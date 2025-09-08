
"use server";

import { aiPoweredMatching, type AIPoweredMatchingInput, type AIPoweredMatchingOutput } from "@/ai/flows/ai-powered-matching";
import { db, storage } from "@/lib/firebase";
import { collection, doc, getDoc, DocumentData, setDoc, updateDoc } from "firebase/firestore";
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

async function uploadProfilePicture(userId: string, photoDataUri: string): Promise<{ success: boolean, url?: string, error?: string }> {
    if (!userId) {
        return { success: false, error: "User ID is required to upload a profile picture." };
    }
    if (!photoDataUri || !photoDataUri.startsWith('data:')) {
        return { success: false, error: "Invalid photo data provided." };
    }

    try {
        const storageRef = ref(storage, `profilePictures/${userId}/profile.jpg`);
        const uploadResult = await uploadString(storageRef, photoDataUri, 'data_url');
        const downloadURL = await getDownloadURL(uploadResult.ref);
        
        return { success: true, url: downloadURL };
    } catch (e) {
        console.error("Error uploading profile picture:", e);
        const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
        return { success: false, error: `Failed to upload profile picture: ${errorMessage}` };
    }
}

export async function createUserProfile(userId: string, profileData: any) {
  if (!userId) {
    return { success: false, error: "User is not authenticated." };
  }

  try {
    let profilePicUrl: string | null = null;
    if (profileData.profilePic && profileData.profilePic.startsWith('data:')) {
        const uploadResult = await uploadProfilePicture(userId, profileData.profilePic);
        if (uploadResult.success && uploadResult.url) {
          profilePicUrl = uploadResult.url;
        } else {
          // Propagate the error from the upload function
          return { success: false, error: uploadResult.error || 'Échec de l\'envoi de la photo de profil.' };
        }
    }
    
    const dataToSave = {
      ...profileData,
      profilePic: profilePicUrl,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    await setDoc(doc(db, "users", userId), dataToSave);
    console.log("Profile successfully created for user: ", userId);
    return { success: true, id: userId };
  } catch (e) {
    console.error("Error creating user profile in Firestore: ", e);
    const errorMessage = e instanceof Error ? e.message : String(e);
    return { success: false, error: `Failed to create user profile: ${errorMessage}` };
  }
}

export async function updateUserProfilePicture(userId: string, photoDataUri: string) {
    if (!userId) {
        return { success: false, error: "User ID is required to update a profile picture." };
    }
    if (!photoDataUri || !photoDataUri.startsWith('data:')) {
        return { success: false, error: "Invalid photo data provided." };
    }

    try {
        const uploadResult = await uploadProfilePicture(userId, photoDataUri);
        if (!uploadResult.success || !uploadResult.url) {
          return { success: false, error: uploadResult.error || "Failed to upload profile picture." };
        }

        const profileRef = doc(db, "users", userId);
        await updateDoc(profileRef, {
            profilePic: uploadResult.url,
            updatedAt: new Date().toISOString(),
        });

        console.log("Profile picture updated successfully for user:", userId);
        return { success: true, url: uploadResult.url };
    } catch (e) {
        console.error("Error updating profile picture:", e);
        const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
        return { success: false, error: `Failed to update profile picture: ${errorMessage}` };
    }
}


export async function getUserProfile(id: string): Promise<DocumentData | null> {
  try {
    const docRef = doc(db, "users", id);
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
