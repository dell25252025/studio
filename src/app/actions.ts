
"use server";

import { aiPoweredMatching, type AIPoweredMatchingInput, type AIPoweredMatchingOutput } from "@/ai/flows/ai-powered-matching";
import { db, storage } from "@/lib/firebase";
import { collection, doc, getDoc, DocumentData, setDoc, updateDoc, getDocs, arrayUnion, arrayRemove } from "firebase/firestore";
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

async function uploadProfilePicture(userId: string, photoDataUri: string): Promise<string | null> {
    if (!userId || !photoDataUri || !photoDataUri.startsWith('data:')) {
        console.error("Invalid data for photo upload.");
        return null;
    }
    try {
        const photoId = uuidv4();
        const storageRef = ref(storage, `profilePictures/${userId}/${photoId}.jpg`);
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
        const { gender, profilePictures: photoDataUris, ...restOfProfileData } = profileData;

        let uploadedPhotoUrls: string[] = [];
        if (photoDataUris && photoDataUris.length > 0) {
            const uploadPromises = photoDataUris.map((uri: string) => uploadProfilePicture(userId, uri));
            const results = await Promise.all(uploadPromises);
            uploadedPhotoUrls = results.filter((url): url is string => url !== null);
        }
        
        const finalProfileData = {
            ...restOfProfileData,
            sex: gender,
            profilePictures: uploadedPhotoUrls,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        if (finalProfileData.dates?.from) {
          finalProfileData.dates.from = new Date(finalProfileData.dates.from);
        }
        if (finalProfileData.dates?.to) {
          finalProfileData.dates.to = new Date(finalProfileData.dates.to);
        }

        await setDoc(doc(db, "users", userId), finalProfileData);
        
        return { success: true, id: userId };

    } catch (e: any) {
        console.error("Error in createUserProfile:", e);
        return { success: false, error: e.message || "An unknown error occurred." };
    }
}


export async function addProfilePicture(userId: string, photoDataUri: string) {
    if (!userId) {
        return { success: false, error: "User ID is required." };
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
            profilePictures: arrayUnion(photoUrl),
            updatedAt: new Date().toISOString(),
        });

        console.log("Profile picture added successfully for user:", userId);
        return { success: true, url: photoUrl };
    } catch (e) {
        console.error("Error adding profile picture:", e);
        const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
        return { success: false, error: `Failed to add profile picture: ${errorMessage}` };
    }
}

export async function removeProfilePicture(userId: string, photoUrl: string) {
    if (!userId) {
        return { success: false, error: "User ID is required." };
    }
     if (!photoUrl) {
        return { success: false, error: "Photo URL is required." };
    }

    try {
        // Delete from Firestore
        const profileRef = doc(db, "users", userId);
        await updateDoc(profileRef, {
            profilePictures: arrayRemove(photoUrl),
            updatedAt: new Date().toISOString(),
        });

        // Delete from Storage
        const photoRef = ref(storage, photoUrl);
        await deleteObject(photoRef);
        
        console.log("Profile picture removed successfully for user:", userId);
        return { success: true };
    } catch (e) {
        console.error("Error removing profile picture:", e);
        const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
        return { success: false, error: `Failed to remove profile picture: ${errorMessage}` };
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
