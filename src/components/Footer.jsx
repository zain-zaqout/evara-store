"use client";
import Link from "next/link";
import { useAuth } from "../Contexts/AuthContext";
import { usePathname } from "next/navigation";
import { useCart } from "../Contexts/CartContext";
const Footer = () => {
  const pathname = usePathname();
  const { currentUser } = useAuth();
  const { setActive } = useCart()

  if (pathname === "/signin" || pathname === "/verify-email" || pathname === "/forgot-password") return null;

  return (
    <>
      <div className="pb-7">
        <div className="w-[80%] m-auto grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">
          <div>
            <img
              className="w-26 select-none"
              src="/assets/images/logo.svg"
              alt="Logo"
            />
            <p className="text-gray-700 pb-0.5 pt-2">Contact</p>
            <p className="text-sm">
              <a href="#" className="text-gray-600">
                <span className="text-gray-800 font-bold">addresss:</span>562
                Wellington Road, San Francisco
              </a>
            </p>
            <p className="py-px text-sm">
              <a href="tel:0599999999" className="text-gray-600">
                <span className="text-gray-800 font-bold">Phone:</span>+01 2222
                365
              </a>
            </p>
            <p className="text-sm">
              <a href="#" className="text-gray-600">
                <span className="text-gray-800 font-bold">Hours:</span>10:00 -
                18:00, Mon Sat
              </a>
            </p>
            <div className="mt-4">
              <span className="text-gray-500">Follow Me:</span>
              <div className="flex gap-0.5 pl-0.5 pt-0.5">
                <img
                  className="w-5"
                  src="/assets/images/icon-facebook.svg"
                  alt=""
                />
                <img
                  className="w-5"
                  src="/assets/images/icon-twitter.svg"
                  alt=""
                />
                <img
                  className="w-5"
                  src="/assets/images/icon-instagram.svg"
                  alt=""
                />
                <img
                  className="w-5"
                  src="/assets/images/icon-pinterest.svg"
                  alt=""
                />
                <img
                  className="w-5"
                  src="/assets/images/icon-youtube.svg"
                  alt=""
                />
              </div>
            </div>
          </div>

          <hr className="hidden max-[625px]:block text-gray-200 mt-3" />

          <div className="pt-4.5 pl-10 max-[625px]:pl-0">
            <div>
              <h3 className="text-lg text-gray-900 font-bold">addresss</h3>
            </div>
            <div className="flex flex-col gap-0.5 pt-1.5 text-gray-500 text-base">
              <p className="hover:pl-0.5 hover:text-[#088179] duration-200 block">
                <a href="#">About Us</a>
              </p>
              <p className="hover:pl-0.5 hover:text-[#088179] duration-200 block">
                <a href="#">Dlivery information</a>
              </p>
              <p className="hover:pl-0.5 hover:text-[#088179] duration-200 block">
                <a href="#">Privacy Policy</a>
              </p>
              <p className="hover:pl-0.5 hover:text-[#088179] duration-200 block">
                <a href="#">Terms & Condtion</a>
              </p>
              <p className="hover:pl-0.5 hover:text-[#088179] duration-200 block">
                <a href="#">Contact Us</a>
              </p>
              <p className="hover:pl-0.5 hover:text-[#088179] duration-200 block">
                <a href="#">Support</a>
              </p>
            </div>
          </div>

          <hr className="hidden max-[625px]:block text-gray-200 mt-3" />

          <div className="pt-4.5">
            <div>
              <h3 className="text-lg text-gray-900">My Account</h3>
            </div>
            <div className="flex flex-col gap-0.5 pt-1.5 text-gray-500 text-base">
              <p className="hover:pl-0.5 hover:text-[#088179] duration-200 block">
                <Link href="/signin" className={`${currentUser?.emailVerified ? "hidden" : "block"}`}>
                  <span>Sign in</span>
                </Link>
              </p>
              <p className="hover:pl-0.5 hover:text-[#088179] duration-200 block">
                <Link href="/cart">
                  <span>View Cart</span>
                </Link>
              </p>
              <p className="hover:pl-0.5 hover:text-[#088179] duration-200 block">
                <Link href="/wshlist">
                  <span>My Wishlist</span>
                </Link>
              </p>
              <p className="hover:pl-0.5 hover:text-[#088179] duration-200 block">
                <a href="#">Help</a>
              </p>
              <p className={`hover:pl-0.5 hover:text-[#088179] duration-200 block ${!currentUser?.emailVerified ? "hidden" : ""}`}>
                <Link href="profile" onClick={() => setActive("order")}>
                  <span>Order</span>
                </Link>
              </p>
            </div>
          </div>

          <hr className="hidden max-[625px]:block text-gray-200 mt-3" />

          <div className="pt-4.5 ml-4 max-[625px]:pl-0">
            <h3 className="text-lg text-gray-900">Secured Poyment Goteways</h3>
            <img
              src="/assets/images/payment-method.png"
              className="w-47 pt-1 select-none"
              alt=""
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default Footer;
