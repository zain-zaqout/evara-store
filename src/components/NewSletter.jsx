"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../Contexts/AuthContext";

const Sign = () => {
  const pathname = usePathname();
  const { State } = useAuth();
  const isAuthPage = ["/login", "/signup"].includes(pathname.toLowerCase());
  if (isAuthPage) return null;

  return (
    <>
      <div className="bg-[#adccc5] h-22 flex mb-6 mt-10">
        <div className="w-[80%] m-auto ">
          <div
            className={`${State ? "hidden" : "block"} flex items-center justify-between`}
          >
            <div className="flex items-center gap-1">
              <img
                className="w-10 select-none"
                src="/assets/images/icon-email.svg"
                alt=""
              />
              <p className="font-semibold">Sign up to Newsletter</p>
            </div>
            <div className="pr-10">
              <p className="text-gray-800 hidden min-[840px]:block">
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
          </div>
          <div
            className={`flex items-center justify-center ${State ? "block" : "hidden"}`}
          >
            <p className="text-lg font-bold text-gray-600">Done</p>
          </div>
        </div>
      </div>
    </>
  );
};
export default Sign;
