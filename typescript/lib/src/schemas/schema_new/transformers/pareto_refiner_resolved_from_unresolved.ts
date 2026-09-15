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
    true,
    sh.schema_reference.sr.sibling("unresolved"),
    p_.literal.set(sh.schema_reference.sr.external("liana-core", "resolved_document_deserialization", "resolving")),
    p_.literal.not_set(),
    p_.literal.dictionary({}),
    p_.from.dictionary($.modules).map(
        ($, id) => sh.declaration.refiner(
            sh.schema_reference.value_reference(
                id,
                p_.literal.list([])
            ),
            p_.literal.set(sh.schema_reference.type_reference(
                "Error",
            )),
            p_.literal.not_set(),
        )
    ),
    p_.from.dictionary($.modules).map(
        ($) => sh.implementation(
            true,
            false,
            sh.expr.implement_me("LOC")
        ),

    )
)
