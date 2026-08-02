import * as p_ from 'pareto-core/implementation/transformer'
import type * as p_i from 'pareto-core/interface/transformer'

//schemas
import type * as s_in from "pareto-liana/modules/schema.generated/schemas/resolved/schema"

import type * as s_out from "pareto/modules/interface_old/schemas/resolved/schema"
namespace declarations {

    export type Schema = p_i.Transformer_With_Parameter<
        s_in.Schema,
        s_out.Package_Set.D,
        {
            'omit (de)serializer': boolean
        }
    >

    export type Schema_Tree = p_i.Transformer_With_Parameter<
        s_in.Schema_Tree,
        s_out.Package_Set.D,
        {
            'omit (de)serializer': boolean
        }
    >

    export type Schemas = p_i.Transformer_With_Parameter<
        s_in.Schemas,
        s_out.Package_Set.D,
        {
            'omit (de)serializer': boolean
        }
    >

}

//shorthands
import * as sh from "pareto/modules/interface_old/schemas/resolved/shorthands/target"

//dependencies
import * as t_boilerplate_for_migrate from "./pareto_interface_boilerplate_for_migrate.js"
import * as t_resolve from "./pareto_interface_resolve.js"
import * as t_types from "./pareto_interface_types.js"
import * as t_marshall from "./pareto_interface_marshall.js"
import * as t_unmarshall from "./pareto_interface_unmarshall.js"
import * as t_serialize from "./pareto_interface_serialize.js"
import * as t_deserialize from "./pareto_interface_deserialize.js"


export const Schema: declarations.Schema = ($, $p) => {
    const schema = $
    const constrainedx: boolean = p_.from.state($.complexity).decide(
        ($) => {
            switch ($[0]) {
                case 'constrained': return p_.option($, ($) => true)
                case 'unconstrained': return p_.option($, ($) => false)
                default: return p_.exhaustive($[0])
            }
        })
    return sh.m.set(
        p_.literal.dictionary({

            "data": constrainedx
                ? sh.m.set(p_.literal.dictionary({
                    "resolved": t_types.Schema(
                        schema,
                        {
                            'imports': schema['schema imports'],
                            'depth': 1,
                            'type': ['resolved', null],
                        }
                    ),
                    "unresolved": t_types.Schema(
                        schema,
                        {
                            'imports': schema['schema imports'],
                            'depth': 1,
                            'type': ['unresolved', null],
                        }
                    ),
                }))
                : t_types.Schema(
                    schema,
                    {
                        'imports': schema['schema imports'],
                        'depth': 0,
                        'type': ['unconstrained', null],
                    }
                ),
            "signatures": $p['omit (de)serializer']
                ? sh.m.set(
                    p_.literal.dictionary({})
                )
                : p_.from.state($.complexity).decide(
                    ($): s_out.Package_Set.D => {
                        switch ($[0]) {
                            case 'constrained': return p_.option($, ($): s_out.Package_Set.D => sh.m.set(
                                p_.literal.dictionary({
                                    "resolved": sh.m.set(
                                        p_.literal.dictionary({
                                            "transformers": sh.m.set(
                                                p_.literal.dictionary({
                                                    "astn sealed target": t_marshall.Schema(
                                                        schema,
                                                        {
                                                            'constrained': p_.literal.set("resolved"),
                                                        }
                                                    ),
                                                    "boilerplate for migrate": t_boilerplate_for_migrate.Schema(schema, {
                                                        'constrained': true,
                                                    }),
                                                    "fountain pen": t_serialize.Schema(schema, {
                                                        'constrained': true,
                                                    })
                                                }),
                                            ),
                                            "refiners": sh.m.set(
                                                p_.literal.dictionary({
                                                    "unresolved": t_resolve.Resolver_Signatures($.signatures.signatures
                                                    ),
                                                    // "list of characters": t_deserialize_resolved.Schema(schema, {
                                                    //     'depth': 7,
                                                    //     'path': $p.path,
                                                    // }),
                                                }),
                                            )
                                        }),
                                    ),
                                    "unresolved": sh.m.set(
                                        p_.literal.dictionary({
                                            "refiners": sh.m.set(
                                                p_.literal.dictionary({
                                                    "astn parse tree": t_unmarshall.Schema(schema, {
                                                        'constrained': true,
                                                    }),
                                                    "list of characters": t_deserialize.Schema(schema, {
                                                        'constrained': true,
                                                    }),
                                                }),
                                                // "transformers": sh.m.set({
                                                //     "astn sealed target": t_marshall.Schema(
                                                //         schema,
                                                //         {
                                                //             'constrained': p_.literal.set("unresolved"),
                                                //         }
                                                //     ),
                                                // }),
                                            )
                                        }),
                                    )
                                })
                            ))
                            case 'unconstrained': return p_.option($, ($) => sh.m.set(
                                p_.literal.dictionary({
                                    "transformers": sh.m.set(
                                        p_.literal.dictionary({
                                            "astn sealed target": t_marshall.Schema(
                                                schema,
                                                {
                                                    'constrained': p_.literal.not_set(),
                                                }
                                            ),
                                            "fountain pen": t_serialize.Schema(schema, {
                                                'constrained': false,
                                            }),
                                            "boilerplate for migrate": t_boilerplate_for_migrate.Schema(schema, {
                                                'constrained': false,
                                            }),
                                        }),
                                    ),
                                    "refiners": sh.m.set(
                                        p_.literal.dictionary({
                                            "astn parse tree": t_unmarshall.Schema(schema, {
                                                'constrained': false,
                                            }),
                                            "list of characters": t_deserialize.Schema(schema, {
                                                'constrained': false,
                                            }),
                                        }),
                                    )
                                })
                            ))
                            default: return p_.exhaustive($[0])
                        }
                    }
                )
        })
        // return m.set(p_.from.dictionary(//     p_.dictionary.literal<p_di.Optional_Value<s_out.Package_Set.D>>({
        //         "data": p_.literal.set(constrained
        //             ? m.set(p_.literal.dictionary({
        //                 "resolved": t_types.Schema(
        //                     schema,
        //                     {
        //                         'imports': schema['schema imports'],
        //                         'depth': 1,
        //                         'type': ['resolved', null],
        //                     }
        //                 ),
        //                 "unresolved": t_types.Schema(
        //                     schema,
        //                     {
        //                         'imports': schema['schema imports'],
        //                         'depth': 1,
        //                         'type': ['unresolved', null],
        //                     }
        //                 ),
        //             }))
        //             : t_types.Schema(
        //                 schema,
        //                 {
        //                     'imports': schema['schema imports'],
        //                     'depth': 0,
        //                     'type': ['unconstrained', null],
        //                 }
        //             ),
        //         ),

        //         "resolve": p_.from.state($.complexity).decide(
        // ($) => {
        //             switch ($[0]) {
        //                 case 'constrained': return p_.option($, ($) => p_.literal.set(t_resolve.Signatures(
        //                     $.signatures.signatures
        //                 )))
        //                 case 'unconstrained': return p_.option($, ($) => p_.literal.not_set())
        //                 default: return p_.exhaustive($[0])
        //             }
        //         }),
        //         "boilerplate for migrate": p_.literal.set(t_migrate_boilerplate.Schema(
        //             schema,
        //             {
        //                 'constrained': constrained
        //             }
        //         )),
        //         "unmarshall": p_.from.boolean(
        //             !$p['omit (de)serializer'],
        //         ).convert(
        //             () => t_unmarshall.Schema(
        //                 schema,
        //                 {
        //                     'constrained': constrained
        //                 }
        //             )
        //         ),
        //         "marshall": p_.from.boolean(
        //             !$p['omit (de)serializer'],
        //         ).convert(
        //             () => t_marshall.Schema(
        //                 schema,
        //                 {
        //                     'constrained': constrained
        //                 }
        //             )
        //         ),
        //         "serialize": p_.from.boolean(
        //             !$p['omit (de)serializer'],
        //         ).convert(
        //             () => t_serialize.Schema(
        //                 schema,
        //                 {
        //                     'constrained': constrained
        //                 }
        //             ),
        //         ),
        //         "deserialize": p_.from.boolean(
        //             !$p['omit (de)serializer'],
        //         ).convert(
        //             () => t_deserialize.Schema(
        //                 schema,
        //                 {
        //                     'constrained': constrained
        //                 }
        //             )
        //         ),

        //         //this needs some work; merging the parameters for deserialization with the parameters for resolving.
        //         // "deserialize resolved": p_.optional.from_boolean(
        //         //     constrained,
        //         //     t_deserialize_resolved.Schema(
        //         //         schema,
        //         //         {
        //         //             'constrained': constrained
        //         //         }
        //         //     )
        //         // ),


        //     }),
        // ).filter(
        //     ($) => $
        // ))
    )
}

export const Schema_Tree: declarations.Schema_Tree = ($, $p) => p_.from.state($).decide(
    ($) => {
        switch ($[0]) {
            case 'schema': return p_.option($, ($) => Schema($, $p))
            case 'set': return p_.option($, ($) => Schemas($, $p))
            default: return p_.exhaustive($[0])
        }
    })


export const Schemas: declarations.Schemas = ($, $p) => sh.m.set(p_.from.dictionary($).map(
    ($) => p_.from.state($).decide(
        ($) => {
            switch ($[0]) {
                case 'schema': return p_.option($, ($) => Schema($, $p))
                case 'set': return p_.option($, ($) => Schemas($, $p))
                default: return p_.exhaustive($[0])
            }
        })))