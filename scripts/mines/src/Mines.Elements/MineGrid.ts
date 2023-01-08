import { IMineGrid } from "../Mines.Annotations/IMineGrid"
import { MineData } from "../Mines.Annotations/MineData";
import { MineGridStatus } from "../Mines.Annotations/MineGridStatus";
import { MineMark } from "../Mines.Annotations/MineMark";

export class MineGrid implements IMineGrid {
    readonly Mine: number = 0xFF

    readonly SizeMax: number = 1024

    readonly w: number

    readonly h: number

    readonly count: number

    ensure(min: number, max: number, value: number, name: string) {
        if (value < min || value > max)
            throw new RangeError(`Invalid argument '${name}'`)
    }

    constructor(w: number, h: number, count: number) {
        this.ensure(2, this.SizeMax, w, "w")
        this.ensure(2, this.SizeMax, h, "h")
        this.ensure(1, (w * h - 1), count, "count")

        this.w = w
        this.h = h
        this.count = count
    }

    get Status(): MineGridStatus {
        throw new Error("Method not implemented.");
    }

    get Version(): number {
        throw new Error("Method not implemented.");
    }

    get XMax(): number {
        return this.w
    }

    get YMax(): number {
        return this.h
    }

    get FlagCount(): number {
        throw new Error("Method not implemented.");
    }

    get MineCount(): number {
        return this.count
    }

    Get(x: number, y: number): MineData {
        throw new Error("Method not implemented.");
    }

    Set(x: number, y: number, mark: MineMark): void {
        throw new Error("Method not implemented.");
    }

    Remove(x: number, y: number): void {
        throw new Error("Method not implemented.");
    }
}
