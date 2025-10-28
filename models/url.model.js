import mongoose from "mongoose";

const urlSchema = new mongoose.Schema(
    {
        shortId: {
            type: String,
            required: true,
            unique: true,
        },
        redirectURL: {
            type: String,
            required: true,
        },
        visitHistory: [{ timestamp: { type: Number } }],
        expirationDate: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

const URL = mongoose.model("url", urlSchema);

export { URL };
