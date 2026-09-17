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
    false,
    sh.schema_reference.sr.external("pareto-fountain-pen", "paragraph", "serialized"),
    p_.literal.set(sh.schema_reference.sr.external("pareto-fountain-pen", "paragraph", "paragraph serialization")),
    p_.literal.dictionary({}),
    p_.literal.dictionary({
        "to sealed target": sh.dependency.transformer.sibling("astn sealed target"),
        "sealed target to serialized paragraph": sh.dependency.transformer.external(
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
            p_.literal.set(sh.schema_reference.type_reference("Parameters")),
        )
    ),
    p_.from.dictionary($.modules).map(
        ($, id) => sh.implementation(
            true,
            sh.expr.call(
                sh.expr.call_.external(
                    "sealed target to serialized paragraph",
                    "Document"
                ),
                sh.value_selection.call(
                    sh.value_selection.call_.external(
                        "to sealed target",
                        id
                    ),
                    sh.value_selection.context_value(
                        p_.literal.list([])
                    ),
                    null,
                    p_.literal.list([]),
                ),
                'pass through',
            )
        ),

    )
)
