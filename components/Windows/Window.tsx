import React, { useState } from "react";

interface WindowProps {
  zIndex: number;
  onClose: () => void;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
  width?: string;
  height?: string;
}

const Window: React.FC<WindowProps> = ({
  zIndex,
  onClose,
  onClick,
  title,
  children,
  width = "500px",
  height = "400px",
}) => {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
    onClick();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      className="absolute bg-white border border-gray-800 shadow-2xl flex flex-col"
      style={{
        top: position.y,
        left: position.x,
        zIndex,
        width: width,
        height: height,
        overflow: "hidden",
      }}
    >
      <div
        className="h-8 bg-gray-700 text-white flex items-center justify-between px-2 cursor-move"
        onMouseDown={handleMouseDown}
      >
        <span className="text-sm font-bold">{title}</span>
        <button onClick={onClose} className="text-white hover:text-red-500">
          X
        </button>
      </div>
      <div className="flex-1 p-4 overflow-y-auto">{children}</div>
    </div>
  );
};

export default Window;
