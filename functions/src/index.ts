
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {ImageAnnotatorClient} from "@google-cloud/vision";

admin.initializeApp();

const visionClient = new ImageAnnotatorClient();

/**
 * Triggered when a new image is uploaded to the profilePictures/ directory.
 * It uses the Google Cloud Vision API to detect inappropriate content.
 * If the image is flagged as adult or violent, it is deleted from Storage.
 */
export const moderateProfilePicture = functions.storage
  .object()
  .onFinalize(async (object) => {
    // We only want to moderate images in the profilePictures folder.
    if (!object.name?.startsWith("profilePictures/")) {
      functions.logger.log("Image is not a profile picture. Skipping.");
      return null;
    }

    // We don't want to moderate folders.
    if (object.contentType?.endsWith("/")) {
      functions.logger.log("This is a folder. Skipping.");
      return null;
    }
    
    // We only moderate images.
    if (!object.contentType?.startsWith("image/")) {
        functions.logger.log("File is not an image. Skipping.");
        return null;
    }

    const bucketName = object.bucket;
    const filePath = object.name;
    const gcsUri = `gs://${bucketName}/${filePath}`;

    functions.logger.log(`Analyzing image: ${filePath}`);

    try {
      const [result] = await visionClient.safeSearchDetection(gcsUri);
      const safeSearch = result.safeSearchAnnotation;

      if (!safeSearch) {
        functions.logger.log("No safe search data found for image.");
        return null;
      }

      const isAdult = safeSearch.adult === "LIKELY" ||
                      safeSearch.adult === "VERY_LIKELY";
      const isViolent = safeSearch.violence === "LIKELY" ||
                        safeSearch.violence === "VERY_LIKELY";

      if (isAdult || isViolent) {
        functions.logger.warn(`Inappropriate image detected: ${filePath}. Deleting...`);
        
        const bucket = admin.storage().bucket(bucketName);
        await bucket.file(filePath).delete();
        
        functions.logger.log(`Image deleted successfully: ${filePath}`);
      } else {
        functions.logger.log(`Image is safe: ${filePath}`);
      }

      return null;
    } catch (error) {
      functions.logger.error(`Error analyzing image ${filePath}:`, error);
      return null;
    }
  });
