import { useState, useEffect } from "react";
import { useAuth } from "../Contexts/AuthContext";
import { useForm } from "../Contexts/FormContexts";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { updateProfile } from "firebase/auth";
const UpdateProfileSection = () => {
  const [Loading, setLoading] = useState(false);
  const [cachedEmail, setCachedEmail] = useState("");

  const { currentUser, setCurrentUser } = useAuth();
  const { Data, dispatch } = useForm();

  useEffect(() => {
    if (currentUser?.user && Data.user === "") {
      dispatch({ type: "user", val: currentUser.user });
    }
    if (currentUser?.email) {
      setCachedEmail(currentUser.email);
    }
  }, [currentUser]);

  async function changeData() {
    const nameValue = Data.user?.trim();

    if (!nameValue || nameValue.length < 3) {
      return toast.error(
        "Name is too short! Please enter at least 3 characters.",
      );
    }

    setLoading(true);
    try {
      if (!auth.currentUser)
        throw new Error(
          "Session expired or user not found. Please log in again.",
        );

      if (nameValue !== currentUser.user) {
        const checkUser = await getDocs(
          query(collection(db, "users"), where("user", "==", nameValue)),
        );
        if (!checkUser.empty) return toast.error("Username already taken");
      }

      const newData = {
        user: nameValue || currentUser.user,
      };

      await updateDoc(doc(db, "users", currentUser.uid), newData);

      await updateProfile(auth.currentUser, { displayName: newData.user });

      setCurrentUser((i) => ({
        ...i,
        ...newData,
      }));

      toast.success("Profile updated successfully!");

      dispatch({ type: "user", val: "" });
    } catch {
      toast.error("An unexpected error occurred.")
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div>
        <div className="bg-gray-100 py-2.5">
          <span className="text-gray-800 font-semibold pl-3">
            Update Profile
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
                  value={Data?.user}
                  onChange={(e) =>
                    dispatch({ type: "user", val: e.target.value })
                  }
                  minLength={3}
                  maxLength={15}
                  className="border border-gray-300 text-gray-600 w-full focus:outline-none pl-3 py-1.5 placeholder:text-gray-400 placeholder:text-[15px] font-medium rounded"
                  placeholder={currentUser?.user || ""}
                />
                <input
                  type="email"
                  readOnly
                  className="border border-gray-300 text-gray-600 bg-slate-50 w-full cursor-not-allowed focus:outline-none pl-3 py-1.5 placeholder:text-gray-400 placeholder:text-[15px] font-medium rounded"
                  placeholder={cachedEmail}
                />
                <button
                  className="bg-[#088179] border-2 w-fit hover:text-[#088179] text-left hover:bg-white font-semibold text-white px-4.5 py-1.5 rounded-md duration-200 cursor-pointer"
                  disabled={Loading}
                  onClick={changeData}
                >
                  {Loading ? (
                    <>
                      <Loader2 className="animate-spin" />
                    </>
                  ) : (
                    <>save</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
export default UpdateProfileSection;
