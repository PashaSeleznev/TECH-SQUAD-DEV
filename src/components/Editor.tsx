import { Stage, Layer, Image as KonvaImage, Rect } from "react-konva";
import useImage from "use-image";
import { useState, useRef, useEffect, type FC } from "react";
import type Konva from "konva";
import { ColorPalette, colorArray } from "./ColorPalette";
import { fetchDefects, replaceImage, type RectShape } from "../actions/defects";
import type { UserType } from "../App";
import {
  handleMouseDown as onMouseDownHandler,
  handleMouseMove as onMouseMoveHandler,
  handleMouseUp as onMouseUpHandler,
  handleKeyDown as onKeyDownHandler,
} from "../actions/draw";

type EditorProps = {
  uploadedImagePath: string;
  logUser: UserType,
  setUploadedImagePath: (imagePath: string | null) => void,
  handleUploadedImagePath: (path: string | null) => void,
  setLogUser: (user: UserType) => void,
  apiUrl: string
};

const Editor: FC<EditorProps> = ({ uploadedImagePath, logUser, setUploadedImagePath, handleUploadedImagePath, setLogUser, apiUrl }) => {

  // Цвет для рисования прямоугольников
  const [selectedColor, setSelectedColor] = useState(colorArray[0]);
  
  // Загрузка изображения
  const [image] = useImage(uploadedImagePath, "anonymous");
  const [imageSize, setImageSize] = useState({ width: 1000, height: 1000 });

  // Все прямоугольники
  const [rects, setRects] = useState<RectShape[]>([]);
  // Режим рисования или выделения
  const [mode, setMode] = useState<"draw" | "select">("draw");
  // Текущий прямоугольник
  const [currentRect, setCurrentRect] = useState<RectShape | null>(null);
  // Выделенные прямоугольники
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);

  // Начальная точка начала перетаскивания прямоугольника (в режиме select)
  const dragStart = useRef<{ x: number; y: number } | null>(null);

  // Смещения прямоугольников от точки нажатия мыши при их перетаскивании
  // Хранятся для всех выделенных прямоугольников по их индексам
  const dragOffsets = useRef<{ [index: number]: { x: number; y: number } }>({});
  // Начальная точка области выделения (при зажатии мыши в режиме select)
  const selectionStart = useRef<{ x: number; y: number } | null>(null);
  // Объект, представляющий прямоугольник области выделения
  const [selectionRect, setSelectionRect] = useState<RectShape | null>(null);

  // Ссылка на stage
  const stageRef = useRef<Konva.Stage>(null);

  // Флаг процесса генерации отчета
  const [inGenerate, setInGenerate] = useState(false); 

  // Загрузка дефектов с backend
  useEffect(() => {
    const loadDefects = async () => {
      const defectsFromServer = await fetchDefects(apiUrl);
      setRects(defectsFromServer);
    };
    loadDefects();
  }, [apiUrl]);

  // Установка размера изображения после его загрузки
  useEffect(() => {
    if (image) {
      setImageSize({ width: image.width, height: image.height });
    }
  }, [image]);

  // Обработка нажатий клавиш (удаление)
  useEffect(() => {
    const handle = (e: KeyboardEvent) =>
    onKeyDownHandler(e, selectedIndices, setRects, setSelectedIndices);
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [selectedIndices]);

  // Обработчики мыши, вынесенные в отдельный модуль
  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) =>
    onMouseDownHandler(e, {
      mode, selectedColor, colorArray, currentRect, setCurrentRect,
      setRects, rects, setSelectedIndices, dragStart, dragOffsets,
      selectionStart, setSelectionRect, selectionRect, selectedIndices
    });

  const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) =>
    onMouseMoveHandler(e, {
      mode, selectedColor, colorArray, currentRect, setCurrentRect,
      setRects, rects, setSelectedIndices, dragStart, dragOffsets,
      selectionStart, setSelectionRect, selectionRect, selectedIndices
    });

  const handleMouseUp = () =>
    onMouseUpHandler({
      mode, selectedColor, colorArray, currentRect, setCurrentRect,
      setRects, rects, setSelectedIndices, dragStart, dragOffsets,
      selectionStart, setSelectionRect, selectionRect, selectedIndices
    });

  // Генерация отчета и отправка изображения + разметки на backend
  const toGenerate = async () => {
    if (!stageRef.current) return;

    setInGenerate(true);

    try {
      const dataURL = stageRef.current.toDataURL({ pixelRatio: 1 });
      console.log(dataURL);
      const res = await fetch(dataURL);
      const blob = await res.blob();
      const file = new File([blob], "edited_image.png", { type: "image/png" });
      const prevFilename = uploadedImagePath.split('/').pop() || "";

      const data = await file.arrayBuffer();
      if (data.byteLength < 1000) {
        throw new Error("Файл пустой или повреждён");
      }

      const response = await replaceImage(file, logUser.id, prevFilename, rects, apiUrl);
      if (!response || !response.user) {
        setInGenerate(false);
        alert("Ошибка при формировании отчета. Попробуйте еще раз.");
        return;
      }
      const updatedUser = {
        ...logUser,
        images: response.user.images,
        reports: response.user.reports
      };
      console.log(updatedUser)
      setLogUser(updatedUser);
      localStorage.setItem("logUser", JSON.stringify(updatedUser));
      setUploadedImagePath(null);
      handleUploadedImagePath(null);
      setInGenerate(false)

    } catch (err) {
      console.log(err)
      setInGenerate(false)
    }
  };

  if (inGenerate) {
    return (
      <div className="generate-report">
        <div className="process">
          <div className="process-text">
            Ожидайте: формируется отчет
          </div>

          <img className="process-img" 
            src="/images/loading.png"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="editor-page">
      <div className="editor-area">
        <div className="editor-buttons">
          <div className="editor-btn">
            <div className="editor-btn-select"
              onClick={() => { setMode("select"); setCurrentRect(null); }}
            >
            </div>

            <div className="edit-btn-text">
              Выделить
            </div>
          </div>

          <div className="editor-btn">
            <div className="editor-btn-create"
              onClick={() => { setMode("draw"); setSelectedIndices([]); }}
            >
            </div>

            <div className="editor-btn-text">
              Рисовать
            </div>
          </div>

          <div className="editor-btn">
            <ColorPalette 
              selectedColor={selectedColor} 
              setSelectedColor={setSelectedColor} 
            />

            <div className="editor-btn-text">
              Цвет
            </div>
          </div>
        </div>

        <div className="editor-stage">
          <div className="scroll-container">
          <Stage
            width={imageSize.width}
            height={imageSize.height}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            ref={stageRef}
            style={{ cursor: mode === "draw" ? "crosshair" : "default" }}
          >
            <Layer>
              {image && <KonvaImage image={image} />}
              {(rects || []).map((r, i) => (
                <Rect
                  key={i}
                  x={r.x}
                  y={r.y}
                  width={r.width}
                  height={r.height}
                  stroke={selectedIndices.includes(i) ? "blue" : r.stroke}
                  strokeWidth={selectedIndices.includes(i) ? 3 : 2}
                  dash={selectedIndices.includes(i) ? [4, 4] : []}
                />
              ))}
              {currentRect && (
                <Rect
                  x={currentRect.x}
                  y={currentRect.y}
                  width={currentRect.width}
                  height={currentRect.height}
                  stroke="green"
                  dash={[4, 4]}
                />
              )}
              {selectionRect && (
                <Rect
                  x={selectionRect.x}
                  y={selectionRect.y}
                  width={selectionRect.width}
                  height={selectionRect.height}
                  stroke="black"
                  strokeWidth={1}
                  dash={[4, 4]}
                  fill="rgba(0, 0, 255, 0.1)"
                />
              )}
            </Layer>
          </Stage>
        </div>
        </div>
      </div>

      <div className="generate-btn">
        <div className="generate-btn-text"
          onClick={toGenerate}
        >
          Сформировать отчет
        </div>

        <img className="generate-btn-img" 
          src="/images/page.png" 
        />      
        </div>
      </div>        
  );
};

export default Editor;
