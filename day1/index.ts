import * as fs from "fs";
import * as path from "path";

type Direction = "L" | "R";

class Rotation {
    private _direction: Direction;
    private _value: number;

    constructor(direction: Direction, value: number) {
        this._direction = direction;
        this._value = value;
    }

    public get direction(): Direction {
        return this._direction;
    }

    public get value(): number {
        return this._value;
    }

    static fromString(str: string) {
        return new Rotation(str[0] as Direction, Number(str.slice(1))); 
    }
}

class Dial {
    private _value: number;
    private _password1: number;
    private _password2: number;

    constructor(value: number, password: number) {
        this._value = value;
        this._password1 = password;
        this._password2 = password
    }
    
    public get value(): number {
        return this._value;
    }

    public get password1(): number {
        return this._password1;
    }

    public get password2(): number {
        return this._password2;
    }

    public rotate(rotation: Rotation): void {
        const prevValue = this._value;
        const rotationValue = rotation.value;
        const newValue = rotation.direction === "R" ? prevValue + rotationValue : prevValue - rotationValue;
        
        let passes = 0;
        
        if (newValue >= 0) {
            passes = Math.floor(newValue / 100);
        } else {
            const startToZero = prevValue === 0 ? 100 : prevValue;
            const remaining = rotationValue - startToZero;
            passes = 1 + Math.floor(remaining / 100);
        }
        
        this._value = ((newValue % 100) + 100) % 100;

        if (this._value === 0 && prevValue !== 0 && passes === 0) {
            passes = 1;
        }

        if(this._value === 0) {
            this._password1++;
        }
        this._password2 += passes;
    }
}

function main(): void {
    const filePath =  path.join(__dirname, "input.txt");
    const data = fs.readFileSync(filePath, "utf-8");

    const dial = new Dial(50, 0);
    for (const str of data.split('\n')) {
        dial.rotate(Rotation.fromString(str));
    }

    console.log(dial.password1);
    console.log(dial.password2);
}

main();