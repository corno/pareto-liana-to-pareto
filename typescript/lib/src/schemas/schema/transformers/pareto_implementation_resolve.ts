import * as p_ from 'pareto-core/implementation/transformer'
import type * as p_i from 'pareto-core/interface/transformer'
import type * as p_di from 'pareto-core/interface/schema'
import p_unreachable_code_path from 'pareto-core/implementation/transformer/specials/unreachable_code_path'

//schemas
import type * as s_in from "../schema.js"

import type * as s_out from "pareto/modules/implementation_old/schemas/resolved/schema"
namespace declarations {

    export type Resolver_Modules = p_i.Transformer_With_Parameter<
        s_in.Resolver_Modules,
        s_out.Package_Set.D,
        {
            'path': p_di.List<string>,
            'imports': s_in.Resolver_Imports,
            'depth': number,
        }
    >

    export type Possible_Value_Selection = p_i.Transformer_With_Parameter<
        s_in.Resolver_Possible_Value_Selection,
        s_out.Select_Value,
        {
            'tail': p_di.List<s_out.Select_Value.regular.tail.L>
        }
    >

    export type Optional_Value_Initialization = p_i.Transformer<
        s_in.Resolver_Optional_Value_Initialization,
        s_out.Assign
    >

    export type Value_Constraint = p_i.Transformer<
        s_in.Resolver_Value_Constraint,
        s_out.Assign
    >

    export type Constraint = p_i.Transformer<
        s_in.Resolver_Constraint,
        s_out.Assign
    >

}

//shorthands
import * as sh from "pareto/modules/implementation_old/schemas/resolved/shorthands/target"
import * as sh_i from "pareto/modules/interface_old/schemas/resolved/shorthands/target"

const temp_prepend = <T extends p_di.Value>(
    $: p_di.Dictionary<T>,
    prefix: string
) => {
    const result: { [id: string]: T } = {}
    p_.from.dictionary($).map(
        ($, id) => {
            result[prefix + id] = $
            return null
        })
    return p_.literal.dictionary(result)
}

const no_such_entry_error = sh.a.group.literal(
    p_.literal.dictionary({
        "type": sh.a.state.literal(
            "lookup",
            sh.a.state.literal(
                "no such entry",
                sh.a.select(
                    sh.sv.context(
                        p_.literal.list(["l reference"])
                    ))
            )
        ),
        "location": sh.a.select(
            sh.sv.context(
                p_.literal.list(["l location"])
            )),
    })
)

const no_context_lookup_error = sh.a.group.literal(
    p_.literal.dictionary({
        "type": sh.a.state.literal(
            "lookup",
            sh.a.state.literal(
                "no context lookup",
                sh.a.nothing()
            )
        ),
        "location": sh.a.select(
            sh.sv.context(
                p_.literal.list(["l location"])
            )),
    })
)

const cycle_detected_error = sh.a.group.literal(
    p_.literal.dictionary({
        "type": sh.a.state.literal(
            "lookup",
            sh.a.state.literal(
                "cycle detected",
                sh.a.nothing()
            )
        ),
        "location": sh.a.select(
            sh.sv.context(
                p_.literal.list(["l location"])
            )),
    })
)

export const Resolver_Modules: declarations.Resolver_Modules = ($, $p) => {
    return sh.m.package_(
        p_.literal.list(['change context', 'variables', 'lookups', 'unreachable code path']),
        p_.literal.dictionary({
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
                    p_.literal.list(["data", "resolved"])
                ])
            ),
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
                        "resolved",
                        "refiners",
                        "unresolved",
                    ]),
                ])
            ),
        }),
        p_.from.dictionary(
            p_.literal.dictionary({
                "external ": p_.from.dictionary($p.imports).map(
                    ($, id) => sh_i.import_.ancestor(
                        3,
                        $['schema set child']['l value']['l id'],
                        p_.literal.list([
                            "resolved",
                            "refiners",
                            "unresolved"
                        ])
                    )
                )
            }),
        ).flatten(
            ($) => $,
            (parent_id, child_id) => parent_id + child_id,
            {
                duplicate_id: () => p_unreachable_code_path("there is only one root key, 'external '"),
            }

        ),
        p_.from.dictionary($).map(
            ($, id) => sh.algorithm(
                "signatures",
                id,
                p_.literal.list(['abort', 'lookups', 'parameters']),
                Resolver_Value(
                    $['root value resolver'],
                    {
                        'temp type': id,
                        'temp subselection': p_.literal.list([])
                    }
                ),
            ))
    )
}



export const Possible_Value_Selection: declarations.Possible_Value_Selection = ($, $p) => {
    return p_.from.state($).decide(
        ($) => {
            switch ($[0]) {
                case 'parameter': return p_.option($, ($) => sh.sv.parameter($['l id'], $p.tail))
                case 'result': return p_.option($, ($) => p_.from.state($).decide(
                    ($) => {
                        switch ($[0]) {
                            case 'state': return p_.option($, ($) => sh.sv.implement_me("IM: STATE2")) //quite some work
                            case 'optional value': return p_.option($, ($) => sh.sv.implement_me("IM: OPTIONAL VALUE2")) //quite some work

                            default: return p_.exhaustive($[0])
                        }
                    }))

                default: return p_.exhaustive($[0])
            }
        })
}


export const Optional_Value_Initialization: declarations.Optional_Value_Initialization = ($) => p_.from.state($).decide(
    ($) => {
        switch ($[0]) {
            case 'not set': return p_.option($, ($) => sh.a.optional.not_set())
            case 'selection': return p_.option($, ($) => sh.a.select(Possible_Value_Selection($, { 'tail': p_.literal.list([]) })))
            case 'set': return p_.option($, ($) => sh.a.optional.set(
                sh.a.select(Resolver_Guaranteed_Value_Selection(
                    $,
                    {
                        'tail': p_.literal.list([])
                    }
                ))))
            default: return p_.exhaustive($[0])
        }
    })

export const Resolver_Guaranteed_Value_Selection = (
    $: s_in.Resolver_Guaranteed_Value_Selection,
    $p: {
        'tail': p_di.List<s_out.Select_Value.regular.tail.L>
    },
): s_out.Select_Value => {
    const tail = (): p_di.List<s_out.Select_Value.regular.tail.L> => p_.literal.segmented_list([
        p_.from.list($.tail.path['l value']).flatten(
            ($) => p_.from.state($['l item']).decide(
                ($): p_di.List<s_out.Select_Value.regular.tail.L> => {
                    switch ($[0]) {
                        case 'component': return p_.option($, ($) => p_.literal.list([]))
                        case 'group': return p_.option($, ($) => p_.literal.list([$['l id']]))
                        case 'reference': return p_.option($, ($) => p_.from.state($.definition.type).decide(
                            ($) => {
                                switch ($[0]) {
                                    case 'derived': return p_.option($, ($) => p_.literal.list([]))
                                    case 'selected': return p_.option($, ($) => p_.literal.list(["l entry"]))
                                    default: return p_.exhaustive($[0])
                                }
                            }))
                        default: return p_.exhaustive($[0])
                    }
                })
        ),
        $p.tail
    ])
    return p_.from.state($.start).decide(
        ($) => {
            switch ($[0]) {
                case 'constraint': return p_.option($, ($) => p_.from.state($).decide(
                    ($) => {
                        switch ($[0]) {
                            case 'component': return p_.option($, ($) => sh.sv.implement_me("IM: COMPONENT")) //simple
                            case 'reference': return p_.option($, ($) => sh.sv.sibling(
                                $.property['l id'],
                                p_.literal.list([
                                    "l results",
                                    $.constraint['l id']
                                ])
                            )) //simple
                            default: return p_.exhaustive($[0])
                        }
                    }))
                case 'list cursor': return p_.option($, ($) => sh.sv.implement_me("IM: LIST CURSOR"))
                case 'linked entry': return p_.option($, ($) => sh.sv.variable("referenced entry", tail()))
                case 'parameter': return p_.option($, ($) => sh.sv.parameter(
                    $['l id'],
                    p_.literal.list([])
                ))
                case 'parent sibling': return p_.option($, ($) => sh.sv.implement_me("IM: PARENT SIBLING"))
                case 'option constraint': return p_.option($, ($) => sh.sv.variable("constraint " + $['l id'], tail()))
                case 'result': return p_.option($, ($) => p_.from.state($).decide(
                    ($) => {
                        switch ($[0]) {
                            case 'state': return p_.option($, ($) => sh.sv.implement_me("IM: STATE"))  // quite some work
                            case 'optional value': return p_.option($, ($) => sh.sv.implement_me("IM: OPTIONAL VALUE")) // quite some work
                            case 'list': return p_.option($, ($) => sh.sv.implement_me("IM: LIST")) // quite some work
                            default: return p_.exhaustive($[0])
                        }
                    }))
                case 'sibling': return p_.option($, ($) => sh.sv.sibling($['l id'], tail()))
                default: return p_.exhaustive($[0])
            }
        })
}

export const Resolver_Lookup_Selection = (
    $: s_in.Resolver_Lookup_Selection,
): s_out.Select_Lookup => p_.from.state($.type).decide(
    ($) => {
        switch ($[0]) {
            case 'acyclic': return p_.option($, ($) => p_.from.state($).decide(
                ($) => {
                    switch ($[0]) {
                        case 'resolved dictionary': return p_.option($, ($) => sh.sl.acyclic.resolved_dictionary(
                            Resolver_Guaranteed_Value_Selection(
                                $.selection,
                                {
                                    'tail': p_.literal.list([]),
                                }
                            )
                        ))
                        case 'siblings': return p_.option($, ($) => sh.sl.acyclic.siblings())
                        default: return p_.exhaustive($[0])
                    }
                }))
            case 'cyclic': return p_.option($, ($) => p_.from.state($).decide(
                ($) => {
                    switch ($[0]) {
                        case 'siblings': return p_.option($, ($) => sh.sl.cyclic.siblings())

                        default: return p_.exhaustive($[0])
                    }
                }))
            case 'parameter': return p_.option($, ($) => sh.sl.from_parameter($['l id']))
            default: return p_.exhaustive($[0])
        }
    })

export const Option_Constraints = (
    $: s_in.Resolver_Option_Constraints,
    $p: {
        sub: s_out.Assign
    },
): s_out.Assign => p_.from.dictionary($).on_has_entries(
    ($) => sh.a.variables(
        p_.from.dictionary(
            temp_prepend($, "constraint "),
        ).map(
            ($, id) => p_.from.state($).decide(
                ($) => {
                    switch ($[0]) {
                        case 'state': return p_.option($, ($) => sh.a.decide.state_single(
                            sh.sv.context(
                                p_.literal.list([])
                            ),
                            $.option['l id'],
                            sh.a.select(
                                sh.sv.context(
                                    p_.literal.list([])
                                )),
                            sh.a.abort(
                                sh.a.group.literal(
                                    p_.literal.dictionary({
                                        "type": sh.a.state.literal(
                                            "option constraint",
                                            sh.a.state.literal(
                                                "no such option",
                                                sh.a.text.literal($.option['l id'], 'freeform')
                                            )
                                        ),
                                        "location": sh.a.select(
                                            sh.sv.variable(
                                                "location",
                                                p_.literal.list([])
                                            ))
                                    })
                                )
                            ),
                            null,
                            // sh.type_node_reference("out", $p['sub'], p_.literal.list([]))

                        ))
                        case 'assert is set': return p_.option($, ($) => sh.a.decide.optional(
                            Possible_Value_Selection($, { 'tail': p_.literal.list([]) }),
                            sh.a.select(
                                sh.sv.context(
                                    p_.literal.list([])
                                )),
                            sh.a.abort(
                                sh.a.group.literal(
                                    p_.literal.dictionary({
                                        "type": sh.a.state.literal(
                                            "constraint",
                                            sh.a.state.literal(
                                                "optional value is not set",
                                                sh.a.nothing(),
                                            )
                                        ),
                                        "location": sh.a.select(
                                            sh.sv.variable(
                                                "location",
                                                p_.literal.list([])
                                            ))
                                    })
                                ),
                            ),
                            // null,
                            // sh.type_node_reference("out", $p['sub'] as any as string, p_.literal.list([]))
                        ))
                        default: return p_.exhaustive($[0])
                    }
                })
        ),
        $p.sub
    ),
    () => $p.sub
)


//  sh.a.variables(
//     // {
//     //         switch ($[0]) {
//     //     case 'assert is set': return p_.option($, ($) => sh.a.decide.optional(
//     //         Possible_Value_Selection($, { 'tail': () => p_.literal.list([]) }),
//     //         sh.a.select(
// sh.sv.context(
// p_.literal.list([])
// )),
//     //         sh.a.implement_me("IM: assert is set"),
//     //         sh.type_node_reference("out", $p['sub'] as any as string, p_.literal.list([]))
//     //     ))
//     //     case 'state': return p_.option($, ($) => sh.a.implement_me("IM: state constraint")) // medium work
//     //     default: return p_.exhaustive($[0])
//     // }
//     $.__ decide(),
//     $p.sub
//  )


export const Resolver_Value = (
    $: s_in.Resolver_Value,
    $p: {
        'temp type': string
        'temp subselection': p_di.List<s_out.Temp_Value_Type_Specification.sub_selection.L> //can be removed when pareto has type inference
    },
): s_out.Assign => p_.from.state($).decide(
    ($) => {
        switch ($[0]) {

            case 'component': return p_.option($, ($) => {

                // const results = $.definition.results

                return Value_Results(
                    $.definition.results,
                    {
                        'base type': sh.a.select(
                            sh.sv.call(
                                p_.from.state($.location).decide(
                                    ($) => {
                                        switch ($[0]) {
                                            case 'external': return p_.option($, ($) => sh.call.external("external " + $['resolver import']['l id'], $.signature['l id']))
                                            case 'internal': return p_.option($, ($) => sh.call.local($['l id']))
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
                                p_.from.optional($.arguments).decide(
                                    ($) => p_.from.optional($.lookups).decide(
                                        ($) => sh.lookups.initialize(p_.from.dictionary($).map(
                                            ($) => p_.from.state($).decide(
                                                ($) => {
                                                    switch ($[0]) {
                                                        case 'acyclic': return p_.option($, ($) => p_.from.state($).decide(
                                                            ($) => {
                                                                switch ($[0]) {
                                                                    case 'not set': return p_.option($, ($) => sh.sl.acyclic.not_set())
                                                                    default: return p_.exhaustive($[0])
                                                                }
                                                            }))
                                                        case 'cyclic': return p_.option($, ($) => p_.from.state($).decide(
                                                            ($) => {
                                                                switch ($[0]) {
                                                                    case 'not set': return p_.option($, ($) => sh.sl.cyclic.not_set())
                                                                    default: return p_.exhaustive($[0])
                                                                }
                                                            }))
                                                        case 'stack': return p_.option($, ($) => p_.from.state($).decide(
                                                            ($) => {
                                                                switch ($[0]) {
                                                                    case 'empty': return p_.option($, ($) => sh.sl.stack.empty())
                                                                    case 'push': return p_.option($, ($) => sh.sl.stack.push(
                                                                        Resolver_Lookup_Selection($['stack']),
                                                                        Resolver_Lookup_Selection($['item']),
                                                                    ))
                                                                    default: return p_.exhaustive($[0])
                                                                }
                                                            }))
                                                        case 'selection': return p_.option($, ($) => Resolver_Lookup_Selection($))
                                                        default: return p_.exhaustive($[0])
                                                    }
                                                }),
                                        )),
                                        () => sh.lookups.pass_through()
                                    ),
                                    () => sh.lookups.not_set()
                                ),
                                p_.from.optional($.arguments).decide(
                                    ($) => p_.from.optional($.modules).decide(
                                        ($) => sh.arguments_.initialize(p_.from.dictionary($).map(
                                            ($) => p_.from.state($).decide(
                                                ($) => {
                                                    switch ($[0]) {
                                                        case 'optional': return p_.option($, ($) => Optional_Value_Initialization($))
                                                        case 'required': return p_.option($, ($) => sh.a.select(
                                                            Resolver_Guaranteed_Value_Selection(
                                                                $,
                                                                {
                                                                    'tail': p_.literal.list([]),
                                                                }
                                                            )
                                                        ))
                                                        case 'parameter': return p_.option($, ($) => sh.a.select(
                                                            sh.sv.parameter(
                                                                $['l id'],
                                                                p_.literal.list([])
                                                            )
                                                        ))
                                                        default: return p_.exhaustive($[0])
                                                    }
                                                }),
                                        )),
                                        () => sh.arguments_.pass_through()
                                    ),
                                    () => sh.arguments_.not_set()
                                ),
                                p_.literal.list([]),
                            )
                        )
                    }
                )
            })
            case 'dictionary': return p_.option($, ($) => {
                const resolver = $.resolver
                return p_.from.optional($.benchmark).decide(
                    ($) => sh.a.dictionary.from.dictionary.resolve( //FIXME: validate denseness
                        sh.sv.context(
                            p_.literal.list(["l dictionary"])
                        ),
                        sh.a.change_context(
                            sh.sv.context(
                                p_.literal.list(["l entry"])
                            ),
                            sh.a.variables(
                                p_.literal.dictionary({
                                    "location": sh.a.select(
                                        sh.sv.context(
                                            p_.literal.list(["l location"])
                                        )
                                    ),
                                    "referenced entry": sh.a.implement_me("IM: referenced entry"),
                                }),
                                Resolver_Value(
                                    resolver,
                                    {
                                        'temp type': $p['temp type'],
                                        'temp subselection': p_.literal.chain(
                                            $p['temp subselection'],
                                            sh_i.sub.dictionary(),
                                        ),
                                    }

                                )
                            )
                        ),
                        sh.type_node_reference("out", $p['temp type'], p_.literal.chain(
                            $p['temp subselection'],
                            sh_i.sub.dictionary(),
                        ))

                    ),
                    () => sh.a.dictionary.from.dictionary.resolve(
                        sh.sv.context(
                            p_.literal.list(["l dictionary"])
                        ),
                        sh.a.change_context(
                            sh.sv.context(
                                p_.literal.list(["l entry"])
                            ),
                            Resolver_Value(
                                $.resolver,
                                {
                                    'temp type': $p['temp type'],
                                    'temp subselection': p_.literal.chain(
                                        $p['temp subselection'],
                                        sh_i.sub.dictionary(),
                                    ),
                                }

                            )
                        ),
                        sh.type_node_reference("out", $p['temp type'], p_.literal.chain(
                            $p['temp subselection'],
                            sh_i.sub.dictionary(),
                        ))

                    )
                )
            })
            case 'group': return p_.option($, ($) => sh.a.group.literal_resolve(
                p_.from.dictionary($).map(
                    ($, id) => sh.a.change_context(
                        sh.sv.context(
                            p_.literal.list([id])
                        ),
                        Resolver_Value(
                            $.resolver,
                            {
                                'temp type': $p['temp type'],
                                'temp subselection': p_.literal.chain(
                                    $p['temp subselection'],
                                    sh_i.sub.group(id)
                                ),
                            }
                        )
                    )
                )
            ))
            case 'list': return p_.option($, ($) => {
                const resolver: s_in.Resolver_Value = $.resolver
                return p_.from.optional($.result).decide(
                    ($) => sh.a.group.literal(
                        p_.literal.dictionary({
                            "l value": sh.a.list.from.list.map_with_state(
                                sh.sv.context(
                                    p_.literal.list(["l list"])
                                ),
                                sh.a.implement_me("IM: initial state"),
                                sh.a.group.literal(
                                    p_.literal.dictionary({
                                        "l item": sh.a.change_context(
                                            sh.sv.context(
                                                p_.literal.list(["l item"])
                                            ),
                                            Resolver_Value(
                                                resolver,
                                                {
                                                    'temp type': $p['temp type'],
                                                    'temp subselection': p_.literal.segmented_list([
                                                        $p['temp subselection'],
                                                        p_.literal.list([
                                                            sh_i.sub.group("l value"),
                                                            sh_i.sub.list(),
                                                            sh_i.sub.group("l item"),
                                                        ])
                                                    ]),
                                                }
                                            ),
                                        ),
                                        "l result": sh.a.implement_me("IM: result aggregation") //depends on the aggregation
                                    }),
                                ),
                                sh.a.implement_me("IM: update state"),
                                sh.a.implement_me("IM: wrapup"),
                            ),
                            "l results": sh.a.group.literal(
                                p_.literal.dictionary({
                                    "result": sh.a.implement_me("IM: result aggregation") //this one is hardcode for now
                                })
                            ),
                        }),
                    ),
                    () => sh.a.list.from.list.map(
                        sh.sv.context(
                            p_.literal.list(["l list"])
                        ),
                        sh.a.change_context(
                            sh.sv.context(
                                p_.literal.list(["l item"])
                            ),
                            Resolver_Value(
                                $.resolver,
                                {
                                    'temp type': $p['temp type'],
                                    'temp subselection': p_.literal.chain(
                                        $p['temp subselection'],
                                        sh_i.sub.list()
                                    ),
                                }
                            )
                        )
                    )
                )
            })
            case 'nothing': return p_.option($, ($) => sh.a.nothing())
            case 'simple': return p_.option($, ($) => sh.a.select(
                sh.sv.context(
                    p_.literal.list([])
                )))
            case 'optional': return p_.option($, ($) => sh.a.optional.map(
                sh.sv.context(
                    p_.literal.list([])
                ),
                Resolver_Value( //FIX option constraints and value results
                    $.resolver,
                    {
                        'temp type': $p['temp type'],
                        'temp subselection': p_.literal.chain(
                            $p['temp subselection'],
                            sh_i.sub.optional()
                        ),
                    }
                )
            ))
            case 'reference': return p_.option($, ($) => p_.from.state($.type).decide(
                ($) => {
                    switch ($[0]) {
                        case 'derived': return p_.option($, ($) => sh.a.select(
                            Resolver_Guaranteed_Value_Selection(
                                $.value,
                                {
                                    'tail': p_.literal.list([])
                                }
                            )
                        ))
                        case 'selected': return p_.option($, ($) => {
                            const x = $.lookup
                            const x_out = Resolver_Lookup_Selection(x)
                            return Value_Constraints(
                                $.constraints,
                                {
                                    'sub': p_.from.state($.definition.dependency).decide(
                                        ($) => {
                                            switch ($[0]) {
                                                case 'stack': return p_.option($, ($) => sh.a.group.literal(
                                                    p_.literal.dictionary({
                                                        "l entry": sh.a.select(
                                                            sh.sv.lookup_entry_acyclic(
                                                                x_out,
                                                                sh.a.select(
                                                                    sh.sv.context(
                                                                        p_.literal.list(["l reference"])
                                                                    )),
                                                                no_such_entry_error,
                                                                no_context_lookup_error,
                                                                cycle_detected_error,

                                                            )),
                                                        "l id": sh.a.select(
                                                            sh.sv.context(
                                                                p_.literal.list(["l reference"])
                                                            )),
                                                        // "l up steps": sh.a.implement_me("IM: FIXME UPSTEPS"),
                                                        "l up steps": sh.a.select(
                                                            sh.sv.lookup_depth(
                                                                x_out,
                                                                sh.a.select(
                                                                    sh.sv.context(
                                                                        p_.literal.list(["l reference"])
                                                                    )),
                                                                no_such_entry_error,
                                                                no_context_lookup_error,
                                                                cycle_detected_error,

                                                            )),
                                                    })
                                                ))
                                                case 'acyclic': return p_.option($, ($) => sh.a.group.literal(
                                                    p_.literal.dictionary({
                                                        // "l entry": sh.a.implement_me("IM: FIXME ACYCLIC ENTRY"),
                                                        "l entry": sh.a.select(
                                                            sh.sv.lookup_entry_acyclic(
                                                                x_out,
                                                                sh.a.select(
                                                                    sh.sv.context(
                                                                        p_.literal.list(["l reference"])
                                                                    )),
                                                                no_such_entry_error,
                                                                no_context_lookup_error,
                                                                cycle_detected_error,

                                                            )),
                                                        "l id": sh.a.select(
                                                            sh.sv.context(
                                                                p_.literal.list(["l reference"])
                                                            )),
                                                    })
                                                ))
                                                case 'cyclic': return p_.option($, ($) => sh.a.group.literal(
                                                    p_.literal.dictionary({
                                                        "l entry": sh.a.select(
                                                            sh.sv.lookup_entry_cyclic(
                                                                x_out,
                                                                sh.a.select(
                                                                    sh.sv.context(
                                                                        p_.literal.list(["l reference"])
                                                                    )),
                                                                no_such_entry_error,
                                                                no_context_lookup_error,
                                                                sh.a.unreachable("the generated resolver should take care of accessing before resolved"),

                                                            )),
                                                        "l id": sh.a.select(
                                                            sh.sv.context(
                                                                p_.literal.list(["l reference"])
                                                            )),
                                                    })
                                                ))
                                                default: return p_.exhaustive($[0])
                                            }
                                        })
                                }
                            )
                        })
                        default: return p_.exhaustive($[0])
                    }
                }))
            case 'state': return p_.option($, ($) => {
                const $v_results = $.definition.results
                return sh.a.variables(
                    p_.literal.dictionary({
                        "location": sh.a.select(
                            sh.sv.context(
                                p_.literal.list(["l location"])
                            )),
                    }),
                    Value_Results(
                        $.definition.results,
                        {
                            'base type': sh.a.decide.state(
                                sh.sv.context(
                                    p_.literal.list(["l state"])
                                ),
                                p_.from.dictionary($.options).map(
                                    ($, id) => sh.a.state.literal(id, Option_Constraints(
                                        $.constraints,
                                        {
                                            'sub': Resolver_Value(
                                                $['resolver'],
                                                {
                                                    'temp type': $p['temp type'],
                                                    'temp subselection': p_.literal.segmented_list([
                                                        $p['temp subselection'],
                                                        p_.from.optional($v_results).decide(
                                                            () => p_.literal.list([
                                                                sh_i.sub.group("l value"),
                                                                sh_i.sub.state(id),
                                                            ]),
                                                            () => p_.literal.list([
                                                                sh_i.sub.state(id),
                                                            ])
                                                        )
                                                    ]),
                                                }
                                            )
                                        }
                                    ))),
                                sh.type_node_reference(
                                    "out",
                                    $p['temp type'], p_.literal.segmented_list([
                                        $p['temp subselection'],
                                        p_.from.optional($v_results).decide(
                                            () => p_.literal.list([
                                                sh_i.sub.group("l value"),
                                            ]),
                                            () => p_.literal.list([])
                                        ),
                                    ]),
                                ),
                            )
                        }
                    )
                )
            })
            case 'text': return p_.option($, ($) => sh.a.select(
                sh.sv.context(
                    p_.literal.list([])
                )))
            default: return p_.exhaustive($[0])
        }
    })

export const Value_Constraint: declarations.Value_Constraint = (
    $: s_in.Resolver_Value_Constraint,
): s_out.Assign => {
    return Resolver_Constraint(
        $.constraint,
        // {
        //     'sub': p_.from.state($.start).decide(
        // ($) => {
        //         switch ($[0]) {
        //             case 'value': return p_.option($, ($) => sh.sv.implement_me("IM: constraint result1"))
        //             case 'sibling': return p_.option($, ($) => sh.sv.implement_me("IM: constraint result2"))
        //             default: return p_.exhaustive($[0])
        //         }
        //     })
        // }
    )
}

export const Resolver_Constraint: declarations.Constraint = (
    $: s_in.Resolver_Constraint
): s_out.Assign => {
    const rvs = Relative_Value_Selection($.selection)
    return p_.from.state($.type).decide(
        ($) => {
            switch ($[0]) {
                case 'state': return p_.option($, ($) => sh.a.decide.state_single(
                    rvs,
                    $.option['l id'],
                    sh.a.select(
                        sh.sv.context(
                            p_.literal.list([])
                        )
                    ),
                    sh.a.abort(
                        sh.a.group.literal(
                            p_.literal.dictionary({
                                "type": sh.a.state.literal(
                                    "constraint",
                                    sh.a.state.literal(
                                        "state",
                                        sh.a.group.literal(
                                            p_.literal.dictionary({
                                                "expected": sh.a.text.literal($.option['l id'], 'freeform'),
                                                "found": sh.a.text.option_name(),
                                            })
                                        )
                                    )
                                ),
                                "location": sh.a.select(
                                    sh.sv.variable(
                                        "location",
                                        p_.literal.list([])
                                    )
                                )
                            })
                        )
                    ),
                    null,
                ))
                case 'optional value': return p_.option($, ($) => sh.a.implement_me("IM: constraint2"))
                default: return p_.exhaustive($[0])
            }
        })
}

export const Relative_Value_Selection = (
    $: s_in.Resolver_Relative_Value_Selection,
): s_out.Select_Value => {
    p_.from.list($.path['l value']).map(
        ($) => null)
    return sh.sv.implement_me("IM: rvs")
}

export const Value_Constraints = (
    $: s_in.Resolver_Value_Constraints,
    $p: {
        sub: s_out.Assign
    }
): s_out.Assign => {
    return p_.from.dictionary($).on_has_entries(
        () => sh.a.group.literal_resolve(
            p_.literal.dictionary({
                "l value": $p.sub,
                "l results": sh.a.variables(
                    p_.literal.dictionary({
                        "location": sh.a.select(
                            sh.sv.context(
                                p_.literal.list(["l location"])
                            )
                        ),
                    }),
                    sh.a.group.literal(p_.from.dictionary($).map(
                        ($, id) => Value_Constraint($)))
                ),
            })
        ),
        () => $p.sub
    )
}

export const Value_Reference = (
    $: s_in.Value_Reference,

): s_out.Assign => {
    return sh.a.implement_me("IM: value reference")
}

export const Value_Results = (
    $: s_in.Value_Results,
    $p: {
        'base type': s_out.Assign
    }
): s_out.Assign => {
    return p_.from.optional($).decide(
        ($) => sh.a.group.literal(
            p_.literal.dictionary({
                "l results": sh.a.group.literal(
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