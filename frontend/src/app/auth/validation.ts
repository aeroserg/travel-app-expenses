import * as yup from "yup";

export const loginSchema = yup.object().shape({
  email: yup.string().email("Неверный формат email").required("Email обязателен"),
  password: yup.string().required("Пароль обязателен"),
});

export const registerSchema = yup.object().shape({
  name: yup.string().required("Имя обязательно"),
  email: yup.string().email("Неверный email").required("Email обязателен"),
  password: yup
    .string()
    .min(6, "Пароль должен быть минимум 6 символов")
    .required("Пароль обязателен"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Пароли не совпадают")
    .required("Подтвердите пароль"),
});
