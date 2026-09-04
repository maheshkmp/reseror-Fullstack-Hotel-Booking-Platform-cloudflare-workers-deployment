import * as XLSX from "xlsx";

/**
 * Converts JSON data to an Excel buffer.
 * @param data Array of objects to convert
 * @param sheetName Optional name for the worksheet
 * @returns Uint8Array containing the Excel file
 */
export function jsonToExcelBuffer(data: any[], sheetName: string = "Sheet1"): Uint8Array {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  
  // Use 'array' type for better compatibility with Web Standard Uint8Array
  const excelBuffer = XLSX.write(workbook, { type: "array", bookType: "xlsx" });
  return new Uint8Array(excelBuffer);
}

/**
 * Parses an Excel data into JSON.
 * @param data Uint8Array containing the Excel file
 * @returns Array of objects parsed from the first sheet
 */
export function excelBufferToJson<T>(data: Uint8Array): T[] {
  const workbook = XLSX.read(data, { type: "array" });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  
  const dataParsed = XLSX.utils.sheet_to_json<T>(worksheet);
  return dataParsed;
}

