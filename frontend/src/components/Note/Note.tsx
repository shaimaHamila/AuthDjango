import { Card } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { NoteType } from "../../types/NoteType";

interface NoteProps {
  note: NoteType;
  handleEditNote: (note: NoteType) => void;
  deleteNote: (id: number) => void;
}

const Note: React.FC<NoteProps> = ({ note, handleEditNote, deleteNote }) => {
  return (
    <Card
      key={note.id}
      title={note.title}
      actions={[
        <EditOutlined
          key="edit"
          onClick={() => handleEditNote(note)} // Open edit modal
          style={{
            fontSize: "18px",
            cursor: "pointer",
            color: "blue",
          }}
        />,
        <DeleteOutlined
          key="delete"
          onClick={() => deleteNote(note.id)}
          style={{
            fontSize: "18px",
            cursor: "pointer",
            color: "red",
          }}
        />,
      ]}
      style={{
        margin: 10,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "space-between",
      }}>
      <p>{note.content}</p>
    </Card>
  );
};

export default Note;
