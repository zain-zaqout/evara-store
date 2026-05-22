import { useReducer, useState } from "react";
import { useAuth } from "../Contexts/AuthContext";
import { toast } from "sonner";
const ChangePasswordSection = () => {
  const [NewPassword, setNewPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");

  const initialSatet = {
    loding: false,
    error: null,
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case "LODING":
        return { loding: true, error: "" };
      case "SUCCESS":
        return { loding: false, error: "" };
      case "ERROR":
        return { loding: false, error: action.val };
      default:
        return state;
    }
  };

  const [passwordAPI, dispatche] = useReducer(reducer, initialSatet);

  const changePassword = () => {
    const currentPassword = Data.password?.trim();
    const newPassword = NewPassword?.trim();
    const confirmPassword = ConfirmPassword?.trim();

    if (currentPassword.length < 8) {
      return toast.error("Current Password must be exactly 8 characters");
    } else if (newPassword.length < 8) {
      return toast.error("New Password must be exactly 8 characters");
    } else if (confirmPassword.length < 8) {
      return toast.error("Confirm Password must be exactly 8 characters");
    }
    async function editPassword() {
      dispatche({ type: "LOADING" });
      try {
        const res = await fetch(
          `http://localhost:3001/72342/${currentUser.id}`,
        );
        if (!res.ok) throw new Error("Falid To Fetch");
        const data = await res.json();
        if (data.password !== Data.password) {
          return toast.error("Current Password incuroct, Try Agin");
        } else if (newPassword !== confirmPassword) {
          return toast.error("New Password incuroct, Try Agin");
        }

        await fetch(`http://localhost:3001/72342/${currentUser.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: data.id,
            user: data.user,
            email: data.email,
            password: newPassword,
          }),
        });
        dispatch({ type: "password", val: "" });
        setConfirmPassword("");
        setNewPassword("");
        toast.success("done");
      } catch (error) {
        dispatche({ type: "ERROR", val: error.message });
        toast.error(error.message);
      }
    }
    editPassword();
  };

  const { Data, currentUser, dispatch } = useAuth();
  return (
    <>
      <div>
        <div className="bg-gray-100 py-2.5">
          <span className="text-gray-800 font-semibold pl-3">
            Change Password
          </span>
        </div>
      </div>
      <div>
        <div className="border border-gray-300 border-t-gray-100">
          <div className="w-[95%] m-auto">
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="flex flex-col space-y-2.5 py-3">
                <input
                  type="password"
                  minLength={8}
                  maxLength={8}
                  value={Data?.password}
                  onChange={(e) =>
                    dispatch({ type: "password", val: e.target.value })
                  }
                  className="border border-gray-300 text-gray-600 w-full focus:outline-none pl-3 py-1.5 placeholder:text-gray-400 placeholder:text-[15px] font-medium rounded"
                  placeholder="Current Password"
                />
                <input
                  type="password"
                  minLength={8}
                  maxLength={8}
                  value={NewPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="border border-gray-300 text-gray-600 w-full focus:outline-none pl-3 py-1.5 placeholder:text-gray-400 placeholder:text-[15px] font-medium rounded"
                  placeholder="New Password"
                />
                <input
                  type="password"
                  minLength={8}
                  maxLength={8}
                  value={ConfirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="border border-gray-300 text-gray-600 w-full focus:outline-none pl-3 py-1.5 placeholder:text-gray-400 placeholder:text-[15px] font-medium rounded"
                  placeholder="Confirm Password"
                />
                <input
                  type="submit"
                  value="Save"
                  onClick={changePassword}
                  className="bg-[#088179] border-2 w-fit hover:text-[#088179] text-left hover:bg-white font-semibold text-white px-4.5 py-1.5 rounded-md duration-200 cursor-pointer"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
export default ChangePasswordSection;
