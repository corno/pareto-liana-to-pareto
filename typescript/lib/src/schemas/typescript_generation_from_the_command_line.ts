export type Error =
    | ['too many arguments', null]
    | ['missing', {
        'expected': Expected,
    }]
    | ['invalid source path', null]
    | ['processing', null]

type Expected =
    | ['source path', null]
    | ['target path', null]