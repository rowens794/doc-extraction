import React from "react";
import { FolderIcon, CircleStackIcon } from "@heroicons/react/24/solid";

const iconMap = {
  FolderIcon,
  CircleStackIcon,
};

interface IconProps {
  label: string;
  IconComponent: keyof typeof iconMap;
  onClick: () => void;
  position: { top: number; left: number };
}

const Icon: React.FC<IconProps> = ({
  label,
  IconComponent,
  onClick,
  position,
}) => {
  const IconSvg = iconMap[IconComponent];
  const labelWords = label.split(" ");
  return (
    <div
      className="absolute flex flex-col items-center cursor-pointer"
      style={{ top: `${position.top}rem`, left: `${position.left}rem` }}
      onClick={onClick}
    >
      <IconSvg className="w-12 h-12 text-yellow-500" />
      {labelWords.map((word, index) => (
        <span key={index} className="text-xs text-stone-900">
          {word}
        </span>
      ))}
    </div>
  );
};

export default Icon;
