import * as p_ from 'pareto-core/implementation/transformer'
import type * as p_i from 'pareto-core/interface/transformer'
import type * as p_di from 'pareto-core/interface/schema'

//schemas
import type * as s_in from "pareto-liana/modules/schema.generated/schemas/resolved/schema"

import type * as s_out from "../../../schemas/pareto_interface_resolved.js"
namespace declarations {

    export type Schema = p_i.Transformer_With_Parameter<
        s_in.Schema,
        s_out.Package_Set.D,
        {
            'constrained': p_di.Optional_Value<string>
        }
    >

}

//shorthands
import * as sh from "pareto/shorthands/interface/target"


export const Schema: declarations.Schema = ($, $p) => sh.m.package_functions(
    p_.literal.dictionary({
        "out": sh.import_.external(
            "astn-core",
            p_.literal.list([
                "dist",
                "interface",
                "generated",
                "liana",
                "schemas",
                "sealed target",
                "data",
            ]),
        ),
        "in": sh.import_.ancestor(
            p_.from.optional($p.constrained).decide(
                ($) => 3,
                () => 2,
            ),
            "data",
            p_.from.optional($p.constrained).decide(
                ($) => p_.literal.list([$]),
                () => p_.literal.list([])
            )
        ),
    }),
    p_.from.dictionary($.modules).map(
        ($, id) => sh.type.transformer(
            sh.t.component_imported(
                "in",
                id,
            ),
            sh.t.component_imported(
                "out",
                "Value",
            ),
            null,
        )),
)
