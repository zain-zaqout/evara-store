"use client";
import Link from "next/link";
import { useAuth } from "../../Contexts/AuthContext";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "@/src/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useWishlist } from "@/src/Contexts/WishlistContext";
import { setCookie } from "cookies-next";

const Logup = () => {
  const router = useRouter();

  const [Loading, setLoading] = useState(false);
  const { Data, dispatch, setState, State, isAuthReady, setCurrentUser } =
    useAuth();
  const { setWishlis } = useWishlist();

  const checkData = async () => {
    const passwordValue = Data.password?.trim();
    const userValue = Data.user?.trim();
    const emailValue = Data.email?.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const localWishlis = localStorage.getItem("wishlis");
    const localCart = localStorage.getItem("cart");

    if (userValue.length < 3) {
      return toast.error("Name must be exactly 3 characters");
    } else if (!emailRegex.test(emailValue)) {
      return toast.error(
        "Invalid email address! Please check the format (name@mail.com).",
      );
    } else if (passwordValue.length < 8) {
      return toast.error("Password must be exactly 8 characters");
    }

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
        email: emailValue.toLowerCase(),
        address: {
          flat: "",
          street: "",
          city: "",
          country: "",
        },
      };

      await setDoc(doc(db, "users", user.uid), userData);
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
        setWishlis(localData || [])
        localStorage.removeItem("cart");
      }

      setState(true);
      setCurrentUser({ ...user, ...userData });
      toast.success("Account created successfully");


      setCookie("auth_token", "true", {
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
        sameSite: 'lax',
      });
      dispatch({ type: "user", val: "" });
      dispatch({ type: "email", val: "" });
      dispatch({ type: "password", val: "" });
    } catch (error) {
      setLoading(false);

      if (error.code === "auth/email-already-in-use") {
        toast.error("This email is already in use");
      } else if (error.code === "auth/weak-password") {
        toast.error("Password is too weak");
      } else {
        toast.error("An error occurred during registration");
      }
    } finally {
      setLoading(false);
    }
  };

  const inputFocus = useRef(null);
  useEffect(() => {
    inputFocus.current?.focus();
  }, []);

  return (
    <div className="bg-gray-50 h-screen flex justify-center items-center text-gray-900">
      <div className="bg-white w-100 relative rounded-xl shadow-xl transition-shadow">
        <h2 className="text-center text-3xl font-bold pt-6 select-none">
          Create Account
        </h2>
        <hr className="mb-6 mt-5 w-80 m-auto border-gray-200" />

        <div className="w-[80%] m-auto">
          <form onSubmit={(e) => {
            e.preventDefault()
            checkData()
          }}>
            <input type="text" style={{ display: "none" }} name="fake_user" />
            <input
              type="password"
              style={{ display: "none" }}
              name="fake_password"
            />
            <div className="flex flex-col gap-4">
              <input
                ref={inputFocus}
                type="text"
                required
                minLength={3}
                maxLength={8}
                placeholder="Name..."
                value={Data?.user}
                disabled={Loading}
                autoComplete="one-time-code"
                onChange={(e) =>
                  dispatch({ type: "user", val: e.target.value })
                }
                className="w-full p-2 rounded-lg outline outline-gray-200 focus:outline-blue-400 focus:shadow-lg text-md transition-colors duration-400"
              />
              <input
                type="email"
                required
                placeholder="Email..."
                value={Data?.email}
                disabled={Loading}
                autoComplete="one-time-code"
                onChange={(e) =>
                  dispatch({ type: "email", val: e.target.value })
                }
                className="w-full p-2 rounded-lg outline outline-gray-200 focus:outline-blue-400 focus:shadow-lg text-md transition-colors duration-400"
              />
              <input
                type="password"
                required
                placeholder="Password..."
                minLength={8}
                maxLength={8}
                value={Data?.password}
                disabled={Loading}
                autoComplete="new-password"
                onChange={(e) =>
                  dispatch({ type: "password", val: e.target.value })
                }
                className="w-full p-2 rounded-lg outline outline-gray-200 focus:outline-blue-400 focus:shadow-lg text-md transition-colors duration-400"
              />
            </div>

            <div className="flex justify-center mt-5">
              <button
                className="w-full p-2 flex justify-center rounded-lg bg-[#3b82f6] text-white text-[15px] font-bold cursor-pointer hover:bg-[#2563eb] duration-200 disabled:opacity-50"
                disabled={Loading}
              >
                {Loading ? (
                  <>
                    <Loader2 className="animate-spin" />
                  </>
                ) : (
                  <>Create An Account</>
                )}
              </button>
            </div>
            <div className="flex py-3 text-center">
              <p className="text-[15px] font-semibold text-gray-600">
                {" "}
                Already have an
                <Link
                  href="/login"
                  className="text-blue-500 hover:text-blue-600 underline"
                >
                  {" "}
                  Account?
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Logup;