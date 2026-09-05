import * as p_ from 'pareto-core/transformer'
import type * as p_i from 'pareto-core/transformer'

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
            "generic": sh.import_.external(
                "liana-core",
                p_.literal.list([
                    "dist",
                    "interface",
                    "to be generated",
                    "unmarshall",
                ]),
            ),
            "out": sh.import_.ancestor(
                $p.constrained ? 3 : 2,
                "data",
                $p.constrained
                    ? p_.literal.list([
                        "unresolved",
                    ])
                    : p_.literal.list([]),
            ),
            "in": sh.import_.external(
                "astn-core",
                p_.literal.list([
                    "dist",
                    "interface",
                    "generated",
                    "liana",
                    "schemas",
                    "parse tree",
                    "data",
                ]),
            ),
        }),
        p_.from.dictionary($.modules).map(
            ($, id) => sh.type.refiner(
                sh.t.component_imported(
                    "in",
                    "Value",
                ),
                sh.t.component_imported(
                    "out",
                    id,
                ),
                sh.t.component_imported("generic", "Error"),
                null,
                null,
            )),
    )
}
