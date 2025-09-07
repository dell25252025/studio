"use server";

import { aiPoweredMatching, type AIPoweredMatchingInput, type AIPoweredMatchingOutput } from "@/ai/flows/ai-powered-matching";
import { db } from "@/lib/firebase";
import { collection, addDoc, doc, getDoc, DocumentData } from "firebase/firestore";

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
  try {
    const serializableProfileData = { ...profileData };
    if (profileData.dates?.from && profileData.dates.from instanceof Date) {
      serializableProfileData.dates.from = profileData.dates.from.toISOString();
    }
    if (profileData.dates?.to && profileData.dates.to instanceof Date) {
      serializableProfileData.dates.to = profileData.dates.to.toISOString();
    }
    
    const docRef = await addDoc(collection(db, "profiles"), serializableProfileData);
    console.log("Document written with ID: ", docRef.id);
    return { success: true, id: docRef.id };
  } catch (e) {
    console.error("Error adding document: ", e);
    throw new Error("Failed to create user profile.");
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
