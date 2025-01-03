import React from "react";
import Window from "./Window";

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

const DatabaseWindow = ({
  zIndex,
  onClose,
  onClick,
  processedResponses,
}: {
  zIndex: number;
  onClose: () => void;
  onClick: () => void;
  processedResponses: FundPerformance[];
}) => {
  return (
    <Window
      title="Database"
      zIndex={zIndex}
      onClose={onClose}
      onClick={onClick}
      width="1300px"
      height="700px"
    >
      <div className="h-full overflow-y-auto max-h-[100%]">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-300 text-stone-800 text-sm">
              <th className="text-left px-4 py-1">Ticker</th>
              <th className="text-left px-4 py-1">Fund Name</th>
              <th className="text-center px-4 py-1">Date</th>
              <th className="text-left px-4 py-1">Benchmark</th>
              <th className="text-center px-4 py-1">1m Return</th>
              <th className="text-center px-4 py-1">3m Return</th>
              <th className="text-center px-4 py-1">12m Return</th>
              <th className="text-left px-4 py-1">Share Class</th>
              <th className="text-left px-4 py-1">Expense Ratio</th>
            </tr>
          </thead>
          <tbody>
            {processedResponses.length > 0 ? (
              processedResponses.map((response, index) => (
                <tr
                  key={index}
                  onClick={() =>
                    window.open(`/factsheets/${response.Filename}`)
                  }
                  className={`border-b ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } text-stone-800 text-sm hover:bg-gray-100 cursor-pointer`}
                >
                  <td className="px-4 py-1 whitespace-nowrap">
                    {response.Ticker !== "null" ? response.Ticker : "-"}
                  </td>
                  <td className="px-4 py-1 whitespace-nowrap max-w-48 overflow-hidden overflow-ellipsis">
                    {response.FundName !== "null" ? response.FundName : "-"}
                  </td>
                  <td className="px-4 py-1 whitespace-nowrap">
                    {response.AsOfDate !== "null" ? response.AsOfDate : "-"}
                  </td>
                  <td className="px-4 py-1 whitespace-nowrap max-w-48 overflow-hidden overflow-ellipsis">
                    {response.Benchmark !== "null" ? response.Benchmark : "-"}
                  </td>
                  <td className="px-4 py-1 whitespace-nowrap text-center">
                    {response.OneMonthReturn !== "null"
                      ? response.OneMonthReturn
                      : "-"}
                  </td>
                  <td className="px-4 py-1 whitespace-nowrap text-center">
                    {response.ThreeMonthReturn !== "null"
                      ? response.ThreeMonthReturn
                      : "-"}
                  </td>
                  <td className="px-4 py-1 whitespace-nowrap text-center">
                    {response.TwelveMonthReturn !== "null"
                      ? response.TwelveMonthReturn
                      : "-"}
                  </td>
                  <td className="px-4 py-1 whitespace-nowrap">
                    {response.ShareClass !== "null" ? response.ShareClass : "-"}
                  </td>
                  <td className="px-4 py-1 whitespace-nowrap text-center">
                    {response.ExpenseRatio !== "null"
                      ? response.ExpenseRatio
                      : "-"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="text-center text-stone-800 py-4">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Window>
  );
};

export default DatabaseWindow;
