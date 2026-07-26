
import type * as s_resolve from "./resolving.js"
import type * as s_read_file from "./fs_unrestricted_read_file.js"
import type * as s_deserialize from "./unresolved_document_deserialization.js"
import type * as s_path from "./fs_unrestricted_path.js"


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