export const EnablePostNamazu = true;

export const jobOrder: Record<number, number> = Object.fromEntries(
  [
    21, // '战士',
    32, //'DK',

    37, //'枪刃',
    19, //'骑士',

    24, //'白魔',
    33, //'占星',
    40, //'贤者',
    28, //'学者',

    34, //'武士',
    22, //'龙骑',

    30, //'忍者',
    20, //'武僧',
    39, //'钐刀',
    25, //'黑魔',

    23, //'诗人',
    31, //'机工',
    38, //'舞者',

    35, //'赤魔',
    27, //'召唤',
  ].map((v, i) => [v, i])
);

export const DisablePostNamazu = !EnablePostNamazu;
