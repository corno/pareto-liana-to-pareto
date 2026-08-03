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


export const Schema: declarations.Schema = ($, $p) => sh.m.package_functions(
    p_.literal.dictionary({
        "generic": sh.import_.external(
            "liana-core",
            p_.literal.list([
                "dist",
                "interface",
                "to be generated",
                "deserialize",
            ]),
        ),
        "in": sh.import_.external(
            "pareto-fountain-pen",
            p_.literal.list([
                "dist",
                "interface",
                "to be generated",
                "list of characters",
            ]),
        ),
        "out": sh.import_.ancestor(
            $p.constrained
                ? 3
                : 2,
            "data",
            $p.constrained
                ? p_.literal.list([
                    "resolved",
                ])
                : p_.literal.list([]),
        ),
    }),
    p_.from.dictionary($.modules).map(
        ($, id) => sh.type.refiner(
            sh.t.component_imported(
                "in",
                "List of Characters",
            ),
            sh.t.component_imported(
                "out",
                id,
            ),
            sh.t.component_imported(
                "generic",
                "Error",
            ),
            null,
            p_.literal.dictionary({
                "tab size": sh.t.natural(),
            }),
        )),
)
