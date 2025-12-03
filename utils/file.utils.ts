import * as fs from "fs";
import * as path from "path";

export function getInputData(dir: string): string {
    const filePath =  path.join(dir, "input.txt");
    const data = fs.readFileSync(filePath, "utf-8");

    return data;
}