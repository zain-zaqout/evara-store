"use client";
import Link from "next/link";
import { useCart } from "../../Contexts/CartContext";
import { useAuth } from "../../Contexts/AuthContext";
import { toast } from "sonner";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { addDoc, collection, deleteDoc, doc, getDocs, query, serverTimestamp, where } from "firebase/firestore";
import { db } from "@/src/lib/firebase";
import { Loader2 } from "lucide-react";
import { FullPageLoader } from "@/src/components/FullPageLoader";

const CheckOut = () => {
  const router = useRouter();
  const path = usePathname();

  const [Loading, setLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true)
  const [isOrderCompleted, setisOrderCompleted] = useState(false)

  const { currentUser, addressData, isAuthReady } = useAuth();
  const { Items, setItems, Total, CartTotal, DeleveryTotal, setActive } =
    useCart();

  const palceOrder = () => {
    if (!billingCity?.trim()) {
      toast.info("Go To My Account Page to add address information");
      return;
    }

    setLoading(true);

    addOrder();
  };

  async function addOrder() {
    try {
      const orderData = {
        orderId: currentUser.uid,
        userName: billingName,
        email: billingEmail,
        address: {
          street: billingStreet,
          city: billingCity,
          country: billingCountry,
        },
        items: Items,
        date: serverTimestamp(),
        status: "Pending",
        total: Total,
      };

      const q = query(
        collection(db, "cart"),
        where("userId", "==", currentUser.uid)
      );

      const querySnapshot = await getDocs(q);

      await Promise.all(
        querySnapshot.docs.map((item) =>
          deleteDoc(doc(db, "cart", item.id))
        )
      );

      await addDoc(collection(db, "orders"), orderData);
      setisOrderCompleted(true)

      toast.success("Order created successfully!");
      setItems([]);
      router.replace("/profile");
      setActive("orders");
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (Items.length === 0 && !isOrderCompleted) {
      router.replace("/cart");
    } else {
      setIsChecking(false)
    }
  }, [Items, router, isOrderCompleted])

  const billingName = currentUser?.user ?? "";
  const billingEmail = currentUser?.email ?? "";
  const billingStreet = [addressData?.flat, addressData?.street]
    .filter(Boolean)
    .join(" / ");
  const billingCity = addressData?.city ?? "";
  const billingCountry = addressData?.country ?? "";


  useEffect(() => {
    if (!isAuthReady) return

    if (!currentUser) {
      return toast.info("Please sign in to your account to complete your order.")
    } else if (!currentUser?.emailVerified) {
      return toast.info("Please verify your email to complete your order.")
    }
  }, [isAuthReady, currentUser, path])

  if (isChecking || !isAuthReady) {
    return <FullPageLoader />
  }
  return (
    <>
      <div className="bg-gray-200 h-16 flex">
        <div className="w-[80%] m-auto flex items-center gap-2">
          <Link href="/">
            <p className="text-sm text-gray-600 font-semibold">Home</p>
          </Link>
          <p className="text-lg text-gray-600 font-semibold">»</p>
          <p className="text-sm text-gray-600 font-semibold cursor-default">
            Cart
          </p>
          <p className="text-lg text-gray-600 font-semibold">»</p>
          <p className="text-sm text-gray-600 font-semibold cursor-default">
            CheckOut
          </p>
        </div>
      </div>
      <div>
        <div className="m-auto grid w-[90%] grid-cols-1 gap-4 md:w-[80%] md:grid-cols-2">
          <div>
            <h3 className="mt-8 pb-2 font-semibold text-lg md:mt-10">
              Billing Details
            </h3>
            <div className="flex flex-col gap-3 pl-1">
              <input
                className="w-full text-gray-500 font-medium outline outline-gray-200 rounded-sm placeholder:text-gray-400 placeholder:text-sm pl-2 py-1 shadow-sm focus:shadow-md transition-shadow duration-200"
                type="text"
                placeholder="Name"
                value={billingName}
                readOnly
              />
              <input
                className="w-full text-gray-500 font-medium outline outline-gray-200 rounded-sm placeholder:text-gray-400 placeholder:text-sm pl-2 py-1 shadow-sm focus:shadow-md transition-shadow duration-200"
                type="email"
                placeholder="Email"
                value={billingEmail}
                readOnly
              />
              <input
                className="w-full text-gray-500 font-medium outline outline-gray-200 rounded-sm placeholder:text-gray-400 placeholder:text-sm pl-2 py-1 shadow-sm focus:shadow-md transition-shadow duration-200"
                type="text"
                placeholder="Flat, Street"
                value={billingStreet}
                readOnly
              />
              <input
                className="w-full text-gray-500 font-medium outline outline-gray-200 rounded-sm placeholder:text-gray-400 placeholder:text-sm pl-2 py-1 shadow-sm focus:shadow-md transition-shadow duration-200"
                type="text"
                placeholder="City"
                value={billingCity}
                readOnly
              />
              <input
                className="w-full text-gray-500 font-medium outline outline-gray-200 rounded-sm placeholder:text-gray-400 placeholder:text-sm pl-2 py-1 shadow-sm focus:shadow-md transition-shadow duration-200"
                type="text"
                placeholder="Country"
                value={billingCountry}
                readOnly
              />
            </div>
            <p className="pt-10 text-xl text-center text-semibold font-medium text-slate-800">
              If you want to edit your address, name, or email <br /> please go
              to the
              <button
                onClick={() => {
                  setActive("address");
                  router.push("/profile")
                }}
                className="font-semibold cursor-pointer text-[#088179] hover:underline"
              >
                {" "}My Account{" "}
              </button>
              page. .
            </p>
          </div>
          <div className="mt-8 md:mt-10">
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              <div className="m-auto w-[88%] md:w-[90%]">
                <h3 className="py-2 text-lg font-semibold tracking-wide text-slate-800 md:py-3">
                  Cart Totals
                </h3>
                <section className="w-full m-auto md:pb-5">
                  <table className="block w-full table-fixed border-separate border-spacing-0 overflow-hidden rounded-lg md:table">
                    <colgroup className="hidden md:table-column-group">
                      <col className="w-[30%]" />
                      <col className="w-[50%]" />
                      <col className="w-[20%]" />
                    </colgroup>
                    <thead className="hidden md:table-header-group">
                      <tr className="w-full">
                        <th
                          colSpan={2}
                          className="border border-slate-200 bg-slate-100 py-2 text-center text-sm font-semibold text-slate-700"
                        >
                          Product
                        </th>
                        <th className="border border-slate-200 bg-slate-100 py-2 text-center text-sm font-semibold text-slate-700">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="block w-full md:table-row-group">
                      {Items.map((item) => (
                        <tr
                          key={item.id}
                          className="mb-2 block w-full overflow-hidden rounded-lg border border-slate-200 transition-colors hover:bg-slate-50/70 md:mb-0 md:table-row md:rounded-none md:border-0"
                        >
                          <td className="block w-full border-b border-slate-200 bg-white py-1.5 text-center align-middle md:table-cell md:w-[30%] md:border md:border-slate-200 md:py-2">
                            <img
                              src={item.firstImage}
                              className="mx-auto h-12 w-12 rounded-md border border-slate-200 object-cover md:h-14 md:w-14"
                              alt=""
                            />
                          </td>
                          <td className="block w-full border-b border-slate-200 bg-white px-2 py-1.5 text-center text-sm max-[768px]:text-[15px] text-slate-600 md:table-cell md:w-[50%] md:border md:border-slate-200 md:py-2">
                            Lorem ipsum dolor sit amet, consectetur adip
                          </td>
                          <td className="block w-full bg-white py-1.5 text-center font-semibold text-slate-800 md:table-cell md:w-[20%] md:border md:border-slate-200 md:py-2">
                            {item.que * item.price}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="hidden md:table-footer-group">
                      <tr>
                        <td
                          colSpan={1}
                          className="border border-slate-200 text-[15px] bg-slate-50 py-1.5 text-center font-semibold text-slate-700"
                        >
                          <span>Sub TotaL</span>
                        </td>
                        <td
                          colSpan={2}
                          className="border border-slate-200 text-[15px] bg-slate-50 py-1.5 text-center font-semibold text-slate-700"
                        >
                          {CartTotal}
                        </td>
                      </tr>
                      <tr>
                        <td
                          colSpan={1}
                          className="border border-slate-200 bg-slate-50 py-1.5 text-[15px] text-center font-semibold text-gray-700"
                        >
                          <span>Delevery</span>
                        </td>
                        <td
                          colSpan={2}
                          className="border border-slate-200 bg-slate-50 py-1.5 text-[15px] text-center font-semibold text-gray-700"
                        >
                          {DeleveryTotal}
                        </td>
                      </tr>
                      <tr>
                        <td
                          colSpan={1}
                          className="border border-slate-200 bg-slate-50 py-1.5 text-center text-[17px] font-bold text-[#088179]"
                        >
                          <span>Total</span>
                        </td>
                        <td
                          colSpan={2}
                          className="border border-slate-200 bg-slate-50 py-1.5 text-center text-[17px] font-bold text-[#088179]"
                        >
                          {Total}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                  <div className="mt-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm md:hidden">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-1">
                      <span className="font-semibold text-slate-700">
                        SubTotal
                      </span>
                      <span className="font-semibold text-slate-800">
                        {CartTotal}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-b border-slate-200 py-1">
                      <span className="font-semibold text-slate-700">
                        Delivery
                      </span>
                      <span className="font-semibold text-slate-800">
                        {DeleveryTotal}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-base font-bold text-[#088179]">
                        Total
                      </span>
                      <span className="text-base font-bold text-emerald-700">
                        {Total}
                      </span>
                    </div>
                  </div>
                </section>
                <div className="py-4">
                  <h3 className="text-base text-gray-900 font-semibold">
                    Payment
                  </h3>
                  <div className="flex flex-col gap-2 pl-1 pt-1">
                    <div className="flex gap-1">
                      <input
                        id="1"
                        type="radio"
                        name="payment"
                        defaultChecked
                        className="accent-[#088179] cursor-pointer"
                      />
                      <label
                        className="select-none text-sm cursor-pointer font-semibold text-gray-700"
                        htmlFor="1"
                      >
                        Direct Bank Transfer
                      </label>
                    </div>
                    <div className="flex gap-1">
                      <input
                        id="2"
                        type="radio"
                        name="payment"
                        className="accent-[#088179] cursor-pointer"
                      />
                      <label
                        className="select-none text-sm cursor-pointer font-semibold text-gray-700"
                        htmlFor="2"
                      >
                        Check Payment
                      </label>
                    </div>
                    <div className="flex gap-1">
                      <input
                        id="3"
                        type="radio"
                        name="payment"
                        className="accent-[#088179] cursor-pointer"
                      />
                      <label
                        className="select-none text-sm cursor-pointer font-semibold text-gray-700"
                        htmlFor="3"
                      >
                        Paypal
                      </label>
                    </div>
                    <button
                      className="bg-[#088179] flex justify-center border-2 hover:text-[#088179] mt-1 hover:bg-white text-sm font-semibold text-white w-30 py-2 rounded-sm duration-200 cursor-pointer"
                      onClick={palceOrder}
                      disabled={Loading}
                    >
                      {Loading ? (
                        <>
                          <Loader2 className="animate-spin" />
                        </>
                      ) : (
                        <>Place Order</>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default CheckOut;
