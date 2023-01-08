import { MineData } from "./MineData";
import { MineGridStatus } from "./MineGridStatus";
import { MineMark } from "./MineMark";

export interface IMineGrid {
    get Status(): MineGridStatus
    get Version(): number   // 版本号 (用于界面刷新判断)
    get XMax(): number      // 网格宽度
    get YMax(): number      // 网格高度
    get FlagCount(): number // 标记的旗子数
    get MineCount(): number // 地雷总数
    Get(x: number, y: number): MineData             // 获取标记
    Set(x: number, y: number, mark: MineMark): void // 设置标记
    Remove(x: number, y: number): void              // 移除方块
}
