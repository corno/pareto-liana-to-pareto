import * as p_ from 'pareto-core/transformer'

import * as s_source from "../schema.js"
import * as s_target from "pareto/modules/pareto_new/schemas/transformer/schema"

namespace declarations {

    export type Schema = p_.Transformer<
        s_source.Schema,
        s_target.Root
    >
}

import * as sh from "pareto/modules/pareto_new/schemas/transformer/shorthands/target"

export const Schema: declarations.Schema = ($) => sh.root(
    true,
    sh.schema_reference.sr.external("pareto-fountain-pen", "paragraph", "serialized"),
    p_.literal.not_set(),
    p_.literal.dictionary({
        "to sealed target": sh.dependency.sibling("sealed target"),
        "sealed target to serialized paragraph": sh.dependency.external(
            "astn-core",
            "serialization",
            "sealed target",
            "serialized paragraph"
        )
    }),
    p_.from.dictionary($.modules).map(
        ($) => sh.declaration(
            sh.schema_reference.value_reference(
                "Lines",
                p_.literal.list([])
            ),
            p_.literal.not_set(),
        )
    ),
    p_.from.dictionary($.modules).map(
        ($) => sh.implementation(
            false,
            sh.expr.implement_me("SERIALIZED PARAGRAPH")
        ),

    )
)
