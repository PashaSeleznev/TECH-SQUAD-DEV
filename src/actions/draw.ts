import Konva from "konva";
import type { RectShape } from "./defects";
import type { RefObject } from "react";

// Типы для аргументов
type DrawHandlersArgs = {
  mode: "draw" | "select";
  selectedColor: string;
  colorArray: Record<number, string>;
  currentRect: RectShape | null;
  setCurrentRect: (rect: RectShape | null) => void;
  setRects: React.Dispatch<React.SetStateAction<RectShape[]>>;
  rects: RectShape[];
  setSelectedIndices: React.Dispatch<React.SetStateAction<number[]>>;
  selectionRect: RectShape | null,
  setSelectionRect: (rect: RectShape | null) => void;
  selectedIndices: number[];
  dragStart: RefObject<{ x: number; y: number } | null>;
  dragOffsets: RefObject<{ [index: number]: { x: number; y: number } }>;
  selectionStart: RefObject<{ x: number; y: number } | null>;
};

export const handleMouseDown = (
  e: Konva.KonvaEventObject<MouseEvent>,
  args: DrawHandlersArgs
) => {
  const {
    mode,
    selectedColor,
    colorArray,
    setCurrentRect,
    rects,
    setSelectedIndices,
    dragStart,
    dragOffsets,
    selectionStart,
    setSelectionRect,
  } = args;

  const pointer = e.target.getStage()?.getPointerPosition();
  if (!pointer) return;

  if (mode === "draw") {
    const classId = Object.entries(colorArray).find(([, color]) => color === selectedColor)?.[0];
    setCurrentRect({
      x: pointer.x,
      y: pointer.y,
      width: 0,
      height: 0,
      stroke: selectedColor,
      className: classId ?? "-1",
    });
    return;
  }

  const hitPadding = 5;

  const clickedIndex = rects.findIndex((r) =>
    pointer.x >= r.x - hitPadding &&
    pointer.x <= r.x + r.width + hitPadding &&
    pointer.y >= r.y - hitPadding &&
    pointer.y <= r.y + r.height + hitPadding
  );

  if (clickedIndex !== -1) {
    dragStart.current = pointer;
    dragOffsets.current = {
      [clickedIndex]: {
        x: pointer.x - rects[clickedIndex].x,
        y: pointer.y - rects[clickedIndex].y,
      },
    };
    setSelectedIndices([clickedIndex]);
  } else {
    setSelectedIndices([]);
    selectionStart.current = pointer;
    setSelectionRect({
      x: pointer.x,
      y: pointer.y,
      width: 0,
      height: 0,
      stroke: "black",
      className: "selection",
    });
  }
};

export const handleMouseMove = (
  e: Konva.KonvaEventObject<MouseEvent>,
  args: DrawHandlersArgs
) => {
  const {
    mode,
    currentRect,
    setCurrentRect,
    dragStart,
    selectedIndices,
    dragOffsets,
    rects,
    setRects,
    selectionStart,
    setSelectionRect,
  } = args;

  const pointer = e.target.getStage()?.getPointerPosition();
  if (!pointer) return;

  if (mode === "draw" && currentRect) {
    setCurrentRect({
      ...currentRect,
      width: pointer.x - currentRect.x,
      height: pointer.y - currentRect.y,
    });
    return;
  }

  if (mode === "select") {
    if (dragStart.current && selectedIndices.length === 1) {
      const index = selectedIndices[0];
      const offset = dragOffsets.current[index];
      if (!offset) return;

      const updatedRects = [...rects];
      updatedRects[index] = {
        ...updatedRects[index],
        x: pointer.x - offset.x,
        y: pointer.y - offset.y,
      };
      setRects(updatedRects);
    }

    if (selectionStart.current) {
      const { x: startX, y: startY } = selectionStart.current;
      setSelectionRect({
        x: Math.min(pointer.x, startX),
        y: Math.min(pointer.y, startY),
        width: Math.abs(pointer.x - startX),
        height: Math.abs(pointer.y - startY),
        stroke: "black",
        className: "selection",
      });
    }
  }
};

export const handleMouseUp = (args: DrawHandlersArgs) => {
  const {
    mode,
    currentRect,
    setCurrentRect,
    setRects,
    selectionStart,
    selectionRect,
    setSelectionRect,
    setSelectedIndices,
    rects,
    dragStart,
    dragOffsets,
  } = args;

  if (mode === "draw" && currentRect) {
    setRects((prev) => [...prev, currentRect]);
    setCurrentRect(null);
    return;
  }

  if (mode === "select" && selectionRect) {
    const selected = rects
      .map((r, i) =>
        r.x >= selectionRect.x &&
        r.y >= selectionRect.y &&
        r.x + r.width <= selectionRect.x + selectionRect.width &&
        r.y + r.height <= selectionRect.y + selectionRect.height
          ? i
          : -1
      )
      .filter((i) => i !== -1);

    setSelectedIndices(selected);
    setSelectionRect(null);
    selectionStart.current = null;
  }

  dragStart.current = null;
  dragOffsets.current = {};
};

export const handleKeyDown = (
  e: KeyboardEvent,
  selectedIndices: number[],
  setRects: React.Dispatch<React.SetStateAction<RectShape[]>>,
  setSelectedIndices: React.Dispatch<React.SetStateAction<number[]>>
) => {
  if (e.key === "Delete" && selectedIndices.length > 0) {
    setRects((prev) => prev.filter((_, i) => !selectedIndices.includes(i)));
    setSelectedIndices([]);
  }
};
