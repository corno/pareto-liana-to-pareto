import * as p_ from 'pareto-core/query'

//interface dependencies
import type * as query_interfaces_file_in_directory_out from "pareto-common/modules/file_in_directory_out/queries/interfaces"

//data  types
import type * as s_serialize_prose from "pareto/modules/typescript_light/schemas/serialization/schema"
import type * as s_schema from "pareto-liana/schemas/schema/schema"
import type * as s_file_in_directory_out_query from "pareto-common/modules/file_in_directory_out/schemas/query/schema"

//dependencies
import * as t_liana_to_typescript_directory_content from "../../schemas/schema_new/transformers/typescript_directory_content.js"
import * as r_liana_from_list_of_characters from "pareto-liana/modules/schema.generated/schemas/resolved/refiners/list_of_characters"
import * as ser_deserialization_to_paragraph from "liana-core/modules/resolved_document_deserialization/schemas/resolved_document_deserialization/serializers"

//shorhands
import * as sh from "pareto-fountain-pen/modules/paragraph/schemas/paragraph/shorthands/target"

export const $$: p_.Query_Implementation<
    query_interfaces_file_in_directory_out.operation,
    {
        'serialization parameters': s_serialize_prose.Source_File_Parameters,
    },
    null
> = p_.query(
    (e, $s, $q) => e.refine(
        ($, abort): s_file_in_directory_out_query.Result => ({
            'data': t_liana_to_typescript_directory_content.Module_Specification(
                r_liana_from_list_of_characters.Module_Specification(
                    $.data,
                    ($) => abort({
                        'message': sh.ph.text(ser_deserialization_to_paragraph.Error($)),
                    }),
                    {
                        'tab size': 4
                    }
                ),
                {
                    'file write parameters': {
                        'newline': "\n",
                    },
                    'serialization parameters': $s['serialization parameters'],
                }
            )
        })
    )
)
