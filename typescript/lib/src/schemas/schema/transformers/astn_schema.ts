// import * as p_ from 'pareto-core/implementation/transformer'
// import p_unreachable_code_path from 'pareto-core/implementation/transformer/specials/unreachable_code_path'

// import type * as declarations from "../../../declarations/transformers/schema/astn_schema.js"

// //schemas
// import type * as s_out from "../../../interface/generated/liana/schemas/astn_schema/data/unresolved.js"

// //shorthands
// import * as sh from "pareto-core-shorthands/unresolved_data"

// export const Schema: declarations.Schema = ($) => ({
//     'globals': Globals($.globals),
//     'imports': Schema_Imports($['schema imports']),
//     'types': sh.dictionary(p_.from.dictionary($.modules).map(
//         ($) => Module($))),
// })

// export const Globals: declarations.Globals = ($) => ({
//     //FIXME!! merge the number types with the text types in here
//     "text types": sh.dictionary(
//         p_.from.dictionary(
//             p_.literal.dictionary({
//                 "t": p_.from.dictionary($['text types']).map(
//                     ($) => {
//                         return Text_Type($)
//                     }),
//                 "n": p_.from.dictionary($['simple types']).map(
//                     ($): s_out.Text_Type => {
//                         return {
//                             'type': sh.state(['single line', null])
//                         }
//                     })
//             }),
//         ).flatten(
//             ($) => $,
//             (parent_id, child_id) => parent_id + child_id,
//             {
//                 duplicate_id: () => p_unreachable_code_path("the root dictionary keys are fixed; 't' and 'n'"),
//             }

//         )
//     ),
// })

// export const Schema_Imports: declarations.Schema_Imports = ($) => sh.dictionary(p_.from.dictionary($).map(
//     ($) => ({
//         'schema': null,
//         'schema set child': sh.reference($['schema set child']['l value']['l id'])
//     })))

// export const Module: declarations.Module = ($) => ({
//     'root value': Value($['root value'])
// })

// export const Value: declarations.Value = ($) => sh.state(p_.from.state($).decide(
//     ($): s_out.Value.l_state => {
//         switch ($[0]) {
//             case 'simple': return p_.option($, ($): s_out.Value.l_state => ['text', sh.state(
//                 p_.from.state($).decide(
//                     ($): s_out.Value.l_state.text.l_state => {
//                         switch ($[0]) {
//                             case 'global': return p_.option($, ($) => ['global', sh.reference("n" + $['l id'])])

//                             default: return p_.exhaustive($[0])
//                         }
//                     })
//             )])
//             case 'list': return p_.option($, ($) => ['list', {
//                 'value': Value($.value)
//             }])
//             case 'nothing': return p_.option($, ($) => ['nothing', null])
//             case 'reference': return p_.option($, ($) => p_.from.state($.type).decide(
//                 ($) => {
//                     switch ($[0]) {
//                         case 'derived': return p_.option($, ($) => ['nothing', null])
//                         case 'selected': return p_.option($, ($) => ['text', sh.state<s_out.Value.l_state.text.l_state>(['local', {
//                             'type': sh.state(['single line', null])
//                         }])])
//                         default: return p_.exhaustive($[0])
//                     }
//                 }))
//             case 'component': return p_.option($, ($) => ['component', sh.state(p_.from.state($.type).decide(
//                 ($): s_out.Value.l_state.component.l_state => {
//                     switch ($[0]) {
//                         case 'external': return p_.option($, ($) => ['external', {
//                             'import': sh.reference($.import['l id']),
//                             'type': sh.reference($.module['l id'])
//                         }])
//                         case 'internal acyclic': return p_.option($, ($) => ['internal acyclic', sh.reference($['l id'])])
//                         case 'internal': return p_.option($, ($) => ['internal', sh.reference($['l id'])])
//                         default: return p_.exhaustive($[0])
//                     }
//                 }))])
//             case 'dictionary': return p_.option($, ($) => ['dictionary', {
//                 'ordered': false,
//                 'value': Value($.value)
//             }])
//             case 'group': return p_.option($, ($) => ['group', sh.dictionary(p_.from.dictionary($).map(
//                 ($) => Value($.value)))])
//             case 'optional': return p_.option($, ($) => ['optional', Value($)])
//             case 'state': return p_.option($, ($) => ['state', sh.dictionary(p_.from.dictionary($.options).map(
//                 ($) => Value($.value)))])
//             case 'text': return p_.option($, ($) => ['text', sh.state(p_.from.state($).decide(
//                 ($): s_out.Value.l_state.text.l_state => {
//                     switch ($[0]) {
//                         case 'global': return p_.option($, ($) => ['global', sh.reference("t" + $['l id'])])
//                         case 'local': return p_.option($, ($) => ['local', Text_Type($)])
//                         default: return p_.exhaustive($[0])
//                     }
//                 }))])
//             // case 'type parameter': return p_.option($, ($) => p_implement_me("xx"))
//             default: return p_.exhaustive($[0])
//         }
//     }))

// export const Text_Type: declarations.Text_Type = ($) => ({
//     'type': sh.state(p_.from.state($.type).decide(
//         ($) => {
//             switch ($[0]) {
//                 case 'multi line': return p_.option($, ($) => ['multi line', null])
//                 case 'single line': return p_.option($, ($) => ['single line', null])
//                 default: return p_.exhaustive($[0])
//             }
//         }))
// })