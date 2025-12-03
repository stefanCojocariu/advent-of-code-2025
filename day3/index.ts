import { getInputData } from "../utils/file.utils";

class BatteryBank {
    private _bank: number[];

    constructor(bank: number[]) {
        this._bank = bank;
    }

    get bank(): number[] {
        return this._bank;
    }

    getLargestJoltage(count: number): number {
        if(this._bank.length <= count) {
            return Number(this._bank.join(''));
        }

        const toRemove = this._bank.length - count;
        const stack: number[] = [];
        let removed = 0;

        for (const digit of this._bank) {
            while (stack.length > 0 && stack[stack.length - 1]! < digit && removed < toRemove) {
                stack.pop();
                removed++;
            }
            stack.push(digit);
        }

        while (removed < toRemove) {
            stack.pop();
            removed++;
        }

        return Number(stack.join(''));
    }

    static fromString(bank: string): BatteryBank {
        return new BatteryBank(bank.split("").map(Number));
    }
}

class Escalator {
    constructor(private batteryBanks: BatteryBank[]) {}

    getTotalOutputJoltage(count: number): number {
        return this.batteryBanks.reduce((sum, bb) => sum + bb.getLargestJoltage(count), 0);
    }
}

function main() {
    const inputData = getInputData(__dirname);
    const batteryBanks = inputData.split('\n')
        .map(s => s.trim())
        .filter(s => s.length > 0)
        .map(BatteryBank.fromString);
    const escalator = new Escalator(batteryBanks);

    console.log("Part 1:", escalator.getTotalOutputJoltage(2));
    console.log("Part 2:", escalator.getTotalOutputJoltage(12));
}

main();