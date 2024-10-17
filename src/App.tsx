import { UploadOutlined } from "@ant-design/icons";
import { Alert, Button, Image, Layout, Spin, Typography, Upload } from "antd";
import "antd/dist/reset.css";
import axios from "axios";
import { useState } from "react";
import "./App.css";

const { Content } = Layout;
const { Text } = Typography;

const App: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [value, setValue] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [valueLoading, setValueLoading] = useState<boolean>(false);

  const handleImageUpload = async (file: File) => {
    setImageUrl(URL.createObjectURL(file));
    setError(null);
    setValue(null);
    setValueLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("https://karrless.ru/api", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setValue(response.data.value);
    } catch (error: any) {
      setError(error.response?.data?.message || "Ошибка при отправке запроса");
    } finally {
      setValueLoading(false);
    }

    return false;
  };

  return (
    <Layout
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #ff7e5f, #feb47b)",
      }}
    >
      <Content className="content">
        <div className="result-container">
          {error ? (
            <div className="error-container">
              <Alert
                message="Ошибка"
                description={error}
                type="error"
                showIcon
              />
            </div>
          ) : (
            <div className="value-container">
              {valueLoading ? (
                <Spin size="large" />
              ) : (
                <Text style={{ color: "white", fontSize: "18px" }}>
                  {value
                    ? `Значение: ${value}`
                    : "Загрузите изображение для получения значения"}
                </Text>
              )}
            </div>
          )}
        </div>

        <div className="upload-container">
          <Upload
            beforeUpload={handleImageUpload}
            showUploadList={false}
            accept="image/*"
          >
            <Button icon={<UploadOutlined />} type="primary">
              Загрузить изображение
            </Button>
          </Upload>

          <div className="image-upload-area">
            {imageUrl && (
              <div className="image-container">
                <Image
                  className="uploaded-image"
                  src={imageUrl}
                  alt="Uploaded"
                />
              </div>
            )}
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default App;
