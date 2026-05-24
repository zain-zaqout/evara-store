"use client";
import Link from "next/link";
import { toast } from "sonner";
import { useAuth } from "../../Contexts/AuthContext";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/src/lib/firebase";
import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import { useWishlist } from "@/src/Contexts/WishlistContext";
import { useCart } from "@/src/Contexts/CartContext";
import { setCookie } from "cookies-next";
const page = () => {
  const router = useRouter();

  const [Loading, setLoading] = useState(false);
  const {
    Data,
    setState,
    dispatch,
    setCurrentUser
  } = useAuth();
  const { setWishlis } = useWishlist();
  const { setItems } = useCart()

  async function checkData() {
    const emailValue = Data.email?.trim();
    const passwordValue = Data.password?.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const localWishlis = localStorage.getItem("wishlis")
    const localCart = localStorage.getItem("cart")

    if (!emailRegex.test(emailValue)) {
      return toast.error("Invalid email address!");
    }
    if (passwordValue.length < 8) {
      return toast.error("Password must be at least 8 characters long.");
    }

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        emailValue,
        passwordValue,
      );
      const user = userCredential.user;

      if (localWishlis) {
        const localData = JSON.parse(localWishlis);
        const addFnction = localData.map((item) => {
          return addDoc(collection(db, "wishlis"), { ...item, userId: user.uid });
        });

        await Promise.all(addFnction);
        setWishlis(localData || [])
        localStorage.removeItem("wishlis");
      }

      if (localCart) {
        const localData = JSON.parse(localCart);
        const addFnction = localData.map((item) => {
          return addDoc(collection(db, "cart"), { ...item, userId: user.uid });
        });

        await Promise.all(addFnction);
        setItems(localData || [])
        localStorage.removeItem("cart");
      }

      const userDoc = await getDoc(doc(db, "users", user.uid));
      setCookie("auth_token", "true", {
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
        sameSite: 'lax',
      });
      if (userDoc.exists()) {
        setCurrentUser({ ...user, ...userDoc.data() });
        setState(true);
      }
      setTimeout(() => {
        router.replace("/")
      }, 100);
      dispatch({ type: "email", val: "" });
      dispatch({ type: "password", val: "" });

    } catch (error) {
      if (error.code === "auth/wrong-password" || error.code === "auth/user-not-found" || error.code === "auth/invalid-credential") {
        toast.error("Invalid email or password. Please try again.");
      } else if (error.code === "auth/too-many-requests") {
        toast.error("Too many failed attempts. Please try again later.");
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  const InputFocus = useRef(null);
  useEffect(() => {
    InputFocus.current?.focus();
  }, []);

  return (
    <div className="bg-gray-50 h-screen flex justify-center items-center text-gray-900">
      <div className="bg-white w-100 rounded-xl shadow-xl transition-shadow">
        <div>
          <h2 className="text-center text-3xl font-bold pt-6 select-none">
            Login
          </h2>
        </div>
        <hr className="mb-6 mt-5 w-80 m-auto border-gray-200" />
        <div className="w-[80%] m-auto">
          <form onSubmit={(e) => e.preventDefault()}>
            <div>
              <div className="flex items-center gap-2 pb-4">
                <input
                  id="email"
                  type="email"
                  required
                  className="w-full p-2 rounded-lg
                  focus:shadow-lg
             outline outline-gray-200
             text-lg
             focus:outline-blue-400
             focus:outline-2
             transition-colors duration-400"
                  placeholder="Email..."
                  value={Data.email}
                  disabled={Loading}
                  autoComplete="one-time-code"
                  onChange={(e) =>
                    dispatch({ type: "email", val: e.target.value })
                  }
                  ref={InputFocus}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="password"
                  type="password"
                  required
                  className="w-full p-2 rounded-lg
                  focus:shadow-lg
             outline outline-gray-200
             text-lg
             focus:outline-blue-400
             focus:outline-2
             focus:border-none
             transition-colors duration-400"
                  minLength={8}
                  maxLength={30}
                  placeholder="password..."
                  value={Data.password}
                  disabled={Loading}
                  autoComplete="new-password"
                  onChange={(e) =>
                    dispatch({ type: "password", val: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="pt-3">
              <div className="flex justify-between">
                <div className="">
                  <input id="check" type="checkbox" className="mr-1" />
                  <label htmlFor="check" className="select-none">
                    Remeber Me
                  </label>
                </div>
                <div>
                  <p className="text-gray-600 hover:text-gray-700 cursor-default font-medium">
                    Forgrt Your{" "}
                    <Link
                      href=""
                      className="hover:underline hover:text-blue-600 duration-150"
                    >
                      Password?
                    </Link>
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <button
                disabled={Loading}
                className="p-2 mt-2.5 flex justify-center w-full rounded-lg bg-[#3b82f6] text-white text-[15px] font-bold cursor-pointer duration-200 hover:bg-[#2563eb]"
                onClick={checkData}
              >
                {Loading ? (
                  <>
                    <Loader2 className="animate-spin" />
                  </>
                ) : (
                  <>Login</>
                )}
              </button>
            </div>
          </form>
        </div>
        <div className="w-[80%] m-auto flex justify-center py-4">
          <p className="text-[15px] font-semibold text-gray-600">
            You Dont Have Acount?{" "}
            <Link
              href="/signup"
              className="text-blue-500 hover:text-blue-600 underline"
            >
              Register!
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default page;
