import * as Yup from "yup";
const countryList = ["iran", "usa", "canada", "germany", "france"];

export const validationPayment = Yup.object().shape({
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  fullName: Yup.string().required("Please enter your full name"),
  country: Yup.string()
    .oneOf(countryList, "Please select a valid country")
    .required("Country is required"),
  address: Yup.string().required("Address is required"),
  phoneNumber: Yup.string()
    .matches(/^[0-9]{11}$/, "Phone number must be exactly 11 digits")
    .required("Phone number is required"),
  postCode: Yup.string()
    .matches(/^[0-9]{6}$/, "Post code must be exactly 6 digits")
    .required("Post code is required"),
  city: Yup.string().required("City is required"),
  cartNumber: Yup.string()
    .matches(/^[0-9]{12}$/, "Cart number must be exactly 12 digits")
    .required("Cart number is required"),
  dateCart: Yup.string()
    .matches(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, "Date must be in MM/YY format")
    .required("Date cart is required"),
  CvcCart: Yup.string()
    .matches(/^[0-9]{3,4}$/, "CVC must be 3 or 4 digits")
    .required("CVC is required"),
});
