
"use server";

import { aiPoweredMatching, type AIPoweredMatchingInput, type AIPoweredMatchingOutput } from "@/ai/flows/ai-powered-matching";
import { db, storage } from "@/lib/firebase";
import { collection, doc, getDoc, DocumentData, setDoc } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';


export async function handleAiMatching(input: AIPoweredMatchingInput): Promise<AIPoweredMatchingOutput> {
  try {
    const results = await aiPoweredMatching(input);
    return results;
  } catch (error) {
    console.error("Error in AI matching flow:", error);
    throw new Error("Failed to get AI-powered matches.");
  }
}

export async function createUserProfile(userId: string, profileData: any) {
  if (!userId) {
    throw new Error("User ID is required to create a profile.");
  }

  try {
    let photoURLs: string[] = [];
    if (profileData.photos && profileData.photos.length > 0) {
        photoURLs = await Promise.all(
          profileData.photos.map(async (photoDataUri: string) => {
            if (!photoDataUri || !photoDataUri.startsWith('data:')) {
                // If it's already a URL, just return it.
                return photoDataUri;
            }
            const storageRef = ref(storage, `profile_pictures/${userId}/${uuidv4()}`);
            const uploadResult = await uploadString(storageRef, photoDataUri, 'data_url');
            return getDownloadURL(uploadResult.ref);
          })
        );
    }

    const serializableProfileData = { ...profileData, photos: photoURLs };

    if (serializableProfileData.dates?.from && typeof serializableProfileData.dates.from !== 'string') {
      serializableProfileData.dates.from = serializableProfileData.dates.from.toISOString();
    }
    if (serializableProfileData.dates?.to && typeof serializableProfileData.dates.to !== 'string') {
      serializableProfileData.dates.to = serializableProfileData.dates.to.toISOString();
    }
    
    await setDoc(doc(db, "profiles", userId), serializableProfileData);
    console.log("Profile successfully created for user: ", userId);
    return { success: true, id: userId };
  } catch (e) {
    console.error("Error creating user profile in Firestore: ", e);
    if (e instanceof Error) {
       throw new Error(`Failed to create user profile: ${e.message}`);
    }
    throw new Error("An unknown error occurred while creating the user profile.");
  }
}

export async function getUserProfile(id: string): Promise<DocumentData | null> {
  try {
    const docRef = doc(db, "profiles", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error getting document:", error);
    throw new Error("Failed to retrieve user profile.");
  }
}
