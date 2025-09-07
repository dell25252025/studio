
"use server";

import { aiPoweredMatching, type AIPoweredMatchingInput, type AIPoweredMatchingOutput } from "@/ai/flows/ai-powered-matching";
import { db, storage } from "@/lib/firebase";
import { collection, doc, getDoc, DocumentData, setDoc, updateDoc } from "firebase/firestore";
import { ref, uploadString, getDownloadURL, deleteObject } from "firebase/storage";
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
    let profilePicUrl: string | null = null;
    if (profileData.profilePic && profileData.profilePic.startsWith('data:')) {
        const storageRef = ref(storage, `profile_pictures/${userId}/profile.jpg`);
        const uploadResult = await uploadString(storageRef, profileData.profilePic, 'data_url');
        profilePicUrl = await getDownloadURL(uploadResult.ref);
    }

    const serializableProfileData = { ...profileData, profilePic: profilePicUrl };

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
       return { success: false, error: `Failed to create user profile: ${e.message}`};
    }
    return { success: false, error: "An unknown error occurred while creating the user profile."};
  }
}

export async function updateUserProfilePicture(userId: string, photoDataUri: string) {
    if (!userId) {
        throw new Error("User ID is required to update a profile picture.");
    }
    if (!photoDataUri || !photoDataUri.startsWith('data:')) {
        throw new Error("Invalid photo data provided.");
    }

    try {
        const storageRef = ref(storage, `profile_pictures/${userId}/profile.jpg`);
        const uploadResult = await uploadString(storageRef, photoDataUri, 'data_url');
        const downloadURL = await getDownloadURL(uploadResult.ref);

        const profileRef = doc(db, "profiles", userId);
        await updateDoc(profileRef, {
            profilePic: downloadURL
        });

        console.log("Profile picture updated successfully for user:", userId);
        return { success: true, url: downloadURL };
    } catch (e) {
        console.error("Error updating profile picture:", e);
        if (e instanceof Error) {
            throw new Error(`Failed to update profile picture: ${e.message}`);
        }
        throw new Error("An unknown error occurred while updating the profile picture.");
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
