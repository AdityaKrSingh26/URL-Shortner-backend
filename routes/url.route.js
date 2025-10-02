import express from "express";
import {
    handleGenerateNewShortURL,
    handleGetAnalytics,
    handleGetQRCode,
} from "../controller/url.controller.js";

const router = express.Router();

router.post("/", handleGenerateNewShortURL);
router.get("/analytics/:shortId", handleGetAnalytics);
router.get("/qr/:shortId", handleGetQRCode);

export default router;