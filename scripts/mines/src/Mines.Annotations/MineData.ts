export enum MineData {
    Num0 = 0,           // 显示的数字 (周围雷个数)
    Num1,
    Num2,
    Num3,
    Num4,
    Num5,
    Num6,
    Num7,
    Num8,
    Tile = 0x40,        // 尚未翻开的方块
    Mine,
    Flag,
    What,
    MineMiss = 0x81,    // Game Over 的那颗雷
    FlagMiss,           // 标记错误的旗子
    WhatMiss,           // 标记错误的问号
}
