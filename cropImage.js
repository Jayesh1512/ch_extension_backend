const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

async function cropImage(imagePath) {
    try {
        if (!fs.existsSync(imagePath)) {
            throw new Error("Image file does not exist.");
        }

        const filename = path.basename(imagePath);
        const croppedFilename = `cropped_${filename}`;
        const croppedFilePath = path.join(path.dirname(imagePath), croppedFilename);

        // Get image dimensions
        const metadata = await sharp(imagePath).metadata();
        const { width, height } = metadata;

        if (width < 100) {
            throw new Error("Image width too small for cropping.");
        }

        // Crop 30% from the left side
        const cropX = Math.floor(width * 0.3);
        const newWidth = width - cropX;

        await sharp(imagePath)
            .extract({ left: cropX, top: 0, width: newWidth, height: height })
            .toFile(croppedFilePath);

        console.log(`✂️ Cropped 30% from the left: ${croppedFilename}`);
        return croppedFilePath;
    } catch (error) {
        console.error("❌ Error cropping image:", error);
        return null;
    }
}

module.exports = cropImage;
