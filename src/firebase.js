import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, setPersistence, browserSessionPersistence } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);

setPersistence(auth, browserSessionPersistence)
  .then(() => console.log("Session persistence set"))
  .catch((error) => console.error("Error setting persistence:", error));

// Function to retrieve or create user data in Firestore
export async function getUserData(uid) {
  const userDocRef = doc(db, "users", uid);
  const userDoc = await getDoc(userDocRef);
  if (!userDoc.exists()) {
    // Create the document if it doesn't exist
    await setDoc(userDocRef, { logoCount: 0, favoriteLogos: [] });
    return { logoCount: 0, favoriteLogos: [] };
  }
  return userDoc.data();
}

// Function to increment logo count
export async function incrementLogoCount(uid) {
  const userDocRef = doc(db, "users", uid);
  await updateDoc(userDocRef, { logoCount: increment(1) });
}

// Function to save a logo to favorites
export async function saveFavoriteLogo(uid, logoUrl) {
  const userDocRef = doc(db, "users", uid);
  const userDoc = await getDoc(userDocRef);
  const favoriteLogos = userDoc.data().favoriteLogos || [];
  favoriteLogos.push(logoUrl);
  await updateDoc(userDocRef, { favoriteLogos });
}

export default app;
