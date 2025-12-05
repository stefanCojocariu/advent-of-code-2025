import { getInputData } from "../utils/file.utils";

interface Range {
    min: number;
    max: number;
}

class Database {
    private _freshRanges: Range[];

    constructor(freshRanges: Range[]) {
        this._freshRanges = this.mergeRanges(freshRanges);
    }

    get freshRanges(): Range[] {
        return this._freshRanges;
    }

    static fromString(strArr: string[]): Database {
        const ranges = strArr
            .map(s => s.split('-').map(Number))
            .filter(([min, max]) => min !== undefined && max !== undefined)
            .map(([min, max]) => ({ min: min!, max: max! }));
        
        return new Database(ranges);
    }

    private mergeRanges(ranges: Range[]): Range[] {
        if (ranges.length === 0) return [];

        const sorted = [...ranges].sort((r1, r2) => r1.min - r2.min);
        const merged: Range[] = [];
        let currentRange = { ...sorted[0]! };

        for (let i = 1; i < sorted.length; i++) {
            const range = sorted[i]!;

            if (range.min <= currentRange.max + 1) {
                currentRange.max = Math.max(currentRange.max, range.max);
            } else {
                merged.push(currentRange);
                currentRange = { ...range };
            }
        }
        
        merged.push(currentRange);
        return merged;
    }

    isFreshId(id: number): boolean {
        return this._freshRanges.some(range => id >= range.min && id <= range.max);
    }

    getTotalFreshIds(): number {
        return this._freshRanges.reduce((sum, range) => sum + (range.max - range.min + 1), 0);
    }
}

abstract class Analyzer {
    constructor(
        protected readonly database: Database,
        protected readonly ids: number[]
    ) {}

    abstract analyze(): number;
}

class Analyzer1 extends Analyzer {
    analyze(): number {
        return this.ids.filter(id => this.database.isFreshId(id)).length;
    }
}

class Analyzer2 extends Analyzer {
    analyze(): number {
        return this.database.getTotalFreshIds();
    }
}

function main() {
    const inputData = getInputData(__dirname);
    const sections = inputData.split(/\r?\n\s*\r?\n/);
    
    const ranges: string[] = sections[0]?.split(/\r?\n/).filter(s => s.trim()) ?? [];
    const ids: number[] = sections[1]?.split('\n')
        .filter(s => s.trim())
        .map(Number) ?? [];
    
    const database = Database.fromString(ranges)
    const analyzer1 = new Analyzer1(database, ids);
    const analyzer2 = new Analyzer2(database, ids);
    console.log('Part 1:', analyzer1.analyze());
    console.log('Part 2:', analyzer2.analyze());
}

main();