import { useState } from "react";
import { classNames, colorArray } from "./ColorArray";

type ColorPaletteProps = {
  selectedColor: string;
  setSelectedColor: (color: string) => void;
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
                {classNames[Number(key)]}
              </span>
            </div>
          ))}
        </div>
        </div>
      )}
    </div>
  );
};
