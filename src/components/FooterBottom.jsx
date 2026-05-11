"use client";

import { usePathname } from "next/navigation";

const FooterBottom = () => {
  const pathname = usePathname()
  const isAuthPage = ["/logup","/login"].includes(pathname.toLowerCase())
  if (isAuthPage) return null

  return (
    <>
      <hr className="text-gray-200 mt-2 w-[80%] m-auto" />
      <div className="h-[8vh] flex">
        <div className="w-[80%] m-auto flex justify-between items-center max-[430px]:flex-col">
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} Evara, All rights reserved</p>
          <p className="text-sm text-gray-500">Disigned by Zain</p>
        </div>
      </div>
    </>
  );
};
export default FooterBottom;
