import Phone from "@/components/Phone";
import { db } from "@/db";
import Image from "next/image";
import { notFound } from "next/navigation";
import FormPayment from "./FormPayment";

interface PageProps {
  searchParams: {
    [key: string]: string;
  };
}

const Page = async ({ searchParams }: PageProps) => {
  const { orderId } = searchParams;

  if (!orderId || typeof orderId !== "string") {
    return notFound();
  }

  const order = await db.order.findFirst({
    where: { id:orderId },
  });

  if (!order) {
    return notFound();
  }

  const configuration = await db.configuration.findFirst({
    where: { id: order.configurationId },
  });

  if (!configuration) {
    return notFound();
  }

  return (
    <>
      <div className="w-full flex justify-center min-h-[90vh] ">
        <div className="mx-auto px-2 sm:px-6 md:px-8 lg:12 py-6 my-6 border-gray-200 bg-white rounded-sm border-[1px] w-[90%] sm:w-[70%] md:w-[60%] lg:w-[50%]">
          <div className="w-full flex justify-center">
            <Phone imgSrc={configuration.imageUrl} className="w-[110px]" />
          </div>
          <FormPayment orderId={order.id} />
        </div>
      </div>
    </>
  );
};

export default Page;
