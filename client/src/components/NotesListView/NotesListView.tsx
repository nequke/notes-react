import "./NotesListView.css";
import { NoteView } from "../NoteView";
import { NoteList } from "../../api/Note";
import { FC } from "react";

export interface NotesListViewProps {
  noteList: NoteList;
}

export const NotesListView: FC<NotesListViewProps> = ({ noteList }) => {
  return (
    <ul className="note-list-view">
      {noteList.map((note) => (
        <li key={note.id} className="note-list_item">
          <NoteView note={note}/>
        </li>
      ))}
    </ul>
  );
};
