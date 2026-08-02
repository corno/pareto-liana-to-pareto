import * as p_ from 'pareto-core/implementation/transformer'
import type * as p_i from 'pareto-core/interface/transformer'
import type * as p_di from 'pareto-core/interface/schema'
import p_unreachable_code_path from 'pareto-core/implementation/transformer/specials/unreachable_code_path'

//schemas
import type * as s_in from "pareto-liana/modules/schema.generated/schemas/resolved/schema"
import type * as s_out_interface from "pareto/modules/interface_old/schemas/resolved/schema"

import type * as s_out from "pareto/modules/implementation_old/schemas/resolved/schema"
namespace declarations {

    export type Schema = p_i.Transformer_With_Parameter<
        s_in.Schema,
        s_out.Package_Set.D,
        {
            'depth': number,
            'path': p_di.List<string>,
        }
    >

    export type Value = p_i.Transformer_With_Parameter<
        s_in.Value,
        s_out.Assign,
        {
            'temp type': string,
            'temp subselection': p_di.List<s_out_interface.Value.reference.sub_selection.L>,
            'constrained': boolean,
        }
    >
}

//shorthands
import * as sh from "pareto/modules/implementation_old/schemas/resolved/shorthands/target"
import * as sh_i from "pareto/modules/interface_old/schemas/resolved/shorthands/target"

//dependencies

const location = sh.a.select(
    sh.sv.call(
        sh.call.external("parse tree to location", "Value"),
        sh.a.select(
            sh.sv.context(
                p_.literal.list([])
            )),
        null,
        sh.lookups.not_set(),
        sh.arguments_.initialize(
            p_.literal.dictionary({
                "subdocument context": sh.a.optional.not_set(),
            }),
        ),
        p_.literal.list([]),
    )
)

export const Schema: declarations.Schema = ($, $p) => {
    const constrained = $.complexity[0] === 'constrained'
    return sh.m.package_(
        p_.literal.list(['change context', 'list from text', 'variables']),
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
                        "signatures",
                    ]),
                    $.complexity[0] === 'constrained'
                        ? p_.literal.list(["unresolved"])
                        : p_.literal.list([]),
                    p_.literal.list([
                        "refiners",
                        "astn parse tree"
                    ]),
                ]),
            ),
            "out": sh_i.import_.ancestor(
                $p.depth,
                "interface",
                p_.literal.segmented_list([
                    p_.literal.list([
                        "generated",
                        "liana",
                        "schemas"
                    ]),
                    $p.path,
                    $.complexity[0] === 'constrained'
                        ? p_.literal.list(["data", "unresolved"])
                        : p_.literal.list(["data"]),
                ]),
            ),
        }),
        p_.from.dictionary(
            p_.literal.dictionary({
                "": p_.literal.dictionary({

                    "unmarshalled from parse tree": sh_i.import_.external(
                        "liana-core",
                        p_.literal.list([
                            "dist",
                            "implementation",
                            "manual",
                            "refiners",
                            "unmarshalled",
                            "astn parse tree"
                        ])
                    ),
                    "parse tree to location": sh_i.import_.external(
                        "liana-core",
                        p_.literal.list([
                            "dist",
                            "implementation",
                            "manual",
                            "transformers",
                            "parse tree",
                            "start token range"
                        ])
                    ),
                }),
                "external ": p_.from.dictionary($['schema imports']).map(
                    ($, id) => constrained
                        ? sh_i.import_.ancestor(
                            3,
                            $['schema set child']['l value']['l id'],
                            p_.literal.list(["unresolved", "refiners", "astn parse tree"])
                        )
                        : sh_i.import_.ancestor(
                            2,
                            $['schema set child']['l value']['l id'],
                            p_.literal.list(["refiners", "astn parse tree"])
                        )
                ),
            }),
        ).flatten(
            ($) => $,
            (parent_id, child_id) => parent_id + child_id,
            {
                duplicate_id: () => p_unreachable_code_path("the keys in the root entry with the empty id do not conflict with the other key: 'external '")
            }
        ),
        p_.from.dictionary($.modules).map(
            ($, id) => sh.algorithm(
                "signatures",
                id,
                p_.literal.list(['abort']),
                Value(
                    $['root value'],
                    {
                        'temp type': id,
                        'temp subselection': p_.literal.list([]),
                        'constrained': constrained
                    }
                ),
            )),
    )
}

export const Value: declarations.Value = ($, $p) => {
    return p_.from.state($).decide(
        ($) => {
            switch ($[0]) {
                case 'component': return p_.option($, ($) => {
                    return sh.a.select(
                        sh.sv.call(
                            p_.from.state($.type).decide(
                                ($) => {
                                    switch ($[0]) {
                                        case 'external': return p_.option($, ($) => sh.call.external(`external ${$.import['l id']}`, $.module['l id']))
                                        case 'internal': return p_.option($, ($) => sh.call.local($['l id']))
                                        case 'internal acyclic': return p_.option($, ($) => sh.call.local($['l id']))
                                        default: return p_.exhaustive($[0])
                                    }
                                }),
                            sh.a.select(
                                sh.sv.context(
                                    p_.literal.list([])
                                )),
                            sh.a.select(
                                sh.sv.context(
                                    p_.literal.list([])
                                )),
                            sh.lookups.not_set(),
                            sh.arguments_.not_set(),
                            p_.literal.list([]),
                        )
                    )
                })
                case 'dictionary': return p_.option($, ($) => {
                    return sh.a.change_context(
                        sh.sv.call(
                            sh.call.external("unmarshalled from parse tree", "Dictionary"),
                            sh.a.select(
                                sh.sv.context(
                                    p_.literal.list([])
                                )),
                            sh.a.select(
                                sh.sv.context(
                                    p_.literal.list([])
                                )),
                            sh.lookups.not_set(),
                            sh.arguments_.initialize(
                                p_.literal.dictionary({
                                    "subdocument context": sh.a.optional.not_set(),
                                }),
                            ),
                            p_.literal.list([]),
                        ),
                        $p.constrained
                            ? sh.a.group.literal(
                                p_.literal.dictionary({
                                    "l location": sh.a.select(
                                        sh.sv.call(
                                            sh.call.external("parse tree to location", "Value"),
                                            sh.a.select(
                                                sh.sv.context(
                                                    p_.literal.list([
                                                        "value"
                                                    ])
                                                )),
                                            null,
                                            sh.lookups.not_set(),
                                            sh.arguments_.initialize(
                                                p_.literal.dictionary({
                                                    "subdocument context": sh.a.optional.not_set(),
                                                }),
                                            ),
                                            p_.literal.list([]),
                                        )
                                    ),
                                    "l dictionary": sh.a.dictionary.from.dictionary.map(
                                        sh.sv.context(
                                            p_.literal.list(["entries"])
                                        ),
                                        sh.a.group.literal(
                                            p_.literal.dictionary({
                                                "l location": location,
                                                "l entry": Value(
                                                    $.value,
                                                    {
                                                        'temp type': $p['temp type'],
                                                        'temp subselection': p_.literal.segmented_list([
                                                            $p['temp subselection'],
                                                            p_.literal.list([
                                                                sh_i.sub.group("l dictionary"),
                                                                sh_i.sub.dictionary(),
                                                                sh_i.sub.group("l entry"),

                                                            ])
                                                        ]),
                                                        'constrained': $p.constrained
                                                    }
                                                )
                                            }),
                                        )
                                    )
                                })
                            )
                            : sh.a.dictionary.from.dictionary.map(
                                sh.sv.context(
                                    p_.literal.list(["entries"])
                                ),
                                Value(
                                    $.value,
                                    {
                                        'temp type': $p['temp type'],
                                        'temp subselection': p_.literal.chain(
                                            $p['temp subselection'],
                                            sh_i.sub.dictionary(),
                                        ),
                                        'constrained': $p.constrained
                                    }
                                ),
                            )
                    )
                })
                case 'group': return p_.option($, ($) => sh.a.change_context(
                    sh.sv.call(
                        sh.call.external("unmarshalled from parse tree", "Verbose Group"),
                        sh.a.select(
                            sh.sv.context(
                                p_.literal.list([])
                            )),
                        sh.a.select(
                            sh.sv.context(
                                p_.literal.list([])
                            )),
                        sh.lookups.not_set(),
                        sh.arguments_.initialize(
                            p_.literal.dictionary({
                                "expected properties": sh.a.dictionary.literal(
                                    p_.from.dictionary($).map(
                                        ($) => sh.a.nothing()
                                    )
                                ),
                                "subdocument context": sh.a.optional.not_set(),
                            }),
                        ),
                        p_.literal.list([]),
                    ),
                    sh.a.variables(
                        p_.literal.dictionary({
                            "verbose group range": sh.a.select(
                                sh.sv.call(
                                    sh.call.external("parse tree to location", "Value"),
                                    sh.a.select(
                                        sh.sv.context(
                                            p_.literal.list(["value"])
                                        )),
                                    null,
                                    sh.lookups.not_set(),
                                    sh.arguments_.initialize(
                                        p_.literal.dictionary({
                                            "subdocument context": sh.a.optional.not_set(),
                                        }),
                                    ),
                                    p_.literal.list([]),
                                )
                            ),
                        }),
                        sh.a.group.literal(p_.from.dictionary($).map(
                            ($, id) => sh.a.change_context(
                                sh.sv.call(
                                    sh.call.external("unmarshalled from parse tree", "Property"),
                                    sh.a.select(
                                        sh.sv.context(
                                            p_.literal.list([])
                                        )),
                                    sh.a.select(
                                        sh.sv.context(
                                            p_.literal.list([])
                                        )),
                                    sh.lookups.not_set(),
                                    sh.arguments_.initialize(
                                        p_.literal.dictionary({
                                            "id": sh.a.text.literal(id, 'identifier'),
                                            "subdocument context": sh.a.optional.not_set(),
                                        }),
                                    ),
                                    p_.literal.list([]),
                                ),
                                Value(
                                    $.value,
                                    {
                                        'temp type': $p['temp type'],
                                        'temp subselection': p_.literal.chain(
                                            $p['temp subselection'],
                                            sh_i.sub.group(id),
                                        ),
                                        'constrained': $p.constrained
                                    }
                                )
                            )))
                    ),
                ))
                case 'list': return p_.option($, ($) => {
                    return $p.constrained
                        ? sh.a.group.literal(
                            p_.literal.dictionary({
                                "l location": location,
                                "l list": sh.a.list.from.list.map(
                                    sh.sv.call(
                                        sh.call.external("unmarshalled from parse tree", "List"),
                                        sh.a.select(
                                            sh.sv.context(
                                                p_.literal.list([])
                                            )),
                                        sh.a.select(
                                            sh.sv.context(
                                                p_.literal.list([])
                                            )),
                                        sh.lookups.not_set(),
                                        sh.arguments_.initialize(
                                            p_.literal.dictionary({
                                                "subdocument context": sh.a.optional.not_set(),
                                            }),
                                        ),
                                        p_.literal.list([
                                            "items"
                                        ]),
                                    ),
                                    sh.a.change_context(
                                        sh.sv.context(
                                            p_.literal.list(["value"])
                                        ),
                                        sh.a.group.literal(
                                            p_.literal.dictionary({
                                                "l location": location,
                                                "l item": Value(
                                                    $.value,
                                                    {
                                                        'temp type': $p['temp type'],
                                                        'temp subselection': p_.literal.segmented_list([
                                                            $p['temp subselection'],
                                                            p_.literal.list([
                                                                sh_i.sub.group("l list"),
                                                                sh_i.sub.list(),
                                                                sh_i.sub.group("l item"),
                                                            ])
                                                        ]),
                                                        'constrained': $p.constrained
                                                    }
                                                )
                                            })
                                        )
                                    )
                                )
                            })
                        )
                        : sh.a.list.from.list.map(
                            sh.sv.call(
                                sh.call.external("unmarshalled from parse tree", "List"),
                                sh.a.select(
                                    sh.sv.context(
                                        p_.literal.list([])
                                    )),
                                sh.a.select(
                                    sh.sv.context(
                                        p_.literal.list([])
                                    )),
                                sh.lookups.not_set(),
                                sh.arguments_.initialize(
                                    p_.literal.dictionary({
                                        "subdocument context": sh.a.optional.not_set(),
                                    }),
                                ),
                                p_.literal.list([
                                    "items"
                                ]),
                            ),
                            sh.a.change_context(
                                sh.sv.context(
                                    p_.literal.list(["value"])
                                ),
                                Value(
                                    $.value,
                                    {
                                        'temp type': $p['temp type'],
                                        'temp subselection': p_.literal.chain(
                                            $p['temp subselection'],
                                            sh_i.sub.list(),
                                        ),
                                        'constrained': $p.constrained
                                    }
                                )
                            ),
                        )
                })
                case 'nothing': return p_.option($, ($) => sh.a.select(
                    sh.sv.call(
                        sh.call.external("unmarshalled from parse tree", "Nothing"),
                        sh.a.select(
                            sh.sv.context(
                                p_.literal.list([])
                            )),
                        sh.a.select(
                            sh.sv.context(
                                p_.literal.list([])
                            )),
                        sh.lookups.not_set(),
                        sh.arguments_.not_set(),
                        p_.literal.list([]),
                    )
                ))
                case 'simple': return p_.option($, ($) => p_.from.state($).decide(
                    ($) => {
                        switch ($[0]) {
                            case 'global': return p_.option($, ($) => p_.from.state($['l entry'].type).decide(
                                ($) => {
                                    switch ($[0]) {
                                        case 'boolean': return p_.option($, ($) => sh.a.select(
                                            sh.sv.call(
                                                sh.call.external("unmarshalled from parse tree", "Boolean"),
                                                sh.a.select(
                                                    sh.sv.context(
                                                        p_.literal.list([])
                                                    )),

                                                sh.a.select(
                                                    sh.sv.context(
                                                        p_.literal.list([])
                                                    )),
                                                sh.lookups.not_set(),
                                                sh.arguments_.initialize(
                                                    p_.literal.dictionary({
                                                        "type": sh.a.state.literal(
                                                            "true/false",
                                                            sh.a.nothing()
                                                        ),
                                                        "subdocument context": sh.a.optional.not_set(),
                                                    }),
                                                ),
                                                p_.literal.list([]),
                                            ),
                                        ))
                                        case 'date': return p_.option($, ($) => sh.a.select(
                                            sh.sv.call(
                                                sh.call.external("unmarshalled from parse tree", "Number"),
                                                sh.a.select(
                                                    sh.sv.context(
                                                        p_.literal.list([])
                                                    )),

                                                sh.a.select(
                                                    sh.sv.context(
                                                        p_.literal.list([])
                                                    )),
                                                sh.lookups.not_set(),
                                                sh.arguments_.initialize(
                                                    p_.literal.dictionary({
                                                        "type": sh.a.state.literal(
                                                            "iso date",
                                                            sh.a.nothing()
                                                        ),
                                                        "subdocument context": sh.a.optional.not_set(),
                                                    }),
                                                ),
                                                p_.literal.list([]),
                                            ),
                                        ))
                                        case 'number': return p_.option($, ($) => sh.a.select(
                                            sh.sv.call(
                                                sh.call.external(
                                                    "unmarshalled from parse tree",
                                                     "Number"
                                                    ),
                                                sh.a.select(
                                                    sh.sv.context(
                                                        p_.literal.list([])
                                                    )),
                                                sh.a.select(
                                                    sh.sv.context(
                                                        p_.literal.list([])
                                                    )),
                                                sh.lookups.not_set(),
                                                sh.arguments_.initialize(
                                                    p_.literal.dictionary({
                                                        "type": p_.from.state($.precision).decide(
                                                            ($) => {
                                                                switch ($[0]) {
                                                                    case 'approximation': return p_.option($, ($) => sh.a.state.literal(
                                                                        "scientific notation",
                                                                        sh.a.group.literal(
                                                                            p_.literal.dictionary({
                                                                                "precision": sh.a.number.natural_literal($['significant digits']),
                                                                            })
                                                                        )
                                                                    ))
                                                                    case 'exact': return p_.option($, ($) => p_.from.optional($['number of fractional digits']).decide(
                                                                        ($) => sh.a.state.literal(
                                                                            "fractional decimal",
                                                                            sh.a.group.literal(
                                                                                p_.literal.dictionary({
                                                                                    "digits": sh.a.number.natural_literal($),
                                                                                })
                                                                            )
                                                                        ),
                                                                        () => sh.a.state.literal(
                                                                            "decimal",
                                                                            sh.a.nothing()
                                                                        )
                                                                    ))
                                                                    default: return p_.exhaustive($[0])
                                                                }
                                                            }),
                                                        "subdocument context": sh.a.optional.not_set(),
                                                    }),
                                                ),
                                                p_.literal.list([]),
                                            ),
                                        ))
                                        default: return p_.exhaustive($[0])
                                    }
                                }))
                            default: return p_.exhaustive($[0])
                        }
                    }))
                case 'optional': return p_.option($, ($) => sh.a.optional.map(
                    sh.sv.call(
                        sh.call.external("unmarshalled from parse tree", "Optional"),
                        sh.a.select(
                            sh.sv.context(
                                p_.literal.list([])
                            )
                        ),
                        sh.a.select(
                            sh.sv.context(
                                p_.literal.list([])
                            )
                        ),
                        sh.lookups.not_set(),
                        sh.arguments_.not_set(),
                        p_.literal.list([
                            "optional",
                        ]),
                    ),
                    Value(
                        $,
                        {
                            'temp type': $p['temp type'],
                            'temp subselection': p_.literal.chain(
                                $p['temp subselection'],
                                sh_i.sub.optional(),
                            ),
                            'constrained': $p.constrained
                        }
                    ),
                ))
                case 'reference': return p_.option($, ($) => p_.from.state($.type).decide(
                    ($) => {
                        switch ($[0]) {
                            case 'derived': return p_.option($, ($) => sh.a.select(
                                sh.sv.call(
                                    sh.call.external("unmarshalled from parse tree", "Nothing"),
                                    sh.a.select(
                                        sh.sv.context(
                                            p_.literal.list([])
                                        )),
                                    sh.a.select(
                                        sh.sv.context(
                                            p_.literal.list([])
                                        )),
                                    sh.lookups.not_set(),
                                    sh.arguments_.not_set(),
                                    p_.literal.list([]),
                                )
                            ))
                            case 'selected': return p_.option($, ($) => sh.a.group.literal(
                                p_.literal.dictionary({
                                    "l location": location,
                                    "l reference": sh.a.select(
                                        sh.sv.call(
                                            sh.call.external("unmarshalled from parse tree", "Text"),
                                            sh.a.select(
                                                sh.sv.context(
                                                    p_.literal.list([])
                                                )),
                                            sh.a.select(
                                                sh.sv.context(
                                                    p_.literal.list([])
                                                )),
                                            sh.lookups.not_set(),
                                            sh.arguments_.not_set(),
                                            p_.literal.list([]),
                                        )
                                    ),
                                })
                            ))
                            default: return p_.exhaustive($[0])
                        }
                    }))
                case 'state': return p_.option($, ($) => sh.a.change_context(
                    sh.sv.call(
                        sh.call.external("unmarshalled from parse tree", "State"),
                        sh.a.select(
                            sh.sv.context(
                                p_.literal.list([])
                            )),
                        sh.a.select(
                            sh.sv.context(
                                p_.literal.list([])
                            )),
                        sh.lookups.not_set(),
                        sh.arguments_.not_set(),
                        p_.literal.list([]),
                    ),
                    sh.a.decide.text(
                        sh.sv.context(
                            p_.literal.list(["option", "token", "value"])
                        ),
                        p_.from.dictionary($.options).map(
                            ($, id) => sh.a.change_context(
                                sh.sv.context(
                                    p_.literal.list(["value"])
                                ),
                                $p.constrained
                                    ? sh.a.group.literal(
                                        p_.literal.dictionary({
                                            "l location": location,
                                            "l state": sh.a.state.literal(
                                                id,
                                                Value(
                                                    $.value,
                                                    {
                                                        'temp type': $p['temp type'],
                                                        'temp subselection': p_.literal.segmented_list([
                                                            $p['temp subselection'],
                                                            p_.literal.list([
                                                                sh_i.sub.group("l state"),
                                                                sh_i.sub.state(id),
                                                            ])
                                                        ]),
                                                        'constrained': $p.constrained
                                                    }
                                                )
                                            )
                                        })
                                    )
                                    : sh.a.state.literal(
                                        id,
                                        Value(
                                            $.value,
                                            {
                                                'temp type': $p['temp type'],
                                                'temp subselection': p_.literal.chain(
                                                    $p['temp subselection'],
                                                    sh_i.sub.state(id),
                                                ),
                                                'constrained': $p.constrained
                                            }
                                        )
                                    )
                            ),
                        ),
                        sh.a.abort(
                            sh.a.state.literal(
                                "liana", sh.a.group.literal(
                                    p_.literal.dictionary({
                                        "type": sh.a.state.literal(
                                            "state", sh.a.state.literal(
                                                "unknown option",
                                                sh.a.select(
                                                    sh.sv.context(
                                                        p_.literal.list([
                                                            "option",
                                                            "token",
                                                            "value"
                                                        ])
                                                    )))),
                                        "range": sh.a.select(
                                            sh.sv.call(
                                                sh.call.external("parse tree to location", "Value"),
                                                sh.a.select(
                                                    sh.sv.context(
                                                        p_.literal.list([
                                                            "value"
                                                        ])
                                                    )),
                                                null,
                                                sh.lookups.not_set(),
                                                sh.arguments_.initialize(
                                                    p_.literal.dictionary({
                                                        "subdocument context": sh.a.optional.not_set(),
                                                    }),
                                                ),
                                                p_.literal.list([]),
                                            )
                                        ),
                                    }))
                            )),
                        sh.type_node_reference("out", $p['temp type'], $p['temp subselection']))
                ))
                case 'text': return p_.option($, ($) => sh.a.select(
                    sh.sv.call(
                        sh.call.external("unmarshalled from parse tree", "Text"),
                        sh.a.select(
                            sh.sv.context(
                                p_.literal.list([])
                            )),
                        sh.a.select(
                            sh.sv.context(
                                p_.literal.list([])
                            )),
                        sh.lookups.not_set(),
                        sh.arguments_.not_set(),
                        p_.literal.list([]),
                    )
                ))
                default: return p_.exhaustive($[0])
            }
        })
}
