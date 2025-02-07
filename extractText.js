const Tesseract = require("tesseract.js");
const path = require("path");
const fs = require("fs");

async function extractText(imagePath) {
    try {
        if (!fs.existsSync(imagePath)) {
            throw new Error("Image file does not exist.");
        }

        console.log(`🔍 Extracting text from: ${path.basename(imagePath)}`);

        const { data } = await Tesseract.recognize(imagePath, "eng", {
            logger: (m) => console.log(`📢 OCR Progress: ${m.status} (${Math.round(m.progress * 100)}%)`),
        });

        console.log("✅ Extracted Text:", data.text.trim());

        return data.text.trim();
    } catch (error) {
        console.error("❌ Error extracting text:", error);
        return null;
    }
}

module.exports = extractText;
