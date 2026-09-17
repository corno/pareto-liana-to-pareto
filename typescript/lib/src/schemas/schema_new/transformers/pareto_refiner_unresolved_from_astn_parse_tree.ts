import * as p_ from 'pareto-core/transformer'

import * as s_source from "../schema.js"
import * as s_target from "pareto/modules/pareto_new/schemas/refiner/schema"

namespace declarations {

    export type Schema = p_.Transformer<
        s_source.Schema,
        s_target.Root
    >

    export type Value = p_.Transformer<
        s_source.Value,
        s_target.Expression
    >
}

import * as sh from "pareto/modules/pareto_new/schemas/refiner/shorthands/target"

export const Schema: declarations.Schema = ($) => sh.root(
    true,
    sh.schema_reference.sr.external("astn-core", "deserialization", "parse tree"),
    p_.literal.set(sh.schema_reference.sr.external("liana-core", "value unmarshalling", "unmarshalling")),
    p_.literal.not_set(),
    p_.literal.dictionary({}),
    p_.from.dictionary($.modules).map(
        ($) => sh.declaration.refiner(
            sh.schema_reference.value_reference(
                "Value",
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
            Value($['root value']

            )
        ),

    )
)

export const Value: declarations.Value = ($) => p_.from.state($).decide(
        ($) => {
            switch ($[0]) {
                case 'component': return p_.option($, ($) => sh.expr.implement_me("COMPONENT"))
                case 'dictionary': return p_.option($, ($) => sh.expr.implement_me("DICTIONARY"))
                case 'group': return p_.option($, ($) => sh.expr.implement_me("GROUP"))
                case 'list': return p_.option($, ($) => sh.expr.implement_me("LIST"))
                case 'nothing': return p_.option($, ($) => sh.expr.implement_me("NOTHING"))
                case 'optional': return p_.option($, ($) => sh.expr.implement_me("OPTIONAL"))
                case 'reference': return p_.option($, ($) => sh.expr.implement_me("REFERENCE"))
                case 'simple': return p_.option($, ($) => sh.expr.implement_me("SIMPLE"))
                case 'state': return p_.option($, ($) => sh.expr.implement_me("STATE"))
                case 'text': return p_.option($, ($) => sh.expr.implement_me("TEXT"))
                default: return p_.exhaustive($[0])
            }
        }
    )