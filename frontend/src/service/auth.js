import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    GoogleAuthProvider,
    signInWithPopup,
} from "firebase/auth";
import { auth } from "./firebase";

export const signUpWithEmail = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log("User signed up:", user);
            return user;
        })
        .catch((error) => {
            console.error("Error signing up:", error.code, error.message);
            throw error;
        });
};

export const signInWithEmail = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log("User signed in:", user);
            return user;
        })
        .catch((error) => {
            console.error("Error signing in:", error.code, error.message);
            throw error;
        });
};

export const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            console.log("User signed in with Google:", user);
            return user;
        })
        .catch((error) => {
            console.error("Error signing in with Google:", error.code, error.message);
            throw error;
        });
};

export const signOutUser = () => {
    return signOut(auth)
        .then(() => {
            console.log("User signed out");
        })
        .catch((error) => {
            console.error("Error signing out:", error);
            throw error;
        });
};
