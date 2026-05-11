"use client";
import { useCart } from "../../Contexts/CartContext";
import Link from "next/link";
import { useWishlist } from "../../Contexts/WishlistContext";
import { Trash2 } from "lucide-react";
const page = () => {

  const { addToCart } = useCart();
  const { wishlis, RemoveFromWishlis } = useWishlist();
  
  return (
    <>
      <div className="bg-gray-200 h-15 flex mb-20">
        <div className="w-[80%] m-auto flex items-center gap-2">
          <Link href="#">
            <p className="text-sm text-gray-600 font-semibold">Home</p>
          </Link>
          <p className="text-lg text-gray-600 font-semibold">»</p>
          <p className="text-sm text-gray-600 font-semibold cursor-default">
            Wishlist
          </p>
        </div>
      </div>
      <div className="flex justify-center mb-25">
        <div className="w-[90%] overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full min-w-[900px] table-auto">
            <thead className="bg-[#f4f8f7]">
              <tr className="border-b border-gray-200">
                <td className="text-gray-600 px-5 py-4 text-center font-semibold">
                  Image
                </td>
                <td className="text-gray-600 px-5 py-4 text-center font-semibold">
                  Name
                </td>
                <td className="text-gray-600 px-5 py-4 text-center font-semibold">
                  Price
                </td>
                <td className="text-gray-600 px-5 py-4 text-center font-semibold">
                  Stock Status
                </td>
                <td className="text-gray-600 px-5 py-4 text-center font-semibold">
                  Action
                </td>
                <td className="text-gray-600 px-5 py-4 text-center font-semibold">
                  Remove
                </td>
              </tr>
            </thead>
            <tbody>
              {wishlis.map((item) => (
                <tr
                  key={item.productId}
                  className="border-b border-gray-200 hover:bg-gray-50/60"
                >
                  <td className="text-center py-4">
                    <img src={item.firstImage} className="w-20 mx-auto" alt="" />
                  </td>
                  <td className="text-center py-4">
                    <h3 className="text-[#088179] font-semibold">
                      Lorem ipsum dolor sit amet consectetur
                    </h3>
                    <p className="w-80 mx-auto">
                      Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                      Animi, l
                    </p>
                  </td>
                  <td className="text-center py-4">{item.price}</td>
                  <td className="text-center py-4">
                    <span className="text-[#088179] font-semibold text-[15px]">
                      in Stock
                    </span>
                  </td>
                  <td className="text-center py-4">
                    <button
                      className="bg-[#088179] border-2 hover:text-[#088179] hover:bg-white text-sm font-semibold text-white w-27 h-9 rounded-sm duration-200 cursor-pointer"
                      onClick={() => addToCart(item)}
                    >
                      Add To Cart
                    </button>
                  </td>
                  <td className="text-center py-4">
                    <button
                      onClick={() => RemoveFromWishlis(item.productId ?? item.id)}
                      className="inline-flex cursor-pointer items-center justify-center w-9 h-9 rounded-full bg-red-50 text-red-600 border border-red-100 shadow-sm transition-all hover:bg-red-600 hover:text-white hover:shadow-md"
                      aria-label="Remove from wishlist"
                    >
                      <Trash2 size={18} strokeWidth={2} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
export default page;
