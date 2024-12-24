import { logout } from "../../api/User";
import { Button } from "../Button";
import "./LogoutButton.css";
import { useMutation } from '@tanstack/react-query';
import { queryClient } from "../../api/queryClient";
import { FormEventHandler } from "react";

export const LogoutButton = () => {
  const logoutMutation = useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
      window.location.href = "/"
    },
  }, queryClient)

  const handleSubmit: FormEventHandler<HTMLElement> = (event) => {
    event.preventDefault();

    logoutMutation.mutate();
  }

  return (
    <div className="logout-button">
      <Button kind="secondary" isLoading={logoutMutation.isPending} onClick={handleSubmit}>Выйти</Button>
    </div>
  );
};
