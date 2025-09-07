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
    const docRef = await addDoc(collection(db, "profiles"), profileData);
    console.log("Document written with ID: ", docRef.id);
    return { success: true, id: docRef.id };
  } catch (e) {
    console.error("Error adding document: ", e);
    throw new Error("Failed to create user profile.");
  }
}
