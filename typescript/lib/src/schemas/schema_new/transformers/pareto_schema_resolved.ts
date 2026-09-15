import * as p_ from 'pareto-core/transformer'
import * as p_s from 'pareto-core/serializer'
import p_unreachable_code_path from 'pareto-core/transformer/specials/unreachable_code_path'
import p_variables from 'pareto-core/refiner/specials/variables'

//schemas
import type * as s_in from "../schema.js"
import type * as s_out from "pareto/modules/pareto_new/schemas/schema/schema" //FIXME; this should be unresolved

namespace s_parameters {
    export type Value_Reference_temp = {
        'type': "cyclic" | "acyclic"
    }
}

namespace declarations {

    export type Schema = p_.Transformer<
        s_in.Schema,
        s_out.Schema
    >

    export type Type_Reference = p_.Transformer<
        s_in.Module_Reference,
        s_out.Value.reference
    >

    export type Simple_Type = p_.Transformer<
        s_in.Simple_Type,
        s_out.Value
    >

    export type Value = p_.Transformer<
        s_in.Value,
        s_out.Value
    >

    export type Value_Results = p_.Transformer_With_Parameter<
        s_in.Value_Results,
        s_out.Value,
        {
            'base type': s_out.Value
        }
    >

    export type Value_Path = p_.Transformer<
        s_in.Value_Path,
        s_out.Value.reference['sub selection']
    >

}

//dependencies
import * as sh from "pareto/modules/pareto_new/schemas/schema/shorthands/target"

export const Schema: declarations.Schema = ($) => {

    return sh.schema(
        p_.literal.dictionary({
            // "imports ": p_.from.dictionary($p.imports).map(
            //     ($) => sh.import_.ancestor(
            //         $p.depth + 1 + $['schema set child']['l value']['l up steps'],
            //         $['schema set child']['l value']['l id'],
            //         p_.from.state($.schema.complexity).decide(
            //             ($) => {
            //                 switch ($[0]) {
            //                     case 'unconstrained': return p_.option($, ($) => p_.literal.list([
            //                         "data.js",
            //                     ]))
            //                     case 'constrained': return p_.option($, ($) => p_.from.state($p.type).decide(
            //                         ($) => {
            //                             switch ($[0]) {
            //                                 case 'unconstrained': return p_.option($, ($) => p_.literal.list([
            //                                     "data",
            //                                     "resolved.js",
            //                                 ]))
            //                                 case 'unresolved': return p_.option($, ($) => p_.literal.list([
            //                                     "data",
            //                                     "unresolved.js",
            //                                 ]))
            //                                 case 'resolved': return p_.option($, ($) => p_.literal.list([
            //                                     "data",
            //                                     "resolved.js",
            //                                 ]))
            //                                 default: return p_.exhaustive($[0])
            //                             }
            //                         }))
            //                     default: return p_.exhaustive($[0])
            //                 }
            //             }),
            //     )
            // )
        }),
        p_.from.dictionary($.modules).map(
            ($) => sh.type(Value(
                $['root value'],
            ))),
    )
}

export const Type_Reference: declarations.Type_Reference = ($) => p_.from.state($.location).decide(
    ($) => {
        switch ($[0]) {
            case 'internal': return p_.option($, ($): s_out.Value.reference => ({
                'type location': ['this schema', {
                    'type': "FOOO",
                }],
                'cyclic': true,
                'sub selection': p_.literal.list([])
            }))
            case 'external': return p_.option($, ($): s_out.Value.reference => ({
                'type location': ['this schema', {
                    'type': "FOOO",
                }],
                'cyclic': true,
                'sub selection': p_.literal.list([])
            }))
            default: return p_.exhaustive($[0])
        }
    }
)



export const Simple_Type: declarations.Simple_Type = ($) => {
    return p_.from.state($.type).decide(
        ($): s_out.Value => {
            switch ($[0]) {
                case 'boolean': return p_.option($, ($) => sh.v.boolean())
                case 'date': return p_.option($, ($) => sh.v.integer())
                case 'number': return p_.option($, ($) => p_.from.state($.precision).decide(
                    ($) => {
                        switch ($[0]) {
                            case 'approximation': return p_.option($, ($) => sh.v.number_approximation())
                            case 'exact': return p_.option($, ($) => p_.from.state($.type).decide(
                                ($) => {
                                    switch ($[0]) {
                                        case 'integer': return p_.option($, ($) => sh.v.integer())
                                        case 'natural': return p_.option($, ($) => sh.v.natural())
                                        case 'positive natural': return p_.option($, ($) => sh.v.natural())
                                        default: return p_.exhaustive($[0])
                                    }
                                }))
                            default: return p_.exhaustive($[0])
                        }
                    }))
                default: return p_.exhaustive($[0])
            }
        }
    )
}

export const Value: declarations.Value = ($) => {

    return p_.from.state($).decide(
        ($) => {
            switch ($[0]) {
                case 'component': return p_.option($, ($) => Value_Results(
                    $.results,
                    {
                        'base type': p_.from.state($.type).decide(
                            ($) => {
                                switch ($[0]) {
                                    case 'external': return p_.option($, ($) => sh.v.component_imported(
                                        "imports " + $.import['l id'],
                                        $.module['l id'],
                                    ))
                                    case 'internal': return p_.option($, ($) => sh.v.component_sibling(
                                        $['l id'],
                                    ))
                                    case 'internal acyclic': return p_.option($, ($) => sh.v.component_sibling( //FIXME: is this correct?
                                        $['l id'],
                                    ))
                                    default: return p_.exhaustive($[0])
                                }
                            }
                        ),
                    }
                ))
                case 'dictionary': return p_.option($, ($) => sh.v.dictionary(Value(
                    $.value,
                ))
                )
                case 'group': return p_.option($, ($) => sh.v.group(p_.from.dictionary($).map(
                    ($, id) => Value(
                        $.value,
                    ))))
                case 'list': return p_.option($, ($) => {
                    const list = $

                    return Value_Results(
                        list.results,
                        {
                            'base type': sh.v.list(
                                p_.from.optional(list.results).decide(
                                    ($) => sh.v.group(
                                        p_.literal.dictionary({
                                            "l results": sh.v.group(
                                                p_.from.dictionary($).map(
                                                    ($) => Value_Reference($)
                                                )),
                                            "l item": Value(
                                                list.value,
                                            )
                                        })
                                    ),
                                    () => Value(
                                        list.value,
                                    )
                                )),
                        }
                    )
                }
                )
                case 'nothing': return p_.option($, ($) => sh.v.nothing())
                case 'simple': return p_.option($, ($) => p_.from.state($).decide(
                    ($) => {
                        switch ($[0]) {
                            case 'global': return p_.option($, ($) => Simple_Type($['l entry']))
                            default: return p_.exhaustive($[0])
                        }
                    }))
                case 'optional': return p_.option($, ($) => sh.v.optional(Value(
                    $,
                )))
                case 'reference': return p_.option($, ($) => {
                    const referent = $.referent

                    return p_.from.state($.type).decide(
                        ($) => {
                            switch ($[0]) {
                                case 'derived': return p_.option($, ($) => Value_Reference(referent))
                                case 'selected': return p_.option($, ($) => {
                                    const $v_selected = $
                                    return Value_Results(
                                        $v_selected.results,
                                        {
                                            'base type': sh.v.group(
                                                p_.literal.optionals_dictionary<s_out.Value>({
                                                    "l entry": p_.literal.set(p_variables(() => {
                                                        return p_.from.state($v_selected.dependency).decide(
                                                            ($) => {
                                                                switch ($[0]) {

                                                                    case 'acyclic': return p_.option($, ($) => Value_Reference_temp(referent, { 'type': 'acyclic' }))
                                                                    case 'cyclic': return p_.option($, ($) => Value_Reference_temp(referent, { 'type': 'cyclic' }))
                                                                    case 'stack': return p_.option($, ($) => Value_Reference_temp(referent, { 'type': 'acyclic' }))
                                                                    default: return p_.exhaustive($[0])
                                                                }
                                                            })
                                                    })),
                                                    "l id": p_.literal.set(
                                                        sh.v.text()),
                                                    "l up steps": p_.from.state($v_selected.dependency).decide(
                                                        ($) => {
                                                            switch ($[0]) {
                                                                case 'acyclic': return p_.option($, ($) => p_.literal.not_set())
                                                                case 'cyclic': return p_.option($, ($) => p_.literal.not_set())
                                                                case 'stack': return p_.option($, ($) => p_.literal.set(
                                                                    sh.v.natural()))
                                                                default: return p_.exhaustive($[0])
                                                            }
                                                        })
                                                })
                                            ),
                                        }
                                    )
                                })
                                default: return p_.exhaustive($[0])
                            }
                        })
                })
                case 'state': return p_.option($, ($) => {
                    const results = $.results
                    const i = sh.v.state(p_.from.dictionary($.options).map(
                        ($, id) => Value(
                            $.value,
                        )))
                    return Value_Results(
                        results,
                        {
                            'base type': i,
                        }
                    )
                }
                )
                case 'text': return p_.option($, ($) => sh.v.text())
                default: return p_.exhaustive($[0])
            }
        })
}

const Value_Results: declarations.Value_Results = ($, $p) => {
    return p_.from.optional($).decide(
        ($) => sh.v.group(
            p_.literal.dictionary({
                "l results": sh.v.group(
                    p_.from.dictionary($).map(
                        ($) => Value_Reference($)
                    )
                ),
                "l value": $p['base type'],
            }),
        ),
        () => $p['base type']
    )
}

const Value_Reference = (
    $: s_in.Value_Reference,
): s_out.Value => {
    return sh.v.reference_to_local(
        "FOOOOX",
        p_.literal.list([]),
        'cyclic',
    )
}

const Value_Reference_temp = (
    $: s_in.Value_Reference,
    $p: s_parameters.Value_Reference_temp
): s_out.Value => sh.v.reference_to_local(
    "FOOOOX",
    p_.literal.list([]),
    'cyclic',
    // Type_Reference($['module']),
    // p_.literal.chain(
    //     Value_Path($.path),
    //     sh.sub.dictionary(),
    // ),
    // $p.type,
)

const Value_Path: declarations.Value_Path = ($) => {
    return p_.from.list($.tail['l value']).map(
        ($) => p_.from.state($['l item']['l value']).decide(
            ($) => {
                switch ($[0]) {
                    case 'dictionary': return p_.option($, ($) => sh.sub.dictionary())
                    case 'group': return p_.option($, ($) => sh.sub.group($['l id']))
                    case 'list': return p_.option($, ($) => sh.sub.list())
                    case 'optional': return p_.option($, ($) => sh.sub.optional())
                    case 'state': return p_.option($, ($) => sh.sub.state($['l id']))
                    default: return p_.exhaustive($[0])
                }
            }))
}