"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../Contexts/AuthContext";
import { useCart } from "../Contexts/CartContext";
import { LocationEdit } from "lucide-react";

const Sign = () => {
  const router = useRouter()
  const path = usePathname()
  const { currentUser } = useAuth();
  const { setActive } = useCart()

  if (path === "/signup" || path === "/login" || path === "/verify-email") return null

  return (
    <>
      <div className="bg-[#adccc5] h-22 flex mb-6 mt-10">
        <div className="w-[80%] m-auto ">
          <div
            className={` flex items-center justify-between`}
          >
            {currentUser?.emailVerified ? (
              <>
                <div className="flex items-center gap-3">
                  <LocationEdit size={35} className="select-none" />
                  <p className="font-extrabold">Actual Delivery Location</p>
                </div>
                <div className="pr-10">
                  <p className="text-gray-600 hidden min-[840px]:block">
                    Update your actual address for fast, accurate delivery.
                  </p>
                </div>
                <div>
                  <button onClick={() => {
                    setActive("address");
                    router.push('/profile')
                  }
                  } className="bg-gray-900 text-sm text-white font-semibold w-34 h-9 rounded-[3px] cursor-pointer select-none hover:bg-[#088179] duration-300">
                    Update Location
                  </button>
                </div>
              </>

            ) : (
              <>
                <div className="flex items-center gap-1">
                  <img
                    className="w-10 select-none"
                    src="/assets/images/icon-email.svg"
                    alt=""
                  />
                  <p className="font-extrabold">Sign up to Newsletter</p>
                </div>
                <div className="pr-10">
                  <p className="text-gray-600 hidden min-[840px]:block">
                    and receive $25 coupon for first shopping...
                  </p>
                </div>
                <div>
                  <Link href="/signup">
                    <button className="bg-gray-900 text-sm text-white font-semibold w-23 h-9 rounded-[3px] cursor-pointer select-none hover:bg-[#088179] duration-300">
                      Sign Up
                    </button>
                  </Link>
                </div>
              </>
            )}
          </div>

        </div>
      </div>
    </>
  );
};
export default Sign;
