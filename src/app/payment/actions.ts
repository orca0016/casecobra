"use server"
import { db } from "@/db";

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

export const paymentProduct = async ({ orderId, paymentData }: PaymentData) => {

  try {
    const shippedAddress = await db.shippingAddress.create({
      data: {
        name: paymentData.fullName,
        city: paymentData.city,
        street: paymentData.address,
        postalCode: paymentData.postCode.toString(),
        country: paymentData.country,
        state: null,
        phoneNumber: paymentData.phoneNumber.toString(),
      }
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
      }
    });
    await db.order.update({
      where:{id:orderId},
      data:{
        shippingAddressId:shippedAddress.id,
        billingAddressId:billingAddress.id,
        isPaid:true
      }
    })
    return { url:  `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${orderId}`}
  } catch (e) {
    throw new Error('error in your code');
  }
};
