"use client";
import { useCallback, useEffect, useState, useReducer } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";

export default function Slider() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const initialState = {
    data: [],
    loading: false,
    error: null,
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case "LOADING":
        return { loading: true, error: null, data: [] };
      case "SUCCESS":
        return { loading: false, error: null, data: action.val };
      case "ERROR":
        return { loading: false, error: action.val, data: [] };
      default:
        return state;
    }
  };

  const [Swiper, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    async function getData() {
      dispatch({ type: "LOADING" });
      try {
        const res = await fetch("/swipperData.json");
        if (!res.ok) throw new Error("ERROR");
        const data = await res.json();
        dispatch({ type: "SUCCESS", val: data });
      } catch (error) {
        dispatch({ type: "ERROR", val: error.message });
      }
    }
    getData();
  }, []);

  const updateButtons = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.reInit();
    updateButtons();
    emblaApi.on("select", updateButtons);
    emblaApi.on("reInit", updateButtons);

    return () => {
      emblaApi.off("select", updateButtons);
      emblaApi.off("reInit", updateButtons);
    };
  }, [emblaApi, updateButtons, Swiper.data.length]);

  return (
    <div className="w-[80%] m-auto mb-15 max-[670px]:mt-6">
      <div className="mb-3 flex items-center justify-between pb-1">
        <h3 className="text-[22px] max-[400px]:text-[20px] font-semibold">
          <span className="text-[#088179]">Pupular</span>{" "}
          <span className="text-gray-800">Categories</span>
        </h3>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => emblaApi?.scrollPrev()}
            disabled={!canScrollPrev}
            aria-label="Previous products"
            className="flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-full border border-gray-300 bg-gray-200 text-blue-600 shadow-md transition disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft size={16} />
          </button>

          <button
            type="button"
            onClick={() => emblaApi?.scrollNext()}
            disabled={!canScrollNext}
            aria-label="Next products"
            className="flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-full border border-gray-300 bg-gray-200 text-blue-600 shadow-md transition disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="-ml-4 flex">
          {Swiper.loading && (
            <div className="pl-4 text-sm text-gray-500">
              Loading products...
            </div>
          )}
          {Swiper.error && !Swiper.loading && (
            <div className="pl-4 text-sm text-red-500">{Swiper.error}</div>
          )}
          {Swiper.data.map((product) => (
            <div
              key={product.id}
              className="min-w-0 flex-[0_0_50%] pl-4 sm:flex-[0_0_33.3333%] md:flex-[0_0_25%] lg:flex-[0_0_16.6667%]"
            >
              <div className="border-2 border-gray-300 rounded-2xl p-3 w-full">
                <div className="w-full aspect-square">
                  <img
                    src={product.img}
                    className="h-full w-full rounded-xl select-none object-cover"
                    alt={`Product ${product.id}`}
                  />
                </div>
                <div className="flex justify-center items-center mt-2">
                  <span className="select-none">{product.name}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
