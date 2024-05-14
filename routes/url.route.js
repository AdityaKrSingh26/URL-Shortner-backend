import express from "express";
import {
    handleGenerateNewShortURL,
    handleGetAnalytics,
} from "../controller/url.controller.js";

const router = express.Router();

router.post("/", handleGenerateNewShortURL);
router.get("/analytics/:shortId", handleGetAnalytics);

export default router;