import { getInputData } from "../utils/file.utils";

class Manifold {
    constructor(
        private readonly diagram: string[][], 
        private beams: Set<number>, 
        private splits = 0
    ) {}

    start(): void {
        this.findStartBeam();
        
        for (const row of this.diagram) {
            const splitters = this.findSplitters(row);
            this.splitBeams(splitters, row.length);
            this.markBeamPaths(row);
        }
    }

    getSplits(): number {
        return this.splits;
    }

    private findStartBeam(): void {
        for (const row of this.diagram) {
            const startIndex = row.indexOf('S');
            if (startIndex !== -1) {
                this.beams.add(startIndex);
                return;
            }
        }
    }

    private findSplitters(row: string[]): Set<number> {
        const splitters = new Set<number>();
        for (const beam of this.beams) {
            if (row[beam] === '^') {
                splitters.add(beam);
            }
        }
        return splitters;
    }

    private splitBeams(splitters: Set<number>, maxLength: number): void {
        if (splitters.size === 0) return;

        this.splits += splitters.size;

        for (const splitter of splitters) {
            const leftBeam = splitter - 1;
            const rightBeam = splitter + 1;

            if (leftBeam >= 0) {
                this.beams.add(leftBeam);
            }
            if (rightBeam < maxLength) {
                this.beams.add(rightBeam);
            }
            
            this.beams.delete(splitter);
        }
    }

    private markBeamPaths(row: string[]): void {
        for (const beam of this.beams) {
            if (row[beam] !== 'S') {
                row[beam] = '|';
            }
        }
    }

    static fromString(str: string): Manifold {
        const diagram = str.split('\r\n').map(line => line.split(''));
        return new Manifold(diagram, new Set<number>());
    }
}

function main() {
    const inputData = getInputData(__dirname);
    const manifold = Manifold.fromString(inputData);
    manifold.start();
    
    console.log('Part 1:', manifold.getSplits());
}

main();