import * as p_ from 'pareto-core/implementation/transformer'
import type * as p_i from 'pareto-core/interface/transformer'
import type * as p_di from 'pareto-core/interface/schema'

//schemas
import type * as s_in from "pareto-liana/modules/liana.generated/modules/schema/schemas/resolved"

import type * as s_out from "../../../interface/schemas/pareto_implementation_resolved.js"
namespace declarations {

    export type Schema = p_i.Transformer_With_Parameter<
        s_in.Schema,
        s_out.Package_Set.D,
        {
            'path': p_di.List<string>,
            'depth': number,
        }
    >

}

//shorthands
import * as sh from "pareto/shorthands/implementation/target"
import * as sh_i from "pareto/shorthands/interface/target"

export const Schema: declarations.Schema = ($, $p) => {
    const constrained = $.complexity[0] === 'constrained'

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
                        "signatures"
                    ]),
                    constrained
                        ? p_.literal.list([
                            "unresolved"
                        ])
                        : p_.literal.list([
                        ]),
                    p_.literal.list([
                        "refiners",
                        "list of characters",
                    ])
                ])
            ),
        }),
        p_.literal.dictionary({
            "deserialize": sh_i.import_.external(
                "astn-core",
                p_.literal.list([
                    "dist",
                    "implementation",
                    "manual",
                    "refiners",
                    "parse tree",
                    "list of characters",
                ]),
            ),
            "unmarshall": sh_i.import_.sibling(
                "astn parse tree",
                p_.literal.list([])
            ),
        }),
        p_.from.dictionary($.modules).map(
            ($, id) => sh.algorithm(
                "signatures",
                id,
                p_.literal.list(['abort', 'parameters']),
                sh.a.select(
sh.sv.call(
                    sh.call.external(
                        "unmarshall",
                        id
                    ),
                    sh.a.select(
                        sh.sv.call(
                            sh.call.external(
                                "deserialize",
                                "Document"
                            ),
                            sh.a.select(
                                sh.sv.context(
                                    p_.literal.list([])
                                )),
                            sh.a.state.literal(
                                "parse error",
                                sh.a.select(
                                    sh.sv.context(
                                        p_.literal.list([])
                                    )
                                )
                            ),
                            sh.lookups.not_set(),
                            sh.arguments_.initialize(
                                p_.literal.dictionary({
                                    "tab size": sh.a.number.integer_copy(
                                        sh.sv.parameter(
                                            "tab size",
                                            p_.literal.list([])
                                        ))
                                })
                            ),
                            p_.literal.list([
                                "content"
                            ])
                        )
                    ),
                    sh.a.state.literal(
                        "unmarshall error",
                        sh.a.select(
                            sh.sv.context(
                                p_.literal.list([])
                            )
                        )
                    ),
                    sh.lookups.not_set(),
                    sh.arguments_.not_set(),
                    p_.literal.list([])
                ))
            )),
    )
}