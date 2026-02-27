import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut as firebaseSignOut,
    updateProfile,
    User,
    UserCredential,
    onAuthStateChanged as firebaseOnAuthStateChanged,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

/**
 * Sign up a new user with email and password
 */
export const signUpWithEmail = async (
    email: string,
    password: string,
    displayName: string
): Promise<UserCredential> => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // Update user profile with display name
        if (userCredential.user) {
            await updateProfile(userCredential.user, {
                displayName: displayName,
            });
        }

        return userCredential;
    } catch (error: any) {
        throw new Error(getAuthErrorMessage(error.code));
    }
};

/**
 * Sign in an existing user with email and password
 */
export const signInWithEmail = async (
    email: string,
    password: string
): Promise<UserCredential> => {
    try {
        return await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
        throw new Error(getAuthErrorMessage(error.code));
    }
};

/**
 * Sign in with Google OAuth
 */
export const signInWithGoogle = async (): Promise<UserCredential> => {
    try {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({
            prompt: 'select_account',
        });
        return await signInWithPopup(auth, provider);
    } catch (error: any) {
        throw new Error(getAuthErrorMessage(error.code));
    }
};

/**
 * Sign out the current user
 */
export const signOut = async (): Promise<void> => {
    try {
        await firebaseSignOut(auth);
    } catch (error: any) {
        throw new Error('Failed to sign out. Please try again.');
    }
};

/**
 * Subscribe to authentication state changes
 */
export const onAuthStateChanged = (callback: (user: User | null) => void) => {
    return firebaseOnAuthStateChanged(auth, callback);
};

/**
 * Get current authenticated user
 */
export const getCurrentUser = (): User | null => {
    return auth.currentUser;
};

/**
 * Convert Firebase auth error codes to user-friendly messages
 */
const getAuthErrorMessage = (errorCode: string): string => {
    switch (errorCode) {
        case 'auth/email-already-in-use':
            return 'This email is already registered. Please sign in instead.';
        case 'auth/invalid-email':
            return 'Please enter a valid email address.';
        case 'auth/operation-not-allowed':
            return 'This sign-in method is not enabled. Please contact support.';
        case 'auth/weak-password':
            return 'Password should be at least 6 characters long.';
        case 'auth/user-disabled':
            return 'This account has been disabled. Please contact support.';
        case 'auth/user-not-found':
            return 'No account found with this email. Please sign up first.';
        case 'auth/wrong-password':
            return 'Incorrect password. Please try again.';
        case 'auth/invalid-credential':
            return 'Invalid email or password. Please try again.';
        case 'auth/too-many-requests':
            return 'Too many failed attempts. Please try again later.';
        case 'auth/network-request-failed':
            return 'Network error. Please check your connection and try again.';
        case 'auth/popup-closed-by-user':
            return 'Sign-in popup was closed. Please try again.';
        case 'auth/cancelled-popup-request':
            return 'Sign-in was cancelled. Please try again.';
        default:
            return 'An error occurred during authentication. Please try again.';
    }
};
