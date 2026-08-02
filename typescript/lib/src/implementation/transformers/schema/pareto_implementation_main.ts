import * as p_ from 'pareto-core/implementation/transformer'
import type * as p_i from 'pareto-core/interface/transformer'
import type * as p_di from 'pareto-core/interface/schema'

//schemas
import type * as s_in from "pareto-liana/modules/schema.generated/schemas/resolved/schema"

import type * as s_out from "pareto/modules/implementation_old/schemas/resolved/schema"
namespace declarations {

    export type Schema_Tree = p_i.Transformer_With_Parameter<
        s_in.Schema_Tree,
        s_out.Package_Set.D,
        {
            'path': p_di.List<string>,
            'omit (de)serializer': boolean
        }
    >

    export type Schemas = p_i.Transformer_With_Parameter<
        s_in.Schemas,
        s_out.Package_Set.D,
        {
            'path': p_di.List<string>,
            'omit (de)serializer': boolean
        }
    >

}

//shorthands
import * as sh from "pareto/modules/implementation_old/schemas/resolved/shorthands/target"

//dependencies
import * as t_boilerplate_for_migrate from "./pareto_implementation_boilerplate_for_migrate.js"
import * as t_resolve from "./pareto_implementation_resolve.js"
import * as t_serialize from "./pareto_implementation_serialize.js"
import * as t_deserialize from "./pareto_implementation_deserialize.js"
import * as t_marshall from "./pareto_implementation_marshall.js"
import * as t_unmarshall from "./pareto_implementation_unmarshall.js"

export const Schema_Tree: declarations.Schema_Tree = ($, $p) => {
    return p_.from.state($).decide(
        ($) => {
            switch ($[0]) {
                case 'schema': return p_.option($, ($) => {
                    const imports = $['resolver imports']
                    const schema = $

                    return $p['omit (de)serializer']
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
                                                                    'path': $p.path,
                                                                    'depth': 7,
                                                                }
                                                            ),
                                                            "boilerplate for migrate": t_boilerplate_for_migrate.Schema(schema, {
                                                                'depth': 7,
                                                                'path': $p.path,
                                                            }),
                                                            "fountain pen": t_serialize.Schema(schema, {
                                                                'path': $p.path,
                                                                'depth': 7,
                                                            })
                                                        })
                                                    ),
                                                    "refiners": sh.m.set(
                                                        p_.literal.dictionary({
                                                            "unresolved": t_resolve.Resolver_Modules($.modules, {
                                                                'path': $p.path,
                                                                'imports': imports,
                                                                'depth': 7,
                                                            }),
                                                            // "list of characters": t_deserialize_resolved.Schema(schema, {
                                                            //     'depth': 7,
                                                            //     'path': $p.path,
                                                            // }),
                                                        }),
                                                    ),
                                                })
                                            ),
                                            "unresolved": sh.m.set(
                                                p_.literal.dictionary({
                                                    // "transformers": sh.m.set({
                                                    //     "astn sealed target": t_marshall.Schema(
                                                    //         schema,
                                                    //         {
                                                    //             'path': $p.path,
                                                    //             'depth': 7,
                                                    //         }
                                                    //     ),
                                                    // }),
                                                    "refiners": sh.m.set(
                                                        p_.literal.dictionary({
                                                            "astn parse tree": t_unmarshall.Schema(schema, {
                                                                'depth': 7,
                                                                'path': $p.path,
                                                            }),
                                                            "list of characters": t_deserialize.Schema(schema, {
                                                                'depth': 7,
                                                                'path': $p.path,
                                                            }),
                                                        }),
                                                    ),
                                                }),
                                            ),
                                        })
                                    ))
                                    case 'unconstrained': return p_.option($, ($) => sh.m.set(
                                        p_.literal.dictionary({
                                            "transformers": sh.m.set(
                                                p_.literal.dictionary({
                                                    "astn sealed target": t_marshall.Schema(
                                                        schema,
                                                        {
                                                            'path': $p.path,
                                                            'depth': 6,
                                                        }
                                                    ),
                                                    "fountain pen": t_serialize.Schema(schema, {
                                                        'path': $p.path,
                                                        'depth': 6,
                                                    }),
                                                    "boilerplate for migrate": t_boilerplate_for_migrate.Schema(schema, {
                                                        'depth': 6,
                                                        'path': $p.path,
                                                    }),
                                                }),
                                            ),
                                            "refiners": sh.m.set(
                                                p_.literal.dictionary({
                                                    "astn parse tree": t_unmarshall.Schema(schema, {
                                                        'depth': 6,
                                                        'path': $p.path,
                                                    }),
                                                    "list of characters": t_deserialize.Schema(schema, {
                                                        'depth': 6,
                                                        'path': $p.path,
                                                    }),
                                                }),
                                            ),
                                        })
                                    ))
                                    default: return p_.exhaustive($[0])
                                }
                            })
                })
                case 'set': return p_.option($, ($): s_out.Package_Set.D => Schemas(
                    $,
                    {
                        'path': $p.path,
                        'omit (de)serializer': $p['omit (de)serializer'],
                    }
                ))
                default: return p_.exhaustive($[0])
            }
        })
}

export const Schemas: declarations.Schemas = ($, $p) => {
    return sh.m.set(p_.from.dictionary($).map(
        ($, id) => Schema_Tree($, {
            'path': p_.literal.chain(
                $p.path,
                id,
            ),
            'omit (de)serializer': $p['omit (de)serializer']
        })))
}
