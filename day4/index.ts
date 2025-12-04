import { getInputData } from "../utils/file.utils";

class Grid {
    private _grid: string[][];
    
    constructor(grid: string[][]) {
        this._grid = grid;
    }

    get grid(): string[][] {
        return this._grid;
    }

    getNumberOfAccessiblePaperRolls(max: number, iterativeRemoval: boolean = true): number {
        const paperRolls = this.getPaperRollsAdjacentsMap();
        const totalPaperRolls = paperRolls.size;

        let changed = true;
        while(changed) {
            changed = false;
            const toRemove: string[] = [];
            
            for (const [key, adjacents] of paperRolls.entries()) {
                if(adjacents.size < max) {
                    toRemove.push(key);
                }
            }
            
            for (const removeKey of toRemove) {
                paperRolls.delete(removeKey);
                changed = iterativeRemoval;
                
                for (const [_, adjacents] of paperRolls.entries()) {
                    adjacents.delete(removeKey);
                }
            }
        }

        return totalPaperRolls - paperRolls.size;
    }

    static fromString(str: string): Grid {
        return new Grid(str.split('\n')
        .map(s => s.trim())
        .filter(s => s.length > 0)
        .map(s => s.split('')));
    }

    private getPaperRollsAdjacentsMap(): Map<string, Map<string, string>> {
        const paperRolls = new Map<string, Map<string, string>>();
        for (const [i, row] of this._grid.entries()) {
            for (const [j, el] of row.entries()) {
                if(el === '@') {
                    paperRolls.set(`${i},${j}`, new Map([
                        [`${i-1},${j-1}`, this._grid[i-1]?.[j-1]],
                        [`${i-1},${j}`, this._grid[i-1]?.[j]],
                        [`${i-1},${j+1}`, this._grid[i-1]?.[j+1]],
                        [`${i},${j+1}`, this._grid[i]?.[j+1]],
                        [`${i+1},${j+1}`, this._grid[i+1]?.[j+1]],
                        [`${i+1},${j}`, this._grid[i+1]?.[j]],
                        [`${i+1},${j-1}`, this._grid[i+1]?.[j-1]],
                        [`${i},${j-1}`, this._grid[i]?.[j-1]],
                    ].filter(([_, value]) => value !== undefined && value !== '.') as [string, string][]));
                }
            }
        }

        return paperRolls;
    }
}

function main() {
    const inputData = getInputData(__dirname);
    const grid = Grid.fromString(inputData);
    console.log('Part 1:', grid.getNumberOfAccessiblePaperRolls(4, false));
    console.log('Part 2:', grid.getNumberOfAccessiblePaperRolls(4));
}

main();