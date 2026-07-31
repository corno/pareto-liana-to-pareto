import * as p_ from 'pareto-core/implementation/transformer'
import type * as p_i from 'pareto-core/interface/transformer'
import type * as p_di from 'pareto-core/interface/schema'
import p_unreachable_code_path from 'pareto-core/implementation/transformer/specials/unreachable_code_path'


//schemas
import type * as s_in from "pareto-liana/modules/schema.generated/schemas/resolved/schema"

import type * as s_out from "../../../schemas/pareto_implementation_resolved.js"
namespace declarations {

    export type Schema = p_i.Transformer_With_Parameter<
        s_in.Schema,
        s_out.Package_Set.D,
        {
            'path': p_di.List<string>,
            'depth': number,
        }
    >

    export type Value = p_i.Transformer_With_Parameter<
        s_in.Value,
        s_out.Assign,
        {
            'type': string
            'subselection': p_di.List<s_out.Temp_Value_Type_Specification.sub_selection.L>
        }
    >

}

//shorthands
import * as sh from "pareto/shorthands/implementation/target"
import * as sh_i from "pareto/shorthands/interface/target"

export const Schema: declarations.Schema = ($, $p) => {
    const constrained = $.complexity[0] === 'constrained'

    return sh.m.package_(
        p_.literal.list([
            'change context',
            'text from list'
        ]),
        p_.literal.dictionary({
            "signatures": sh_i.import_.ancestor(
                $p.depth,
                "interface",
                p_.literal.segmented_list([
                    p_.literal.list([
                        "generated",
                        "liana",
                        "schemas"
                    ]),
                    $p.path,
                    p_.literal.list([
                        "signatures"
                    ]),
                    constrained
                        ? p_.literal.list([
                            "resolved"
                        ])
                        : p_.literal.list([
                        ]),
                    p_.literal.list([
                        "transformers",
                        "astn sealed target"
                    ])
                ])
            ),
            "out": sh_i.import_.external(
                "astn-core",
                p_.literal.list([
                    "dist",
                    "interface",
                    "generated",
                    "liana",
                    "schemas",
                    "sealed target",
                    "data",
                ]),
            ),

        }),
        p_.from.dictionary(
            p_.literal.dictionary({
                "": p_.literal.dictionary({
                    "primitives to text": sh_i.import_.external(
                        "liana-core",
                        p_.literal.list([
                            "dist",
                            "implementation",
                            "manual",
                            "transformers",
                            "primitives",
                            "text",
                        ]),
                    ),
                }),
                "external ": p_.from.dictionary($['schema imports']).map(
                    ($, id) => constrained
                        ? sh_i.import_.ancestor(
                            3,
                            $['schema set child']['l value']['l id'],
                            p_.literal.list(["resolved", "transformers", "astn sealed target"])
                        )
                        : sh_i.import_.ancestor(
                            2,
                            $['schema set child']['l value']['l id'],
                            p_.literal.list(["transformers", "astn sealed target"])
                        )
                ),
            }),
        ).flatten(
            ($) => $,
            (parent_id, child_id) => parent_id + child_id,
            {
                duplicate_id: () => p_unreachable_code_path("the root keys are fixed; '' and 'external'"),
            }

        ),
        p_.from.dictionary($.modules).map(
            ($, id) => sh.algorithm(
                "signatures",
                id,
                p_.literal.list([]),
                Value(
                    $['root value'],
                    {
                        'type': id,
                        'subselection': p_.literal.list([])
                    }
                ),
            )),
    )
}

export const Value: declarations.Value = ($, $p) => p_.from.state($).decide(
    ($) => {
        switch ($[0]) {
            case 'component': return p_.option($, ($) => sh.a.select(
                sh.sv.call(
                    p_.from.state($.type).decide(
                        ($) => {
                            switch ($[0]) {
                                case 'external': return p_.option($, ($) => sh.call.external(`external ${$.import['l id']}`, $.module['l id']))
                                case 'internal acyclic': return p_.option($, ($) => sh.call.local($['l id']))
                                case 'internal': return p_.option($, ($) => sh.call.local($['l id']))
                                default: return p_.exhaustive($[0])
                            }
                        }),
                    sh.a.select(
                        sh.sv.context(p_.from.optional($.results).decide(
                            ($) => p_.literal.list(["l value"]),
                            () => p_.literal.list([])
                        ))),
                    null,
                    sh.lookups.not_set(),
                    sh.arguments_.not_set(),
                    p_.literal.list([]),
                )
            ))
            case 'dictionary': return p_.option($, ($) => sh.a.state.literal(
                "dictionary",
                sh.a.dictionary.from.dictionary.map(
                    sh.sv.context(
                        p_.literal.list([])
                    ),
                    Value(
                        $.value,
                        {
                            'type': $p.type,
                            'subselection': p_.literal.chain(
                                $p.subselection,
                                sh.sub.dictionary(),
                            ),
                        }
                    )
                )
            ))
            case 'group': return p_.option($, ($) => sh.a.state.literal(
                "group",
                sh.a.state.literal(
                    "verbose",
                    sh.a.dictionary.literal(p_.from.dictionary($).map(
                        ($, id) => sh.a.change_context(
                            sh.sv.context(
                                p_.literal.list([
                                    id
                                ])
                            ),
                            Value(
                                $.value,
                                {
                                    'type': $p.type,
                                    'subselection': p_.literal.chain(
                                        $p.subselection,
                                        sh.sub.group(id),
                                    ),
                                }
                            )
                        )))
                )
            ))
            case 'list': return p_.option($, ($) => {

                const x = Value(
                    $.value,
                    {
                        'type': $p.type,
                        'subselection': p_.literal.chain(
                            $p.subselection,
                            sh.sub.list(),
                        ),
                    }
                )

                return sh.a.state.literal(
                    "list",
                    sh.a.list.from.list.map(
                        sh.sv.context(p_.from.optional($.results).decide(
                            ($) => p_.literal.list(["l value"]),
                            () => p_.literal.list([])
                        )),
                        p_.from.optional($.results).decide(
                            ($) => sh.a.change_context(
                                sh.sv.context(
                                    p_.literal.list(["l item"])
                                ),
                                x,
                            ),
                            () => x
                        )
                    )
                )
            })
            case 'nothing': return p_.option($, ($) => sh.a.state.literal(
                "nothing",
                sh.a.nothing()
            ))
            case 'simple': return p_.option($, ($) => p_.from.state($).decide(
                ($) => {
                    switch ($[0]) {
                        case 'global': return p_.option($, ($) => {
                            return p_.from.state($['l entry'].type).decide(
                                ($) => {
                                    switch ($[0]) {
                                        case 'boolean': return p_.option($, ($) => sh.a.state.literal(
                                            "text",
                                            sh.a.group.literal(
                                                p_.literal.dictionary({
                                                    "delimiter": sh.a.state.literal(
                                                        "none", sh.a.nothing()),
                                                    "value": sh.a.select(
                                                        sh.sv.call(
                                                            sh.call.external("primitives to text", "true false"),
                                                            sh.a.select(
                                                                sh.sv.context(
                                                                    p_.literal.list([])
                                                                )
                                                            ),
                                                            null,
                                                            sh.lookups.not_set(),
                                                            sh.arguments_.not_set(),
                                                            p_.literal.list([]),
                                                        )
                                                    ),
                                                })
                                            )
                                        ))
                                        case 'date': return p_.option($, ($) => sh.a.state.literal(
                                            "text",
                                            sh.a.group.literal(
                                                p_.literal.dictionary({
                                                    "delimiter": sh.a.state.literal(
                                                        "none", sh.a.nothing()),
                                                    "value": sh.a.select(
                                                        sh.sv.call(
                                                            sh.call.external("primitives to text", "iso date udhr"),
                                                            sh.a.select(
                                                                sh.sv.context(
                                                                    p_.literal.list([])
                                                                )
                                                            ),
                                                            null,
                                                            sh.lookups.not_set(),
                                                            sh.arguments_.not_set(),
                                                            p_.literal.list([]),
                                                        )
                                                    ),
                                                })
                                            )
                                        ))
                                        case 'number': return p_.option($, ($) => sh.a.state.literal(
                                            "text",
                                            sh.a.group.literal(
                                                p_.literal.dictionary({
                                                    "delimiter": sh.a.state.literal(
                                                        "none",
                                                        sh.a.nothing()
                                                    ),
                                                    "value": sh.a.select(
                                                        p_.from.state($.precision).decide(
                                                            ($) => {
                                                                switch ($[0]) {
                                                                    case 'approximation': return p_.option($, ($) => sh.sv.call(
                                                                        sh.call.external("primitives to text", "scientific notation"),
                                                                        sh.a.select(
                                                                            sh.sv.context(
                                                                                p_.literal.list([])
                                                                            )
                                                                        ),
                                                                        null,
                                                                        sh.lookups.not_set(),
                                                                        sh.arguments_.initialize(
                                                                            p_.literal.dictionary({
                                                                                "digits": sh.a.number.natural_literal(
                                                                                    $['significant digits']
                                                                                )
                                                                            }),
                                                                        ),
                                                                        p_.literal.list([]),
                                                                    ))
                                                                    case 'exact': return p_.option($, ($) => p_.from.optional($['number of fractional digits']).decide(
                                                                        ($) => sh.sv.call(
                                                                            sh.call.external("primitives to text", "fractional decimal"),
                                                                            sh.a.select(
                                                                                sh.sv.context(
                                                                                    p_.literal.list([])
                                                                                )),
                                                                            null,
                                                                            sh.lookups.not_set(),
                                                                            sh.arguments_.initialize(
                                                                                p_.literal.dictionary({
                                                                                    "number of fractional digits": sh.a.number.natural_literal(
                                                                                        $
                                                                                    )
                                                                                }),
                                                                            ),
                                                                            p_.literal.list([]),
                                                                        ),
                                                                        () => sh.sv.call(
                                                                            sh.call.external("primitives to text", "decimal"),
                                                                            sh.a.select(
                                                                                sh.sv.context(
                                                                                    p_.literal.list([])
                                                                                )),
                                                                            null,
                                                                            sh.lookups.not_set(),
                                                                            sh.arguments_.not_set(),
                                                                            p_.literal.list([]),
                                                                        )
                                                                    ))
                                                                    default: return p_.exhaustive($[0])
                                                                }
                                                            }
                                                        )
                                                    ),
                                                })
                                            )
                                        ))

                                        default: return p_.exhaustive($[0])
                                    }
                                })
                        })
                        default: return p_.exhaustive($[0])
                    }
                }))

            case 'optional': return p_.option($, ($) => sh.a.state.literal(
                "optional",
                sh.a.decide.optional(
                    sh.sv.context(
                        p_.literal.list([])
                    ),
                    sh.a.state.literal(
                        "set",
                        Value(
                            $,
                            {
                                'type': $p.type,
                                'subselection': p_.literal.chain(
                                    $p.subselection,
                                    sh.sub.optional(),
                                ),
                            }
                        ),
                    ),
                    sh.a.state.literal(
                        "not set",
                        sh.a.nothing()
                    ),
                    sh.type_node_reference(
                        "out",
                        "Value",
                        p_.literal.list([
                            sh.sub.state("optional")
                        ])
                    ),
                )))
            case 'reference': return p_.option($, ($) => p_.from.state($.type).decide(
                ($) => {
                    switch ($[0]) {
                        case 'derived': return p_.option($, ($) => sh.a.state.literal(
                            "nothing",
                            sh.a.nothing()
                        ))
                        case 'selected': return p_.option($, ($) => sh.a.state.literal(
                            "text",
                            sh.a.group.literal(
                                p_.literal.dictionary({
                                    "delimiter": sh.a.state.literal(
                                        "apostrophe",
                                        sh.a.nothing()),
                                    "value": sh.a.text.copy(
                                        sh.sv.context(p_.from.optional($.results).decide(
                                            ($) => p_.literal.list(["l value", "l id"]),
                                            () => p_.literal.list(["l id"])
                                        ))),
                                })
                            )
                        ))
                        default: return p_.exhaustive($[0])
                    }
                }))
            case 'state': return p_.option($, ($) => sh.a.state.literal(
                "state",
                sh.a.decide.state(
                    sh.sv.context(p_.from.optional($.results).decide(
                        ($) => p_.literal.list(["l value"]),
                        () => p_.literal.list([])
                    )),
                    p_.from.dictionary($.options).map(
                        ($, id) => sh.a.group.literal(
                            p_.literal.dictionary({
                                "option": sh.a.text.literal(id, 'identifier'),
                                "value": Value(
                                    $.value,
                                    {
                                        'type': $p.type,
                                        'subselection': p_.literal.chain(
                                            $p.subselection,
                                            sh.sub.state(id),
                                        ),
                                    }
                                )
                            })
                        )
                    ),
                    sh.type_node_reference(
                        "out",
                        "Value",
                        p_.literal.list([
                            sh.sub.state("state")
                        ])
                    ),
                )
            ))
            case 'text': return p_.option($, ($) => sh.a.state.literal(
                "text",
                sh.a.group.literal(
                    p_.literal.dictionary({
                        "delimiter": sh.a.state.literal(
                            "quote",
                            sh.a.nothing()),
                        "value": sh.a.text.copy(
                            sh.sv.context(
                                p_.literal.list([])
                            )),
                    })
                )
            ))
            default: return p_.exhaustive($[0])
        }
    })