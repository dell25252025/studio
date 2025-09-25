
'use server';

import { db, storage } from "@/lib/firebase";
import { collection, doc, getDoc, DocumentData, setDoc, updateDoc, getDocs, arrayUnion, arrayRemove, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadString, getDownloadURL, deleteObject } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';

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

export async function createOrUpdateGoogleUserProfile(userId: string, profileData: { email: string | null; displayName: string | null; photoURL: string | null; }) {
    if (!userId) {
        return { success: false, error: "User is not authenticated." };
    }
    try {
        const userRef = doc(db, "users", userId);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            // User exists, check if profile is complete
            const data = userDoc.data();
            const isComplete = !!data.intention && !!data.age; // A simple check for profile completion
            return { success: true, id: userId, isNewUser: !isComplete };
        } else {
            // User does not exist, create a basic profile
            const [firstName] = profileData.displayName?.split(' ') || [''];
            
            const newProfileData = {
                email: profileData.email,
                firstName: firstName,
                profilePictures: profileData.photoURL ? [profileData.photoURL] : [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                friends: [],
                isPremium: false,
                subscriptionEndDate: null,
            };
            await setDoc(userRef, newProfileData);
            return { success: true, id: userId, isNewUser: true };
        }

    } catch (e: any) {
        console.error("Error in createOrUpdateGoogleUserProfile:", e);
        return { success: false, error: e.message || "An unknown error occurred." };
    }
}


export async function createUserProfile(userId: string, profileData: any) {
    if (!userId) {
        return { success: false, error: "User is not authenticated." };
    }

    try {
        const { profilePictures: photoDataUris, ...restOfProfileData } = profileData;

        let uploadedPhotoUrls: string[] = [];
        if (photoDataUris && photoDataUris.length > 0) {
            const uploadPromises = photoDataUris.map((uri: string) => uploadProfilePicture(userId, uri));
            const results = await Promise.all(uploadPromises);
            uploadedPhotoUrls = results.filter((url): url is string => url !== null);
        }
        
        const finalProfileData = {
            ...restOfProfileData,
            profilePictures: uploadedPhotoUrls,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            friends: [],
            isPremium: false,
            subscriptionEndDate: null,
        };

        if (finalProfileData.dates?.from) {
          finalProfileData.dates.from = new Date(finalProfileData.dates.from);
        }
        if (finalProfileData.dates?.to) {
          finalProfileData.dates.to = new Date(finalProfileData.dates.to);
        }

        await setDoc(doc(db, "users", userId), finalProfileData, { merge: true });
        
        return { success: true, id: userId };

    } catch (e: any) {
        console.error("Error in createUserProfile:", e);
        return { success: false, error: e.message || "An unknown error occurred." };
    }
}

export async function updateUserProfile(userId: string, profileData: any) {
    if (!userId) {
        return { success: false, error: "User is not authenticated." };
    }

    try {
        const { profilePictures, ...restOfProfileData } = profileData;

        const finalProfileData = {
            ...restOfProfileData,
            profilePictures: profilePictures, // Assume pictures are already URLs or handled client-side
            updatedAt: new Date().toISOString(),
        };
        
        if (finalProfileData.dates?.from) {
            finalProfileData.dates.from = new Date(finalProfileData.dates.from);
        }
        if (finalProfileData.dates?.to) {
            finalProfileData.dates.to = new Date(finalProfileData.dates.to);
        }

        await updateDoc(doc(db, "users", userId), finalProfileData);
        
        return { success: true, id: userId };

    } catch (e: any) {
        console.error("Error in updateUserProfile:", e);
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
      const data = docSnap.data();
      // Convert Firestore Timestamps to serializable format (ISO strings)
      if (data.dates) {
        if (data.dates.from && typeof data.dates.from.toDate === 'function') {
          data.dates.from = data.dates.from.toDate().toISOString();
        }
        if (data.dates.to && typeof data.dates.to.toDate === 'function') {
          data.dates.to = data.dates.to.toDate().toISOString();
        }
      }
      if (data.subscriptionEndDate && typeof data.subscriptionEndDate.toDate === 'function') {
        data.subscriptionEndDate = data.subscriptionEndDate.toDate().toISOString();
      }
      return { id: docSnap.id, ...data };
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
    const userList = userSnapshot.docs.map(doc => {
      const data = doc.data();
      // Convert Firestore Timestamps to serializable format (ISO strings)
      if (data.dates) {
        if (data.dates.from && typeof data.dates.from.toDate === 'function') {
          data.dates.from = data.dates.from.toDate().toISOString();
        }
        if (data.dates.to && typeof data.dates.to.toDate === 'function') {
          data.dates.to = data.dates.to.toDate().toISOString();
        }
      }
      if (data.subscriptionEndDate && typeof data.subscriptionEndDate.toDate === 'function') {
        data.subscriptionEndDate = data.subscriptionEndDate.toDate().toISOString();
      }
      return { id: doc.id, ...data };
    });
    return userList;
  } catch (error) {
    console.error("Error getting all users:", error);
    throw new Error("Failed to retrieve user list.");
  }
}

export async function submitAbuseReport(
  reporterId: string,
  reportedId: string,
  reason: string,
  details: string
) {
  if (!reporterId || !reportedId || !reason) {
    return { success: false, error: 'Informations manquantes pour le signalement.' };
  }

  try {
    const reportsCollection = collection(db, 'abuseReports');
    await addDoc(reportsCollection, {
      reporterId,
      reportedId,
      reason,
      details,
      status: 'pending', // pending, reviewed, resolved
      createdAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la soumission du signalement:", error);
    const errorMessage = error instanceof Error ? error.message : "Une erreur inconnue est survenue.";
    return { success: false, error: errorMessage };
  }
}

export async function addFriend(currentUserId: string, friendId: string) {
  if (!currentUserId || !friendId) {
    return { success: false, error: 'User IDs are required.' };
  }
  try {
    const currentUserRef = doc(db, 'users', currentUserId);
    const friendRef = doc(db, 'users', friendId);

    await updateDoc(currentUserRef, {
      friends: arrayUnion(friendId),
    });
    await updateDoc(friendRef, {
      friends: arrayUnion(currentUserId),
    });

    return { success: true };
  } catch (error) {
    console.error('Error adding friend:', error);
    return { success: false, error: 'Failed to add friend.' };
  }
}

export async function removeFriend(currentUserId: string, friendId: string) {
  if (!currentUserId || !friendId) {
    return { success: false, error: 'User IDs are required.' };
  }
  try {
    const currentUserRef = doc(db, 'users', currentUserId);
    const friendRef = doc(db, 'users', friendId);

    await updateDoc(currentUserRef, {
      friends: arrayRemove(friendId),
    });
    await updateDoc(friendRef, {
      friends: arrayRemove(currentUserId),
    });

    return { success: true };
  } catch (error) {
    console.error('Error removing friend:', error);
    return { success: false, error: 'Failed to remove friend.' };
  }
}

export async function getFriends(userId: string) {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (!userDoc.exists()) {
      return [];
    }
    const userData = userDoc.data();
    const friendIds = userData.friends || [];
    
    if (friendIds.length === 0) {
      return [];
    }

    const friendPromises = friendIds.map((id: string) => getDoc(doc(db, "users", id)));
    const friendDocs = await Promise.all(friendPromises);

    const friends = friendDocs
      .filter(doc => doc.exists())
      .map(doc => ({ id: doc.id, ...doc.data() }));

    return friends;
  } catch (error) {
    console.error("Error getting friends:", error);
    throw new Error("Failed to retrieve friends list.");
  }
}

    