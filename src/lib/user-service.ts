import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase"; // Assuming db is exported from firebase.ts

interface UserData {
  uid: string;
  email?: string | null;
  displayName?: string | null;
  // Add any other user-specific data you want to store
}

export const saveUserToFirestore = async (userData: UserData) => {
  if (!userData.uid) {
    console.error("User UID is required to save user data.");
    return;
  }
  try {
    await setDoc(doc(db, "users", userData.uid), userData, { merge: true });
    console.log("User data saved to Firestore successfully!");
  } catch (error) {
    console.error("Error saving user data to Firestore: ", error);
  }
};
