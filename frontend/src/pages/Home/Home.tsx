import { useEffect, useState } from "react";
import {
  Layout,
  Button,
  Card,
  Modal,
  Form,
  Input,
  Row,
  Col,
  message,
} from "antd";
import api from "../../api/apiConfig";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
const { Header, Content } = Layout;

interface Note {
  id: number;
  title: string;
  content: string;
}

const Home: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState<Note | null>(null); // Track current note for editing
  const [form] = Form.useForm();

  useEffect(() => {
    getNotes();
  }, []);

  const getNotes = () => {
    setLoading(true);
    api
      .get("/notes/")
      .then((res) => setNotes(res.data))
      .catch((err) => message.error("Failed to load notes"))
      .finally(() => setLoading(false));
  };

  const deleteNote = (id: number) => {
    api
      .delete(`/notes/delete/${id}/`)
      .then((res) => {
        if (res.status === 204) {
          message.success("Note deleted!");
          setNotes(notes.filter((note) => note.id !== id));
        } else {
          message.error("Failed to delete note!");
        }
      })
      .catch(() => message.error("Error deleting note"));
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    setCurrentNote(null); // Reset current note on cancel
  };

  const createOrUpdateNote = (values: { title: string; content: string }) => {
    if (currentNote) {
      // Update existing note
      api
        .put(`/notes/edit/${currentNote.id}/`, values)
        .then((res) => {
          if (res.status === 200) {
            message.success("Note updated!");
            setIsModalOpen(false);
            form.resetFields();
            getNotes();
          } else {
            message.error("Failed to update note.");
          }
        })
        .catch(() => message.error("Error updating note"));
    } else {
      // Create new note
      api
        .post("/notes/", values)
        .then((res) => {
          if (res.status === 201) {
            message.success("Note Created!");
            setIsModalOpen(false);
            form.resetFields();
            getNotes();
          } else {
            message.error("Failed to create note.");
          }
        })
        .catch(() => message.error("Error creating note"));
    }
  };

  // Opening the modal for editing or creating a note
  const handleCreateNote = () => {
    setCurrentNote(null); // Reset currentNote for creating a new note
    setIsModalOpen(true);
  };

  const handleEditNote = (note: Note) => {
    setCurrentNote(note);
    form.setFieldsValue({ title: note.title, content: note.content });
    setIsModalOpen(true);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#001529",
          color: "#fff",
          padding: "0 20px",
        }}>
        <h2 style={{ color: "#fff" }}>Total Notes: {notes.length}</h2>
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          Create Note
        </Button>
      </Header>

      <Content style={{ padding: 24 }}>
        <Row gutter={[16, 16]}>
          {notes.map((note) => (
            <Col key={note.id} xs={24} sm={12} md={8} lg={6}>
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
            </Col>
          ))}
        </Row>
      </Content>

      {/* Modal for Creating or Editing Notes */}
      <Modal
        title={currentNote ? "Edit Note" : "Create Note"}
        open={isModalOpen}
        onCancel={handleModalCancel}
        footer={null}>
        <Form form={form} layout="vertical" onFinish={createOrUpdateNote}>
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Title is required!" }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="content"
            label="Content"
            rules={[{ required: true, message: "Content is required!" }]}>
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {currentNote ? "Update" : "Create"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default Home;
