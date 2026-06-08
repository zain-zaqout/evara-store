"use client"
import { AlertCircle, ArrowLeft, CheckCircle2, Loader2, Mail, RotateCcw } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { sendEmailVerification } from 'firebase/auth'
import { getDoc, doc } from 'firebase/firestore'
import { auth, db } from '@/src/lib/firebase'
import { useAuth } from "@/src/Contexts/AuthContext";
import { setCookie } from "cookies-next";
import { FullPageLoader } from "@/src/components/FullPageLoader";

const Page = () => {
    const router = useRouter()

    const COOLDOWN = 90
    const [cooldown, setCooldown] = useState(0)
    const [isResending, setIsResending] = useState(false)
    const [resendStatus, setResendStatus] = useState(null)
    const [isChecking, setIsChecking] = useState(false)

    const { isAuthReady, currentUser, setCurrentUser } = useAuth()

    useEffect(() => {
        if (cooldown <= 0) return
        const interval = setTimeout(() => setCooldown((c) => c - 1), 1000)
        return () => clearTimeout(interval)
    }, [cooldown])

    useEffect(() => {
        const lastResend = localStorage.getItem("lastVerificationSent");

        if (lastResend) {
            const elapsed = Math.floor(
                (Date.now() - Number(lastResend)) / 1000
            );

            if (elapsed < 90) {
                setCooldown(90 - elapsed);
                return;
            }
        }

        const firstSent = localStorage.getItem("firstVerificationSent");

        if (firstSent) {
            const elapsed = Math.floor(
                (Date.now() - Number(firstSent)) / 1000
            );

            if (elapsed < 60) {
                setCooldown(60 - elapsed);
            }
        }
    }, []);

    const handleResend = async () => {
        if (cooldown > 0 || isResending) return;

        const lastSent = Number(localStorage.getItem("lastVerificationSent"));
        if (lastSent && Date.now() - lastSent < COOLDOWN * 1000) {
            toast.error("Please wait before resending.");
            return;
        }

        setIsResending(true);

        try {
            const freshUser = auth.currentUser;

            if (!freshUser) {
                toast.error("Please sign in again.");
                return;
            }

            await sendEmailVerification(freshUser);

            localStorage.setItem("lastVerificationSent", Date.now());
            setCooldown(COOLDOWN);
            setResendStatus("success");

        } catch (error) {
            setResendStatus("failed");

            if (error.code === "auth/too-many-requests") {
                toast.error("Too many requests. Try later.");
            } else {
                toast.error("Failed to send email.");
            }

        } finally {
            setIsResending(false);
        }
    };

    const handleCheckVerified = async () => {
        if (isChecking) return;

        setIsChecking(true);

        try {
            const freshUser = auth.currentUser;

            if (!freshUser) {
                toast.error("Please sign in again.");
                return;
            }

            await freshUser.reload();

            const updatedUser = freshUser;

            if (updatedUser.emailVerified) {

                const token = await updatedUser.getIdToken();
                setCookie("firebase_token", token, {
                    maxAge: 60 * 60 * 24 * 7,
                    path: "/",
                    secure: true,
                    sameSite: "lax",
                });

                const userDoc = await getDoc(doc(db, "users", updatedUser.uid));

                if (userDoc.exists()) {
                    setCurrentUser({ ...updatedUser, ...userDoc.data() });
                }

                localStorage.removeItem("lastVerificationSent");
                localStorage.removeItem("firstVerificationSent");
                toast.success("Email verified successfully. Welcome!");
                setTimeout(() => router.replace("/"), 100)

            } else {
                toast.error("Email not verified yet.");
            }

        } catch {
            toast.error("Something went wrong.");
        } finally {
            setIsChecking(false);
        }
    };

    useEffect(() => {
        if (!isAuthReady) return;

        if (!currentUser) {
            router.replace("/login");
            return;
        }

        if (currentUser.emailVerified) {
            router.replace("/");
            return;
        }
    }, [isAuthReady, currentUser, router]);

    if (!isAuthReady || !currentUser) {
        return <FullPageLoader />;
    }

    return (
        <div className='min-h-screen flex items-center justify-center px-4'>

            <div className="fixed top-0 left-0 mx-10 flex items-center py-5">
                <button
                    onClick={() => router.push("/")}
                    className="flex items-center group gap-0.75 cursor-pointer duration-200 py-1 px-2.5 rounded-md"
                >
                    <ArrowLeft size={16} className="text-gray-500 group-hover:text-slate-900 group-hover:-translate-x-1 duration-100" />
                    <span className="text-sm text-gray-500 group-hover:text-slate-900 duration-100">
                        Back
                    </span>
                </button>
            </div>

            <main className="max-w-100 w-full flex flex-col items-center justify-center">

                <div className='relative bg-[#c7f2ef] rounded-3xl w-25.5 h-25.5 flex items-center justify-center'>
                    <div
                        className='flex items-center justify-center rounded-2xl w-21.5 h-21.5 bg-[#088179] text-white'
                        style={{ boxShadow: "0 4px 6px -1px rgba(0, 127, 123, 0.3), 0 2px 4px -2px rgba(0, 127, 123, 0.3)" }}
                    >
                        <Mail size={39} />
                    </div>
                    <div className='absolute -bottom-2.5 -right-2 flex items-center justify-center bg-green-600 rounded-full p-1.5 border-2 border-white'>
                        <CheckCircle2 className='text-white' size={18} />
                    </div>
                </div>

                <div className='text-center mb-7'>
                    <p className='uppercase pt-6 pb-3 text-[#007f7b] text-sm tracking-[0.2em]' style={{ fontWeight: 700 }}>
                        Almost There
                    </p>
                    <h1 className='text-4xl pb-3 text-slate-950'>Check your inbox</h1>
                    <p className='text-[14.5px] text-gray-500'>We sent a verification link to</p>
                    <span className='text-sm text-slate-950' style={{ fontWeight: 700 }}>
                        {currentUser?.email}
                    </span>
                </div>

                <div className='flex flex-col space-y-1.5 py-3.5 px-5 bg-[#c7f2ef] w-full rounded-[19px]'>
                    {[
                        "Open the email we sent you",
                        "Click the verification link",
                        "You're all set — start shopping",
                    ].map((step, i) => (
                        <div key={i} className='flex items-center gap-3'>
                            <div className='bg-[#088179] w-4.75 h-4.75 flex items-center justify-center rounded-full'>
                                <span className='text-white text-[10px]'>{i + 1}</span>
                            </div>
                            <p className='text-slate-700 text-[15px]' style={{ fontWeight: 600 }}>{step}</p>
                        </div>
                    ))}
                </div>

                <div className='w-full mt-6'>

                    <button
                        onClick={handleCheckVerified}
                        disabled={isChecking}
                        className='text-white flex items-center justify-center gap-2 bg-[#088179] hover:bg-[#005350] rounded-2xl shadow-sm w-full h-12 text-sm duration-200 ease-in-out cursor-pointer'
                        style={{ fontWeight: 700, boxShadow: "0 4px 6px -1px rgba(0, 127, 123, 0.3), 0 2px 4px -2px rgba(0, 127, 123, 0.3)" }}
                    >
                        {isChecking ? (
                            <span><Loader2 className="animate-spin text-white" /></span>
                        ) : (
                            <>
                                <CheckCircle2 size={17} />
                                I verified — Sign me in
                            </>
                        )}
                    </button>

                    <button
                        onClick={() => handleResend()}
                        disabled={isResending || cooldown > 0}
                        className="w-full h-12 mt-3 flex items-center justify-center gap-2 rounded-2xl border-2 border-gray-300 text-foreground font-semibold text-sm transition-all duration-200 hover:border-[#007f7b] hover:text-[#007f7b] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <RotateCcw className={`w-4 h-4 ${isResending ? "animate-spin" : ""}`} strokeWidth={2.5} />
                        {isResending
                            ? "Sending..."
                            : cooldown > 0
                                ? `Resend in ${cooldown}s`
                                : "Resend link"
                        }
                    </button>

                    {resendStatus === "success" && (
                        <div className='flex items-center justify-center mt-3.5 gap-1.5 h-11 rounded-full w-full bg-green-500/10'>
                            <CheckCircle2 size={16.5} className='text-green-600' />
                            <p className='text-[13px] text-green-600' style={{ fontWeight: 600 }}>
                                Sign in again and we&apos;ll resend automatically!
                            </p>
                        </div>
                    )}
                    {resendStatus === "failed" && (
                        <div className="mt-3 flex items-center gap-2 justify-center text-xs font-semibold text-red-500 bg-red-500/10 rounded-xl py-2.5 px-4">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            Something went wrong. Try again.
                        </div>
                    )}

                </div>

                <p className='text-gray-400 text-[13px] mt-4'>
                    Can&apos;t find it? Check your{" "}
                    <span className='text-slate-950' style={{ fontWeight: 600 }}>Spam</span>
                    {" "}or{" "}
                    <span className='text-slate-950' style={{ fontWeight: 600 }}>Promotions</span>
                    {" "}folder
                </p>

            </main>
        </div>
    )
}

export default Page