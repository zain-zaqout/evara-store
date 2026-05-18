"use client";
import Link from "next/link";
import { Shuffle, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "../../Contexts/CartContext";
import { useAuth } from "../../Contexts/AuthContext";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const page = () => {
  const router = useRouter();
  const {
    Items,
    removerFromCart,
    increment,
    decrement,
    Total,
    DeleveryTotal,
    CartTotal,
  } = useCart();
  const { State } = useAuth();

  const GoToCheckOut = () => {
    if (!State) {
      toast.dismiss("checkout-auth");
      toast.info(
        ({ closeToast }) => (
          <div className="w-full max-w-[320px]">
            <p className="text-sm font-medium text-slate-800 leading-5">
              Please sign in to continue to checkout.
            </p>
            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={() => {
                  closeToast();
                  router.push("/login?next=/checkout");
                }}
                className="inline-flex h-8 items-center justify-center rounded-md bg-[#088179] px-3 text-xs font-semibold text-white transition-colors hover:bg-[#06635e] focus:outline-none focus:ring-2 focus:ring-[#088179]/30"
              >
                Sign in
              </button>
              <button
                onClick={() => {
                  closeToast();
                  toast.dismiss("checkout-auth");
                }}
                className="inline-flex h-8 items-center justify-center rounded-md border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300/50"
              >
                Not now
              </button>
            </div>
          </div>
        ),
        {
          toastId: "checkout-auth",
          autoClose: false,
          closeOnClick: false,
          className: "!rounded-xl !border !border-slate-200 !bg-white !p-4 !shadow-lg",
          bodyClassName: "!p-0 !m-0",
          icon: false,
        }
      );
      return;
    } else if (Items.length === 0) {
      toast.dismiss("checkout-empty");
      toast.info(
        ({ closeToast }) => (
          <div className="w-full max-w-[320px]">
            <p className="text-sm font-medium text-slate-800 leading-5">
              Your cart is empty. Add items to continue to checkout.
            </p>
            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={() => {
                  closeToast();
                  router.push("/shop");
                }}
                className="inline-flex h-8 items-center justify-center rounded-md bg-[#088179] px-3 text-xs font-semibold text-white transition-colors hover:bg-[#06635e] focus:outline-none focus:ring-2 focus:ring-[#088179]/30"
              >
                Shop now
              </button>
              <button
                onClick={() => {
                  closeToast();
                  toast.dismiss("checkout-empty");
                }}
                className="inline-flex h-8 items-center justify-center rounded-md border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300/50"
              >
                Close
              </button>
            </div>
          </div>
        ),
        {
          toastId: "checkout-empty",
          autoClose: false,
          closeOnClick: false,
          className: "!rounded-xl !border !border-slate-200 !bg-white !p-4 !shadow-lg",
          bodyClassName: "!p-0 !m-0",
          icon: false,
        }
      );
      return;
    }
    router.push("/checkout");
  };

  return (
    <>
      <div className="bg-gray-200 h-15 flex mb-20">
        <div className="w-[80%] m-auto flex items-center gap-2">
          <Link href="#">
            <p className="text-sm text-gray-600 font-semibold">Home</p>
          </Link>
          <p className="text-lg text-gray-600 font-semibold">»</p>
          <p className="text-sm text-gray-600 font-semibold cursor-default">Shop</p>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="w-[90%] overflow-x-auto rounded-2xl border border-gray-300 bg-white shadow-sm">
          <table className="w-full min-w-[900px] table-auto">
            <thead className="bg-[#f4f8f7]">
              <tr className="border-b border-gray-300">
                <td className="text-gray-600 px-5 py-4 text-center font-semibold">Image</td>
                <td className="text-gray-600 px-5 py-4 text-center font-semibold">Name</td>
                <td className="text-gray-600 px-5 py-4 text-center font-semibold">Price</td>
                <td className="text-gray-600 px-5 py-4 text-center font-semibold">Quantity</td>
                <td className="text-gray-600 px-5 py-4 text-center font-semibold">Subtotal</td>
                <td className="text-gray-600 px-5 py-4 text-center font-semibold">Remove</td>
              </tr>
            </thead>
            <tbody>
              {Items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-400">
                    <p className="text-xl font-semibold">Your cart is empty</p>
                    <p className="text-sm mt-2">Browse our store and add items you love!</p>
                    <Link href="/shop" className="mt-4 inline-block bg-[#088179] border-2 hover:text-[#088179] hover:bg-white text-sm font-semibold text-white px-6 py-2 rounded-sm duration-200 cursor-pointer">
                      GO TO SHOP
                    </Link>
                  </td>
                </tr>
              ) : (
                Items.map((item) => (
                  <tr key={item.productId} className="border-b border-gray-300 hover:bg-gray-50/60">
                    <td className="py-4">
                      <img src={item.firstImage} className="w-20 mx-auto" alt="" />
                    </td>
                    <td className="w-5 h-5 text-center py-4">
                      <h3 className="text-[#088179] font-semibold">
                        Lorem ipsum dolor sit amet consectetur
                      </h3>
                      <p className="w-80">
                        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Animi, l
                      </p>
                    </td>
                    <td className="text-center py-4">{item.price}</td>
                    <td className="text-center py-4">
                      <div className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-gray-50 px-2 py-1 shadow-sm">
                        <button
                          className="w-6 h-6 rounded-full bg-white text-gray-700 border border-gray-300 hover:bg-[#088179] hover:text-white transition-colors text-base font-semibold select-none pb-6 pr-px cursor-pointer"
                          onClick={() => decrement(item.id)}
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="min-w-6 text-center font-semibold text-gray-700">
                          {item.que}
                        </span>
                        <button
                          className="w-6 h-6 rounded-full bg-white text-gray-700 border border-gray-300 hover:bg-[#088179] hover:text-white transition-colors text-base font-semibold select-none pb-6 pr-px cursor-pointer"
                          onClick={() => increment(item.id)}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="text-center py-4">{item.que * item.price}</td>
                    <td className="text-center py-4">
                      <button
                        onClick={() => removerFromCart(item.id)}
                        className="inline-flex items-center cursor-pointer justify-center w-9 h-9 rounded-full bg-red-50 text-red-600 border border-red-100 shadow-sm transition-all hover:bg-red-600 hover:text-white hover:shadow-md"
                        aria-label="Remove from cart"
                      >
                        <Trash2 size={18} strokeWidth={2} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex mt-10 mb-5">
        <div className="w-[80%] m-auto flex gap-2 justify-end">
          <button className="flex select-none rounded justify-center items-center text-sm text-white h-9 gap-1 w-fit px-3 cursor-pointer border-2 border-[#088179] hover:bg-transparent hover:text-[#088179] bg-[#088179] duration-300">
            <Shuffle className="w-3.5" />
            Update Cart
          </button>
          <Link href="/shop">
            <button className="flex select-none rounded justify-center items-center text-sm text-white h-9 gap-1 w-fit px-3 cursor-pointer border-2 border-[#088179] hover:bg-transparent hover:text-[#088179] bg-[#088179] duration-300">
              <ShoppingBag className="w-4" /> Continue Shopping
            </button>
          </Link>
        </div>
      </div>

      <div className="grid">
        <div className="w-[80%] m-auto mt-9">
          <hr className="text-gray-300" />
          <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">
            <div className="py-3">
              <h3 className="text-lg font-semibold pt-4.5 pb-2">Caluculate Shopping</h3>
              <div>
                <input
                  type="text"
                  className="w-full outline outline-gray-200 rounded-sm placeholder:text-gray-400 placeholder:text-sm pl-2 py-1 shadow-sm focus:shadow-md transition-shadow duration-200"
                  placeholder="State / Country"
                />
                <div className="flex gap-2 pt-3 w-full pb-3">
                  <input
                    type="text"
                    className="w-full outline outline-gray-200 rounded-sm placeholder:text-gray-400 placeholder:text-sm pl-2 py-1 shadow-sm focus:shadow-md transition-shadow duration-200"
                    placeholder="City"
                  />
                  <input
                    type="text"
                    className="w-full outline outline-gray-200 rounded-sm placeholder:text-gray-400 placeholder:text-sm pl-2 py-1 shadow-sm focus:shadow-md transition-shadow duration-200"
                    placeholder="PostCode / ZIP"
                  />
                </div>
                <div>
                  <button className="flex select-none rounded justify-center items-center text-sm text-white h-9 gap-1 w-fit px-4 cursor-pointer border-2 border-[#088179] hover:bg-transparent hover:text-[#088179] bg-[#088179] duration-300">
                    <Shuffle className="w-3.5" />
                    Update
                  </button>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-semibold pb-1 pr-1">Calculate Shopping</h3>
                  <div className="flex gap-3 pl-1">
                    <input
                      type="text"
                      placeholder="Enter Your Coupon"
                      className="w-60 outline outline-gray-200 rounded-sm placeholder:text-gray-400 placeholder:text-sm pl-2 py-1 shadow-sm focus:shadow-md transition-shadow duration-200"
                    />
                    <button className="flex select-none rounded justify-center items-center text-sm text-white h-9 gap-1 px-3 cursor-pointer border-2 border-[#088179] hover:bg-transparent hover:text-[#088179] bg-[#088179] duration-300">
                      <ShoppingBag className="w-4" /> Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="border border-gray-300 mt-7 rounded py-3">
                <div className="w-[90%] m-auto">
                  <h3 className="text-lg text-gray-950 font-semibold">Cart Total</h3>
                  <div className="grid grid-cols-2">
                    <div>
                      <span className="border text-gray-400 font-semibold border-gray-300 block pl-1.5 py-[3px]">Cart Subtotal</span>
                      <span className="border text-gray-400 font-semibold border-gray-300 block pl-1.5 py-[3px]">Delevry</span>
                      <span className="border text-gray-400 font-semibold border-gray-300 block pl-1.5 py-[3px]">Total</span>
                    </div>
                    <div>
                      <span className="border text-[#088179] font-semibold border-gray-300 block pl-1.5 py-[3px]">{CartTotal}</span>
                      <span className="border text-[#088179] font-semibold border-gray-300 block pl-1.5 py-[3px]">{DeleveryTotal}</span>
                      <span className="border text-[#088179] font-semibold border-gray-300 block pl-1.5 py-[3px]">{Total}</span>
                    </div>
                  </div>
                  <button
                    className="flex mt-3 select-none rounded justify-center items-center text-sm text-white py-2 gap-1 px-3 cursor-pointer border-2 border-[#088179] hover:bg-transparent hover:text-[#088179] bg-[#088179] duration-300"
                    onClick={GoToCheckOut}
                  >
                    <ShoppingBag size={16} /> Proceed In CheckOut
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;