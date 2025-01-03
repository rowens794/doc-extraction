import React, { useState } from "react";
import Icon from "./Icon";
import DocumentStorageFolder from "../Windows/DocumentStorageFolder";
import DatabaseWindow from "../Windows/DatabaseWindow";

const Desktop = () => {
  const [isFolderOpen, setIsFolderOpen] = useState(false);
  const [isDatabaseOpen, setIsDatabaseOpen] = useState(false);
  const [activeWindow, setActiveWindow] = useState<string | null>(null);
  const [filesProcessing, setFilesProcessing] = useState({
    inProcess: false,
    filesProcessed: 0,
    totalFiles: 0,
  });

  type FundPerformance = {
    AsOfDate: string;
    Benchmark: string;
    BenchmarkOneMonthReturn: string;
    BenchmarkThreeMonthReturn: string;
    BenchmarkTwelveMonthReturn: string;
    ExpenseRatio: string;
    FundName: string;
    OneMonthReturn: string;
    ShareClass: string;
    ThreeMonthReturn: string;
    Ticker: string;
    TwelveMonthReturn: string;
    Filename: string;
  };

  const [files, setFiles] = useState([
    {
      name: "calamos-phineus-fact-sheet.pdf",
      size: "540 KB",
    },
    {
      name: "dgro-ishares-core-en-us.pdf",
      size: "250 KB",
    },
    {
      name: "F0540.pdf",
      size: "536 KB",
    },
    {
      name: "F0807.pdf",
      size: "536 KB",
    },
    {
      name: "F1520.pdf",
      size: "537 KB",
    },
    {
      name: "F1848.pdf",
      size: "536 KB",
    },
    {
      name: "factsheet-us-en-hybl.pdf",
      size: "305 KB",
    },
    {
      name: "FS-JPEF.pdf",
      size: "132 KB",
    },
    {
      name: "FS-USE-A.pdf",
      size: "138 KB",
    },
    {
      name: "GGUS_fc.pdf",
      size: "160 KB",
    },
    {
      name: "GIGB_fc.pdf",
      size: "252 KB",
    },
    {
      name: "GPIQ_fc.pdf",
      size: "214 KB",
    },
    {
      name: "GSST_fc.pdf",
      size: "131 KB",
    },
    {
      name: "madvx-equity-individual.pdf",
      size: "338 KB",
    },
    {
      name: "maegx-unconstrained-us-en-individual.pdf",
      size: "327 KB",
    },
  ]);

  const [activeFiles, setActiveFiles] = useState<
    {
      name: string;
      size: string;
    }[]
  >([]);
  const [processedResponses, setProcessedResponses] = useState<
    FundPerformance[]
  >([]);

  const processFiles = async () => {
    // Create a local copy of activeFiles to iterate over
    const filesToProcess = [...activeFiles];

    setFilesProcessing({
      inProcess: true,
      filesProcessed: 1,
      totalFiles: filesToProcess.length,
    });

    for (const fileToProcess of filesToProcess) {
      //determine if the project is deployed or running locally
      const isLocal = process.env.NODE_ENV === "development";
      const apiEndpoint = isLocal
        ? "http://localhost:3000"
        : "https://doc-extraction.vercel.app/";

      try {
        const response = await fetch(`${apiEndpoint}/api/extractdata`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            filename: fileToProcess.name,
          }),
        });

        if (response.ok) {
          const data = await response.json();

          //get existing files processed count
          const filesProcessed = filesProcessing.filesProcessed;

          // Update filesProcessing state
          setFilesProcessing({
            inProcess: true,
            filesProcessed: filesProcessed + 1,
            totalFiles: filesToProcess.length,
          });

          setProcessedResponses((prev) => [...prev, ...data.data.Shares]); // Store the response

          // Move file from activeFiles to files
          setActiveFiles((prev) =>
            prev.filter((file) => file.name !== fileToProcess.name)
          ); // Remove the processed file
          setFiles((prev) => [...prev, fileToProcess]); // Add the file back to files
        } else {
          //get existing files processed count
          const filesProcessed = filesProcessing.filesProcessed;

          // Update filesProcessing state
          setFilesProcessing({
            inProcess: true,
            filesProcessed: filesProcessed + 1,
            totalFiles: filesToProcess.length,
          });

          // Move file from activeFiles to files
          setActiveFiles((prev) =>
            prev.filter((file) => file.name !== fileToProcess.name)
          ); // Remove the processed file
          setFiles((prev) => [...prev, fileToProcess]); // Add the file back to files

          console.error("Processing failed:", await response.text());
        }
      } catch (error) {
        console.error("Error processing file:", error);
      }
    }

    setFilesProcessing({
      inProcess: false,
      filesProcessed: 0,
      totalFiles: 0,
    });
  };

  const simulateFileTransfer = async () => {
    for (let i = 0; i < files.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      setActiveFiles((prev) => [...prev, files[i]]);
      setFiles((prev) => prev.slice(1));
    }
  };

  return (
    <div className="w-screen h-screen overflow-hidden bg-stone-300 relative">
      {/* Icons */}
      <Icon
        label="Document Storage"
        IconComponent="FolderIcon"
        onClick={() => {
          setIsFolderOpen(true);
          setActiveWindow("folder");
        }}
        position={{ top: 4, left: 4 }}
      />
      <Icon
        label="Database"
        IconComponent="CircleStackIcon"
        onClick={() => {
          setIsDatabaseOpen(true);
          setActiveWindow("database");
        }}
        position={{ top: 4, left: 10 }}
      />

      {/* Files */}
      {filesProcessing.inProcess && (
        //center a div in the middle of the screen
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-100 p-4 z-[90] border-2 border-stone-800 rounded-md shadow-xl">
          <p className="text-stone-800">
            Processing {files.length + 1} of {filesProcessing.totalFiles}{" "}
            files...
          </p>
        </div>
      )}

      {/* Buttons */}
      <div className="absolute bottom-12 left-12 flex gap-4">
        <button
          className=" bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={simulateFileTransfer}
        >
          File Transfer
        </button>
        <button
          className=" bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          onClick={processFiles}
          disabled={activeFiles.length === 0} // Disable if no files in activeFiles
        >
          Process Files
        </button>
      </div>

      {/* Windows */}
      {isFolderOpen && (
        <DocumentStorageFolder
          onClose={() => setIsFolderOpen(false)}
          files={activeFiles} // Pass activeFiles here
          zIndex={activeWindow === "folder" ? 50 : 40}
          onClick={() => setActiveWindow("folder")}
        />
      )}
      {isDatabaseOpen && (
        <DatabaseWindow
          onClose={() => setIsDatabaseOpen(false)}
          zIndex={activeWindow === "database" ? 50 : 40}
          onClick={() => setActiveWindow("database")}
          processedResponses={processedResponses} // Pass processed responses here
        />
      )}
    </div>
  );
};

export default Desktop;
