"use client";
import { useEffect, useReducer } from "react";
import { useAuth } from "../Contexts/AuthContext";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../lib/firebase";

const OrderSection = () => {

  const { currentUser } = useAuth()

  const initialState = {
    data: [],
    loading: false,
    error: null
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case "LOADING":
        return { loading: true, erorr: "", data: [] };
      case "SUCCESS":
        return {
          ...state,
          loading: false,
          erorr: "",
          data: action.val,
        };
      case "ERROR":
        return { loading: false, erorr: action.val, data: [] };
      default:
        return state;
    }
  };

  const [orders, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    if (!currentUser?.uid) return;
    async function getData() {
      dispatch({ type: "LOADING" });
      try {
        const q = query(collection(db, "orders"), where("userId", "==", currentUser.uid))
        const getData = await getDocs(q)
        const orderData = getData.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            date: data.date?.toDate ? data.date.toDate().toLocaleDateString() : "No Date"
          };
        })

        dispatch({ type: "SUCCESS", val: orderData });
      } catch (error) {
        dispatch({ type: "ERROR", val: error.message });
      }
    }
    getData();
  }, [currentUser?.uid]);

  return (
    <>
      <div className="bg-gray-200 py-2.5">
        <span className="pl-3 font-semibold text-gray-900">Your Orders</span>
      </div>

      <div className="border border-gray-200 bg-white">
        <div className="w-[90%] m-auto overflow-x-auto py-3">
          <table className="w-full min-w-[680px] border-collapse border border-gray-300 text-sm">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                  Order
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                  Data
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                  Status
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                  Total
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {orders.data.map((order) => (
                <tr key={order.id}>
                  <td className="border border-gray-300 px-4 py-2 font-semibold text-left">
                    #{order.id.slice(0, 4)}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 font-semibold text-gray-700 text-left">
                    {order.date}
                  </td>
                  <td
                    className={`border border-gray-300 px-4 py-2 text-left font-semibold text-base ${order.status === "Complete"
                        ? "text-green-700"
                        : "text-orange-600"
                      }`}
                  >
                    {order.status}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-800 font-semibold text-base text-left">
                    ${order.total}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-[#088179] text-base font-semibold text-left cursor-pointer hover:text-emerald-800 duration-150">
                    View
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

export default OrderSection;
