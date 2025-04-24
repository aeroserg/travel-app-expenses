"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Button, Input, Stack, Heading, Text } from "@chakra-ui/react";
import { authApi } from "@/services/api";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "../validation";

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterPage() {
  const router = useRouter();
  
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterFormData) =>
      authApi.register(data.name, data.email, data.password),
    onSuccess: () => router.push("/dashboard"),
    onError: () => alert("Ошибка регистрации. Попробуйте снова."),
  });

  const onSubmit = (data: RegisterFormData) => {
    registerMutation.mutate(data);
  };

  return (
    <Stack gap={4} p={6} height="100vh" justifyContent="center" alignItems="center">
      <Heading size="lg">Регистрация</Heading>
      
      <Input placeholder="Имя" {...register("name")} />
      <Text color="red.500">{errors.name?.message}</Text>

      <Input placeholder="Email" {...register("email")} />
      <Text color="red.500">{errors.email?.message}</Text>

      <Input placeholder="Пароль" type="password" {...register("password")} />
      <Text color="red.500">{errors.password?.message}</Text>

      <Input placeholder="Повторите пароль" type="password" {...register("confirmPassword")} />
      <Text color="red.500">{errors.confirmPassword?.message}</Text>

      <Button isLoading={registerMutation.isPending} onClick={handleSubmit(onSubmit)} colorScheme="blue" width="full">
        Зарегистрироваться
      </Button>

      <Text>
        Уже есть аккаунт?{" "}
        <Button variant="ghost" colorScheme="blue" onClick={() => router.push("/auth/login")}>
          Войти
        </Button>
      </Text>
    </Stack>
  );
}
