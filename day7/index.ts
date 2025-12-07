import { getInputData } from "../utils/file.utils";

class Manifold {
    constructor(
        private readonly diagram: string[][], 
        private beams: Set<number>, 
        private splits = 0
    ) {}

    start(): void {
        const startIndex = this.findStartBeam();
        this.beams.add(startIndex);
        
        for (const row of this.diagram) {
            const splitters = this.findSplitters(row);
            this.splitBeams(splitters, row.length);
            this.markBeamPaths(row);
        }
    }

    getSplits(): number {
        return this.splits;
    }

    getTotalTimelineCount(): number {
        const startBeamIndex = this.findStartBeam();
        if (startBeamIndex === -1) return 0;
        
        let currentPositions = new Map<number, number>();
        currentPositions.set(startBeamIndex, 1);
        
        let rowIndex = 0;
        for (const row of this.diagram) {
            const nextPositions = new Map<number, number>();
            
            for (const [pos, count] of currentPositions) {
                if (row[pos] === '^') {
                    const left = pos - 1;
                    const right = pos + 1;
                    
                    if (left >= 0) {
                        nextPositions.set(left, (nextPositions.get(left) ?? 0) + count);
                    }
                    if (right < row.length) {
                        nextPositions.set(right, (nextPositions.get(right) ?? 0) + count);
                    }
                } else {
                    nextPositions.set(pos, (nextPositions.get(pos) ?? 0) + count);
                }
            }
            
            currentPositions = nextPositions;
            rowIndex++;
        }
        
        return [...currentPositions.values()].reduce((sum, el) => sum + el, 0);
    }

    private findStartBeam(): number {
        for (const row of this.diagram) {
            const startIndex = row.indexOf('S');
            if (startIndex !== -1) {
                return startIndex;
            }
        }

        return -1;
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
    
    console.log('Part 1(splits):', manifold.getSplits());
    console.log('Part 2(timelines):', manifold.getTotalTimelineCount());
}

main();