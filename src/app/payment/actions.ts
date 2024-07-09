"use server";
import OrderReceivedEmail from "@/components/emails/OrderReceivedEmail";
import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

interface typeObject {
  email: string;
  fullName: string;
  country: string;
  address: string;
  phoneNumber: string;
  postCode: string;
  city: string;
  cartNumber: string;
  dateCart: string;
  CvcCart: string;
}

interface PaymentData {
  orderId: string;
  paymentData: typeObject;
}

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const paymentProduct = async ({ orderId, paymentData }: PaymentData) => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  try {
    const dbUser = await db.user.findFirst({
      where: { id: user.id },
    });

    if (!dbUser) {
      throw new Error("User not found in database");
    }

    const shippedAddress = await db.shippingAddress.create({
      data: {
        name: paymentData.fullName,
        city: paymentData.city,
        street: paymentData.address,
        postalCode: paymentData.postCode.toString(),
        country: paymentData.country,
        state: null,
        phoneNumber: paymentData.phoneNumber.toString(),
      },
    });

    const billingAddress = await db.billingAddress.create({
      data: {
        name: paymentData.fullName,
        city: paymentData.city,
        street: paymentData.address,
        postalCode: paymentData.postCode.toString(),
        country: paymentData.country,
        state: null,
        phoneNumber: paymentData.phoneNumber.toString(),
      },
    });

    await db.order.update({
      where: { id: orderId },
      data: {
        shippingAddressId: shippedAddress.id,
        billingAddressId: billingAddress.id,
        isPaid: true,
      },
    });

    await resend.emails.send({
      from: "CaseCobra <mashhadim901@gmail.com>",
      to: [user.email ?? ""],
      subject: "Thank you for your order!",
      react: OrderReceivedEmail({
        orderId,
        orderDate: new Date().toLocaleDateString(),
        //@ts-ignore
        shippingAddress: {
          name: paymentData.fullName,
          city: paymentData.city,
          street: paymentData.address,
          postalCode: paymentData.postCode.toString(),
          country: paymentData.country,
          state: null,
          phoneNumber: paymentData.phoneNumber.toString(),
        },
      }),
    });

    return {
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${orderId}`,
    };
  } catch (e) {
    throw new Error("Error in your code: ");
  }
};
