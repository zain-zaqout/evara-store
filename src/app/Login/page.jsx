"use client";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import { useAuth } from "../../Contexts/AuthContext";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/src/lib/firebase";
import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import { useWishlist } from "@/src/Contexts/WishlistContext";
import { useCart } from "@/src/Contexts/CartContext";
const Login = () => {
  const router = useRouter();

  const [Loading, setLoading] = useState(false);
  const {
    Data,
    setState,
    dispatch,
    State,
    isAuthReady,
    setCurrentUser
  } = useAuth();
  const { setWishlis } = useWishlist();
  const {setItems} = useCart()

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
      return toast.error("Password must be exactly 8 characters");
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

      if (userDoc.exists()) {
        setCurrentUser({ ...user, ...userDoc.data() });
        setState(true);
      }
      dispatch({ type: "email", val: "" });
      dispatch({ type: "password", val: "" });
      router.replace("/")
    } catch (error) {
      if (error.code === "auth/wrong-password") {
        toast.error("كلمة المرور غلط");
      } else {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  const InputFocus = useRef(null);
  useEffect(() => {
    InputFocus.current?.focus();
  }, []);

  useEffect(() => {
    if (!isAuthReady) return;
    if (State) {
      router.replace("/");
    }
  }, [State, isAuthReady, router]);

  if (!isAuthReady || State) return null;

  return (
    <div className="bg-gray-50 h-screen flex justify-center items-center text-gray-900">
      <ToastContainer />
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
                  maxLength={8}
                  placeholder="password..."
                  value={Data.password}
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
        <div className="w-[80%] m-auto mt-4">
          <p className="pb-4 text-[15px] font-semibold text-gray-600">
            You Dont Have Acount{" "}
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
export default Login;
