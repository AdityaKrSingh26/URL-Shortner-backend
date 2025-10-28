import express from "express";
import multer from 'multer';
import {
    handleGenerateNewShortURL,
    handleGetAnalytics,
    handleExtendExpiration,
    handleBulkUpload,
    handleBulkStatus,
} from "../controller/url.controller.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.post("/", handleGenerateNewShortURL);
router.get("/analytics/:shortId", handleGetAnalytics);
router.patch("/expiration/:shortId", handleExtendExpiration);
router.post("/bulk/upload", upload.single('file'), handleBulkUpload);
router.get("/bulk/status/:jobId", handleBulkStatus);

export default router;