import fs from "fs";
import path from "path";

export const readFile = (relativeFilePath: string): string => {
  const absoluteFilePath = path.join(process.cwd(), relativeFilePath);
  return fs.readFileSync(absoluteFilePath, "utf8");
};

export const readJSONFile = <T>(relativeFilePath: string): T => {
  return JSON.parse(readFile(relativeFilePath));
};

export const writeFile = (relativeFilePath: string, data: string) => {
  const absoluteFilePath = path.join(process.cwd(), relativeFilePath);
  fs.writeFileSync(absoluteFilePath, data, "utf8");
};

export const writeJSONFile = <T>(relativeFilePath: string, data: T) => {
  writeFile(relativeFilePath, JSON.stringify(data, null, 2));
};
