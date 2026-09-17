import * as p_ from 'pareto-core/transformer'

import * as s_source from "../schema.js"
import * as s_target from "pareto/modules/pareto_new/schemas/transformer/schema"

namespace declarations {

    export type Schema = p_.Transformer<
        s_source.Schema,
        s_target.Root
    >
    export type Value = p_.Transformer_With_Parameter<
        s_source.Value,
        s_target.Expression,
        {
            'temp value reference tail': s_target.Value_Reference.subselection
        }
    >

}

import * as sh from "pareto/modules/pareto_new/schemas/transformer/shorthands/target"

export const Schema: declarations.Schema = ($) => sh.root(
    false,
    sh.schema_reference.sr.external("astn-core", "serialization", "sealed target"),
    p_.literal.not_set(),
    p_.literal.dictionary({
        "primitives": sh.dependency.serializer.external(
            "liana-core",
            "serialization",
            "primitives",
        ), //"liana-core/modules/serialization/schemas/primitives/serializers"
    }),
    p_.literal.dictionary({
        //"primitives": sh.dependency.external("astn-core", "primitives"), //"liana-core/modules/serialization/schemas/primitives/serializers"
    }),
    p_.from.dictionary($.modules).map(
        ($) => sh.declaration(
            sh.schema_reference.value_reference(
                "Value",
                p_.literal.list([])
            ),
            p_.literal.not_set(),
        )
    ),
    p_.from.dictionary($.modules).map(
        ($) => sh.implementation(
            false,
            Value(
                $['root value'],
                {
                    'temp value reference tail': p_.literal.list([]),
                }
            )
        ),

    )
)


export const Value: declarations.Value = ($, $p) => p_.from.state($).decide(
    ($) => {
        switch ($[0]) {
            case 'component': return p_.option($, ($) => sh.expr.call(
                p_.from.state($.type).decide(
                    ($) => {
                        switch ($[0]) {
                            case 'external': return p_.option($, ($) => sh.expr.call_.external(
                                p_.literal.segmented_text([
                                    "external ",
                                    $.import['l id']
                                ]),
                                $.module['l id'])
                            )
                            case 'internal acyclic': return p_.option($, ($) => sh.expr.call_.local($['l id']))
                            case 'internal': return p_.option($, ($) => sh.expr.call_.local($['l id']))
                            default: return p_.exhaustive($[0])
                        }
                    }
                ),
                sh.value_selection.context_value(p_.from.optional($.results).decide(
                    ($) => p_.literal.list(["l value"]),
                    () => p_.literal.list([])
                )),
                null,
                // sh.lookups.not_set(),
                // p_.literal.not_set(),
            ))
            case 'dictionary': return p_.option($, ($) => sh.expr.literal.state(
                "dictionary",
                sh.expr.from.dictionary.map(
                    sh.value_selection.context_value(
                        p_.literal.list([])
                    ),
                    Value(
                        $.value,
                        {
                            'temp value reference tail': p_.literal.chain(
                                $p['temp value reference tail'],
                                sh.vr.dictionary(),
                            ),
                        }
                    )
                )
            ))
            case 'group': return p_.option($, ($) => sh.expr.literal.state(
                "group",
                sh.expr.literal.state(
                    "verbose",
                    sh.expr.literal.dictionary(
                        p_.from.dictionary($).map(
                            ($, id) => sh.expr.change_context(
                                sh.value_selection.context_value(
                                    p_.literal.list([
                                        id
                                    ])
                                ),
                                Value(
                                    $.value,
                                    {
                                        'temp value reference tail': p_.literal.chain(
                                            $p['temp value reference tail'],
                                            sh.vr.group(id),
                                        ),
                                    }
                                )
                            )
                        )
                    )
                )
            ))
            case 'list': return p_.option($, ($) => {

                const x = Value(
                    $.value,
                    {
                        'temp value reference tail': p_.literal.chain(
                            $p['temp value reference tail'],
                            sh.vr.list(),
                        ),
                    }
                )

                return sh.expr.literal.state(
                    "list",
                    sh.expr.from.list.map(
                        sh.value_selection.context_value(p_.from.optional($.results).decide(
                            ($) => p_.literal.list(["l value"]),
                            () => p_.literal.list([])
                        )),
                        p_.from.optional($.results).decide(
                            ($) => sh.expr.change_context(
                                sh.value_selection.context_value(
                                    p_.literal.list(["l item"])
                                ),
                                x,
                            ),
                            () => x
                        )
                    )
                )
            })
            case 'nothing': return p_.option($, ($) => sh.expr.literal.state(
                "nothing",
                sh.expr.literal.nothing()
            ))
            case 'simple': return p_.option($, ($) => p_.from.state($).decide(
                ($) => {
                    switch ($[0]) {
                        case 'global': return p_.option($, ($) => {
                            return p_.from.state($['l entry'].type).decide(
                                ($) => {
                                    switch ($[0]) {
                                        case 'boolean': return p_.option($, ($) => sh.expr.literal.state(
                                            "text",
                                            sh.expr.literal.group(
                                                p_.literal.dictionary({
                                                    "delimiter": sh.expr.literal.state(
                                                        "none",
                                                        sh.expr.literal.nothing()
                                                    ),
                                                    "value": sh.expr.call(
                                                        sh.expr.call_.external("primitives", "true false"),
                                                        sh.value_selection.context_value(
                                                            p_.literal.list([])
                                                        ),
                                                        null,
                                                        // sh.lookups.not_set(),
                                                        // sh.arguments_.not_set(),
                                                        // p_.literal.list([]),
                                                    ),
                                                })
                                            )
                                        ))
                                        case 'date': return p_.option($, ($) => sh.expr.literal.state(
                                            "text",
                                            sh.expr.literal.group(
                                                p_.literal.dictionary({
                                                    "delimiter": sh.expr.literal.state(
                                                        "none", sh.expr.literal.nothing()),
                                                    "value": sh.expr.call(
                                                        sh.expr.call_.external("primitives", "iso date udhr"),
                                                        sh.value_selection.context_value(
                                                            p_.literal.list([])
                                                        ),
                                                        null,
                                                        // sh.lookups.not_set(),
                                                        // sh.arguments_.not_set(),
                                                    ),
                                                })
                                            )
                                        ))
                                        case 'number': return p_.option($, ($) => sh.expr.literal.state(
                                            "text",
                                            sh.expr.literal.group(
                                                p_.literal.dictionary({
                                                    "delimiter": sh.expr.literal.state(
                                                        "none",
                                                        sh.expr.literal.nothing()
                                                    ),
                                                    "value": p_.from.state($.precision).decide(
                                                        ($) => {
                                                            switch ($[0]) {
                                                                case 'approximation': return p_.option($, ($) => sh.expr.call(
                                                                    sh.expr.call_.external(
                                                                        "primitives",
                                                                        "scientific notation"
                                                                    ),
                                                                    sh.value_selection.context_value(
                                                                        p_.literal.list([])
                                                                    ),
                                                                    sh.expr.literal.dictionary(
                                                                        p_.literal.dictionary({
                                                                            "digits": sh.expr.implement_me("DIGITS"),
                                                                            // "digits": sh.a.number.natural_literal(
                                                                            //     $['significant digits']
                                                                            // )
                                                                        })
                                                                    ),
                                                                ))
                                                                case 'exact': return p_.option($, ($) => p_.from.optional($['number of fractional digits']).decide(
                                                                    ($) => sh.expr.call(
                                                                        sh.expr.call_.external("primitives", "fractional decimal"),
                                                                        sh.value_selection.context_value(
                                                                            p_.literal.list([])
                                                                        ),
                                                                        sh.expr.literal.dictionary(
                                                                            p_.literal.dictionary({
                                                                                "number of fractional digits": sh.expr.implement_me("NUMBER OF FRACTIONAL DIGITS"),
                                                                                // "number of fractional digits": sh.a.number.natural_literal(
                                                                                //     $
                                                                                // )
                                                                            })
                                                                        ),
                                                                    ),
                                                                    () => sh.expr.call(
                                                                        sh.expr.call_.external("primitives", "decimal"),
                                                                        sh.value_selection.context_value(
                                                                            p_.literal.list([])
                                                                        ),
                                                                        null,
                                                                    )
                                                                ))
                                                                default: return p_.exhaustive($[0])
                                                            }
                                                        }
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
                }
            ))
            case 'optional': return p_.option($, ($) => sh.expr.literal.state(
                "optional",
                sh.expr.from.optional.decide(
                    sh.value_selection.context_value(
                        p_.literal.list([])
                    ),
                    p_.literal.set(sh.schema_reference.value_reference(
                        "Value",
                        p_.literal.list([
                            sh.vr.state("optional")
                        ])
                    )),
                    sh.expr.literal.state(
                        "set",
                        Value(
                            $,
                            {
                                'temp value reference tail': p_.literal.chain(
                                    $p['temp value reference tail'],
                                    sh.vr.optional(),
                                ),
                            }
                        ),
                    ),
                    sh.expr.literal.state(
                        "not set",
                        sh.expr.literal.nothing()
                    ),
                )
            ))
            case 'reference': return p_.option($, ($) => p_.from.state($.type).decide(
                ($) => {
                    switch ($[0]) {
                        case 'derived': return p_.option($, ($) => sh.expr.literal.state(
                            "nothing",
                            sh.expr.literal.nothing()
                        ))
                        case 'selected': return p_.option($, ($) => sh.expr.literal.state(
                            "text",
                            sh.expr.literal.group(
                                p_.literal.dictionary({
                                    "delimiter": sh.expr.literal.state(
                                        "apostrophe",
                                        sh.expr.literal.nothing()),
                                    "value": sh.expr.selection(
                                        sh.value_selection.context_value(p_.from.optional($.results).decide(
                                            ($) => p_.literal.list(["l value", "l id"]),
                                            () => p_.literal.list(["l id"])
                                        ))
                                    )
                                })
                            )
                        ))
                        default: return p_.exhaustive($[0])
                    }
                }
            ))
            case 'state': return p_.option($, ($) => sh.expr.literal.state(
                "state",
                sh.expr.from.state.decide(
                    sh.value_selection.context_value(
                        p_.from.optional($.results).decide(
                            ($) => p_.literal.list(["l value"]),
                            () => p_.literal.list([])
                        )
                    ),
                    p_.literal.set(sh.schema_reference.value_reference(
                        "Value",
                        p_.literal.list([
                            sh.vr.state("state")
                        ])
                    )),
                    p_.from.dictionary($.options).map(
                        ($, id) => sh.expr.literal.group(
                            p_.literal.dictionary({
                                "option": sh.expr.literal.reference(id),
                                "value": Value(
                                    $.value,
                                    {
                                        'temp value reference tail': p_.literal.chain(
                                            $p['temp value reference tail'],
                                            sh.vr.state(id),
                                        ),
                                    }
                                )
                            })
                        )
                    ),
                )
            ))
            case 'text': return p_.option($, ($) => sh.expr.literal.state(
                "text",
                sh.expr.literal.group(
                    p_.literal.dictionary({
                        "delimiter": sh.expr.literal.state(
                            "quote",
                            sh.expr.literal.nothing()),
                        "value": sh.expr.selection(
                            sh.value_selection.context_value(
                                p_.literal.list([])
                            )
                        ),

                    })
                )
            ))
            default: return p_.exhaustive($[0])
        }
    }
)