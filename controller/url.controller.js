import shortid from 'shortid'
import QRCode from 'qrcode'
import { URL } from '../models/url.model.js';

// const shortid = require("shortid");
// const URL = require("../models/url");

async function handleGenerateNewShortURL(req, res) {
    try {
        const body = req.body;
        if (!body.url) return res.status(400).json({ error: "url is required" });
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

export {
    handleGenerateNewShortURL,
    handleGetAnalytics,
};

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
