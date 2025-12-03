import { getInputData } from "../utils/file.utils"

class Range {
    constructor(private start: number, private end: number) {}

    static fromString(rangeStr: string): Range {
        const [start, end] = rangeStr.split('-').map(Number);
        return new Range(start ?? 0, end ?? 0);
    }

    *ids(): Generator<number> {
        for (let id = this.start; id <= this.end; id++) {
            yield id;
        }
    }
}

abstract class Validator {
    abstract isValid(id: string): boolean;

    getInvalidIdSum(range: Range): number {
        let sum = 0;
        for (const id of range.ids()) {
            if (!this.isValid(id.toString())) {
                sum += id;
            }
        }
        return sum;
    }
}

class Validator1 extends Validator {
    isValid(id: string): boolean {
        const len = id.length;
        
        if (len % 2 === 1) {
            return true;
        }

        const mid = len / 2;
        return Number(id.slice(0, mid)) !== Number(id.slice(mid));
    }
}

class Validator2 extends Validator {
    isValid(id: string): boolean {
        let seqLen = 1;

        while (seqLen <= id.length / 2) {
            const seq = id.slice(0, seqLen);
            const invalidSeq = seq.repeat(Math.trunc(id.length / seqLen));
            
            if (Number(invalidSeq) === Number(id)) {
                return false;
            }
            
            seqLen++;
        }

        return true;
    }
}

class SecurityAnalyzer {
    constructor(private validators: Validator[]) {}

    analyze(ranges: Range[]): number[] {
        return this.validators.map(validator => 
            ranges.reduce((sum, range) => sum + validator.getInvalidIdSum(range), 0)
        );
    }
}

function main() {
    const inputData = getInputData(__dirname);
    
    const ranges = inputData
        .split(',')
        .map(r => r.trim())
        .filter(r => r.length > 0)
        .map(Range.fromString);

    const analyzer = new SecurityAnalyzer([new Validator1(), new Validator2()]);
    const [sum1, sum2] = analyzer.analyze(ranges);

    console.log("Part 1:", sum1);
    console.log("Part 2:", sum2);
}

main();