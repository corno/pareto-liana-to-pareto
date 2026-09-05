import * as p_ from 'pareto-core/transformer'

import type * as p_di from 'pareto-core/schema'
import type * as s_in from "../schema.js"
import type * as s_out from "pareto/modules/implementation_old/schemas/resolved/schema"


namespace declarations {
    export type Schema = p_.Transformer_With_Parameter<
        s_in.Schema,
        s_out.Package_Set.D,
        {
        'path': p_di.List<string>,
        'depth': number,
        }
    >
}

//shorthands
import * as sh from "pareto/modules/implementation_old/schemas/resolved/shorthands/target"
import * as sh_i from "pareto/modules/interface_old/schemas/resolved/shorthands/target"

export const Schema: declarations.Schema = ($,
    $p) => {
    return sh.m.package_(
        p_.literal.list([]),
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
                        "deserialize",
                    ])
                ])
            ),
        }),
        p_.literal.dictionary({
            "deserialize": sh_i.import_.ancestor(
                2,
                "unresolved",
                p_.literal.list([
                    "refiners",
                    "list of characters",
                ])),
            "resolve": sh_i.import_.sibling(
                "unresolved",
                p_.literal.list([])
            ),
        }),
        p_.from.dictionary($.modules).map(
            ($,
                id) => sh.algorithm(
                    "signatures",
                    id,
                    p_.literal.list(['abort',
                        'lookups',
                        'parameters']),
                    sh.a.select(
                        sh.sv.call(
                            sh.call.external(
                                "resolve",
                                id
                            ),
                            sh.a.select(
                                sh.sv.call(
                                    sh.call.external(
                                        "deserialize",
                                        id
                                    ),
                                    sh.a.select(
                                        sh.sv.context(
                                            p_.literal.list([])
                                        )),
                                    sh.a.state.literal(
                                        "tbd",
                                        sh.a.nothing()),
                                    sh.lookups.not_set(),
                                    sh.arguments_.initialize(
                                        p_.literal.dictionary({
                                            "tab size": sh.a.number.integer_copy(
                                                sh.sv.parameter(
                                                    "tab size",
                                                    p_.literal.list([])
                                                ))
                                        }),
                                    ),
                                    p_.literal.list([])
                                )
                            ),
                            sh.a.state.literal(
                                "tbd",
                                sh.a.nothing()
                            ),
                            sh.lookups.pass_through(),
                            sh.arguments_.pass_through(),
                            p_.literal.list([])
                        ))
                )),
    )
}