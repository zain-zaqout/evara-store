import Link from "next/link";

const Main = () => {
  return (
    <>
      <div>
        <div className="w-[80%] m-auto grid grid-cols-2 items-center h-[70vh] max-[670px]:grid-cols-1 max-[670px]:h-[80vh]">
          <div>
            <p className="font-semibold mb-0.5 text-lg text-gray-700">
              Hot promotions
            </p>
            <h2 className="text-[2.25rem] font-bold leading-[1.3] max-[1100px]:text-[1.8rem] max-[800px]:text-[1.5rem]">
              Fashion Trending
            </h2>
            <h3 className="text-[#088179] text-[3.25rem] font-semibold max-[1100px]:text-4xl max-[800px]:text-3xl">
              Great Collection
            </h3>
            <p className="my-1 text-gray-600 max-[1100px]:text-[12px]">
              Save more with coupons & up to 20% off
            </p>
            <Link href="/shop">
            <button className="inline-block bg-[#088179] border-2 border-[#088179] px-7 h-[49px] rounded-sm font-bold transition-all duration-400 text-[#ffffff] text-sm hover:bg-transparent hover:text-[#088179] cursor-pointer mt-4 max-[800px]:h-10 max-[800px]:px-5">
              Shop Now
            </button>
            </Link>
          </div>
          <div>
            <img
              src="/assets/images/home-img.png"
              className="w-130"
              alt="IMAGE"
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default Main;
