"use client";
import Link from "next/link";
import { Crown, RefreshCw, CreditCard, Heart } from "lucide-react";
import { useEffect, useReducer, useState } from "react";
import { useCart } from "../../../Contexts/CartContext";
import { useWishlist } from "@/src/Contexts/WishlistContext";
import { useParams, useRouter } from "next/navigation";
import Comments from "@/src/components/G&R_Comments";
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

const Product = () => {
  const [active, setActive] = useState(1);
  const [ImgDiriction, setImgDiriction] = useState("front");

  const router = useRouter();

  const { id } = useParams();

  const initialState = {
    loading: false,
    error: null,
    data: {},
    notFound: false,
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case "LOADING":
        return { ...state, loading: true, error: "" };
      case "SUCCESS":
        return { ...state, loading: false, error: "", data: action.val };
      case "ERROR":
        return { ...state, loading: false, error: action.val };
      case "NOT_FOUND":
        return { ...state, loading: false, notFound: true };
      default:
        return state;
    }
  };

  const [Product, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    async function getData() {
      dispatch({ type: "LOADING" });
      try {
        const res = await fetch(`/products.json`);
        if (res.status === 404) {
          dispatch({ type: "NOT_FOUND" });
          return;
        }
        if (!res.ok) throw new Error("Falid To Fetch");
        const data = await res.json();
        const newList = data.find((i) => i.id === id)
        dispatch({ type: "SUCCESS", val: newList });
      } catch (error) {
        dispatch({ type: "ERROR", val: error.message });
      }
    }
    getData();
  }, [id]);

  const { addToCart } = useCart();
  const { addToWishlis } = useWishlist();

  const item = Product.data;

  if (Product.notFound) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-3">
        <h2 className="text-2xl font-bold text-red-500">
          Sorry, this product does not exist.
        </h2>
        <button
          className="bg-[#088179] border-2 hover:text-[#088179] hover:bg-white text-sm font-semibold text-white w-27 h-9 rounded-sm duration-200 cursor-pointer"
          onClick={() => router.push("/shop")}
        >
          GO TO SHOP
        </button>
      </div>
    );
  }

  if (Product.error)
    return (
      <p className="text-red-500 text-2xl text-center py-20">
        {Product.error}...
      </p>
    );
  if (!item) return null;

  return (
    <div className="p-0">
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

      <div className="mt-13">
        <div className="w-[80%] m-auto grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] max-[890px]:gap-4">
          <div>
            <Zoom zoomMargin={20}>

              <img
                className="w-full min-[890px]:max-w-[90%] select-none"
                src={ImgDiriction === "front" ? item.firstImage : item.lastImage}
                alt=""
              />
            </Zoom>
            <div className="flex gap-1 mt-1">
              <img
                className={`select-none cursor-pointer ${ImgDiriction === "front" ? "border border-gray-400" : ""}`}
                width={100}
                src={item.firstImage}
                alt=""
                onClick={() => setImgDiriction("front")}
              />
              <img
                className={`select-none cursor-pointer ${ImgDiriction === "back" ? "border border-gray-400" : ""}`}
                width={100}
                src={item.lastImage}
                alt=""
                onClick={() => setImgDiriction("back")}
              />
            </div>
          </div>
          <div className="max-[645px]:pt-4">
            <h2 className="text-3xl font-semibold">{item.name}</h2>
            <p className="text-sm font-semibold py-3">
              Brand: <span className="text-[#088179]">adidas</span>
            </p>
            <hr className="text-gray-300" />
            <div className="flex items-center gap-2 py-1.5">
              <span className="text-3xl text-[#088179] font-semibold">
                $116
              </span>
              <del className="text-gray-600 text-[12px]">
                <span className="text-[12px] text-gray-600">{item.price}</span>
              </del>
              <span className="text-[12px] text-gray-600">25% Off</span>
            </div>
            <hr className="text-gray-300" />
            <p className="pt-1.5 pb-3 text-gray-600 text-[15px]">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit
              recusandae quo reiciendis culpa quas fugit id et, natus illum ea
              exercitationem praesentium
            </p>
            <div className="flex flex-col gap-1">
              <p className="flex items-center gap-1 text-sm text-gray-600">
                <Crown size={17} /> 1 Year AL Jazeera Brand Warranty
              </p>
              <p className="flex items-center gap-1 text-sm text-gray-600">
                <RefreshCw size={17} />
                30 Day Return Policy
              </p>
              <p className="flex items-center gap-1 text-sm text-gray-600">
                <CreditCard size={17} />
                Cash on Delivery available
              </p>
            </div>
            <div className="flex items-center gap-1 pt-5">
              <span className="gray-800 font-semibold text-[15px]">Color:</span>
              <span className="bg-yellow-400 cursor-pointer hover:bg-amber-500 duration-150 w-5 h-5 rounded-full block" />
              <span className="bg-red-400 hover:bg-red-500 duration-150 cursor-pointer w-5 h-5 rounded-full block" />
              <span className="bg-pink-400 cursor-pointer hover:bg-pink-500 duration-150 w-5 h-5 rounded-full block" />
              <span className="bg-green-600 cursor-pointer hover:bg-green-700 duration-150 w-5 h-5 rounded-full block" />
            </div>
            <div className="flex gap-1.5 pt-3">
              <span className="text-gray-800 font-semibold text-[15px]">
                Size:{" "}
              </span>
              <p
                className={`w-6.5 h-6.5 text-center hover:bg-[#088179] hover:text-white duration-300 border border-gray-300 ${active === 1 ? "bg-[#088179] text-white border-gray-500" : " bg-white select-none text-gray-700"} cursor-pointer`}
                onClick={() => setActive(1)}
              >
                M
              </p>
              <p
                className={`w-6.5 h-6.5 text-center hover:bg-[#088179] hover:text-white duration-300 border border-gray-300 ${active === 2 ? "bg-[#088179] text-white border-gray-500" : " bg-white select-none text-gray-700"} cursor-pointer`}
                onClick={() => setActive(2)}
              >
                L
              </p>
              <p
                className={`w-6.5 h-6.5 text-center hover:bg-[#088179] hover:text-white duration-300 border border-gray-300 ${active === 3 ? "bg-[#088179] text-white border-gray-500" : " bg-white select-none text-gray-700"} cursor-pointer`}
                onClick={() => setActive(3)}
              >
                XL
              </p>
              <p
                className={`w-8.5 h-6.5 text-center hover:bg-[#088179] hover:text-white duration-300 border border-gray-300 ${active === 4 ? "bg-[#088179] text-white border-gray-500" : " bg-white select-none text-gray-700"} cursor-pointer`}
                onClick={() => setActive(4)}
              >
                XXL
              </p>
            </div>
            <div className="flex items-center gap-0.5 pt-5">
              <button
                className="bg-[#088179] border-2 hover:text-[#088179] hover:bg-white text-sm font-semibold text-white w-27 h-9 rounded-sm duration-200 cursor-pointer"
                onClick={() => addToCart(item)}
              >
                Add To Cart
              </button>
              <div
                className="border border-gray-300 w-8 h-8 flex justify-center items-center cursor-pointer group"
                onClick={() => addToWishlis(item)}
              >
                <Heart
                  className="group-hover:text-red-500 duration-150"
                  size={18}
                />
              </div>
            </div>
            <hr className="text-gray-300 mt-7 pb-3 block" />
            <div className="flex flex-col gap-1">
              <p className="text-[13px] text-gray-500 font-semibold">
                SKU: FWM15VKT
              </p>
              <p className="text-[13px] text-gray-500 font-semibold">
                Tags: Cloth, Women, Dress
              </p>
              <p className="text-[13px] text-gray-500 font-semibold">
                Avilability: 8 Items In Stock
              </p>
            </div>
          </div>
        </div>
        <Comments />
      </div>
    </div>
  );
};
export default Product;
