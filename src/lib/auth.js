import { auth, db } from "./firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const SignInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const userCredential = await signInWithPopup(auth, provider);

  const user = userCredential.user;

  const userRef = doc(db, "users", user.uid);
  let userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    const userData = {
      user: user.displayName || "Anonymous",
      email: user.email,
      address: {
        flat: "",
        street: "",
        city: "",
        country: "",
      },
    };
    await setDoc(userRef, userData);
    userDoc = await getDoc(userRef);
  }
  return { user, userData: userDoc.data() };
};
