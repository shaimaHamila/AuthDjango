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
  Spin,
} from "antd";
import api from "../../api/apiConfig";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

import Note from "../../components/Note/Note";
import { NoteType } from "../../types/NoteType";
const { Header, Content } = Layout;

const Home: React.FC = () => {
  const [notes, setNotes] = useState<NoteType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState<NoteType | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    getNotes();
  }, []);

  const getNotes = () => {
    setLoading(true);
    api
      .get("/notes/")
      .then((res) => setNotes(res.data))
      .catch(() => message.error("Failed to load notes"))
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
    setCurrentNote(null);
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
            setCurrentNote(null);
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
            form.resetFields();
            getNotes();
          } else {
            message.error("Failed to create note.");
          }
        })
        .catch(() => message.error("Error creating note"));
    }
  };

  const handleEditNote = (note: NoteType) => {
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
        <Button
          type="primary"
          onClick={() => {
            setCurrentNote(null); // Ensure previous note data is cleared
            form.resetFields();
            setIsModalOpen(true);
          }}>
          Create Note
        </Button>
      </Header>

      <Content style={{ padding: 24 }}>
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: 50,
            }}>
            <Spin size="large" />
          </div>
        ) : (
          <Row gutter={[16, 16]}>
            {notes.map((note, key) => (
              <Col key={note.id} xs={24} sm={12} md={8} lg={6}>
                <Note
                  key={key}
                  note={note}
                  handleEditNote={() => handleEditNote(note)}
                  deleteNote={() => deleteNote(note.id)}
                />
              </Col>
            ))}
          </Row>
        )}
      </Content>

      {/* Modal for Creating or Editing Notes */}
      <Modal
        title={currentNote ? "Edit Note" : "Create Note"}
        open={isModalOpen}
        onCancel={handleModalCancel}
        maskClosable={true}
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
