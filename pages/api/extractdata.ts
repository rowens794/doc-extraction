import { NextApiRequest, NextApiResponse } from "next";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY : ""
);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp", // other models: "gemini-2.0-flash-exp", "gemini-1.5-flash"
  generationConfig: {
    temperature: 1,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
    responseSchema: {
      //@ts-expect-error - This is a valid schema
      type: "object",
      properties: {
        Shares: {
          //@ts-expect-error - This is a valid schema
          type: "array",
          items: {
            //@ts-expect-error - This is a valid schema
            type: "object",
            properties: {
              //@ts-expect-error - This is a valid schema
              FundName: { type: "string" },
              //@ts-expect-error - This is a valid schema
              ShareClass: { type: "string" },
              //@ts-expect-error - This is a valid schema
              Ticker: { type: "string" },
              //@ts-expect-error - This is a valid schema
              Benchmark: { type: "string" },
              //@ts-expect-error - This is a valid schema
              OneMonthReturn: { type: "string" },
              //@ts-expect-error - This is a valid schema
              ThreeMonthReturn: { type: "string" },
              //@ts-expect-error - This is a valid schema
              TwelveMonthReturn: { type: "string" },
              //@ts-expect-error - This is a valid schema
              BenchmarkOneMonthReturn: { type: "string" },
              //@ts-expect-error - This is a valid schema
              BenchmarkThreeMonthReturn: { type: "string" },
              //@ts-expect-error - This is a valid schema
              BenchmarkTwelveMonthReturn: { type: "string" },
              //@ts-expect-error - This is a valid schema
              ExpenseRatio: { type: "string" },
              //@ts-expect-error - This is a valid schema
              AsOfDate: { type: "string" },
              //@ts-expect-error - This is a valid schema
              Filename: { type: "string" },
            },
            required: [
              "FundName",
              "ShareClass",
              "Ticker",
              "Benchmark",
              "OneMonthReturn",
              "ThreeMonthReturn",
              "TwelveMonthReturn",
              "BenchmarkOneMonthReturn",
              "BenchmarkThreeMonthReturn",
              "BenchmarkTwelveMonthReturn",
              "ExpenseRatio",
              "AsOfDate",
              "Filename",
            ],
          },
        },
      },
    },
  },
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const pdfResp = await fetch(
      `http://localhost:3000/factsheets/${req.body.filename}`
    ).then((response) => response.arrayBuffer());

    const result1 = await model.generateContent([
      {
        inlineData: {
          data: Buffer.from(pdfResp).toString("base64"),
          mimeType: "application/pdf",
        },
      },
      `
        Instructions for Extracting Data from Investment Factsheets

        You are an expert in extracting structured data from investment factsheets. When provided with a factsheet, your task is to extract the relevant data and return it as a JSON object or an array of JSON objects if the factsheet contains multiple share classes.

        Expected JSON Structure
        •	FundName: The descriptive name of the fund in the document (String)
        •	ShareClass: A description of the fund’s share class. If a fund is an ETF it will not have a share class - just use null (String)
        •	Ticker: The ticker symbol of the fund (String)
        •	Benchmark: The benchmark the fund is compared against (String)
        •	OneMonthReturn: The fund’s return over the last month, formatted as a percentage (e.g., 1.23) (Number)
        •	ThreeMonthReturn: The fund’s return over the last three months, formatted as a percentage (e.g., 3.45) (Number)
        •	TwelveMonthReturn: The fund’s return over the last twelve months, formatted as a percentage (e.g., 12.67) (Number)
        •	BenchmarkOneMonthReturn: The benchmark’s return over the last month, formatted as a percentage (e.g., 1.10) (Number)
        •	BenchmarkThreeMonthReturn: The benchmark’s return over the last three months, formatted as a percentage (e.g., 3.20) (Number)
        •	BenchmarkTwelveMonthReturn: The benchmark’s return over the last twelve months, formatted as a percentage (e.g., 11.50) (Number)
        •	ExpenseRatio: The fund’s expense ratio, formatted as a percentage with a single digit before the decimal point and 2 digits after (e.g., 0.75) (Number)
        •	AsOfDate: The date of the report in the format MM/DD/YYYY (String)
        •	Filename: ${req.body.filename} (String)


        Processing Guidelines
        1.	If any field is missing or not available in the document, set its value to null.
        2.	If the document contains multiple share classes, extract data for each share class and return an array of JSON objects, one for each share class.
        3. In some cases a manager with multiple share classes will only show the returns for a single share class.  In this case use the returns shown for all share classes.

        Example Output

        Single Share Class
        •	FundName: Example Fund Name
        •	ShareClass: Class A
        •	Ticker: TICKR
        •	Benchmark: S&P 500
        •	OneMonthReturn: 1.23
        •	ThreeMonthReturn: 3.45
        •	TwelveMonthReturn: 12.67
        •	BenchmarkOneMonthReturn: 1.10
        •	BenchmarkThreeMonthReturn: 3.20
        •	BenchmarkTwelveMonthReturn: 11.50
        •	ExpenseRatio: 0.75
        •	AsOfDate: 12/31/2023
        •	Filename: ${req.body.filename}

        Multiple Share Classes

        For a factsheet with multiple share classes, the JSON response would look like this:
        1.	FundName: Example Fund Name
        •	ShareClass: Class A
        •	Ticker: TICKR
        •	Benchmark: S&P 500
        •	OneMonthReturn: 1.23
        •	ThreeMonthReturn: 3.45
        •	TwelveMonthReturn: 12.67
        •	BenchmarkOneMonthReturn: 1.10
        •	BenchmarkThreeMonthReturn: 3.20
        •	BenchmarkTwelveMonthReturn: 11.50
        •	ExpenseRatio: 0.75
        •	AsOfDate: 12/31/2023
        •	Filename: ${req.body.filename}

        2.	FundName: Example Fund Name
        •	ShareClass: Class C
        •	Ticker: TICKRC
        •	Benchmark: S&P 500
        •	OneMonthReturn: 1.15
        •	ThreeMonthReturn: 3.30
        •	TwelveMonthReturn: 12.00
        •	BenchmarkOneMonthReturn: 1.10
        •	BenchmarkThreeMonthReturn: 3.20
        •	BenchmarkTwelveMonthReturn: 11.50
        •	ExpenseRatio: 0.95
        •	AsOfDate: 12/31/2023
        •	Filename: ${req.body.filename}
      `,
    ]);
    const text = result1.response.text();
    const result = JSON.parse(text);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: unknown) {
    console.error("Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return res.status(500).json({
      error: errorMessage,
      stack:
        error instanceof Error && process.env.NODE_ENV === "development"
          ? error.stack
          : undefined,
    });
  }
};

export default handler;
