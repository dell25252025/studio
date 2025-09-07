
'use server';

import { auth } from '@/lib/firebase';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';

export async function signUpWithEmail({ email, password }: { email: string, password: string }) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return JSON.parse(JSON.stringify(userCredential.user));
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return JSON.parse(JSON.stringify(result.user));
  } catch (error: any) {
    throw new Error(error.message);
  }
}
