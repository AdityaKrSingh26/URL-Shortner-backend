import express from "express";
import multer from 'multer';
import {
    handleGenerateNewShortURL,
    handleGetAnalytics,
    handleBulkUpload,
    handleBulkStatus,
    handleGetQRCode,
} from "../controller/url.controller.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.post("/", handleGenerateNewShortURL);
router.get("/analytics/:shortId", handleGetAnalytics);
router.post("/bulk/upload", upload.single('file'), handleBulkUpload);
router.get("/bulk/status/:jobId", handleBulkStatus);
router.get("/qr/:shortId", handleGetQRCode);

export default router;