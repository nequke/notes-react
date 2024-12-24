import { FormField } from "../FormField";
import { Button } from "../Button";
import "./NoteForm.css";
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, FC } from "react";
import { useMutation } from "@tanstack/react-query";
import { createNote } from "../../api/Note";
import { queryClient } from "../../api/queryClient";
import { FetchNoteListView } from "../NotesListView/FetchNoteListView";

export interface NoteFormProps { }

const CreateNoteSchema = z.object({
  text: z.string().min(10, "Длина заметки должна быть не менее 10 символов"),
});

type CreateNoteForm = z.infer<typeof CreateNoteSchema>

export const NoteForm: FC<NoteFormProps> = () => {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const { register, handleSubmit, formState: { errors } } = useForm<CreateNoteForm>({
    resolver: zodResolver(CreateNoteSchema),
  });

  const createNoteMutation = useMutation({
    mutationFn:() => createNote(title, text),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  },
    queryClient);

  return (
    <form className="note-form" onSubmit={handleSubmit(({ text }) => {
      setText(text)
      createNoteMutation.mutate();
    },)}>
      <FormField label="Заголовок">
        <input 
          type="text"
          name="title"
          onChange={(event) => setTitle(event.target.value)}
          value={title}
        />
      </FormField>
      <FormField label="Текст" errorMessage={errors.text?.message}>
        <textarea {...register("text")} />
      </FormField>

      <Button type="submit" isLoading={createNoteMutation.isPending}>Сохранить</Button>
      <FetchNoteListView />
    </form>
  );
};
