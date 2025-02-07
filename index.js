const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const cropImage = require("./cropImage"); // Import cropping function
const extractText = require("./extractText"); // Import OCR function

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));

app.post("/upload", async (req, res) => {
    const { image, website, links } = req.body;

    if (!image) {
        return res.status(400).json({ error: "No image received" });
    }

    console.log(`📩 Image received from: ${website}`);
    console.log("🔗 Extracted Links:", links);

    const base64Data = image.replace(/^data:image\/png;base64,/, "");
    const originalFilename = `screenshot_${Date.now()}.png`;
    const filePath = path.join(__dirname, "uploads", originalFilename);

    // Save original image
    fs.writeFile(filePath, base64Data, "base64", async (err) => {
        if (err) {
            return res.status(500).json({ error: "Failed to save image" });
        }

        console.log(`✅ Image saved: ${originalFilename}`);

        // Crop the image (removes 30% from left)
        const croppedFilePath = await cropImage(filePath);

        // Extract text from cropped image
        let extractedText = croppedFilePath ? await extractText(croppedFilePath) : null;

        res.json({
            message: "Image uploaded, cropped & text extracted successfully",
            originalFilename,
            croppedFilename: croppedFilePath ? path.basename(croppedFilePath) : null,
            extractedText,
            website,
            links,
        });
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
