import * as p_ from 'pareto-core/implementation/command'
import * as p_temp from 'pareto-core/implementation/transformer'
import p_iterate from 'pareto-core/implementation/refiner/specials/iterate'

//interface dependencies
import type * as command_interfaces_pareto_application_api from "pareto-application-api/commands/interfaces"
import type * as command_interfaces_pareto_filesystem_unrestricted_api from "pareto-filesystem-unrestricted-api/modules/unrestricted/commands/interfaces"
import type * as command_interfaces_pareto_stream_api from "pareto-stream-api/commands/interfaces"
import type * as query_interfaces_pareto_filesystem_unrestricted_api from "pareto-filesystem-unrestricted-api/modules/unrestricted/queries/interfaces"

// //schemas
import type * as s_main from "pareto-application-api/schemas/main/schema"
import type * as s_resource from "../../schemas/typescript_generation/schema.js"
import type * as s_path from "pareto-filesystem-unrestricted-api/modules/unrestricted/schemas/path/schema"

import type * as s_generate_typescript_cli from "../../schemas/typescript_generation_from_the_command_line/schema.js"

//dependencies
import * as c_generate_typescript from "./generate_typescript.js"
import * as t_generate_typescript_to_serialized from "../../schemas/typescript_generation/transformers/serialized.js"
import * as ser_path from "pareto-filesystem-unrestricted-api/modules/unrestricted/schemas/path/serializers"
import * as deser_path from "pareto-filesystem-unrestricted-api/modules/unrestricted/schemas/path/deserializers"
import * as t_paragraph_to_serialized_paragraph from "pareto-fountain-pen/modules/paragraph/schemas/paragraph/transformers/serialized"

// //shorthands
import * as sh from "pareto-fountain-pen/modules/paragraph/schemas/paragraph/shorthands/deprecated"

export const $$: p_.Command_Implementation<
    command_interfaces_pareto_application_api.main,
    {
        'error message indentation': string
        'file indentation': string
        'newline': string
    },
    {
        'read file': query_interfaces_pareto_filesystem_unrestricted_api.read_file
    },
    {
        'copy': command_interfaces_pareto_filesystem_unrestricted_api.copy
        'log lines': command_interfaces_pareto_stream_api.log_lines
        'log error lines': command_interfaces_pareto_stream_api.log_error_lines
        'make directory': command_interfaces_pareto_filesystem_unrestricted_api.make_directory
        'remove': command_interfaces_pareto_filesystem_unrestricted_api.remove
        'write file': command_interfaces_pareto_filesystem_unrestricted_api.write_file
    }
> = p_.command(
    ($d, $s, $q, $c) => [

        p_.s.handle_error<s_main.Error, s_generate_typescript_cli.Error>(
            [
                p_.s.refine(
                    (abort) => p_iterate<
                        {
                            'source': s_path.Node_Path
                            'target': s_path.Context_Path
                        },
                        string,
                        null
                    >({
                        list: $d.arguments,
                        end_info: null,
                        on_dangling_item: () => abort(['too many arguments', null]),
                        // create_expectation_error: (expected, found) => ['missing', { 'expected': expected }],
                        assign: (iterator) => ({

                            'source': deser_path.Node_Path(
                                iterator.consume(
                                    ($) => abort(['missing', {
                                        'expected': ['source path', null]
                                    }]),
                                    ($) => $,
                                ),
                                () => abort(['invalid source path', null]),
                                { 'pedantic': false }
                            ),
                            'target': deser_path.Context_Path(
                                iterator.consume(
                                    ($) => abort(['missing', {
                                        'expected': ['target path', null]
                                    }]),
                                    ($) => $,
                                ),
                            ),
                        })
                    }),
                    ($v) => [
                        p_.s.handle_error<s_generate_typescript_cli.Error, s_resource.Error>(
                            [


                                c_generate_typescript.$$(
                                    {
                                        'file indentation': $s['file indentation'],
                                        'newline': $s.newline,
                                    },
                                    $q,
                                    $c,
                                ).execute(
                                    {
                                        'source': $v.source,
                                        'target': $v.target,
                                        'type': ['package', null]
                                    },
                                    ($) => $,
                                ),
                                //log
                                $c['log lines'].execute(
                                    {
                                        'lines': p_.literal.list([
                                            "generated package: ",
                                            ser_path.Node_Path($v.source),
                                        ]),
                                    },
                                    ($) => ['could not log', null]
                                ),

                            ],
                            ($) => [
                                $c['log error lines'].execute(
                                    {
                                        'lines': t_generate_typescript_to_serialized.Error(
                                            $,
                                            {
                                                'indentation': $s['error message indentation'],
                                            }
                                        )
                                    },
                                    ($) => ['processing', null]
                                )
                            ],
                            () => ['processing', null]
                        ),

                    ]
                )
            ],
            ($) => [
                $c['log error lines'].execute(
                    {
                        'lines': t_paragraph_to_serialized_paragraph.Phrase(
                            p_temp.from.state($).decide(
                                ($) => {
                                    switch ($[0]) {
                                        case 'missing': return p_temp.option($, ($) => p_temp.from.state($.expected).decide(
                                            ($) => {
                                                switch ($[0]) {
                                                    case 'source path': return p_temp.option($, ($) => sh.ph.text("missing source path argument"))
                                                    case 'target path': return p_temp.option($, ($) => sh.ph.text("missing target path argument"))
                                                    default: return p_temp.exhaustive($[0])
                                                }
                                            }
                                        ))
                                        case 'invalid source path': return p_temp.option($, ($) => sh.ph.text("invalid source path argument"))
                                        case 'too many arguments': return p_temp.option($, ($) => sh.ph.text("too many arguments"))
                                        case 'processing': return p_temp.option($, ($) => sh.ph.text("error while processing"))
                                        default: return p_temp.exhaustive($[0])
                                    }
                                }
                            ),
                            {
                                'indentation': $s['error message indentation']
                            }
                        )
                    },
                    ($) => ({
                        'exit code': 2
                    })
                )
            ],
            () => ({
                'exit code': 1,
            })
        ),

    ]
)