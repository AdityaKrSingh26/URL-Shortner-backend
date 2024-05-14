import express from "express";
import {
    getInfoIp
} from "../controller/ip.controller.js";

const router = express.Router();

router.get("/getInfo/:shortId", getInfoIp);


export default router;