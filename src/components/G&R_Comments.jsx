"use client";
import { useAuth } from "../Contexts/AuthContext";
import { useEffect, useReducer, useState } from "react";
import { Loader2, Star } from "lucide-react";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";

const Comments = () => {
  const [activeSection, setactiveSection] = useState(1);
  const [Comment, setComment] = useState("");

  const { id } = useParams();
  const { currentUser } = useAuth();

  const initialState = {
    data: [],
    loading: false,
    error: null,
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case "LOADING":
        return { ...state, loading: true, error: "" };
      case "GET_DATA":
        return {
          ...state,
          loading: false,
          error: "",
          data: action.val,
        };
      case "NEW_COMMENT":
        return {
          ...state,
          loading: false,
          error: "",
          data: [...state.data, action.val],
        };
      case "ERROR":
        return { ...state, loading: false, error: action.val };
      default:
        return state;
    }
  };

  const [comments, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        dispatch({ type: "LOADING" });
        const querySnapshot = await getDocs(collection(db, "reviews"));
        if (!querySnapshot) throw new Error("Falid To Fetch");
        const reviewsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const productsComments = reviewsData.filter(
          (i) => i.productId === id,
        );
        dispatch({ type: "GET_DATA", val: productsComments });
      } catch (error) {
        dispatch({ type: "ERROR", val: error.message });
      }
    };
    fetchReviews();
  }, [id]);

  const addReview = async () => {
    dispatch({ type: "LOADING" });

    const newComment = {
      productId: String(id),
      comment: Comment,
      user: currentUser?.user,
      date: today,
      img: "/assets/images/userAno.webp",
    };
    try {
      const docRef = await addDoc(collection(db, "reviews"), newComment);
      dispatch({ type: "NEW_COMMENT", val: { id: docRef.id, ...newComment } });

      setComment("");
      toast.success("Comment Has Added successfully!");
    } catch (error) {
      dispatch({ type: "ERROR", val: error.message });
      toast.error(error.message)
    }
  };

  const today = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  if (comments.error) {
    return (
      <div className="flex items-center justify-center mt-10">
        <p className="text-2xl text-red-500 font-black">{comments.error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="mt-15">
        <div className="w-[80%] m-auto">
          <div className="flex gap-2">
            <p
              className={`font-bold cursor-pointer select-none ${activeSection === 1 ? "text-[#088179]" : "text-gray-700 "}`}
              onClick={() => setactiveSection(1)}
            >
              Addilional Info
            </p>
            <p
              className={`font-bold cursor-pointer select-none ${activeSection === 2 ? "text-[#088179]" : "text-gray-700"}`}
              onClick={() => setactiveSection(2)}
            >
              Review({comments.data.length})
            </p>
          </div>
          {activeSection === 1 ? (
            <div className="mt-6 overflow-x-auto">
              <div className="grid min-w-[780px] grid-cols-2 gap-4">
                <table className="w-full table-auto">
                  <tbody>
                    <tr>
                      <td className="border border-gray-400 rounded px-2 py-1 text-gray-800">
                        <p>Stand Up</p>
                      </td>
                      <td className="border border-gray-400 rounded px-2 py-1 text-gray-500">
                        <p>35*L x 24*W x 37-45*H(front to back wheel)</p>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-400 rounded px-2 py-1 text-gray-800">
                        <p>Folded (w/o wheels)</p>
                      </td>
                      <td className="border border-gray-400 rounded px-2 py-1 text-gray-500">
                        <p>32.5*L × 18.5*W × 16.5*H</p>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-400 rounded px-2 py-1 text-gray-800">
                        <p>Folded (w/ wheels)</p>
                      </td>
                      <td className="border border-gray-400 rounded px-2 py-1 text-gray-500">
                        <p>32.5*L × 24*W × 18.5*H</p>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-400 rounded px-2 py-1 text-gray-800">
                        <p>Door Pass Through</p>
                      </td>
                      <td className="border border-gray-400 rounded px-2 py-1 text-gray-500">
                        <p>24</p>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-400 rounded px-2 py-1 text-gray-800">
                        <p>Frame</p>
                      </td>
                      <td className="border border-gray-400 rounded px-2 py-1 text-gray-500">
                        <p>Aluminum</p>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-400 rounded px-2 py-1 text-gray-800">
                        <p>Weight (w/o wheels)</p>
                      </td>
                      <td className="border border-gray-400 rounded px-2 py-1 text-gray-500">
                        <p>20 LBS</p>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-400 rounded px-2 py-1 text-gray-800">
                        <p>Weight</p>
                      </td>
                      <td className="border border-gray-400 rounded px-2 py-1 text-gray-500">
                        <p>60 LBS</p>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table className="w-full table-auto">
                  <tbody>
                    <tr>
                      <td className="border border-gray-400 rounded px-2 py-1 text-gray-800">
                        <p>Width</p>
                      </td>
                      <td className="border border-gray-400 rounded px-2 py-1 text-gray-500">
                        <p>24</p>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-400 rounded px-2 py-1 text-gray-800">
                        <p>Handle hight (ground to handle)</p>
                      </td>
                      <td className="border border-gray-400 rounded px-2 py-1 text-gray-500">
                        <p>37-45</p>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-400 rounded px-2 py-1 text-gray-800">
                        <p>Wheels</p>
                      </td>
                      <td className="border border-gray-400 rounded px-2 py-1 text-gray-500">
                        <p>12 air / wide track slick tread</p>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-400 rounded px-2 py-1 text-gray-800">
                        <p>Seat back height</p>
                      </td>
                      <td className="border border-gray-400 rounded px-2 py-1 text-gray-500">
                        <p>21.5</p>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-400 rounded px-2 py-1 text-gray-800">
                        <p>Head room (Inside canopy)</p>
                      </td>
                      <td className="border border-gray-400 rounded px-2 py-1 text-gray-500">
                        <p>25</p>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-400 rounded px-2 py-1 text-gray-800">
                        <p>Color</p>
                      </td>
                      <td className="border border-gray-400 rounded px-2 py-1 text-gray-500">
                        <p>Black,Blue,Red,White</p>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-400 rounded px-2 py-1 text-gray-800">
                        <p>Size</p>
                      </td>
                      <td className="border border-gray-400 rounded px-2 py-1 text-gray-500">
                        <p>M,S</p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            comments.data.map((item) => (
              <div key={item.id} className="mt-8">
                <div className="flex gap-2.5 items-center">
                  <div className="flex flex-col ">
                    <img
                      src={item.img}
                      width={75}
                      className="select-none rounded-full min-w-20"
                      alt=""
                    />
                    <h3 className="font-semibold text-[15px] text-center text-gray-700 pt-0.5">
                      {item.user}
                    </h3>
                  </div>
                  <div className="pb-6">
                    <div className="flex gap-0.5">
                      <Star size={14} className="text-yellow-400" />
                      <Star size={14} className="text-yellow-400" />
                      <Star size={14} className="text-yellow-400" />
                      <Star size={14} className="text-yellow-400" />
                      <Star size={14} className="text-yellow-400" />
                    </div>
                    <p className="text-gray-700">{item.comment}</p>
                    <p className="text-sm text-gray-500">{item.date}</p>
                  </div>
                </div>
                <hr className="text-gray-300 mt-3 block" />
              </div>
            ))
          )}
          <div className={`mt-5 ${activeSection === 1 ? "hidden" : ""}`}>
            <h3 className="font-semibold text-lg">Add a review</h3>
            <div className="flex gap-0.5 pt-1.5">
              <Star size={14} className="active:text-yellow-400" />
              <Star size={14} className="active:text-yellow-400" />
              <Star size={14} className="active:text-yellow-400" />
              <Star size={14} className="active:text-yellow-400" />
              <Star size={14} className="active:text-yellow-400" />
            </div>
            <form onSubmit={(e) => e.preventDefault()}>
              <textarea
                value={Comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full mt-4.5 outline text-sm outline-gray-200 min-h-30 rounded-sm placeholder:text-gray-400 placeholder:text-sm pl-2 py-1 shadow-sm transition-shadow duration-200"
                placeholder="Write Comment"
                maxLength={70}
              />
              <button
                disabled={comments.loading}
                className="bg-[#088179] flex items-center justify-center border-2 text-center hover:text-[#088179] mt-1 hover:bg-white text-sm font-semibold text-white w-29 h-9 rounded-sm duration-200 cursor-pointer"
                onClick={() => {
                  if (Comment === "") return false
                  if (currentUser?.emailVerified) {
                    addReview();
                  } else if (currentUser && !currentUser?.emailVerified) {
                    toast.error("Please verify your email to submit a review.");
                    return
                  } else {
                    toast.error("Please sign in to your account to submit a review.");
                    return
                  }
                }}
              >
                {comments.loading ? (
                  <>
                    <Loader2 className="animate-spin" />
                  </>
                ) : (
                  <>
                    Submit Review
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
export default Comments;
