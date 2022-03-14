import * as Yup from "yup";

export const loginValidationSchema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().label("Password"),
});

export const registerValidationSchema = Yup.object().shape({
  name: Yup.string().required().label("Full Name"),
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(6).label("Password"),
  repassword: Yup.string()
    .oneOf([Yup.ref("password")], "Confirm Password must match password.")
    .required()
    .label("Confirm Password"),
});

export const passwordResetSchema = Yup.object().shape({
  email: Yup.string()
    .required("Please enter a registered email")
    .label("Email")
    .email("Enter a valid email"),
});

export const addPetProfileSchema = Yup.object().shape({
  name: Yup.string().required("Please input name"),
  dob: Yup.string().required("Please input birthday"),
  type: Yup.string().required("Please input type"),
  species: Yup.string().required("Please input species"),
});

export const addAlarmSchema = Yup.object().shape({
  time: Yup.string().required("Please select alarm time"),
  name: Yup.string().required("Please input alarm name"),
  food: Yup.string().required("Please input food name"),
  pet: Yup.string().required("Please select your pet"),
});

export const editProfileSchema = Yup.object().shape({
  name: Yup.string().required("Please input your name"),
});