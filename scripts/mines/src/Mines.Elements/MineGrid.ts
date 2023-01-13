import { IMineGrid } from "../Mines.Annotations/IMineGrid"
import { MineData } from "../Mines.Annotations/MineData";
import { MineGridStatus } from "../Mines.Annotations/MineGridStatus";
import { MineGridStatusError } from "../Mines.Annotations/MineGridStatusError"
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

    private back: ReadonlyArray<number> = null

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

    private remove(x: number, y: number): number {
        let adjacent = (a: number, b: number) => Algorithms.adjacent(this.w, this.h, a, b)
        let o = new Array<[number, number]>([x, y])
        let c = new Set<[number, number]>()
        var n = 0
        while (o.length > 0) {
            let p = o.pop()
            if (!c.has(p)) {
                c.add(p)
                let [a, b] = p
                let i = this.flatten(a, b)
                if (this.face[i] == TileMark.Tile) {
                    this.face[i] = TileMark.None
                    n += 1
                    switch (this.back[i]) {
                        case 0: Array.from(adjacent(a, b)).forEach(k => o.push(k)); break
                        case this.Mine: this.miss = i; break
                    }
                }
            }
        }
        return n
    }

    private fail() {
        throw new MineGridStatusError(`Can not operate now, status: ${this.step}`)
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
        let i = this.flatten(x, y)
        let b = this.back == null ? -1 : this.back[i]
        let m = b == this.Mine
        let f = this.step == MineGridStatus.Over
        switch (this.face[i]) {
            case TileMark.Tile: return f && m ? MineData.Mine : MineData.Tile;
            case TileMark.Flag: return f && !m ? MineData.FlagMiss : MineData.Flag;
            case TileMark.What: return f && !m ? MineData.WhatMiss : MineData.What;
            default: i == this.miss ? MineData.MineMiss : (m ? MineData.Mine : MineData[b]);
        }
    }

    Set(x: number, y: number, mark: MineMark): void {
        let convert = (mark: MineMark) => {
            switch (mark) {
                case MineMark.None: return TileMark.Tile;
                case MineMark.Flag: return TileMark.Flag
                case MineMark.What: return TileMark.What
                default: throw new Error("Invalid mine mark!")
            }
        }

        if (this.step != MineGridStatus.None && this.step != MineGridStatus.Wait)
            this.fail()
        let t = convert(mark)
        let i = this.flatten(x, y)
        let s = this.face[i]
        if (s != t) {
            this.code += 1
            this.face[i] = t
            if (s == TileMark.Flag) {
                this.flag -= 1
            } else if (t == TileMark.Flag) {
                this.flag += 1
            }
        }
    }

    Remove(x: number, y: number): void {
        if (this.step == MineGridStatus.None) {
            this.back = this.generate(x, y)
            this.update(MineGridStatus.Wait)
        } else if (this.step != MineGridStatus.Wait) {
            this.fail()
        }

        let n = this.remove(x, y)
        if (n != 0) {
            this.code += 1
            this.tile -= n
            if (this.miss != -1) {
                this.update(MineGridStatus.Over)
            } else if (this.tile == this.count) {
                this.update(MineGridStatus.Done)
            }
        }
    }
}
