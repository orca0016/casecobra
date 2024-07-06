"use client";
import Lottie from "react-lottie-player";
import lottieJson from "./not-found-3.json";
const Page = () => {
  return (
    <div className="w-full h-[70vh] py-12 flex justify-center items-center">
      <Lottie
        loop
        animationData={lottieJson}
        play
        className="lottie-cat-animation"
/>
    </div>
  );
};

export default Page;
