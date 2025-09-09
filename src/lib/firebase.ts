// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// VEUILLEZ REMPLACER CECI PAR LA CONFIGURATION DE VOTRE NOUVEAU PROJET FIREBASE
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "REMPLACER_PAR_VOTRE_API_KEY",
  authDomain: "REMPLACER_PAR_VOTRE_AUTH_DOMAIN",
  projectId: "REMPLACER_PAR_VOTRE_PROJECT_ID",
  storageBucket: "REMPLACER_PAR_VOTRE_STORAGE_BUCKET",
  messagingSenderId: "REMPLACER_PAR_VOTRE_MESSAGING_SENDER_ID",
  appId: "REMPLACER_PAR_VOTRE_APP_ID"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, storage };
