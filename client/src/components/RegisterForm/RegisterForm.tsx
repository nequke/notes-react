import { FormField } from "../FormField";
import { Button } from "../Button";
import "./RegisterForm.css";
import { useState } from "react";
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { registerUser } from "../../api/User";
import { queryClient } from "../../api/queryClient";

export interface RegisterFormProps { }

const RegisterSchema = z.object({
  username: z.string().min(5, "Длина имени пользователя должна быть не менее 5 символов"),
  email: z.string().email("Неверный формат email").min(5, "Длина email должна быть не менее 5 символов"),
  password: z.string().min(8, "Длина пароля должна быть не менее 8 символов"),
});

type RegisterForm = z.infer<typeof RegisterSchema>

export const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const {register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(RegisterSchema),
  });

  const registerMutation = useMutation(
    {
      mutationFn: () => registerUser(username, email, password),
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ["users", "me"]})
      }
    },
    queryClient
  )

  return (
    <form className="register-form" onSubmit={handleSubmit(({ username, email, password }) => {
      setUsername(username),
      setEmail(email),
      setPassword(password),
      registerMutation.mutate();
    })}>
      <FormField label="Имя" errorMessage={errors.username?.message}>
        <input {...register("username")}/>
      </FormField>
      <FormField label="Email" errorMessage={errors.email?.message}>
      <input {...register("email")}/>
      </FormField>
      <FormField label="Пароль" errorMessage={errors.password?.message}>
      <input {...register("password")}/>
      </FormField>

      <Button type="submit" isLoading={registerMutation.isPending}>Зарегистрироваться</Button>
    </form>
  );
};
