import { fetchNoteList } from "../../api/Note";
import { queryClient } from "../../api/queryClient";
import { Loader } from "../Loader";
import { NotesListView } from "./NotesListView";
import { useQuery } from "@tanstack/react-query";

export const FetchNoteListView = () => {
    const noteListQuery = useQuery({
        queryFn: () => fetchNoteList(),
        queryKey: ["notes"]
    }, queryClient)

    switch(noteListQuery.status) {
        case "pending":
            return <Loader />;
        case "success":
            return <NotesListView noteList={noteListQuery.data.list} />;
        case "error":
            return (
                <div>
                    <span>Произошла какая-то ошибка</span>
                    <button onClick={() => noteListQuery.refetch()}>Повторить попытку</button>
                </div>
            );
            
    }
}