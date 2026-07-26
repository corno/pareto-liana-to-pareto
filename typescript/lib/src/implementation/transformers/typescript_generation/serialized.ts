import * as p_ from 'pareto-core/implementation/transformer'

import * as s_in from "../../../interface/schemas/typescript_generation.js"
import * as s_out from "pareto-fountain-pen/interface/schemas/serialized"

//dependencies
import * as t_to_paragraph from "./paragraph.js"
import * as t_paragraph_to_serialized from "pareto-fountain-pen/_implementation/transformers/paragraph/serialized"
import * as s_parameters from "pareto-fountain-pen/interface/schemas/paragraph_serialization"

export const Error: p_.Transformer_With_Parameter<
    s_in.Error,
    s_out.Lines,
    s_parameters.Parameters
> = ($, $p) => t_paragraph_to_serialized.Phrase(
    t_to_paragraph.Error($),
    $p
)