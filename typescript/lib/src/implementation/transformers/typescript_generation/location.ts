import type * as p_di from 'pareto-core/interface/schema'
import * as p_ from 'pareto-core/implementation/transformer'

//schemas
import type * as s_location from "../../../interface/schemas/location.js"

namespace s_out {

    export type Possible_Range = p_di.Optional_Value<s_location.Range>

}
import type * as s_in from "../../../interface/schemas/typescript_generation.js"
namespace declarations {
    export type Error = p_.Transformer<
        s_in.Error,
        s_out.Possible_Range
    >
}


//dependencies
import * as t_deserialize_to_location from "liana-core/modules/unresolved_document_deserialization/implementation/transformers/unresolved_document_deserialization/location"



export const Error: declarations.Error = ($) => {
    return p_.from.state($).decide(
        ($) => {
            switch ($[0]) {
                case 'could not read source': return p_.option($, ($) => p_.literal.not_set())
                case 'could not log': return p_.option($, ($) => p_.literal.not_set())
                case 'could not remove interface': return p_.option($, ($) => p_.literal.not_set())
                case 'could not remove implementation': return p_.option($, ($) => p_.literal.not_set())
                case 'could not write interface': return p_.option($, ($) => p_.literal.not_set())
                case 'could not write implementation': return p_.option($, ($) => p_.literal.not_set())
                case 'could not copy generic implementation': return p_.option($, ($) => p_.literal.not_set())
                case 'could not copy core interface': return p_.option($, ($) => p_.literal.not_set())
                case 'could not resolve module': return p_.option($, ($) => p_.literal.set($.error.location))
                case 'could not deserialize': return p_.option($, ($) => p_.literal.set(
                    p_.from.state(t_deserialize_to_location.Error($.error)).decide(
                        ($) => {
                            switch ($[0]) {
                                case 'range': return p_.option($, ($) => $)
                                case 'end of document': return p_.option($, ($) => ({
                                    'start': $.end,
                                    'end': $.end,
                                }))
                                default: return p_.exhaustive($[0])
                            }
                        })
                ))
                default: return p_.exhaustive($[0])
            }
        })
}