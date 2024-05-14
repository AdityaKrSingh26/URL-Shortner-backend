import shortid from 'shortid'
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
        return res.status(200).json({ id: shortID });
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
