import "./LoginForm.css";
import { FormField } from "../FormField";
import { Button } from "../Button";
import { useState } from "react";
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { login } from "../../api/User";
import { queryClient } from "../../api/queryClient";

export interface LoginFormProps { }

const LoginSchema = z.object({
  email: z.string().email("Неверный формат email").min(5, "Длина email должна быть не менее 5 символов"),
  password: z.string().min(8, "Длина пароля должна быть не менее 8 символов"),
});

type LoginForm = z.infer<typeof LoginSchema>

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const {register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(LoginSchema),
  });

  const loginMutation = useMutation({
    mutationFn: () => login(email, password),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["users", "me"]})
    },
  }, queryClient)

  return (
    <form className="note-form" onSubmit={handleSubmit(({ email, password }) => {
      setEmail(email)
      setPassword(password)
      loginMutation.mutate();
    })}>
      <FormField label="Email" errorMessage={errors.email?.message}>
      <input {...register("email")}/>
      </FormField>
      <FormField label="Пароль" errorMessage={errors.password?.message}>
      <input {...register("password")}/>
      </FormField>

      <Button type="submit" isLoading={loginMutation.isPending}>Войти</Button>
    </form>
  );
};
