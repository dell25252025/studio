"use server";

import { aiPoweredMatching, type AIPoweredMatchingInput, type AIPoweredMatchingOutput } from "@/ai/flows/ai-powered-matching";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

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
    // Firestore SDK on the server doesn't handle Date objects well when they come from the client.
    // We need to convert them to a serializable format.
    const serializableProfileData = { ...profileData };
    if (profileData.dates?.from) {
      serializableProfileData.dates.from = new Date(profileData.dates.from).toISOString();
    }
    if (profileData.dates?.to) {
      serializableProfileData.dates.to = new Date(profileData.dates.to).toISOString();
    }
    
    const docRef = await addDoc(collection(db, "profiles"), serializableProfileData);
    console.log("Document written with ID: ", docRef.id);
    return { success: true, id: docRef.id };
  } catch (e) {
    console.error("Error adding document: ", e);
    throw new Error("Failed to create user profile.");
  }
}
