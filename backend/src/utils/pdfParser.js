import pdfParse from "pdf-parse";
import { errorLogger } from "./logger.js";

export const extractTextFromBuffer = async (buffer) => {
    try {
        const data = await pdfParse(buffer);
        return data.text;
    } catch (error) {
        errorLogger.error("PDF Parsing Error: " + error);
        throw new Error("Failed to extract text from PDF memory buffer");
    }
};