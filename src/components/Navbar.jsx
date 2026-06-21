"use client";
import Link from "next/link";
import { useAuth } from "../Contexts/AuthContext";
import { useMenu } from "../Contexts/MenuContext";
import { usePathname } from "next/navigation";
import { useCart } from "../Contexts/CartContext";
import { useWishlist } from "../Contexts/WishlistContext";
import { useRouter } from "next/navigation";
import { useForm } from "../Contexts/FormContexts";

const NavBar = () => {
  const { currentUser } = useAuth();
  const { Menu, setMenu } = useMenu();
  const { Items } = useCart();
  const { wishlis } = useWishlist();
  const { setMode } = useForm()

  const pathNAme = usePathname();
  const isAuthPage = ["/signin", "/verify-email", "/forgot-password"].includes(pathNAme.toLowerCase());
  const isHome = pathNAme === "/";
  const isShop = pathNAme === "/shop";
  const isMyAccount = pathNAme === "/profile";

  const router = useRouter();

  if (isAuthPage) return null;

  return (
    <>
      <header className="w-full flex h-[13vh]">
        <div className="w-[80%] m-auto flex justify-between items-center">
          <button onClick={() => router.push("/")} className="cursor-pointer">
            <img
              src="/assets/images/logo.svg"
              className="w-26 select-none"
              alt="LOGO"
            />
          </button>
          <nav className="flex gap-5 max-[925px]:hidden">
            <Link href="/" className={`${isHome ? "text-[#088179]" : ""}`}>
              <p className="text-[17px] font-semibold hover:text-[#088179] duration-300">
                Home
              </p>
            </Link>
            <Link href="/shop" className={`${isShop ? "text-[#088179]" : ""}`}>
              <p className="text-[17px] font-semibold hover:text-[#088179] duration-300 text-gray-900">
                Shope
              </p>
            </Link>
            <Link href={currentUser?.emailVerified && currentUser ? "/profile" : "/signin"} onClick={() => setMode("Signin")}>
              <p className="text-[17px] font-semibold hover:text-[#088179] duration-300 text-gray-900">
                {currentUser?.emailVerified ? "My Account" : "Login"}
              </p>
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="text"
                className="outline w-58 pb-0.75 outline-gray-300 max-[600px]:hidden focus:outline-gray-800 text-lg duration-400 shadow-sm focus:shadow-md placeholder:text-gray-400 placeholder:text-[15px] pl-2.75 h-9 rounded transition"
                placeholder="Search for Items..."
                id="search"
                maxLength={21}
              />
              <label
                htmlFor="search"
                className="absolute right-1 top-1/2 -translate-1/2"
              >
                <img src="/assets/images/search.png" className="w-4 pb-0.5" alt="S" />
              </label>
            </div>
            <div>
              <Link href="/wshlist">
                <img
                  src="/assets/images/icon-heart.svg"
                  className="w-5 "
                  alt="H"
                />
              </Link>
              <div
                className={`relative ${wishlis.length === 0 ? "hidden" : "block"}`}
              >
                <p className=" absolute cursor-default bottom-2.5 left-3 text-center text-[10px] rounded-full font-bold bg-[#088179] w-[15px] h-[15px] text-white">
                  {wishlis.length}
                </p>
              </div>
            </div>
            <div>
              <Link href="/cart">
                <img
                  src="/assets/images/icon-cart.svg"
                  className="w-[19px]"
                  alt="C"
                />
              </Link>
              <div
                className={`relative ${Items.length === 0 ? "hidden" : "block"}`}
              >
                <p className="absolute bottom-[9px] left-3 text-center text-[10px] rounded-full font-bold cursor-default bg-[#088179] w-[15px] h-[15px] text-white">
                  {Items.length}
                </p>
              </div>
            </div>
            <button onClick={() => setMenu(true)}>
              <img
                src="/assets/images/menu-burger.svg"
                className="w-5 hidden max-[925px]:block cursor-pointer"
                alt="M"
              />
            </button>
          </div>
        </div>
      </header>

      <div
        className={`bg-white fixed top-0 right-0 h-screen w-full transform transition-transform duration-300 hidden max-[925px]:block ${Menu ? "tranlate-x-0" : "translate-x-full"} z-500 `}
      >
        <div className="w-[90%] m-auto pt-5">
          <div className="flex justify-between items-center pb-5">
            <img src="/assets/images/logo.svg" className="w-25" alt="LOGO" />
            <span
              className="text-2xl cursor-pointer"
              onClick={() => setMenu(false)}
            >
              ×
            </span>
          </div>
          <hr className="text-gray-300 pb-5" />
          <div className="relative min-[600px]:hidden w-[230px] mb-4 min-[600px]:mb-1">
            <input
              type="text"
              placeholder="Search for Items..."
              maxLength={21}
              className="w-full h-9 pl-2.25 pr-9 border border-gray-300 rounded shadow-sm focus:shadow-md focus:outline-none focus:border-gray-400 placeholder:text-gray-400 placeholder:text-[14.5px] transition"
            />
            <img
              src="/assets/images/search.png"
              className="w-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-60"
              alt="search"
            />
          </div>
          <nav className="flex flex-col gap-4">
            <Link href="/" className={`${isHome ? "text-[#088179]" : ""}`}>
              <p
                className="text-[17px] font-semibold hover:text-[#088179] duration-300"
                onClick={() => setMenu(false)}
              >
                Home
              </p>
            </Link>
            <Link href="/shop" className={`${isShop ? "text-[#088179]" : ""}`}>
              <p
                className="text-[17px] font-semibold hover:text-[#088179] duration-300"
                onClick={() => setMenu(false)}
              >
                Shope
              </p>
            </Link>
            <Link href="/signin" className={`${currentUser?.emailVerified ? "hidden" : ""}`}>
              <p
                className="text-[17px] font-semibold hover:text-[#088179] duration-300 text-gray-900"
                onClick={() => {
                  setMenu(false)
                  setMode("Signin")
                }}
              >
                Login
              </p>
            </Link>
            <Link
              href="/profile"
              className={`${!currentUser?.emailVerified ? "hidden" : ""} ${isMyAccount ? "text-[#088179]" : ""}`}
            >
              <p
                className="text-[17px] font-semibold hover:text-[#088179] duration-300 text-gray-900"
                onClick={() => setMenu(false)}
              >
                MyAcount
              </p>
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
};
export default NavBar;
