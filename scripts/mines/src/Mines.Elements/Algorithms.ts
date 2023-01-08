export abstract class Algorithms {
    /**
     * 洗牌算法
     */
    static shuffle<T>(array: T[]): void {
        let random = () => Math.random() * array.length
        for (var i = 0; i < array.length; i++) {
            let x = random()
            let a = array[x]
            array[i] = array[x]
            array[x] = a
        }
    }

    /**
     * 展开二维数组索引到一维数组索引
     */
    static flatten(w: number, h: number) {
        if (w < 0 || h < 0)
            throw RangeError()
        let closure = (x: number, y: number) => {
            if (x < 0 || y < 0 || x >= w || y >= h)
                throw RangeError()
            return y * w + x
        }
        return closure
    }

    static * adjacent(w: number, h: number, x: number, y: number): Generator<[number, number]> {
        if (w < 0 || h < 0 || x < 0 || y < 0 || x >= w || y >= h)
            throw RangeError()
        let l = x > 0 ? -1 : 0
        let t = y > 0 ? -1 : 0
        let r = x < w - 1 ? 1 : 0
        let b = y < h - 1 ? 1 : 0
        for (var v = t; v <= b; v++) {
            for (var i = l; i <= r; i++) {
                if (v != 0 || i != 0)
                    yield [x + i, y + v]
            }
        }
    }
}
