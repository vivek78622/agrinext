import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB6gn97CwZ2MIA6LX16a8ZOMt1n_q8HWqs",
    authDomain: "agrinext-8d8b3.firebaseapp.com",
    projectId: "agrinext-8d8b3",
    storageBucket: "agrinext-8d8b3.firebasestorage.app",
    messagingSenderId: "330101625910",
    appId: "1:330101625910:web:06fe1db256748e84a9b497",
    measurementId: "G-0C87G21HDR",
    databaseURL: "https://agrinext-8d8b3-default-rtdb.asia-southeast1.firebasedatabase.app",
};

// Initialize Firebase (singleton pattern to avoid multiple initializations)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Realtime Database
export const db = getDatabase(app);

// Initialize Analytics only in browser environment
if (typeof window !== 'undefined') {
    isSupported().then((supported) => {
        if (supported) {
            getAnalytics(app);
        }
    });
}

export default app;
