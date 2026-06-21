"use client"
import { useState, useEffect } from 'react';
import SignInForm from '../../components/SignInForm';
import { FaGoogle } from 'react-icons/fa';
import { SignInWithGoogle } from "@/src/lib/auth";
import { useAuth } from "@/src/Contexts/AuthContext";
import { useForm } from "@/src/Contexts/FormContexts";
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth, db } from "@/src/lib/firebase";
import {
    getDoc,
    collection,
    doc,
    getDocs,
    query,
    setDoc,
    where,
} from "firebase/firestore";
import { setCookie } from 'cookies-next';

const Page = () => {
    const [error, setError] = useState({ name: "", email: "", password: "" })
    const [Loading, setLoading] = useState(false);
    const [LoadingGoogle, setLoadingGoogle] = useState(false);


    const { setCurrentUser } = useAuth();
    const { Data, dispatch, mode, setMode } = useForm()

    const router = useRouter()

    useEffect(() => {
        setError({ name: "", email: "", password: "" })
    }, [mode])


    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

    const handelGoogle = async () => {
        setLoadingGoogle(true)
        try {
            const { user, userData } = await SignInWithGoogle()
            setCurrentUser({ ...user, ...userData });

            const token = await user.getIdToken(true);

            setCookie("firebase_token", token, {
                maxAge: 60 * 60 * 24 * 7,
                path: "/",
                secure: true,
                sameSite: "lax",
            });

            router.replace("/")

        } catch (error) {
            const code = error?.code;

            if (
                code === "auth/popup-closed-by-user" ||
                code === "auth/cancelled-popup-request" ||
                error?.message?.includes("Cross-Origin")
            ) {
                return;
            }

            if (code === "auth/network-request-failed") {
                toast.error("Network error. Please check your internet connection and try again.");
            }
            else if (code === "auth/user-disabled") {
                toast.error("This account has been disabled. Please contact support.");
            }
            else {
                toast.error("Something went wrong. Please try again later.");
            }
        } finally {
            setLoadingGoogle(false)
        }
    }

    async function Login() {
        const emailValue = Data.email?.trim() || ""
        const passwordValue = Data.password?.trim() || ""

        let localErrors = {}


        if (!emailValue || !emailRegex.test(emailValue)) {
            localErrors.email = "Please enter a valid email address."
        }
        if (passwordValue < 8) {
            localErrors.password = "Password must be at least 8 characters long."
        }
        setError(localErrors)
        if (Object.keys(localErrors).length > 0) {
            return
        }

        setLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                emailValue,
                passwordValue,
            );

            const user = userCredential.user;

            if (!user.emailVerified) {
                toast.error("Please verify your email first.");
                router.push("/verify-email")
                return
            }

            const userDoc = await getDoc(doc(db, "users", user.uid));

            if (userDoc.exists()) {
                setCurrentUser({ ...user, ...userDoc.data() });
            }

            dispatch({ type: "email", val: "" });
            dispatch({ type: "password", val: "" });

            const token = await user.getIdToken();

            setCookie("firebase_token", token, {
                maxAge: 60 * 60 * 24 * 7,
                path: "/",
                secure: true,
                sameSite: "lax",
            });

            localStorage.removeItem("firstVerificationSent");
            localStorage.removeItem("lastVerificationSent");

            setTimeout(() => router.replace("/"), 100)

        } catch (error) {
            if (error.code === "auth/wrong-password" || error.code === "auth/user-not-found" || error.code === "auth/invalid-credential") {
                toast.error("Invalid email or password. Please try again.");
            } else if (error.code === "auth/too-many-requests") {
                toast.error("Too many failed attempts. Please try again later.");
            } else if (error.code === 'auth/account-exists-with-different-credential') {
                toast.error("This email is already linked to a Google account. Please use 'Sign in with Google' to continue.");
            } else {
                toast.error("An unexpected error occurred. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    }

    const Signup = async () => {
        const passwordValue = Data.password?.trim() || ""
        const userValue = Data.user?.trim() || ""
        const emailValue = Data.email?.trim() || ""

        let localErrors = {}


        if (userValue.length < 3) {
            localErrors.name = "Please enter your full name."
        }
        if (!emailRegex.test(emailValue)) {
            localErrors.email = "Please enter a valid email address."
        }
        if (passwordValue.length < 8) {
            localErrors.password = "Password must be at least 8 characters long."
        }
        setError(localErrors)

        if (Object.keys(localErrors).length > 0) return

        setLoading(true);
        try {
            const userQuery = query(
                collection(db, "users"),
                where("user", "==", userValue),
            );
            const userSnapshot = await getDocs(userQuery);

            if (!userSnapshot.empty) {
                toast.error("This username is already taken");
                setLoading(false);
                return;
            }

            const userCredential = await createUserWithEmailAndPassword(
                auth,
                emailValue,
                passwordValue,
            );

            const user = userCredential.user;
            const userData = {
                user: userValue,
                email: emailValue,
                address: {
                    flat: "",
                    street: "",
                    city: "",
                    country: "",
                },
            };

            await setDoc(doc(db, "users", user.uid), userData);

            await sendEmailVerification(user)
            localStorage.setItem("firstVerificationSent", Date.now());
            toast.success("Verification email sent! Check your inbox at " + user.email)

            dispatch({ type: "user", val: "" });
            dispatch({ type: "email", val: "" });
            dispatch({ type: "password", val: "" });

            router.push("/verify-email")

        } catch (error) {
            switch (error.code) {
                case "auth/email-already-in-use":
                    toast.error("This email is already registered. Please login instead.");
                    break;
                case "auth/invalid-email":
                    toast.error("The email address provided is invalid.");
                    break;
                case "auth/weak-password":
                    toast.error("Password should be at least 6 characters long.");
                    break;
                case "auth/network-request-failed":
                    toast.error("Network error. Please check your internet connection.");
                    break;
                default:
                    toast.error("Registration failed. Please try again later.");
                    break;
            }
        } finally {
            setLoading(false);
        }
    }

    function GoogleIcon() {
        return (
            <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
            </svg>
        )
    }

    return (
        <main className='min-h-screen flex items-center justify-center '>
            <div className='max-w-90 w-full flex flex-col items-center justify-center'>
                <div className='text-center'>
                    {mode === "createAccount" ? (
                        <>
                            <h1 className='uppercase text-[#088179] text-[13px] tracking-[0.2em]'>Get Started</h1>
                            <h2 className='text-[32px]'>Create new account</h2>
                        </>
                    ) : (
                        <>
                            <h1 className='uppercase text-[#088179] text-[13px] tracking-[0.2em]'>Welcome Back</h1>
                            <h2 className='text-[32px]'>Sign in to <span className='text-[#088179]' style={{ fontWeight: 600 }}>Evara</span></h2>
                        </>
                    )}

                </div>
                <div className={`flex items-center w-full mt-4.5 mb-4 ${mode === "2" ? "mb-4" : "mb-0"}`}>
                    <button disabled={Loading} onClick={() => setMode("Signin")} className={`${mode !== "Signin" ? "text-[#088179] text-center border border-gray-300 rounded-l-[17px] h-10.5 text-[14px] cursor-pointer hover:bg-gray-50" : "text-white text-center rounded-l-[17px] h-10.5 text-sm bg-[#088179] cursor-pointer hover:bg-[#0b7069]"} w-full transition-colors duration-200`} style={{ fontWeight: 600 }}>Sign in</button>
                    <button disabled={Loading} onClick={() => setMode("createAccount")} className={`${mode !== "createAccount" ? "text-[#088179] text-center border border-gray-300 rounded-r-[17px] h-10.5 text-[14px] cursor-pointer hover:bg-gray-50" : "text-white text-center rounded-r-[17px] h-10.5 text-sm bg-[#088179] cursor-pointer hover:bg-[#0b7069]"} w-full transition-colors duration-200`} style={{ fontWeight: 600 }}>Create account</button>
                </div>
                <button
                    className="w-full h-11 pl-12 pr-4 flex items-center justify-center gap-3 rounded-[20px] outline outline-gray-300 bg-white text-[14.5px] cursor-pointer hover:bg-gray-100 transition-colors duration-300"
                    disabled={Loading || LoadingGoogle}
                    onClick={() => handelGoogle()}
                >
                    <GoogleIcon />
                    Contnue with Google
                </button>
                <div className={`${mode === "Signin" ? "pb-4" : "pb-4"} relative w-full flex pt-4.5 items-center`}>
                    <div className="grow border-t border-gray-200"></div>

                    <span className="shrink mx-4 text-xs tracking-widest text-gray-500 uppercase select-none">
                        or
                    </span>

                    <div className="grow border-t border-gray-200"></div>
                </div>
                <SignInForm login={() => Login()} signup={() => Signup()} loadingGoogle={LoadingGoogle} loading={Loading} errorPreview={error} />
            </div>
        </main>
    )
}

export default Page