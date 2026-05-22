"use client";
import {
  LogOut,
  MapPin,
  Package,
  User,
  Trash2,
  Loader2,
  Lock,
} from "lucide-react";
import { useState } from "react";
import UpdateProfileSection from "../../components/UpdateProfileSection";
import OrderSection from "../../components/OrderSection";
import ShopingaddressSection from "../../components/ShopingAddresSection";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "../../Contexts/AuthContext";
import { useCart } from "../../Contexts/CartContext";
import { deleteUser, signOut } from "firebase/auth";
import { auth, db } from "@/src/lib/firebase";
import { collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import { deleteCookie } from "cookies-next";
import { useWishlist } from "@/src/Contexts/WishlistContext";

const Profile = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const router = useRouter();

  const [Loading, setLoading] = useState(false);
  const {
    currentUser,
    setState,
    setaddressData,
    setCurrentUser,
  } = useAuth();
  const { active, setActive, setItems } = useCart();
  const { setwishlist } = useWishlist()

  async function getWishlisDataForDeleted() {

    const wishlisData = query(collection(db, "wishlis"), where("userId", "==", currentUser.uid));
    const getWishlis = await getDocs(wishlisData);

    if (!getWishlis.empty) {
      const deleteWishlis = getWishlis.docs.map((item) => deleteDoc(doc(db, "wishlis", item.id)));
      await Promise.all(deleteWishlis);
    }
  }
  async function getCartDataForDeleted() {

    const cartData = query(collection(db, "cart"), where("userId", "==", currentUser.uid));
    const getCart = await getDocs(cartData);

    if (!getCart.empty) {
      const deleteCart = getCart.docs.map((item) => deleteDoc(doc(db, "cart", item.id)));
      await Promise.all(deleteCart)
    }
  }
  async function getReviewsDataForDeleted() {

    const reviewsData = query(collection(db, "reviews"), where("userId", "==", currentUser.uid));
    const getReviews = await getDocs(reviewsData);


    if (!getReviews.empty) {
      const deleteReviews = getReviews.docs.map((item) => deleteDoc(doc(db, "reviews", item.id)));
      await Promise.all(deleteReviews);
    }
  }
  async function getOrdersDataForDeleted() {

    const ordersData = query(collection(db, "orders"), where("userId", "==", currentUser.uid));
    const getOrders = await getDocs(ordersData);


    if (!getOrders.empty) {
      const deleteOrders = getOrders.docs.map((item) => deleteDoc(doc(db, "orders", item.id)));
      await Promise.all(deleteOrders);
    }
  }

  async function deletAccount() {
    toast.info("")
    // try {

    //   await getWishlisDataForDeleted()
    //   await getCartDataForDeleted()
    //   await getReviewsDataForDeleted()
    //   await getOrdersDataForDeleted()

    //   await deleteDoc(doc(db, "users", currentUser.uid));
    //   await deleteUser(auth.currentUser);

    //   router.replace("/");
    //   toast.success("Your account has been deleted successfully.");

    //   setState(false);
    //   setCurrentUser(null);

    //   setaddressData(null);
    // } catch (error) {
    //   toast.error(error.message);
    //   setLoading(false);
    //   setActive("profile");
    // } finally {
    //   setShowDeleteModal(false);
    // }
  }

  return (
    <div className=" my-30 block">
      <div className="w-[80%] mx-auto grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-5">
        <div className=" flex flex-col w-full min-w-0">
          <button
            className={`w-full text-left px-3 py-3 font-semibold cursor-pointer border border-gray-200 flex items-center gap-2 ${active === "profile" ? "text-white bg-[#088179]" : "text-gray-900"}`}
            onClick={() => setActive("profile")}
          >
            <User size={18} />
            <span>Uptade Profile</span>
          </button>
          <button
            className={`w-full text-left px-3 py-3 font-semibold cursor-pointer border border-gray-200 flex items-center gap-2 ${active === "address" ? "text-white bg-[#088179]" : "text-gray-900"}`}
            onClick={() => setActive("address")}
          >
            <MapPin size={18} />
            <span>My address</span>
          </button>
          <button
            className={`w-full text-left px-3 py-3 font-semibold cursor-pointer border border-gray-200 flex items-center gap-2 ${active === "password" ? "text-white bg-[#088179]" : "text-gray-900"}`}
            onClick={() => {
              toast.info("Password change is under development by our support team. Coming soon!");
            }}
          >
            <Lock size={18} />
            <span>Change Password</span>
          </button>
          <button
            className={`w-full text-left px-3 py-3 font-semibold cursor-pointer border border-gray-200 flex items-center gap-2 ${active === "orders" ? "text-white bg-[#088179]" : "text-gray-900"}`}
            onClick={() => setActive("orders")}
          >
            <Package size={18} />
            <span>Orders</span>
          </button>
          <button
            className={`w-full text-left px-3 py-3 font-semibold cursor-pointer border border-gray-200 flex items-center gap-2 ${active === "logout" ? "text-white bg-red-600" : "text-gray-900"}`}
            onClick={async () => {
              setLoading(true)
              try {
                await signOut(auth);
                await deleteCookie("auth_token")
                router.replace("/");
                setState(false);
                setCurrentUser(null);
                setaddressData(null);
                setItems([])
                setwishlist([])
              } catch (error) {
                toast.error("some thing went error!")
                setLoading(false)
              }
            }}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
          <button
            className={`w-full text-left px-3 py-3 font-semibold cursor-pointer border border-gray-200 flex items-center gap-2 ${active === "remove" ? "text-white bg-red-600" : "text-gray-900"}`}
            onClick={() => {
              // setActive("remove");
              // setShowDeleteModal(true);
              toast.info("Account deletion is under development by our support team. Coming soon!");
            }}
          >
            <Trash2 size={18} />
            <span>Remove An Account</span>
          </button>
        </div>
        <div className="w-full min-w-0 min-h-fit">
          <section className={`${active === "profile" ? "block" : "hidden"}`}>
            <UpdateProfileSection />
          </section>

          <section className={`${active === "address" ? "block" : "hidden"}`}>
            <ShopingaddressSection />
          </section>

          <section className={`${active === "orders" ? "block" : "hidden"}`}>
            <OrderSection />
          </section>

          <section className={`${active === "remove" ? "block" : "hidden"} `}>
            <div className="flex justify-center items-center h-40">
              <h3 className="text-red-500 text-center max-[500px]:text-3xl text-shadow-xs text-4xl font-semibold select-none underline">
                Delet An Account!
              </h3>
            </div>
          </section>
        </div>
      </div>
      {showDeleteModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-account-title"
        >
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-5 shadow-xl">
            <h3
              id="delete-account-title"
              className="text-lg font-semibold text-slate-900"
            >
              Delete account permanently?
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              This action cannot be undone. Your profile and account data will
              be removed.
            </p>
            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  setActive("profile");
                  setShowDeleteModal(false);
                }}
                className="inline-flex h-9 items-center justify-center rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300/50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setLoading(true);
                  deletAccount();
                }}
                disabled={Loading}
                className="inline-flex h-9 items-center justify-center rounded-md bg-red-600 w-43 text-sm font-semibold text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/40"
              >
                {Loading ? (
                  <>
                    <Loader2 className="animate-spin" />
                  </>
                ) : (
                  <>Yes, delete my account</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Profile;