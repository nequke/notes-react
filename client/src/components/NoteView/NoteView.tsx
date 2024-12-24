import "./NoteView.css";
import { Note } from "../../api/Note";
import { FC } from "react";
import { FetchUserView } from "../UserView/FetchUserView";
import { UserView } from "../UserView";

const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

interface NoteViewProps {
  note: Note;
}

export const NoteView: FC<NoteViewProps> = ({ note }) => {
  return (
    <div className="note-view">
      <FetchUserView userId={UserView.name}/>
      <div className="note-view__head">
        <p className="note-view__datetime">{formatDate(note.createdAt)}</p>
        <p className="note-view__title">{note.title}</p>
      </div>

      <p className="note-view__text">
        {note.text}
      </p>
    </div>
  );
};
