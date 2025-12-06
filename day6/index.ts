import { getInputData } from "../utils/file.utils";

class ProblemSolver {
    constructor(private readonly problems: string[][], private readonly isCephalopod: boolean = true) {
        this.problems = problems;
    }

    getGrandTotal(): number {
        return this.getResults().reduce((sum, v) => sum + v, 0);
    }

    private applyOperation(result: number, value: number, operation: string): number {
        if (operation === '+') {
            return result + value;
        } else if (operation === '*') {
            return result * value;
        }
        return result;
    }

    private getResults(): number[] {
        const problems = this.problems;
        const operations = problems.slice(-1)[0] ?? [];
        
        const results: number[] = operations.map(op => op === '+' ? 0 : 1);

        if (!this.isCephalopod) {
            for (let i = 0; i < problems.length - 1; i++) {
                const row = problems[i]!;
                for (const [index, el] of row.entries()) {
                    const value = Number(el);
                    results[index] = this.applyOperation(results[index]!, value, operations[index]!);
                }
            }
        } else {
            for (const [index, row] of problems.entries()) {
                if (index === problems.length - 1) continue;
                
                for (const el of row) {
                    const value = Number(el);
                    results[index] = this.applyOperation(results[index]!, value, operations[index]!);
                }
            }
        }
        
        return results;
    }

    static fromString(str: string, isCephalopod: boolean = false): ProblemSolver {
        const splitted = str.split('\r\n');
        let matrix: string[][] = [];
        
        if (!isCephalopod) {
            matrix = splitted.map(r => r.split(' ').filter(el => el !== ''));
        } else {
            const len = splitted[0]?.length ?? 0;
            let col: string[] = [];
            
            for (let i = 0; i < len; i++) {
                let number = '';
                for (let j = 0; j < splitted.length - 1; j++) {
                    number += splitted[j]!.charAt(i);
                }
                
                if (number === ' '.repeat(splitted.length - 1)) {
                    if (col.length) {
                        matrix.push(col);
                        col = [];
                    }
                } else {
                    col.push(number);
                }
            }
            
            if (col.length) {
                matrix.push(col);
            }
            
            matrix.push(splitted[splitted.length - 1]!.split(' ').filter(el => el !== ''));
        }

        return new ProblemSolver(matrix);
    }
}

function main() {
    const inputData = getInputData(__dirname);
    const problemSolver1 = ProblemSolver.fromString(inputData, false);
    const problemSolver2 = ProblemSolver.fromString(inputData, true);
    
    console.log('Part 1:', problemSolver1.getGrandTotal());
    console.log('Part 2:', problemSolver2.getGrandTotal());
}

main();