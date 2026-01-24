import { auth } from "../lib/firebase";
import {
    sendSignInLinkToEmail,
    isSignInWithEmailLink,
    signInWithEmailLink,
    onAuthStateChanged,
    User,
} from "firebase/auth";

const actionCodeSettings = {
    url: "https://cook.kerget.com",
    handleCodeInApp: true,
};

export async function sendLoginLink(email: string) {
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    window.localStorage.setItem("emailForSignIn", email);
}

export async function completeLoginIfLink(): Promise<User | null> {
    if (!isSignInWithEmailLink(auth, window.location.href)) return null;

    const email =
        window.localStorage.getItem("emailForSignIn") ??
        window.prompt("Please confirm your email") ??
        "";

    const result = await signInWithEmailLink(auth, email, window.location.href);
    window.localStorage.removeItem("emailForSignIn");
    return result.user;
}

export function watchAuth(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
}

