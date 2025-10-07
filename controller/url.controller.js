import shortid from 'shortid'
import QRCode from 'qrcode'
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
        const shortID = shortid();

        await URL.create({
            shortId: shortID,
            redirectURL: body.url,
            visitHistory: [],
        });
        const shortUrl = `${req.protocol}://${req.get('host')}/${shortID}`;
        const qrCodeDataUrl = await QRCode.toDataURL(shortUrl, { type: 'image/png', margin: 1, scale: 6 });
        return res.status(200).json({ id: shortID, shortUrl, qrCodeDataUrl });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error occurred in gentrating short url' });
    }
}

async function handleGetAnalytics(req, res) {
    try {
        const shortId = req.params.shortId;
        const result = await URL.findOne({ shortId });
        return res.status(200).json({
            totalClicks: result.visitHistory.length,
            analytics: result.visitHistory,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error occurred in analytics for short url' });
    }
}

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

// New handler to return QR code PNG for a given shortId
export async function handleGetQRCode(req, res) {
    try {
        const shortId = req.params.shortId;
        const result = await URL.findOne({ shortId });
        if (!result) {
            return res.status(404).json({ error: 'URL not found' });
        }
        const shortUrl = `${req.protocol}://${req.get('host')}/${shortId}`;
        const pngBuffer = await QRCode.toBuffer(shortUrl, { type: 'png', margin: 1, scale: 6 });
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Content-Disposition', `inline; filename="${shortId}.png"`);
        return res.status(200).send(pngBuffer);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Error generating QR code' });
    }
}

export {
    handleGenerateNewShortURL,
    handleGetAnalytics,
    handleBulkUpload,
    handleBulkStatus,
    handleGetQRCode,
};
