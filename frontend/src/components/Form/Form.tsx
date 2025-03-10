import type { FormProps } from "antd";
import { Button, Form, Input, Card, Typography } from "antd";
import Title from "antd/es/typography/Title";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/apiConfig";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../helpers/Constans";
const { Link, Text } = Typography;
interface CustomFormProps {
  route: string;
  method: string;
}

const CustomForm: React.FC<CustomFormProps> = ({ route, method }) => {
  const [loading, setLoding] = useState<boolean>(false);
  const navigate = useNavigate();

  const isLogin = method === "login";
  const name = method === "login" ? "Login" : "Register";

  type FieldType = {
    username?: string;
    password?: string;
  };

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    console.log("Success:", values);
    setLoding(true);
    try {
      const res = await api.post(route, {
        username: values.username,
        password: values.password,
      });
      if (method === "login") {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        navigate("/");
      } else {
        navigate("/login");
      }
    } catch (error: any) {
      alert(error);
    } finally {
      setLoding(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#f5f5f5",
      }}>
      <Card
        style={{
          width: 450,
          padding: 18,
          textAlign: "center",
          boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
        }}>
        <Title level={2}>{name}</Title>
        <Form
          name={name}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
          autoComplete="off">
          <Form.Item<FieldType>
            label="Username"
            name="username"
            rules={[
              { required: true, message: "Please input your username!" },
            ]}>
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please input your password!" },
            ]}>
            <Input.Password />
          </Form.Item>

          <Form.Item label={null}>
            <Button type="primary" loading={loading} htmlType="submit" block>
              {name}
            </Button>
          </Form.Item>
        </Form>
        {/* Already have an account? / Don't have an account? */}
        <Text>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <Link onClick={() => navigate(isLogin ? "/register" : "/login")}>
            {isLogin ? "Register" : "Login"}
          </Link>
        </Text>
      </Card>
    </div>
  );
};

export default CustomForm;
