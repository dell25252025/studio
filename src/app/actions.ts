
"use server";

import { aiPoweredMatching, type AIPoweredMatchingInput, type AIPoweredMatchingOutput } from "@/ai/flows/ai-powered-matching";
import { db, storage } from "@/lib/firebase";
import { collection, doc, getDoc, DocumentData, setDoc, updateDoc } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getApp } from "firebase/app";

async function getUserId(): Promise<string | null> {
  const auth = getAuth(getApp());
  return auth.currentUser?.uid || null;
}


export async function handleAiMatching(input: AIPoweredMatchingInput): Promise<AIPoweredMatchingOutput> {
  try {
    const results = await aiPoweredMatching(input);
    return results;
  } catch (error) {
    console.error("Error in AI matching flow:", error);
    throw new Error("Failed to get AI-powered matches.");
  }
}

export async function createUserProfile(profileData: any) {
  const userId = await getUserId();

  if (!userId) {
    return { success: false, error: "User is not authenticated." };
  }

  try {
    let profilePicUrl: string | null = null;
    if (profileData.profilePic && profileData.profilePic.startsWith('data:')) {
        const storageRef = ref(storage, `profile_pictures/${userId}/profile.jpg`);
        const uploadResult = await uploadString(storageRef, profileData.profilePic, 'data_url');
        profilePicUrl = await getDownloadURL(uploadResult.ref);
    }
    
    const dataToSave = {
      ...profileData,
      profilePic: profilePicUrl,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    await setDoc(doc(db, "profiles", userId), dataToSave);
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

    