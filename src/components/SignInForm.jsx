import { AlertCircle, Loader2, Lock, Mail, User2 } from 'lucide-react'
import { useEffect, useRef } from 'react';
import { useForm } from "@/src/Contexts/FormContexts";
import Link from 'next/link';

const SignInForm = ({ login, signup, loadingGoogle, loading, errorPreview }) => {
    const { Data, dispatch, mode } = useForm();
    const inputFocus = useRef(null);

    useEffect(() => {
        inputFocus.current?.focus();
    }, []);

    return (
        <div className='w-full'>
            <form className='w-full' onSubmit={(e) => {
                e.preventDefault();
                if (mode === "createAccount") {
                    signup();
                } else {
                    login();
                }
            }}>
                <div className="flex flex-col gap-4">

                    <div className={`${mode === "Signin" ? "hidden" : "block"} group w-full relative`}>
                        <User2 className={`${!errorPreview.name ? "group-hover:text-[#007f7b] focus-within:text-[#007f7b]" : "text-red-500"} absolute left-4 top-6 -translate-y-1/2 w-5 h-5 text-[#a1a1a1] transition-colors duration-200`} strokeWidth={2} />
                        <input
                            id="userName"
                            type="text"
                            className={`${errorPreview.name ? "outline-2 outline-red-500" : "focus:border-none group-hover:outline-2 group-hover:outline-[#007f7b] focus:outline-2 focus:outline-[#007f7b]"} w-full h-12 pl-12 pr-4 rounded-[20px] outline outline-gray-300 bg-white text-[14.5px] placeholder:text-[#616b6a] transition-colors duration-300`}
                            ref={inputFocus}
                            placeholder="Full name"
                            value={Data?.user || ""}
                            minLength={3}
                            maxLength={18}
                            onChange={(e) => dispatch({ type: "user", val: e.target.value })}
                        />
                        {errorPreview.name && (
                            <p className="text-red-500 text-xs flex items-center gap-1 mt-2 px-1 font-semibold">
                                <AlertCircle className='w-4 h-4' />
                                {errorPreview.name}
                            </p>
                        )}
                    </div>

                    <div className="group w-full relative">
                        <Mail className={`${!errorPreview.email ? "group-hover:text-[#007f7b] focus-within:text-[#007f7b]" : "text-red-500"} absolute left-4 top-6 -translate-y-1/2 w-5 h-5 text-[#a1a1a1] transition-colors duration-200`} strokeWidth={2} />
                        <input
                            id="email"
                            type="email"
                            className={`${errorPreview.email ? "outline-2 outline-red-500" : "focus:border-none group-hover:outline-2 group-hover:outline-[#007f7b] focus:outline-2 focus:outline-[#007f7b]"} w-full h-12 pl-12 pr-4 rounded-[20px] outline outline-gray-300 bg-white text-[14.5px] placeholder:text-[#616b6a] transition-colors duration-300`}
                            placeholder="Email address"
                            value={Data?.email || ""}
                            maxLength={45}
                            onChange={(e) => dispatch({ type: "email", val: e.target.value })}
                        />
                        {errorPreview.email && (
                            <p className="text-red-500 text-xs flex items-center gap-1 mt-2 px-1 font-semibold">
                                <AlertCircle className='w-4 h-4' />
                                {errorPreview.email} {/* قراءة الخطأ الديناميكي هنا */}
                            </p>
                        )}
                    </div>

                    {/* حقل كلمة المرور */}
                    <div className="group w-full relative">
                        <Lock className={`${!errorPreview.password ? "group-hover:text-[#007f7b] focus-within:text-[#007f7b]" : "text-red-500"} absolute left-4 top-6 -translate-y-1/2 w-5 h-5 text-[#a1a1a1] transition-colors duration-200`} strokeWidth={2} />
                        <input
                            id="password"
                            type="password"
                            className={`${errorPreview.password ? "outline-2 outline-red-500" : "focus:border-none group-hover:outline-2 group-hover:outline-[#007f7b] focus:outline-2 focus:outline-[#007f7b]"} w-full h-12 pl-12 pr-4 rounded-[20px] outline outline-gray-300 bg-white text-[14.5px] placeholder:text-[#616b6a] transition-colors duration-300`}
                            placeholder="Password"
                            value={Data?.password || ""}
                            minLength={8}
                            maxLength={30}
                            onChange={(e) => dispatch({ type: "password", val: e.target.value })}
                        />
                        {errorPreview.password && (
                            <p className="text-red-500 text-xs flex items-center gap-1 mt-2 px-1 font-semibold">
                                <AlertCircle className='w-4 h-4' />
                                {errorPreview.password} {/* قراءة الخطأ الديناميكي هنا */}
                            </p>
                        )}
                    </div>
                </div>

                {/* قسم خيارات التذكر ونسيان كلمة المرور */}
                <div className={`${mode === "createAccount" ? "hidden" : "flex"} justify-between items-center mt-4 mb-2 px-1`}>
                    <div className='flex items-center gap-2 select-none'>
                        <input
                            type="checkbox"
                            id="rememberBox"
                            checked={true}
                            readOnly
                            onClick={(e) => e.preventDefault()}
                            className="h-4 w-4 rounded border-gray-300 text-[#088179] focus:ring-[#088179] focus:ring-offset-0 cursor-default"
                        />
                        <label htmlFor="rememberBox" className='text-xs text-slate-900 font-bold cursor-default'>Remember me</label>
                    </div>
                    <Link href="/forgot-password" className='text-xs text-[#088179] hover:underline font-bold'>
                        Forgot Password?
                    </Link>
                </div>

                {/* زر الإرسال الرئيسي */}
                <button
                    disabled={loading || loadingGoogle}
                    className='text-white mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 bg-[#088179] hover:bg-[#005350] rounded-[20px] shadow-sm w-full h-12 text-sm font-bold duration-200 ease-in-out cursor-pointer'
                    style={{ boxShadow: "0 4px 6px -1px rgba(0, 127, 123, 0.2), 0 2px 4px -2px rgba(0, 127, 123, 0.2)" }}
                    type='submit'
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin" size={19} />
                            <span>Loading...</span>
                        </>
                    ) : mode === "createAccount" ? "Create account" : "Sign in"}
                </button>
            </form>
        </div>
    )
}

export default SignInForm;