import { IMineGrid } from "../Mines.Annotations/IMineGrid"
import { MineData } from "../Mines.Annotations/MineData";
import { MineGridStatus } from "../Mines.Annotations/MineGridStatus";
import { MineMark } from "../Mines.Annotations/MineMark";
import { Algorithms } from "./Algorithms";
import { TileMark } from "./TileMark";

export class MineGrid implements IMineGrid {
    private readonly Mine: number = 0xFF

    private readonly SizeMax: number = 1024

    private readonly w: number

    private readonly h: number

    private readonly count: number

    private readonly face: TileMark[]

    private step = MineGridStatus.None

    private back: number[] = null

    private miss = -1

    private tile: number

    private flag = 0

    private code = 0

    private readonly flatten: (x: number, y: number) => number

    private ensure(min: number, max: number, value: number, name: string) {
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
        this.face = new Array(w * h).fill(TileMark.Tile)
        this.tile = w * h
        this.flatten = Algorithms.flatten(w, h)
    }

    private generate(x: number, y: number): ReadonlyArray<number> {
        let select = (a: number[], i: [number, number]) => {
            let [x, y] = i
            return a[this.flatten(x, y)] == this.Mine ? 1 : 0
        }
        let detect = (a: number[], x: number, y: number) => {
            let target = Array.from(Algorithms.adjacent(this.w, this.h, x, y))
            return target.reduce((sum: number, i: [number, number]) => {
                return sum + select(a, i)
            }, 0)
        }

        // 调用洗牌算法并忽略最后一个位置
        let data: number[] = new Array(this.w * this.h - 1)
        data.fill(this.Mine, 0, this.count)
        data.fill(0, this.count)
        Algorithms.shuffle(data)
        data.push(0)

        // 交换第一次点击的位置和最后一个位置
        let last = data.length - 1
        let i = this.flatten(x, y)
        let k = data[last]
        data[last] = data[i]
        data[i] = k

        for (var m = 0; m < this.w; m++) {
            for (var n = 0; n < this.h; n++) {
                let i = this.flatten(m, n)
                if (data[i] != this.Mine)
                    data[i] = detect(data, m, n)
            }
        }
        return data
    }

    private update(item: MineGridStatus) {
        this.step = item
        // TODO: 触发状态更改事件
    }

    get Status(): MineGridStatus {
        return this.step
    }

    get Version(): number {
        return this.code
    }

    get XMax(): number {
        return this.w
    }

    get YMax(): number {
        return this.h
    }

    get FlagCount(): number {
        return this.flag
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
