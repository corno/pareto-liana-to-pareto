
import type * as s_resolve from "liana-core/modules/resolved_document_deserialization/schemas/resolving/schema"
import type * as s_read_file from "pareto-filesystem-unrestricted-api/modules/unrestricted/schemas/read_file/schema"
import type * as s_deserialize from "liana-core/modules/unresolved_document_deserialization/schemas/unresolved_document_deserialization/schema"
import type * as s_path from "pareto-filesystem-unrestricted-api/modules/unrestricted/schemas/path/schema"


export type Error =
    | ['could not log', null]
    | ['could not read source', s_read_file.Error]
    | ['could not remove interface', null]
    | ['could not remove implementation', null]
    | ['could not write interface', null]
    | ['could not write implementation', null]
    | ['could not copy generic implementation', null]
    | ['could not copy core interface', null]
    | ['could not resolve module', {
        'location': s_path.Node_Path,
        'error': s_resolve.Error
    }]
    | ['could not deserialize', {
        'location': s_path.Node_Path,
        'error': s_deserialize.Error
    }]

export type Parameters = {
    'source': s_path.Node_Path,
    'target': s_path.Context_Path,
    'type':
    | ['module specification', null]
    | ['package', null]
}