"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Button, Input, Stack, Heading, Text } from "@chakra-ui/react";
import { authApi } from "@/services/api";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../validation";

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormData) => authApi.login(data.email, data.password),
    onSuccess: () => router.push("/dashboard"),
    onError: () => alert("Ошибка входа. Проверьте данные."),
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  return (
    <Stack gap={4} p={6} height="100vh" justifyContent="center" alignItems="center">
      <Heading size="lg">Вход</Heading>
      <Input placeholder="Email" {...register("email")} />
      <Text color="red.500">{errors.email?.message}</Text>

      <Input placeholder="Пароль" type="password" {...register("password")} />
      <Text color="red.500">{errors.password?.message}</Text>

      <Button isLoading={loginMutation.isPending} onClick={handleSubmit(onSubmit)} colorScheme="blue" width="full">
        Войти
      </Button>
      
      <Text>
        Нет аккаунта?{" "}
        <Button variant="ghost" colorScheme="blue" onClick={() => router.push("/auth/register")}>
          Зарегистрироваться
        </Button>
      </Text>
    </Stack>
  );
}
