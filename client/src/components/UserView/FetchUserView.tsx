import { useQuery } from "@tanstack/react-query";
import { FC } from "react";
import { fetchUser } from "../../api/User";
import { queryClient } from "../../api/queryClient";
import { Loader } from "../Loader";
import { UserView } from "./UserView";

export interface FetchUserViewProps {
    userId: string;
}

export const FetchUserView: FC<FetchUserViewProps>= ({ userId }) => {
    const userQuery = useQuery({
        queryFn: () => fetchUser(),
        queryKey: ["users", userId]
    }, queryClient)

    switch(userQuery.status) {
        case "pending":
            return <Loader />;
        case "success":
            return <UserView user={userQuery.data}/>;
        case "error":
            return (
                <div>
                    <span>Произошла какая-то ошибка</span>
                    <button onClick={() => userQuery.refetch()}>Повторить попытку</button>
                </div>
            );
    }
};