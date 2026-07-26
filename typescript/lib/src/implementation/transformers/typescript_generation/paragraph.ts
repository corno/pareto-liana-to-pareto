import * as p_ from 'pareto-core/implementation/transformer'

import type * as s_in from "../../../interface/schemas/typescript_generation.js"
import type * as s_out from "pareto-fountain-pen/interface/schemas/paragraph"
namespace declarations {
    export type Error = p_.Transformer<
        s_in.Error,
        s_out.Phrase
    >
}

//dependencies
import * as ser_resolving from "liana-core/modules/resolved_document_deserialization/implementation/serializers/resolving"
import * as ser_unresolved_document_deserialization from "liana-core/modules/unresolved_document_deserialization/implementation/serializers/unresolved_document_deserialization"
import * as ser_read_file from "pareto-filesystem-unrestricted-api/modules/unrestricted/implementation/serializers/read_file"

//shorthands
import * as sh from "pareto-fountain-pen/shorthands/paragraph/deprecated"

export const Error: declarations.Error = ($) => {
    return p_.from.state($).decide(
        ($) => {
            switch ($[0]) {
                case 'could not read source': return p_.option($, ($) => sh.ph.composed([
                    sh.ph.text("could not read source"),
                    sh.ph.text(ser_read_file.Error($))
                ]))
                case 'could not log': return p_.option($, ($) => sh.ph.text("could not log"))
                case 'could not remove interface': return p_.option($, ($) => sh.ph.text("could not remove interface"))
                case 'could not remove implementation': return p_.option($, ($) => sh.ph.text("could not remove implementation"))
                case 'could not write interface': return p_.option($, ($) => sh.ph.text("could not write interface"))
                case 'could not write implementation': return p_.option($, ($) => sh.ph.text("could not write implementation"))
                case 'could not copy generic implementation': return p_.option($, ($) => sh.ph.text("could not copy generic implementation"))
                case 'could not copy core interface': return p_.option($, ($) => sh.ph.text("could not copy core interface"))
                case 'could not resolve module': return p_.option($, ($) => sh.ph.text(
                    ser_resolving.Error(
                        $.error,
                    )
                ))
                case 'could not deserialize': return p_.option($, ($) => sh.ph.text(
                    ser_unresolved_document_deserialization.Error(
                        $.error,
                    )
                ))
                default: return p_.exhaustive($[0])
            }
        })
}