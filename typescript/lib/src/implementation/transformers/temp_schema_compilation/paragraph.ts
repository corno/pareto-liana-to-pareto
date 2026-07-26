import * as p_ from 'pareto-core/implementation/transformer'
// import type * as s_parameters from "../../../interface"
import type * as s_in from "../../../interface/schemas/temp_schema_compilation.js"
import type * as s_out from "pareto-fountain-pen/interface/schemas/paragraph"
import type * as s_parameters_clr from "astn-core/modules/deserialization/schemas/location_serialization"

namespace declarations {
    export type Error = p_.Transformer_With_Parameter<
        s_in.Error,
        s_out.Phrase,
        {
            'id': string,
            'character location reporting': s_parameters_clr.Character_location_reporting
        }
    >
}

//dependencies
import * as ser_resolving from "liana-core/modules/resolved_document_deserialization/implementation/serializers/resolving"
import * as ser_location from "astn-core/modules/deserialization/implementation/serializers/location"

//shorthands
import * as sh from "pareto-fountain-pen/shorthands/paragraph/deprecated"

export const Error: declarations.Error = ($, $p) => sh.ph.composed([
    sh.ph.text("error in package '"),
    sh.ph.text($p.id),
    sh.ph.text("': "),
    p_.from.state($).decide(
        ($) => {
            switch ($[0]) {
                case 'could not log': return p_.option($, ($) => sh.ph.text("could not log"))
                case 'could not remove interface': return p_.option($, ($) => sh.ph.text("could not remove interface"))
                case 'could not remove implementation': return p_.option($, ($) => sh.ph.text("could not remove implementation"))
                case 'could not write interface': return p_.option($, ($) => sh.ph.text("could not write interface"))
                case 'could not write implementation': return p_.option($, ($) => sh.ph.text("could not write implementation"))
                case 'could not copy generic implementation': return p_.option($, ($) => sh.ph.text("could not copy generic implementation"))
                case 'could not copy core interface': return p_.option($, ($) => sh.ph.text("could not copy core interface"))
                case 'could not deserialize module': return p_.option($, ($) => sh.ph.composed([
                    sh.ph.text(
                        ser_location.Range(
                            $.location,
                            {
                                'character location reporting': $p['character location reporting'],
                            }
                        )
                    ),
                    sh.ph.text(": "),
                    sh.ph.text(
                        ser_resolving.Error(
                            $,
                        )
                    )
                ]))
                default: return p_.exhaustive($[0])
            }
        })
])