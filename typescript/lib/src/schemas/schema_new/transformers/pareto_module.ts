import * as p_ from 'pareto-core/transformer'
import p_implement_me from 'pareto-core-dev/implement_me'

import * as s_source from "../schema.js"
import * as s_target from "pareto/modules/pareto_new/schemas/module/schema"

namespace declarations {

    export type Module_Specification = p_.Transformer<
        s_source.Module_Specification,
        s_target.Root
    >
    export type Schema = p_.Transformer<
        s_source.Schema,
        s_target.Root
    >
}

import * as sh from "pareto/modules/pareto_new/schemas/module/shorthands/target"

//dependencies
import * as t_to_pareto_refiner_unresolved_from_astn_parse_tree from "./pareto_refiner_unresolved_from_astn_parse_tree.js"
import * as t_to_pareto_refiner_unresolved_from_list_of_characters from "./pareto_refiner_unresolved_from_list_of_characters.js"
import * as t_to_pareto_refiner_resolved_from_unresolved from "./pareto_refiner_resolved_from_unresolved.js"
import * as t_to_pareto_refiner_resolved_from_list_of_characters from "./pareto_refiner_resolved_from_list_of_characters.js"
import * as t_to_pareto_schema from "./pareto_schema.js"
import * as t_to_pareto_transformer_resolved_to_astn_sealed_target from "./pareto_transformer_resolved_to_astn_sealed_target.js"
import * as t_to_pareto_transformer_resolved_to_serialized_paragraph from "./pareto_transformer_resolved_to_serialized_paragraph.js"

export const Module_Specification: declarations.Module_Specification = ($) => p_.from.state($.schema).decide(
    ($) => {
        switch ($[0]) {
            case 'schema': return p_.option($, ($) => Schema($))
            case 'set': return p_.option($, ($) => p_implement_me("SCHEMA SET"))
            default: return p_.exhaustive($[0])
        }
    }
)

export const Schema: declarations.Schema = ($) => sh.module(
    p_.literal.dictionary({}),
    p_.literal.dictionary({
        "resolved": sh.schema_package(
            t_to_pareto_schema.Schema(
                $,
                {
                    'type': ['resolved', null]
                }
            ),
            p_.literal.dictionary({
                "astn sealed target": t_to_pareto_transformer_resolved_to_astn_sealed_target.Schema($),
                "serialized paragraph": t_to_pareto_transformer_resolved_to_serialized_paragraph.Schema($),
            }),
            p_.literal.dictionary({}),
            p_.literal.dictionary({
                "unresolved": t_to_pareto_refiner_resolved_from_unresolved.Schema($),
                "list of characters": t_to_pareto_refiner_resolved_from_list_of_characters.Schema($),
            }),
            p_.literal.dictionary({})
        ),
        "unresolved": sh.schema_package(
            t_to_pareto_schema.Schema(
                $,
                {
                    'type': ['unresolved', null]
                }
            ),
            p_.literal.dictionary({}),
            p_.literal.dictionary({}),
            p_.literal.dictionary({
                "astn parse tree": t_to_pareto_refiner_unresolved_from_astn_parse_tree.Schema($),
                "list of characters": t_to_pareto_refiner_unresolved_from_list_of_characters.Schema($),
            }),
            p_.literal.dictionary({})
        )
    }),
    p_.literal.dictionary({}),
    p_.literal.dictionary({}),
    p_.literal.dictionary({}),
    p_.literal.dictionary({}),
)