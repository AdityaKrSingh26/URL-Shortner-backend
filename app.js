import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { URL } from './models/url.model.js';

const app = express();

app.use(cors())
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())

import urlRouter from "./routes/url.route.js"
import ipRouter from "./routes/ip.route.js"

app.use("/api/v1/url", urlRouter)
app.use("/api/v1/ip", ipRouter)

app.get("/:shortId", async (req, res) => {
    try {
        const shortId = req.params.shortId;
        const entry = await URL.findOneAndUpdate(
            {
                shortId,
            },
            {
                $push: {
                    visitHistory: {
                        timestamp: Date.now(),
                    },
                },
            }
        );

        if (entry) {
            let redirectURL = entry.redirectURL;
            if (!redirectURL.startsWith("http://") && !redirectURL.startsWith("https://")) {
                redirectURL = "http://" + redirectURL;
            }
            // console.log(entry);
            res.redirect(redirectURL);
        } else {
            res.status(404).json({ error: "URL not found" });
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Error in redirecting to orinal link" })
    }
});


export { app } 