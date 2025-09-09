
"use server";

import { aiPoweredMatching, type AIPoweredMatchingInput, type AIPoweredMatchingOutput } from "@/ai/flows/ai-powered-matching";
import { db, storage } from "@/lib/firebase";
import { collection, doc, getDoc, DocumentData, setDoc, updateDoc, getDocs } from "firebase/firestore";
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

async function uploadProfilePicture(userId: string, photoDataUri: string): Promise<string | null> {
    if (!userId || !photoDataUri || !photoDataUri.startsWith('data:')) {
        console.error("Invalid data for photo upload.");
        return null;
    }
    try {
        const storageRef = ref(storage, `profilePictures/${userId}/profile.jpg`);
        const uploadResult = await uploadString(storageRef, photoDataUri, 'data_url');
        const downloadURL = await getDownloadURL(uploadResult.ref);
        return downloadURL;
    } catch (e) {
        console.error("Error uploading profile picture:", e);
        return null;
    }
}

export async function createUserProfile(userId: string, profileData: any) {
  if (!userId) {
    return { success: false, error: "User is not authenticated." };
  }

  try {
    let photoUrl = profileData.profilePic || null;

    if (profileData.profilePic && profileData.profilePic.startsWith('data:')) {
      photoUrl = await uploadProfilePicture(userId, profileData.profilePic);
    }
    
    const finalProfileData = {
        ...profileData,
        profilePic: photoUrl,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    
    // Ensure dates are stringified if they exist
    if (finalProfileData.dates?.from) {
      finalProfileData.dates.from = finalProfileData.dates.from.toISOString();
    }
    if (finalProfileData.dates?.to) {
      finalProfileData.dates.to = finalProfileData.dates.to.toISOString();
    }

    await setDoc(doc(db, "users", userId), finalProfileData, { merge: true });
    
    return { success: true, id: userId };

  } catch (e: any) {
    console.error("Error in createUserProfile:", e);
    return { success: false, error: e.message || "An unknown error occurred." };
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
        const photoUrl = await uploadProfilePicture(userId, photoDataUri);
        if (!photoUrl) {
          return { success: false, error: "Failed to upload profile picture." };
        }

        const profileRef = doc(db, "users", userId);
        await updateDoc(profileRef, {
            profilePic: photoUrl,
            updatedAt: new Date().toISOString(),
        });

        console.log("Profile picture updated successfully for user:", userId);
        return { success: true, url: photoUrl };
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

export async function getAllUsers() {
  try {
    const usersCollection = collection(db, "users");
    const userSnapshot = await getDocs(usersCollection);
    const userList = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return userList;
  } catch (error) {
    console.error("Error getting all users:", error);
    throw new Error("Failed to retrieve user list.");
  }
}
