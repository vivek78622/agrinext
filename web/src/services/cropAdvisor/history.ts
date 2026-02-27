import { db, auth } from "../firebase";
import { collection, addDoc, query, where, orderBy, getDocs, Timestamp } from "firebase/firestore";
import { FinalDecision, UserInput, EnvironmentalData } from "./types";

const COLLECTION_NAME = "crop_analyses";

export interface AnalysisRecord {
    id?: string;
    userId: string;
    timestamp: Timestamp;
    decision: FinalDecision;
    input: UserInput;
    weather: EnvironmentalData;
    locationName: string;
}

/**
 * Saves a completed analysis to Firestore.
 * Requires the user to be authenticated.
 */
export async function saveAnalysis(
    decision: FinalDecision,
    input: UserInput,
    weather: EnvironmentalData,
    locationName: string
): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
        const user = auth.currentUser;
        if (!user) {
            return { success: false, error: "User not authenticated" };
        }

        const record: AnalysisRecord = {
            userId: user.uid,
            timestamp: Timestamp.now(),
            decision,
            input,
            weather,
            locationName
        };

        // Create a subcollection for the user or a root collection with userId index?
        // Using root collection with userId query is often more flexible for admin views, 
        // but subcollection `users/{uid}/analyses` is better for permissions.
        // Let's use a root collection 'crop_analyses' for simplicity in this demo, 
        // assuming Security Rules allow 'create' if auth.uid == request.resource.data.userId

        const docRef = await addDoc(collection(db, COLLECTION_NAME), record);
        return { success: true, id: docRef.id };

    } catch (error) {
        console.error("Error saving analysis:", error);
        return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
}

/**
 * Retrieves the analysis history for the current user.
 */
export async function getUserHistory(): Promise<{ success: boolean; data?: AnalysisRecord[]; error?: string }> {
    try {
        const user = auth.currentUser;
        if (!user) {
            return { success: false, error: "User not authenticated" };
        }

        const q = query(
            collection(db, COLLECTION_NAME),
            where("userId", "==", user.uid),
            orderBy("timestamp", "desc")
        );

        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as AnalysisRecord[];

        return { success: true, data };

    } catch (error) {
        console.error("Error fetching history:", error);
        return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
}
