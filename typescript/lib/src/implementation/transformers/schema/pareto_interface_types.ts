import * as p_ from 'pareto-core/implementation/transformer'
import type * as p_i from 'pareto-core/interface/transformer'
import p_unreachable_code_path from 'pareto-core/implementation/transformer/specials/unreachable_code_path'
import p_variables from 'pareto-core/implementation/refiner/specials/variables'

//schemas
import type * as s_in from "pareto-liana/modules/liana.generated/modules/schema/schemas/resolved"
import type * as s_out from "../../../interface/schemas/pareto_interface_resolved.js" //FIXME; this should be unresolved

namespace declarations {

    export type Schema = p_i.Transformer_With_Parameter<
        s_in.Schema,
        s_out.Package_Set.D,
        {
            'imports': s_in.Schema_Imports,
            'depth': number,
            'type':
            | ['unconstrained', null]
            | ['unresolved', null]
            | ['resolved', null]
        }
    >

    export type Module_Reference = p_i.Transformer<
        s_in.Module_Reference,
        s_out.Module_Reference
    >

    export type Value = p_i.Transformer_With_Parameter<
        s_in.Value,
        s_out.Value,
        {
            'type':
            | ['unconstrained', null]
            | ['unresolved', null]
            | ['resolved', null]
        }
    >

    export type Value_Results = p_i.Transformer_With_Parameter<
        s_in.Value_Results,
        s_out.Value,
        {
            'base type': s_out.Value
        }
    >

    export type Simple_Type = p_i.Transformer<
        s_in.Simple_Type,
        s_out.Value
    >

    export type Value_Path = p_i.Transformer<
        s_in.Value_Path,
        s_out.Value.reference.sub_selection
    >

}

//dependencies
import * as sh from "pareto/shorthands/interface/target"

const location = sh.t.component_imported(
    "location",
    "Range",
)

export const Schema: declarations.Schema = ($, $p) => {
    const add_location = $p.type[0] === 'unresolved'

    return sh.m.package_data(
        p_.from.dictionary(
            p_.literal.dictionary({
                "location": p_.literal.optionals_dictionary({
                    "": p_.from.boolean(
                        add_location,
                    ).decide(
                        () => p_.literal.set(
                            sh.import_.external(
                                "liana-core",
                                p_.literal.list([
                                    "dist",
                                    "interface",
                                    "to be generated",
                                    "document and location",
                                ])
                            )),
                        () => p_.literal.not_set(),
                    )
                }),
                "imports ": p_.from.dictionary($p.imports).map(
                    ($) => sh.import_.ancestor(
                        $p.depth + 1 + $['schema set child']['l value']['l up steps'],
                        $['schema set child']['l value']['l id'],
                        p_.from.state($.schema.complexity).decide(
                            ($) => {
                                switch ($[0]) {
                                    case 'unconstrained': return p_.option($, ($) => p_.literal.list([
                                        "data",
                                    ]))
                                    case 'constrained': return p_.option($, ($) => p_.from.state($p.type).decide(
                                        ($) => {
                                            switch ($[0]) {
                                                case 'unconstrained': return p_.option($, ($) => p_.literal.list([
                                                    "data",
                                                    "resolved",
                                                ]))
                                                case 'unresolved': return p_.option($, ($) => p_.literal.list([
                                                    "data",
                                                    "unresolved",
                                                ]))
                                                case 'resolved': return p_.option($, ($) => p_.literal.list([
                                                    "data",
                                                    "resolved",
                                                ]))
                                                default: return p_.exhaustive($[0])
                                            }
                                        }))
                                    default: return p_.exhaustive($[0])
                                }
                            }),
                    )
                )
            }),
        ).flatten(
            ($) => $,
            (parent_id, child_id) => parent_id + child_id,
            {
                duplicate_id: () => p_unreachable_code_path("the root keys are fixed; 'location' and 'imports'"),
            }

        ),
        p_.from.dictionary($.modules).map(
            ($) => sh.type.data(Value(
                $['root value'],
                {
                    'type': $p.type,
                }
            ))),
    )
}

export const Module_Reference: declarations.Module_Reference = ($) => p_.from.state($.location).decide(
    ($) => {
        switch ($[0]) {
            case 'internal': return p_.option($, ($) => sh.mr.local($['l id']))
            case 'external': return p_.option($, ($) => sh.mr.imported(
                "imports " + $.import['l id'],
                $.module['l id'],
            ))
            default: return p_.exhaustive($[0])
        }
    })



export const Value: declarations.Value = ($, $p) => {

    return p_.from.state($).decide(
        ($) => {
            switch ($[0]) {
                case 'component': return p_.option($, ($) => {
                    const x: s_out.Value = p_.from.state($.type).decide(
                        ($) => {
                            switch ($[0]) {
                                case 'external': return p_.option($, ($) => sh.t.component_imported(
                                    "imports " + $.import['l id'],
                                    $.module['l id'],
                                ))
                                case 'internal': return p_.option($, ($) => sh.t.component_sibling(
                                    $['l id'],
                                ))
                                case 'internal acyclic': return p_.option($, ($) => sh.t.component_sibling( //FIXME: is this correct?
                                    $['l id'],
                                ))
                                default: return p_.exhaustive($[0])
                            }
                        })
                    return $p.type[0] === 'resolved'
                        ? Value_Results(
                            $.results,
                            {
                                'base type': x,
                            }
                        )
                        : x
                })
                case 'dictionary': return p_.option($, ($) => $p.type[0] === 'unresolved'
                    ? sh.t.group(
                        p_.literal.dictionary({
                            "l location": location,
                            "l dictionary": sh.t.dictionary(
                                sh.t.group(
                                    p_.literal.dictionary({
                                        "l location": location,
                                        "l entry": Value(
                                            $.value,
                                            {
                                                'type': $p.type,
                                            }
                                        )
                                    })
                                )
                            )
                        })
                    )
                    : sh.t.dictionary(Value(
                        $.value,
                        $p
                    ))
                )
                case 'group': return p_.option($, ($) => sh.t.group(p_.from.dictionary($).map(
                    ($, id) => Value(
                        $.value,
                        {
                            'type': $p.type,
                        }
                    ))))
                case 'list': return p_.option($, ($) => {
                    const list = $

                    return p_.from.state($p.type).decide(
                        ($) => {
                            switch ($[0]) {
                                case 'unconstrained': return p_.option($, ($) => sh.t.list(Value(
                                    list.value,
                                    $p
                                )))
                                case 'unresolved': return p_.option($, ($) => sh.t.group(
                                    p_.literal.dictionary({
                                        "l location": location,
                                        "l list": sh.t.list(
                                            sh.t.group(
                                                p_.literal.dictionary({
                                                    "l location": location,
                                                    "l item": Value(
                                                        list.value,
                                                        $p
                                                    )
                                                })
                                            )
                                        )
                                    })
                                ))
                                case 'resolved': return p_.option($, ($) => Value_Results(
                                    list.results,
                                    {
                                        'base type': sh.t.list(
                                            p_.from.optional(list.results).decide(
                                                ($) => sh.t.group(
                                                    p_.literal.dictionary({
                                                        "l results": sh.t.group(
                                                            p_.from.dictionary($).map(
                                                                ($) => Value_Reference($)
                                                            )),
                                                        "l item": Value(
                                                            list.value,
                                                            $p
                                                        )
                                                    })
                                                ),
                                                () => Value(
                                                    list.value,
                                                    $p
                                                )
                                            )),
                                    }
                                ))
                                default: return p_.exhaustive($[0])
                            }
                        })
                }
                )
                case 'nothing': return p_.option($, ($) => sh.t.nothing())
                case 'simple': return p_.option($, ($) => p_.from.state($).decide(
                    ($) => {
                        switch ($[0]) {
                            case 'global': return p_.option($, ($) => Simple_Type($['l entry']))
                            default: return p_.exhaustive($[0])
                        }
                    }))
                case 'optional': return p_.option($, ($) => sh.t.optional(Value(
                    $,
                    $p
                )))
                case 'reference': return p_.option($, ($) => {
                    const referent = $.referent

                    return p_.from.state($.type).decide(
                        ($) => {
                            switch ($[0]) {
                                case 'derived': return p_.option($, ($) => $p.type[0] === 'unresolved'
                                    ? sh.t.nothing()
                                    : Value_Reference(referent)
                                )
                                case 'selected': return p_.option($, ($) => {
                                    const $v_selected = $
                                    return p_.from.state($p.type).decide(
                                        ($) => {
                                            switch ($[0]) {
                                                case 'unconstrained': return p_.option($, ($) => sh.t.group(
                                                    p_.literal.dictionary({ //this is weird; a reference in an unconstrained schema
                                                        "l location": location,
                                                        "l reference": sh.t.text(),
                                                    })
                                                ))
                                                case 'resolved': return p_.option($, ($) => {
                                                    return Value_Results(
                                                        $v_selected.results,
                                                        {
                                                            'base type': sh.t.group(
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
                                                                        sh.t.text()),
                                                                    "l up steps": p_.from.state($v_selected.dependency).decide(
                                                                        ($) => {
                                                                            switch ($[0]) {
                                                                                case 'acyclic': return p_.option($, ($) => p_.literal.not_set())
                                                                                case 'cyclic': return p_.option($, ($) => p_.literal.not_set())
                                                                                case 'stack': return p_.option($, ($) => p_.literal.set(
                                                                                    sh.t.natural()))
                                                                                default: return p_.exhaustive($[0])
                                                                            }
                                                                        })
                                                                })
                                                            ),
                                                        }
                                                    )
                                                })
                                                case 'unresolved': return p_.option($, ($) => sh.t.group(
                                                    p_.literal.dictionary({
                                                        "l location": location,
                                                        "l reference": sh.t.text(),
                                                    })
                                                ))
                                                default: return p_.exhaustive($[0])
                                            }
                                        })
                                })
                                default: return p_.exhaustive($[0])
                            }
                        })
                })
                case 'state': return p_.option($, ($) => {
                    const results = $.results
                    const i = sh.t.state(p_.from.dictionary($.options).map(
                        ($, id) => Value(
                            $.value,
                            $p
                        )))
                    return p_.from.state($p.type).decide(
                        ($) => {
                            switch ($[0]) {
                                case 'unconstrained': return p_.option($, ($) => i)
                                case 'unresolved': return p_.option($, ($) => sh.t.group(
                                    p_.literal.dictionary({
                                        "l location": location,
                                        "l state": i
                                    })
                                ))
                                case 'resolved': return p_.option($, ($) => Value_Results(
                                    results,
                                    {
                                        'base type': i,
                                    }
                                ))
                                default: return p_.exhaustive($[0])
                            }
                        })
                }
                )
                case 'text': return p_.option($, ($) => sh.t.text())
                default: return p_.exhaustive($[0])
            }
        })
}

const Value_Results: declarations.Value_Results = ($, $p) => {
    return p_.from.optional($).decide(
        ($) => sh.t.group(
            p_.literal.dictionary({
                "l results": sh.t.group(
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
    return sh.t.reference(
        Module_Reference($['module']),
        Value_Path($.path)
    )
}

const Value_Reference_temp = (
    $: s_in.Value_Reference,
    $p: {
        'type': "cyclic" | "acyclic"
    }
): s_out.Value => sh.t.reference(
    Module_Reference($['module']),
    p_.literal.chain(
        Value_Path($.path),
        sh.sub.dictionary(),
    ),
    $p.type,
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

export const Simple_Type: declarations.Simple_Type = ($) => {
    return p_.from.state($.type).decide(
        ($) => {
            switch ($[0]) {
                case 'boolean': return p_.option($, ($) => sh.t.boolean())
                case 'date': return p_.option($, ($) => sh.t.integer())
                case 'number': return p_.option($, ($) => p_.from.state($.precision).decide(
                    ($) => {
                        switch ($[0]) {
                            case 'approximation': return p_.option($, ($) => sh.t.number_approximation())
                            case 'exact': return p_.option($, ($) => p_.from.state($.type).decide(
                                ($) => {
                                    switch ($[0]) {
                                        case 'integer': return p_.option($, ($) => sh.t.integer())
                                        case 'natural': return p_.option($, ($) => sh.t.natural())
                                        case 'positive natural': return p_.option($, ($) => sh.t.natural())
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