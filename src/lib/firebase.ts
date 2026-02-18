import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, Timestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCr9e8ZBFNYn1_UhEJJ1nlHQ9K8VcwdrPo",
  authDomain: "dutu-a3d9e.firebaseapp.com",
  projectId: "dutu-a3d9e",
  storageBucket: "dutu-a3d9e.firebasestorage.app",
  messagingSenderId: "1080106403900",
  appId: "1:1080106403900:web:60d39175b45011e3809b39",
  measurementId: "G-YPSZ1FZL8G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Store like in "google review" collection
export const submitLike = async (language: string): Promise<void> => {
  try {
    await addDoc(collection(db, "google review"), {
      reaction: "like",
      createdAt: Timestamp.now(),
      language
    });
  } catch (error) {
    console.error("Error submitting like:", error);
    throw error;
  }
};

// Store dislike with details in "review" collection
export interface ReviewData {
  improvements: string[];
  comment?: string;
  language: string;
}

export const submitReview = async (data: ReviewData): Promise<void> => {
  try {
    await addDoc(collection(db, "google review"), {
      reaction: "dislike",
      improvements: data.improvements,
      comment: data.comment || "",
      createdAt: Timestamp.now(),
      language: data.language
    });
  } catch (error) {
    console.error("Error submitting review:", error);
    throw error;
  }
};

export { db };
