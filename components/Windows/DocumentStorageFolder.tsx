import React from "react";
import { DocumentIcon } from "@heroicons/react/24/solid";
import Window from "./Window";

const DocumentStorageFolder = ({
  files,
  zIndex,
  onClose,
  onClick,
}: {
  files: { name: string; size: string }[];
  zIndex: number;
  onClose: () => void;
  onClick: () => void;
}) => {
  const handleFileClick = (fileName: string) => {
    // Open the file in a new window
    window.open(`/factsheets/${fileName}`, "_blank");
  };

  return (
    <Window
      title="Document Storage"
      zIndex={zIndex}
      onClose={onClose}
      onClick={onClick}
      width="500px"
      height="500px"
    >
      <ul>
        {files.map((file, index) => (
          <li
            key={index}
            className="flex items-center justify-between text-stone-800 hover:bg-gray-100 cursor-pointer p-0.5 pr-4"
            onClick={() => handleFileClick(file.name)} // Open file when clicked
          >
            {/* Icon and File Name */}
            <div className="flex items-center">
              <DocumentIcon className="w-6 h-6 text-gray-500 mr-2" />
              <span>{file.name}</span>
            </div>
            {/* File Size */}
            <span className="italic text-sm">{file.size}</span>
          </li>
        ))}
      </ul>
    </Window>
  );
};

export default DocumentStorageFolder;
