import { useEffect, useState } from "react";
import { z } from "zod";
import { validateResponse } from "./validateResponse";

export const NoteSchema = z.object({
    id: z.string(),
    title: z.string(),
    text: z.string(),
    createdAt: z.number(),
})

export type Note = z.infer<typeof NoteSchema>;

export const NoteList = z.array(NoteSchema);

export type NoteList = z.infer<typeof NoteList>;

export const FetchNoteListSchema = z.object({
    list: NoteList,
})

export type FetchNoteListResponse = z.infer<typeof FetchNoteListSchema>;

export function fetchNoteList(): Promise<FetchNoteListResponse> {
    return fetch("/api/notes")
        .then((response) => response.json())
        .then((data) => FetchNoteListSchema.parse(data));
}

export interface IdleRequestState {
    status: "idle";
}

export interface LoadingRequestState {
    status: "pending";
}

export interface SuccessRequestState {
    status: "success";
    data: NoteList;
}

export interface ErrorRequestState {
    status: "error";
    error: unknown;
}

export type RequestState = 
    | IdleRequestState 
    | LoadingRequestState 
    | SuccessRequestState 
    | ErrorRequestState;

export function useNoteList() {
    const [state, setState] = useState<RequestState>({ status: "idle" });

    useEffect(() => {
        if (state.status === "pending") {
            fetchNoteList()
                .then((data) => {
                    setState({ status: "success", data: data.list });
                })
                .catch((error) => {
                    setState({ status: "error", error });
                });
        }
    }, [state]);

    useEffect(() => {
        setState({ status: "pending" });
    }, []);

    const refetch = () => {
        setState({ status: "pending" });
    };

    return {
        state,
        refetch,
    };
}

export function createNote(title: string, text: string): Promise<void> {
    return fetch("/api/notes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            title,
            text,
        }),
    })
        .then(validateResponse)
        .then(() => undefined);
}