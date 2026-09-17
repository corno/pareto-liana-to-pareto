import * as p_ from 'pareto-core/transformer'

import * as s_source from "../schema.js"
import * as s_target from "pareto/modules/pareto_new/schemas/refiner/schema"

namespace declarations {

    export type Schema = p_.Transformer<
        s_source.Schema,
        s_target.Root
    >
}

import * as sh from "pareto/modules/pareto_new/schemas/refiner/shorthands/target"

export const Schema: declarations.Schema = ($) => sh.root(
    false,
    sh.schema_reference.sr.external("astn-core", "deserialization", "list of characters"),
    p_.literal.set(sh.schema_reference.sr.external("liana-core", "unresolved document deserialization", "unresolved document deserialization")),
    p_.literal.set(sh.schema_reference.sr.external("liana-core", "unresolved document deserialization", "unresolved document deserialization")),
    p_.literal.dictionary({
        "from parse tree": sh.dependency.sibling("astn parse tree"),
        "parse tree from list of characters": sh.dependency.external(
            "astn-core",
            "deserialization",
            "parse tree",
            "list of characters"
        ),
    }),
    p_.from.dictionary($.modules).map(
        ($) => sh.declaration.refiner(
            sh.schema_reference.value_reference(
                "List Of Characters",
                p_.literal.list([])
            ),
            p_.literal.set(sh.schema_reference.type_reference(
                "Error",
            )),
            p_.literal.set(sh.schema_reference.type_reference(
                "Parameters",
            )),
        )
    ),
    p_.from.dictionary($.modules).map(
        ($, id) => sh.implementation(
            true,
            true,
            sh.expr.selection(
                sh.value_selection.call(
                    "from parse tree",
                    id,
                    sh.value_selection.call(
                        "parse tree from list of characters",
                        "Document",
                        sh.value_selection.context_value(
                            p_.literal.list([])
                        ),
                        sh.expr.literal.state(
                            "parse tree deserialization",
                            sh.expr.selection(sh.value_selection.context_value(
                                p_.literal.list([])
                            ))
                        ),
                        'pass through',
                        p_.literal.list([
                            "content"
                        ]),
                    ),
                    sh.expr.literal.state(
                        "unmarshalling",
                        sh.expr.selection(sh.value_selection.context_value(
                            p_.literal.list([])
                        ))
                    ),
                    null,
                    p_.literal.list([]),
                )
            )
        ),

    )
)
