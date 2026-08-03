import * as p_ from 'pareto-core/implementation/transformer'
import type * as p_i from 'pareto-core/interface/transformer'

//schemas
import type * as s_in from "../schema.js"

import type * as s_out from "pareto/modules/interface_old/schemas/resolved/schema"
namespace declarations {

    export type Schema = p_i.Transformer_With_Parameter<
        s_in.Schema,
        s_out.Package_Set.D,
        {
            'constrained': boolean
        }
    >

}

//shorthands
import * as sh from "pareto/modules/interface_old/schemas/resolved/shorthands/target"


export const Schema: declarations.Schema = ($, $p) => {
    return sh.m.package_functions(

        p_.literal.dictionary({
            "in": sh.import_.ancestor(
                $p.constrained ? 3 : 2,
                "data",
                $p.constrained
                    ? p_.literal.list([
                        "resolved",
                    ])
                    : p_.literal.list([]),
            ),
            "out": sh.import_.external(
                "pareto-fountain-pen",
                p_.literal.list([
                    "dist",
                    "interface",
                    "generated",
                    "liana",
                    "schemas",
                    "prose",
                    "data",
                ]),
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
                    "Paragraph",
                ),
                null,
            )),
    )
}
