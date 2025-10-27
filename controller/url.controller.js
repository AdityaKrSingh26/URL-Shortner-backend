import shortid from 'shortid'
import { URL } from '../models/url.model.js';
import { parse } from 'csv-parse';
import { Readable } from 'stream';

// const shortid = require("shortid");
// const URL = require("../models/url");

async function handleGenerateNewShortURL(req, res) {
    try {
        const body = req.body;
        if (!body.url) return res.status(400).json({ error: 'url is required' });
        const urlRegex = new RegExp(
            '^(https?|ftp)://' +
                '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
                '((\\d{1,3}\\.){3}\\d{1,3}))' +
                '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
                '(\\?[;&a-z\\d%_.~+=-]*)?' +
                '(\\#[-a-z\\d_]*)?$',
            'i'
        );

        if (!urlRegex.test(body.url)) {
            return res.status(400).json({ error: 'Invalid URL format' });
        }
        
        // Parse expiration date if provided (in days from now)
        let expirationDate = null;
        if (body.expiresInDays) {
            const days = parseInt(body.expiresInDays);
            if (isNaN(days) || days <= 0) {
                return res.status(400).json({ error: 'expiresInDays must be a positive number' });
            }
            expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + days);
        }
        
        const shortID = shortid();

        await URL.create({
            shortId: shortID,
            redirectURL: body.url,
            visitHistory: [],
            expirationDate: expirationDate,
        });
        return res.status(200).json({ id: shortID, expirationDate });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error occurred in gentrating short url' });
    }
}

async function handleGetAnalytics(req, res) {
    try {
        const shortId = req.params.shortId;
        const result = await URL.findOne({ shortId });
        
        if (!result) {
            return res.status(404).json({ error: 'URL not found' });
        }
        
        return res.status(200).json({
            totalClicks: result.visitHistory.length,
            analytics: result.visitHistory,
            expirationDate: result.expirationDate,
            isExpired: result.expirationDate ? new Date() > new Date(result.expirationDate) : false,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error occurred in analytics for short url' });
    }
}

async function handleExtendExpiration(req, res) {
    try {
        const shortId = req.params.shortId;
        const body = req.body;
        
        if (!body.additionalDays) {
            return res.status(400).json({ error: 'additionalDays is required' });
        }
        
        const additionalDays = parseInt(body.additionalDays);
        if (isNaN(additionalDays) || additionalDays <= 0) {
            return res.status(400).json({ error: 'additionalDays must be a positive number' });
        }
        
        const entry = await URL.findOne({ shortId });
        
        if (!entry) {
            return res.status(404).json({ error: 'URL not found' });
        }
        
        let newExpirationDate;
        if (entry.expirationDate) {
            // Extend existing expiration date
            newExpirationDate = new Date(entry.expirationDate);
            newExpirationDate.setDate(newExpirationDate.getDate() + additionalDays);
        } else {
            // Set new expiration date from now
            newExpirationDate = new Date();
            newExpirationDate.setDate(newExpirationDate.getDate() + additionalDays);
        }
        
        await URL.findOneAndUpdate(
            { shortId },
            { expirationDate: newExpirationDate }
        );
        
        return res.status(200).json({
            message: 'Expiration date extended successfully',
            expirationDate: newExpirationDate
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error extending expiration date' });
    }
}

export {
    handleGenerateNewShortURL,
    handleGetAnalytics,
    handleExtendExpiration,
    handleBulkUpload,
    handleBulkStatus,
};

// In-memory job store for bulk uploads. For production, move to Redis or database.
const bulkJobs = new Map();

async function handleBulkUpload(req, res) {
    try {
        if (!req.file || !req.file.buffer) {
            return res.status(400).json({ error: 'CSV file is required in form field "file"' });
        }

        const jobId = shortid();
        const job = {
            id: jobId,
            status: 'processing',
            createdAt: Date.now(),
            total: 0,
            processed: 0,
            succeeded: 0,
            failed: 0,
            results: [], // { url, id }
            errors: [], // { url, error }
        };
        bulkJobs.set(jobId, job);

        // Kick off async processing so we can return immediately
        process.nextTick(async () => {
            const urls = [];
            try {
                const csvString = req.file.buffer.toString('utf8');
                const readable = Readable.from(csvString);
                const parser = parse({
                    skip_empty_lines: true,
                    trim: true,
                });

                readable.pipe(parser);

                for await (const record of parser) {
                    // Support header or no-header CSV. If header, skip the first row when it looks like a header.
                    // csv-parse with no columns gives arrays for each row.
                    const firstCell = Array.isArray(record) ? record[0] : record;
                    if (typeof firstCell === 'string') {
                        const cell = firstCell.trim();
                        if (cell.length === 0) continue;
                        if (urls.length === 0 && cell.toLowerCase() === 'url') {
                            // header row detected
                            continue;
                        }
                        urls.push(cell);
                    }
                }

                job.total = urls.length;

                for (const originalUrl of urls) {
                    try {
                        const shortID = shortid();
                        await URL.create({
                            shortId: shortID,
                            redirectURL: originalUrl,
                            visitHistory: [],
                        });
                        job.succeeded += 1;
                        job.results.push({ url: originalUrl, id: shortID });
                    } catch (err) {
                        job.failed += 1;
                        job.errors.push({ url: originalUrl, error: 'Failed to create short URL' });
                    } finally {
                        job.processed += 1;
                    }
                }

                job.status = 'completed';
            } catch (e) {
                job.status = 'failed';
                job.errors.push({ url: null, error: 'CSV parsing failed' });
            }
        });

        return res.status(202).json({ jobId, status: job.status });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Error starting bulk upload' });
    }
}

async function handleBulkStatus(req, res) {
    try {
        const { jobId } = req.params;
        const job = bulkJobs.get(jobId);
        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }
        return res.status(200).json(job);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Error retrieving job status' });
    }
}
