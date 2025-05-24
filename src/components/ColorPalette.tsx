import { useState } from "react";

type ColorPaletteProps = {
  selectedColor: string;
  setSelectedColor: (color: string) => void;
};

// Сопоставление номеров классов дефектов с определёнными цветами
// Используется для визуального различия размеченных прямоугольников
export const colorArray: Record<number, string> = {
  0: "#2EC3C2",
  1: "#34C759",
  2: "#5E5CE6",
  3: "#FF9500",
  4: "#EC407A",
  5: "#FF3B30",
  6: "#007AFF",
  7: "#607D8B",
  8: "#FFEA00",
  9: "#36BAF5",
  10: "#AF52DE",
  11: "#EF2E83",
  12: "#A6A6A6"
};

export const ColorPalette = ({ selectedColor, setSelectedColor }: ColorPaletteProps) => {

  // Показ палитры цветов
  const [isOpen, setIsOpen] = useState(false);

  // Обработчик клика по цвету: устанавливает выбранный цвет для рисования и закрывает палитру
  const handleColorClick = (color: string) => {
    setSelectedColor(color);
    setIsOpen(false);
  };

  return (
    <div className="color-change">
      <div className="edit-btn-color"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          borderColor: selectedColor
        }}
      />

      {isOpen && (
        <div className="color-area">
          <div className="editor-btn-text">
            Выберите класс дефекта:
          </div>

          <div className="color-palette">
            {Object.entries(colorArray).map(([key, color]) => (
              <div
                key={key}
                onClick={() => handleColorClick(color)}
                className={`color-box${selectedColor === color ? " selected" : ""}`}
                style={{
                  backgroundColor: color,
                }}
              >
              <span className="tooltip">
                Класс {key}
              </span>
            </div>
          ))}
        </div>
        </div>
      )}
    </div>
  );
};
