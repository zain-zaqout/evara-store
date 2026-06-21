"use client"
import { useState, useEffect, useRef } from "react"
import { auth } from "@/src/lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { ArrowLeft, KeyRound, CheckCircle2, Loader2, AlertCircle, Mail, Send } from "lucide-react";
import { useRouter } from "next/navigation";

const Page = () => {
    const [emailInputValue, setEmailInputValue] = useState("")
    const [email, setEmail] = useState("")

    const [isLoading, setIsLoading] = useState(false)
    const [countdown, setCountdown] = useState(0)
    const [status, setStatus] = useState(null)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    const valid = !emailRegex.test(emailInputValue)

    const router = useRouter()

    useEffect(() => {
        if (countdown <= 0) return
        const interval = setTimeout(() => setCountdown((c) => c - 1), 1000)
        return () => clearTimeout(interval)
    }, [countdown])

    useEffect(() => {
        const lastResend = localStorage.getItem("lastResetPasswordSent");

        if (lastResend) {
            const elapsed = Math.floor(
                (Date.now() - Number(lastResend)) / 1000
            );

            if (elapsed < 60) {
                setCountdown(60 - elapsed);
                return;
            }
        }
    }, []);

    const handleSendLink = async () => {
        setIsLoading(true)
        try {
            await sendPasswordResetEmail(auth, emailInputValue)
            setEmail(emailInputValue)
            setCountdown(60)
            localStorage.setItem("lastResetPasswordSent", Date.now())
            setStatus("success")
        } catch {
            setStatus("failed")
        } finally {
            setIsLoading(false)
        }
    }

    const InputFocus = useRef(null);
    useEffect(() => {
        InputFocus.current?.focus();
    }, []);

    return (
        <div className='min-h-screen flex items-center justify-center px-4'>

            <div className="fixed top-0 left-0 mx-10 flex items-center py-5">
                <button
                    onClick={() => router.push("/signin")}
                    className="flex items-center group gap-0.75 cursor-pointer duration-200 py-1 rounded-md"
                >
                    <ArrowLeft size={16} className="text-gray-500 group-hover:text-slate-900 group-hover:-translate-x-1 duration-100" />
                    <span className="text-sm text-gray-500 group-hover:text-slate-900 duration-100">
                        Back
                    </span>
                </button>
            </div>

            <main className="max-w-110 w-full flex flex-col items-center justify-center">

                <div className='bg-[#c7f2ef] rounded-3xl w-25.5 h-25.5 flex items-center justify-center'>
                    <div
                        className='flex items-center justify-center rounded-2xl w-21.5 h-21.5 bg-[#088179] text-white'
                        style={{ boxShadow: "0 4px 6px -1px rgba(0, 127, 123, 0.3), 0 2px 4px -2px rgba(0, 127, 123, 0.3)" }}
                    >
                        <KeyRound size={39} />
                    </div>
                </div>

                <div className='text-center mb-2.5'>
                    <p className='uppercase pt-6 pb-1 text-[#007f7b] text-xs tracking-[0.2em]' style={{ fontWeight: 700 }}>
                        Forgot Password
                    </p>
                    <h1 className='text-[30px] pb-3 text-slate-950'>Reset your password</h1>
                    <p className='text-[14.5px] text-gray-500 max-w-100'>Enter your email and we&apos;ll send you a link to reset your password.</p>
                </div>

                <div className="flex flex-col space-y-2.5 py-3 px-5 w-full ">
                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 group-hover:text-[#007f7b] focus:text-[#007f7b] w-4.75 h-4.75 text-[#a1a1a1] transition-colors duration-200" strokeWidth={2} />
                        <input
                            id="email"
                            type="email"
                            className="w-full h-12 pl-11 pr-4 rounded-2xl border-2 border-[#d8e0df] bg-white text-sm placeholder:text-[#616b6a] focus:outline-none group-hover:border-[#007f7b] focus:border-[#007f7b] transition-colors duration-200"
                            style={{ fontWeight: 600 }}
                            ref={InputFocus}
                            placeholder="you@example.com"
                            value={emailInputValue}
                            maxLength={45}
                            onChange={(e) => setEmailInputValue(e.target.value)}
                        />
                    </div>
                    <button
                        disabled={isLoading || !emailInputValue || countdown > 0 || valid}
                        className='text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[#007f7b] flex items-center justify-center gap-2 bg-[#088179] hover:bg-[#005350] rounded-2xl shadow-sm w-full h-12 text-sm duration-200 ease-in-out cursor-pointer'
                        style={{ fontWeight: 700, boxShadow: "0 4px 6px -1px rgba(0, 127, 123, 0.3), 0 2px 4px -2px rgba(0, 127, 123, 0.3)" }}
                        onClick={() => handleSendLink()}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="animate-spin" size={19} />
                                <span style={{ fontWeight: 700 }}>Sending...</span>
                            </>
                        ) : countdown > 0 ? (
                            `Resend In ${countdown}s`
                        ) : (
                            <>
                                <Send size={18} />
                                {status ? `Resend reset link` : `Send reset link`}
                            </>
                        )

                        }
                    </button>

                    {status === "success" && (
                        <div className='flex flex-col space-y-2 py-3.5 px-5 bg-[#c7f2ef] w-full rounded-[19px]'>
                            <h3 className="flex items-center gap-2 text-[15px] text-green-600">
                                <CheckCircle2 size={18} />
                                Email sent successfully!
                            </h3>
                            <p className="text-sm text-gray-700 leading-relaxed">
                                We sent a reset link to <span style={{ fontWeight: 800 }}>{email}</span>. Please check your inbox and click the link to continue.
                            </p>
                        </div>
                    )}
                    {status === "failed" && (
                        <div className='flex flex-col space-y-2 py-3.5 px-5 bg-amber-50 w-full rounded-[19px] border border-amber-200'>
                            <h3 className="flex items-center gap-2 text-[15px] text-amber-700 font-bold">
                                <AlertCircle size={18} />
                                Unable to send request
                            </h3>
                            <p className="text-sm text-amber-800 leading-relaxed">
                                Something went wrong. Please check your connection and try again.
                            </p>
                        </div>
                    )}


                </div>
                <p className='text-gray-400 text-[13px] mt-1'>
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
