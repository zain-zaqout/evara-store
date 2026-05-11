"use client";
import { Star, Eye, Heart, Shuffle, ShoppingBag } from "lucide-react";
import { useCart } from "../../Contexts/CartContext";
import { useWishlist } from "../../Contexts/WishlistContext";
import Link from "next/link";
import { useProducts } from "@/src/Contexts/ProductsContext";

const page = () => {
  const { addToCart } = useCart();
  const { addToWishlis } = useWishlist();
  const {products} = useProducts()

  return (
    <>
      <div className="bg-gray-200 h-16 flex">
        <div className="w-[80%] m-auto flex items-center gap-2">
          <Link href="#">
            <p className="text-sm text-gray-600 font-semibold">Home</p>
          </Link>
          <p className="text-lg text-gray-600 font-semibold">»</p>
          <p className="text-sm text-gray-600 font-semibold cursor-default">
            Shop
          </p>
        </div>
      </div>
      <div className="w-[80%] m-auto">
        <div className="grid place-content-center justify-items-center grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">
          {products.map((item) => (
            <div
              key={item.id}
              className="group mt-8 relative border-2 border-gray-300 rounded-3xl p-3 w-fit"
            >
              <div className=" relative w-55 h-55">
                <img
                  src={item.firstImage}
                  className="w-55 h-55 rounded-2xl group-hover:opacity-0 transition-opacity select-none"
                  alt=""
                />
                <div className="">
                  <div
                    style={{ backgroundColor: item.color }}
                    className=" opacity-95 select-none flex justify-center items-center rounded-4xl w-fit px-[9.8px] h-[17.5px] z-50 absolute top-1.5 left-2"
                  >
                    <span className="text-[11px] text-white">{item.label}</span>
                  </div>
                  <img
                    src={item.lastImage}
                    className="absolute bottom-[0.5px] w-55 h-55 rounded-2xl select-none opacity-0 group-hover:opacity-100 transition-opacity ease-out duration-500"
                    alt=""
                  />
                  <div className="flex justify-center gap-2 absolute bottom-24.5 left-18 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="group/icon relative bg-gray-200 cursor-pointer w-8 h-8 rounded-[50%] flex justify-center items-center">
                      <Link href={`/Product/${item.id}`}>
                        <Eye size={15} />
                      </Link>
                      <div className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover/icon:opacity-100 transition-opacity">
                        <span className="bg-[#088179] text-white text-[14px] px-2 py-1 rounded-sm whitespace-nowrap">
                          Quick View
                        </span>
                        <span className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-[#088179]" />
                      </div>
                    </div>
                    <div className="group/icon relative bg-gray-200 cursor-pointer w-8 h-8 rounded-[50%] flex justify-center items-center">
                      <Heart size={15} onClick={() => addToWishlis(item)} />
                      <div className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover/icon:opacity-100 transition-opacity">
                        <span className="bg-[#088179] text-white text-sm px-2 py-1 rounded-sm whitespace-nowrap">
                          Add To wishlist
                        </span>
                        <span className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-[#088179]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-2">
                <span className="text-[#90908e] text-[15px]">Clothing</span>
                <p className="text-gray-800 font-semibold text-[15px]">
                  Colorful Pattern Shirt
                </p>
                <div className="flex gap-0.5 py-0.5">
                  <Star size={15} className="text-yellow-400" />
                  <Star size={15} className="text-yellow-400" />
                  <Star size={15} className="text-yellow-400" />
                  <Star size={15} className="text-yellow-400" />
                  <Star size={15} className="text-yellow-400" />
                </div>
                <div className="flex  gap-0.5 pb-px">
                  <span className="text-[#088179] font-semibold">238.85$</span>
                  <del className="text-gray-400">
                    <span className="text-sm text-gray-400 px-1">245.8$</span>
                  </del>
                </div>
                <button
                  onClick={() => addToCart(item)}
                  className="group/icon absolute right-3.5 bottom-5 inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#088179]/10 text-[#088179] border border-[#088179]/20 shadow-sm transition-all hover:bg-[#088179] hover:text-white hover:shadow-md cursor-pointer"
                  aria-label="Add to cart"
                >
                  <ShoppingBag size={16} />
                  <div className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover/icon:opacity-100 transition-opacity">
                    <span className="bg-[#088179] select-none text-white text-sm px-2 py-1 rounded-sm whitespace-nowrap">
                      Add to cart
                    </span>
                    <span className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-0 h-0 border-l-6 border-r-6 border-t-6 border-l-transparent border-r-transparent border-t-[#088179]" />
                  </div>
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-1.5 mt-6 pl-3.5 ">
          <span className="bg-[#088179] text-white w-7 h-7 text-center text-sm pt-1 rounded font-semibold select-none">
            01
          </span>
          <span className="text-gray-900 w-7 h-7 text-center text-sm pt-1 rounded hover:bg-[#088179] hover:text-white font-semibold cursor-pointer duration-200 select-none">
            02
          </span>
          <span className="text-gray-900 w-7 h-7 text-center text-sm pt-1 rounded hover:bg-[#088179] hover:text-white font-semibold cursor-pointer duration-200 select-none">
            03
          </span>
          <span className="text-gray-900 w-7 h-7 text-center text-sm pt-1 font-semibold select-none">
            _
          </span>
          <span className="text-gray-900 w-7 h-7 text-center text-sm pt-1 rounded hover:bg-[#088179] hover:text-white font-semibold cursor-pointer duration-200 select-none">
            16
          </span>
          <span className="text-gray-900 w-7 h-7 text-center pt-0.5 rounded-tr-[50%] rounded-br-[50%] rounded-l hover:bg-[#088179] hover:text-white font-semibold cursor-pointer duration-200 select-none">
            »
          </span>
        </div>
      </div>
    </>
  );
};
export default page;
