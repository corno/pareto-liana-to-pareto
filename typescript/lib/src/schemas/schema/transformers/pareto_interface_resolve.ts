import * as p_ from 'pareto-core/transformer'
import type * as p_i from 'pareto-core/transformer'

//schemas
import type * as s_in from "../schema.js"

import type * as s_out from "pareto/modules/interface_old/schemas/resolved/schema"
namespace declarations {

    export type Resolver_Signatures = p_i.Transformer<
        s_in.Resolver_Signatures,
        s_out.Package_Set.D
    >

}

//shorthands
import * as sh from "pareto/modules/interface_old/schemas/resolved/shorthands/target"


export const Resolver_Signatures: declarations.Resolver_Signatures = ($) => {
    return sh.m.package_functions(
        p_.literal.dictionary({
            "generic": sh.import_.external(
                "liana-core",
                p_.literal.list([
                    "dist",
                    "interface",
                    "to be generated",
                    "resolve",
                ])
            ),
            "resolved": sh.import_.ancestor(
                3,
                "data",
                p_.literal.list(["resolved"])
            ),
            "unresolved": sh.import_.ancestor(
                3,
                "data",
                p_.literal.list(["unresolved"])
            ),
        }),
        p_.from.dictionary($).map(
            ($, id) => sh.type.refiner(
                sh.t.component_imported("unresolved", id),
                sh.t.component_imported("resolved", id),
                sh.t.component_imported("generic", "Error"),
                p_.from.dictionary($['resolved parameters'].lookups).map(
                    ($): s_out.Package.content.functions.D.type_.refiner.lookups.O.D => {
                        const y = sh.t.reference(
                            Module_Reference($.referent),
                            p_.literal.list([
                                sh.sub.dictionary()
                            ])
                        )
                        return p_.from.state($.type).decide(
                            ($) => {
                                switch ($[0]) {
                                    case 'acyclic': return p_.option($, ($) => ['acyclic', y])
                                    case 'cyclic': return p_.option($, ($) => ['cyclic', y])
                                    case 'stack': return p_.option($, ($) => ['stack', y])
                                    default: return p_.exhaustive($[0])
                                }
                            }
                        )
                    }
                ),
                p_.from.dictionary($['resolved parameters'].modules).map(
                    ($) => {
                        const temp_2 = sh.t.reference(
                            Module_Reference($['module']),
                            p_.literal.list([])
                        )
                        return p_.from.state($.presence).decide(
                            ($) => {
                                switch ($[0]) {
                                    case 'optional': return sh.t.optional(temp_2)
                                    case 'required': return temp_2
                                    default: return p_.exhaustive($[0])
                                }
                            })
                    }
                ),
            )
        ),
    )
}

export const Module_Reference = (
    $: s_in.Module_Reference,
): s_out.Module_Reference => {

    return p_.from.state($.location).decide(
        ($) => {
            switch ($[0]) {
                case 'external': return p_.option($, ($) => sh.mr.imported(
                    `imports ${$.import['l id']}`,
                    $.module['l id'],
                ))
                case 'internal': return p_.option($, ($) => sh.mr.imported(
                    "resolved",
                    $['l id'],
                ))
                default: return p_.exhaustive($[0])
            }
        })
}

export const Value_Path = (
    $: s_in.Value_Path,
): s_out.Value.reference.sub_selection => {
    const tail: s_out.Value.reference.sub_selection = p_.from.list($.tail['l value']).map(
        ($) => p_.from.state($['l item']['l value']).decide(
            ($) => {
                switch ($[0]) {
                    case 'dictionary': return p_.option($, ($) => sh.sub.dictionary())
                    case 'group': return p_.option($, ($) => sh.sub.group($['l id']))
                    case 'list': return p_.option($, ($) => sh.sub.list())
                    case 'optional': return p_.option($, ($) => sh.sub.optional())
                    case 'state': return p_.option($, ($) => sh.sub.state($['l id']))
                    default: return p_.exhaustive($[0])
                }
            }))
    return tail
}
