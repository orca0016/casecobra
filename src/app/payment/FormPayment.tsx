"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { validationPayment } from "@/validators/validationPayment";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import { Coins, CreditCard, ScanLine } from "lucide-react";
import { useEffect, useState } from "react";
import { paymentProduct } from "./actions";
import { useRouter } from "next/navigation";

const FormPayment = ({ orderId }: { orderId: string }) => {
  const [isAddress, setIsAddress] = useState<boolean>(false);
const router = useRouter()
  const { mutate: payProduct } = useMutation({
    mutationKey: ["payment-form"],
    mutationFn:  paymentProduct,
    onSuccess: ({ url }) => {
      console.log("is ok", url);
      if (url) router.push(url)
      else throw new Error('Unable to retrieve thank you URL.')
    },
    onError: () => {
      toast({
        title: "Something went wrong",
        description: "There was an error on our end. Please try again.",
        variant: "destructive",
      });
    },
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      fullName: "",
      country: "",
      address: "",
      phoneNumber: "",
      postCode: "",
      city: "",
      cartNumber: "",
      dateCart: "",
      CvcCart: "",
    },
    onSubmit: (values) => {
      console.log("formik values", values);
      payProduct({ orderId, paymentData: values });
    },
    validationSchema: validationPayment,
  });

  useEffect(() => {
    setIsAddress(formik.values.address !== "");
  }, [formik.values.address]);

  return (
    <div className="relative mt-12">
      <h2 className="font-sans">Shipping information</h2>
      <form autoComplete="off" onSubmit={formik.handleSubmit}>
        <div className="w-full">
          {/* get email */}
          <div className="w-full mt-3 ">
            <Label htmlFor="email">Email</Label>
            <Input
              name="email"
              id="email"
              placeholder="Email"
              type="email"
              error={Boolean(formik.touched.email && formik.errors.email)}
              value={formik.values.email}
              onChange={formik.handleChange}
            />
            <div className="text-red-700">
              {formik.touched.email ? formik.errors.email : null}
            </div>
          </div>

          {/* address and name and country */}
          <div className="w-full mt-3 ">
            <Label htmlFor="fullName">shipping address</Label>
            <Input
              name="fullName"
              id="fullName"
              className="rounded-none rounded-tr-md rounded-tl-md "
              placeholder="Full name"
              error={Boolean(formik.touched.fullName && formik.errors.fullName)}
              value={formik.values.fullName}
              onChange={formik.handleChange}
            />
            <div className="text-red-700">
              {formik.touched.fullName ? formik.errors.fullName : null}
            </div>
            <Select
              value={formik.values.country}
              onValueChange={(value) => formik.setFieldValue("country", value)}
            >
              <SelectTrigger
                name="country"
                id="country"
                className={cn("rounded-none", {
                  "border-red-400":
                    formik.touched.country && formik.errors.country,
                })}
              >
                <SelectValue placeholder="Select a country" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Country</SelectLabel>
                  <SelectItem value="iran">Iran</SelectItem>
                  <SelectItem value="germany">Germany</SelectItem>
                  <SelectItem value="usa">USA</SelectItem>
                  <SelectItem value="canada">Canada</SelectItem>
                  <SelectItem value="france">France</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <div className="text-red-700">
              {formik.touched.country ? formik.errors.country : null}
            </div>
            <Input
              onInput={formik.handleChange}
              value={formik.values.address}
              name="address"
              id="address"
              className={cn("rounded-none ", {
                "rounded-bl-md rounded-br-md": !isAddress,
              })}
              placeholder="Address"
              error={Boolean(formik.touched.address && formik.errors.address)}
              onChange={formik.handleChange}
            />
            <div className="text-red-700">
              {formik.touched.address ? formik.errors.address : null}
            </div>
            {isAddress && (
              <div>
                <Input
                  name="phoneNumber"
                  id="phoneNumber"
                  type="number"
                  className="rounded-none"
                  placeholder="Phone number"
                  error={Boolean(
                    formik.touched.phoneNumber && formik.errors.phoneNumber
                  )}
                  value={formik.values.phoneNumber}
                  onChange={formik.handleChange}
                />
                <div className="text-red-700">
                  {formik.touched.phoneNumber
                    ? formik.errors.phoneNumber
                    : null}
                </div>
                <div className="flex">
                  <Input
                    name="postCode"
                    id="postCode"
                    className="rounded-none  rounded-bl-md"
                    placeholder="Post Code"
                    type="number"
                    error={Boolean(
                      formik.touched.postCode && formik.errors.postCode
                    )}
                    value={formik.values.postCode}
                    onChange={formik.handleChange}
                  />
                  <Input
                    name="city"
                    id="city"
                    className="rounded-none  rounded-br-md"
                    placeholder="City"
                    error={Boolean(formik.touched.city && formik.errors.city)}
                    value={formik.values.city}
                    onChange={formik.handleChange}
                  />
                </div>
                <div className="text-red-700">
                  {formik.touched.postCode ? formik.errors.postCode : null}
                  {formik.touched.city ? formik.errors.city : null}
                </div>
              </div>
            )}
          </div>

          <div className="w-full mt-3 ">
            <Label htmlFor="Payment-method">Cart information</Label>
            <Input
              placeholder="123 123 123 123 "
              name="cartNumber"
              className="rounded-none rounded-tl-md rounded-tr-md"
              id="cartNumber"
              type="number"
              error={Boolean(
                formik.touched.cartNumber && formik.errors.cartNumber
              )}
              value={formik.values.cartNumber}
              onChange={formik.handleChange}
              icon={
                <>
                  <CreditCard fill="#2DAC5C" /> <ScanLine />
                </>
              }
            />
            <div className="text-red-700">
              {formik.touched.cartNumber ? formik.errors.cartNumber : null}
            </div>
            <div className="flex w-full">
              <Input
                placeholder="MM / YY"
                name="dateCart"
                id="dateCart"
                className=" rounded-none rounded-bl-md "
                type="number"
                error={Boolean(
                  formik.touched.dateCart && formik.errors.dateCart
                )}
                value={formik.values.dateCart}
                onChange={formik.handleChange}
              />

              <Input
                placeholder="CVC"
                className=" rounded-none  rounded-br-md"
                name="CvcCart"
                id="CvcCart"
                type="number"
                error={Boolean(formik.touched.CvcCart && formik.errors.CvcCart)}
                value={formik.values.CvcCart}
                onChange={formik.handleChange}
                icon={<Coins />}
              />
            </div>
            <div className="text-red-700">
              {formik.touched.dateCart ? formik.errors.dateCart : null}
              {formik.touched.CvcCart ? formik.errors.CvcCart : null}
            </div>
          </div>
          <div className="w-full mt-6">
            <Button type="submit" className="w-full ">
              Pay
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default FormPayment;
