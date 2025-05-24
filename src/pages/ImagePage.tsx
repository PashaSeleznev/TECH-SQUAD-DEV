import { useState, type FC, useEffect } from "react";
import type { UserType } from "../App";
import Editor from "../components/Editor";

type ImagePageProps = {
  logUser: UserType
  setLogUser: (user: UserType) => void,
  fetchUsers: () => void,
  apiUrl: string
}


const ImagePage: FC<ImagePageProps> = ({logUser, setLogUser, fetchUsers, apiUrl}) => {
  // Выбранный файл
  const [file, setFile] = useState<File | null>(null);
  const [inputKey, setInputKey] = useState<number>(Date.now());
  // Ошибка при загрузке изображения
  const [uploadError, setUploadError] = useState("");
  // Отправка изображения для анализа
  const [isProcessing, setIsProcessing] = useState(false);
  // Путь к загруженному изображению на backend
  const [uploadedImagePath, setUploadedImagePath] = useState<string | null>(() => {
    return localStorage.getItem("uploadedImagePath");
  });

  // Если у пользователя нет изображений, сбрасываем путь к изображению
  useEffect(() => {
    if (!logUser.images || logUser.images.length === 0) {
      setUploadedImagePath(null);
      localStorage.removeItem("uploadedImagePath");
    }
  }, [logUser]);

  // Функция выбора файла
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected || selected.type !== "image/png") {
      setFile(null);
    } else {
      setFile(selected);
    }
  };

  // Обновление пути к изображению в состоянии и localStorage
  const handleUploadedImagePath = (path: string | null) => {
    setUploadedImagePath(path);
    if (path) {
      localStorage.setItem("uploadedImagePath", path);
    } else {
      localStorage.removeItem("uploadedImagePath");
    }
  };

  // Отправка выбранного PNG-файла на сервер для анализа
  const toAnalyse = async () => {
    if (!file) return;
    setIsProcessing(true);
    setUploadError("")

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", logUser.id.toString());
  
    try {
      const response = await fetch(`${apiUrl}/upload`, {
        method: "POST",
        body: formData,
      });
  
      if (response.ok) {
        const data = await response.json();
        const newImagePath = `${apiUrl}/images/${data.filename}`;
        setUploadedImagePath(newImagePath);
        handleUploadedImagePath(newImagePath);

        const updatedUser = {
          ...logUser,
          images: [...logUser.images, data.filename],
        };

        setLogUser(updatedUser);
        localStorage.setItem("logUser", JSON.stringify(updatedUser));
        fetchUsers();
        setIsProcessing(false);
        setFile(null);
        setInputKey(Date.now());
      } else {
        setUploadError("Ошибка при загрузке изображения");
      };
    } catch (err) {
      console.log(err)
      setUploadError("Ошибка при загрузке изображения");
    } finally {
      setIsProcessing(false);
    }
  };

  // Переход к редактору, если изображение успешно загружено
  if (uploadedImagePath) {
    return (
      <Editor
        uploadedImagePath={uploadedImagePath}
        logUser={logUser}
        setUploadedImagePath={setUploadedImagePath}
        handleUploadedImagePath={handleUploadedImagePath}
        setLogUser={setLogUser}
        apiUrl={apiUrl}
      />
    );
  }

  return (
    <div className="upload-page">
      <div className="upload-page-heading">
        Загрузите изображение для анализа
      </div>

      <div className="upload-area">
        <img className="upload-area-img" 
          src="/images/upload-img.png"
        />

        {!file && !isProcessing && (
          <div className="upload-container">
            <div className="upload-ask">
              Загрузите файл на платформу
            </div>
            <label className="upload-btn">
              Выбрать файл
              <input
                key={inputKey}
                type="file"
                accept="image/png"
                onChange={handleFileChange}
                hidden
              />
            </label>
            <ul className="upload-limit">
              <li>
                Доступна загрузка изображения формата .png
              </li>
              <li>
                Максимальный размер файла 100 Мб
              </li>
            </ul>
          </div>
        )}
        
        {file && !isProcessing && (
          <div className="uploaded-img">
            <div className="uploaded-img-info">
              <div className="uploaded-img-name">
                {file.name}
              </div>

              <div className="upload-img-success">
                <img className="uploaded-img-icon" 
                  src="/images/done.png"
                />
                <div className="uploaded-img-text">
                  Загрузка завершена
                </div>
                <img className="uploaded-img-delete" 
                  src="/images/delete.png"
                  onClick={() => setFile(null)}
                />
              </div>
            </div>

            <div className="analysis-text">
              Убедитесь, что файл выбран верно, и начните анализ
            </div>            

            <div className="analysis-btn" 
              onClick={toAnalyse}
            >
              Начать анализ
            </div>
          </div>
        )}

        {isProcessing && (
          <div className="process">
            <div className="process-text">
              Ожидайте: выполняется анализ
            </div>

            <img className="process-img" 
              src="/images/loading.png"
            />
          </div>
        )}

        {uploadError && (
          <div className="upload-error">
            {uploadError}
          </div>
        )}
      </div>
    </div>
  );
};
  
export default ImagePage;