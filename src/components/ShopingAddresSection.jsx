"use client";
import { useState } from "react";
import { useAuth } from "../Contexts/AuthContext";
import { toast } from "sonner";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
const ShopingaddressSection = () => {
  const [Loading, setLoading] = useState(false);
  const { Data, dispatch, currentUser, setaddressData, addressData } =
    useAuth();

  async function updateaddress() {
    if (addressData) {
      if (Data?.flat && Data?.flat.length < 4) {
        return toast.error("Flat number must be at least 4 characters long.");
      }
      if (Data?.street && Data?.street.length < 4) {
        return toast.error("Street name must be at least 4 characters long.");
      }
      if (Data?.city && Data?.city.length < 3) {
        return toast.error("City name must be at least 3 characters long.");
      }
      if (Data?.country && Data?.country.length < 4) {
        return toast.error("Country name must be at least 4 characters long.");
      }
      if (!Data.flat && !Data.street && !Data.city && !Data.country) {
        return toast.error("No data provided for update.")
      }
    }
    setLoading(true);
    try {
      const newAddress = {
        flat: Data?.flat || addressData?.flat,
        city: Data?.city || addressData?.city,
        country: Data?.country || addressData?.country,
        street: Data?.street || addressData?.street,
      };

      setaddressData(newAddress || null);
      await updateDoc(doc(db, "users", currentUser.uid), {
        address: newAddress,
      });

      toast.success("Done");
      dispatch({ type: "flat", val: "" });
      dispatch({ type: "street", val: "" });
      dispatch({ type: "city", val: "" });
      dispatch({ type: "country", val: "" });

    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div>
        <div className="bg-gray-100 py-2.5">
          <span className="text-gray-800 font-semibold pl-3">
            Shoping addresss
          </span>
        </div>
      </div>
      <div>
        <div className="border border-gray-300 border-t-gray-100">
          <div className="w-[95%] m-auto">
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="flex flex-col space-y-2.5 py-3">
                <input
                  type="text"
                  className="border border-gray-300 text-gray-600 w-full focus:outline-none pl-3 py-1.5 placeholder:text-gray-400 placeholder:text-[15px] font-medium rounded"
                  placeholder={addressData?.flat || "Flat"}
                  value={Data.flat}
                  maxLength={10}
                  onChange={(e) =>
                    dispatch({ type: "flat", val: e.target.value })
                  }
                />
                <input
                  type="text"
                  className="border border-gray-300 text-gray-600 w-full focus:outline-none pl-3 py-1.5 placeholder:text-gray-400 placeholder:text-[15px] font-medium rounded"
                  placeholder={addressData?.street || "Street"}
                  value={Data.street}
                  maxLength={25}
                  onChange={(e) =>
                    dispatch({ type: "street", val: e.target.value })
                  }
                />
                <input
                  type="text"
                  className="border border-gray-300 text-gray-600 w-full focus:outline-none pl-3 py-1.5 placeholder:text-gray-400 placeholder:text-[15px] font-medium rounded"
                  placeholder={addressData?.city || "City"}
                  value={Data.city}
                  maxLength={10}
                  onChange={(e) =>
                    dispatch({ type: "city", val: e.target.value })
                  }
                />
                <input
                  type="text"
                  className="border border-gray-300 text-gray-600 w-full focus:outline-none pl-3 py-1.5 placeholder:text-gray-400 placeholder:text-[15px] font-medium rounded"
                  placeholder={addressData?.country || "Country"}
                  value={Data.country}
                  maxLength={10}
                  onChange={(e) =>
                    dispatch({ type: "country", val: e.target.value })
                  }
                />
                <input
                  type="submit"
                  value={Loading ? "Loading..." : "Edit"}
                  className="bg-[#088179] border-2 w-fit hover:text-[#088179] text-left hover:bg-white font-semibold text-white px-4.5 py-1.5 rounded-md duration-200 cursor-pointer"
                  disabled={Loading}
                  onClick={updateaddress}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
export default ShopingaddressSection;
