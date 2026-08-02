import * as p_ from 'pareto-core/implementation/command'
import * as p_t from 'pareto-core/implementation/transformer'


//interface dependencies
import type * as command_interfaces_pareto_application_api from "pareto-application-api/interface/commands"
import type * as command_interfaces_pareto_filesystem_unrestricted_api from "pareto-filesystem-unrestricted-api/modules/unrestricted/interface/commands"
import type * as command_interfaces_pareto_stream_api from "pareto-stream-api/interface/commands"

//schemas
import type * as s_main from "pareto-application-api/interface/schemas/main"
import type * as s_compile_temp_schemas from "../../interface/schemas/temp_schema_compilation.js"
import type * as s_packages from "../../interface/schemas/packages.js"

//dependencies
import { $$ as write_directory_content } from "pareto-filesystem-unrestricted-api/modules/helpers/implementation/commands/write_directory_content"
import * as deser_path from "pareto-filesystem-unrestricted-api/modules/unrestricted/implementation/deserializers/path"
import * as r_schema from "../to_be_generated/refiners/schema/unresolved_manual.js"
import * as t_generate_typescript_to_paragraph from "../transformers/compile_temp_schemas/paragraph.js"
import * as t_liana_to_pareto_implementation from "../transformers/schema/pareto_implementation.js"
import * as t_liana_to_pareto_interface from "../transformers/schema/pareto_interface.js"
import * as t_paragraph_to_serialized from "pareto-fountain-pen/_implementation/transformers/paragraph/serialized"
import * as t_pareto_implementation_to_typescript_directory from "pareto/modules/implementation_old/implementation/transformers/implementation/to_be_written_directory_content"
import * as t_pareto_interface_to_typescript_directory from "pareto/modules/interface_old/implementation/transformers/interface/to_be_written_directory_content"
import * as t_path_to_path from "pareto-filesystem-unrestricted-api/modules/unrestricted/implementation/transformers/path/path"


//shorthands
import * as sh from "pareto-fountain-pen/shorthands/paragraph/deprecated"

export const $$: p_.Command_Implementation<
    command_interfaces_pareto_application_api.main,
    {
        'packages': s_packages.Packages,
        'error message indentation': string
        'file indentation': string
        'newline': string
    },
    null,
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

        $c['log lines'].execute(
            {
                'lines': p_.literal.list([
                    "generating..."
                ])
            },
            ($): s_main.Error => ({
                'exit code': 1
            })
        ),
        p_.s.handle_error(
            [
                p_.s.dictionary(
                    $s.packages,
                    ($, id): p_.Command_Block<s_compile_temp_schemas.Error> => {

                        const path = deser_path.Context_Path(
                            `./out/source_code/${id}`
                        )

                        const interface_module_path = t_path_to_path.create_node_path(
                            path,
                            {
                                'node': "interface"
                            }
                        )
                        const implementation_module_path = t_path_to_path.create_node_path(
                            path,
                            {
                                'node': "implementation"
                            }
                        )

                        return [

                            //remove old implementation files
                            $c.remove.execute(
                                {
                                    'path': t_path_to_path.extend_context_path_with_single_step(
                                        path,
                                        {
                                            'addition': "implementation"
                                        }
                                    ),
                                    'error if not exists': false,
                                },
                                ($) => ['could not remove implementation', null]
                            ),

                            //remove old interface files
                            $c.remove.execute(
                                {
                                    'path': t_path_to_path.extend_context_path_with_single_step(
                                        path,
                                        {
                                            'addition': "interface"
                                        }
                                    ),
                                    'error if not exists': false,
                                },
                                ($) => ['could not remove interface', null]
                            ),

                            p_.s.refine(
                                (abort) => r_schema.Package(
                                    $.package,
                                    ($) => abort(['could not deserialize module', $]),
                                    p_.literal.nothing(),
                                    p_.literal.nothing(),
                                ),
                                ($) => [
                                    //write new interface files
                                    write_directory_content(
                                        {
                                            'remove before writing': true
                                        },
                                        null,
                                        {
                                            'remove': $c.remove,
                                            'write file': $c['write file'],
                                        },
                                    ).execute(
                                        {
                                            'path': t_path_to_path.deprecated_node_path_to_context_path(interface_module_path),
                                            'directory': t_pareto_interface_to_typescript_directory.Package_Set(
                                                t_liana_to_pareto_interface.Package(
                                                    $,
                                                ),
                                                {
                                                    'file write parameters': {
                                                        'newline': $s.newline,
                                                    },
                                                    'serialization parameters': {
                                                        'typescript': {
                                                            'replace empty type literals by symbol': true,
                                                        },
                                                        'indentation': $s['file indentation'],
                                                    }
                                                }
                                            ),
                                        },
                                        ($) => ['could not write interface', null]
                                    ),
                                    //write new implementation files
                                    write_directory_content(
                                        {
                                            'remove before writing': true
                                        },
                                        null,
                                        {
                                            'remove': $c.remove,
                                            'write file': $c['write file'],
                                        },
                                    ).execute(
                                        {
                                            'path': t_path_to_path.deprecated_node_path_to_context_path(implementation_module_path),
                                            'directory': t_pareto_implementation_to_typescript_directory.Package_Set(
                                                t_liana_to_pareto_implementation.Package(
                                                    $,
                                                ),
                                                {
                                                    'file write parameters': {
                                                        'newline': $s.newline,
                                                    },
                                                    'serialization parameters': {
                                                        'typescript': {
                                                            'replace empty type literals by symbol': true,
                                                        },
                                                        'indentation': $s['file indentation'],
                                                    }
                                                }
                                            ),
                                        },
                                        ($) => ['could not write interface', null]
                                    ),

                                ]
                            ),

                            // //copy generic implementation files
                            // $c.copy.execute(
                            //     {
                            //         'source': t_path_to_path.create_node_path(ds_context_path.Context_Path("./lib/src/implementation/generated/liana"), "generic"),
                            //         'target': t_path_to_path.extend_node_path(implementation_module_path, { 'addition': "generic" }),
                            //         'options': {
                            //             'recursive': p_.literal.set(true),
                            //             'force': p_.literal.not_set(),
                            //             'errorOnExist': p_.literal.not_set(),
                            //         }
                            //     },
                            //     ($) => ['could not copy generic implementation', null]
                            // ),

                            //copy core interface files
                            // $c.copy.execute(
                            //     {
                            //         'source': t_path_to_path.create_node_path(ds_context_path.Context_Path("./lib/src/interface/generated/liana"), "core"),
                            //         'target': t_path_to_path.extend_node_path(interface_module_path, { 'addition': "core" }),
                            //         'options': {
                            //             'recursive': p_.literal.set(true),
                            //             'force': p_.literal.not_set(),
                            //             'errorOnExist': p_.literal.not_set(),
                            //         }
                            //     },
                            //     ($) => ['could not copy core interface', null]
                            // ),


                            //log
                            $c['log lines'].execute(
                                {
                                    'lines': p_.literal.list([
                                        "generated package: ",
                                        id,
                                    ]),
                                },
                                ($) => ['could not log', null]
                            ),
                        ]
                    },
                    ($) => $
                )
            ],
            ($) => [
                $c['log lines'].execute(
                    {
                        'lines': t_paragraph_to_serialized.Paragraph(
                            sh.pg.sentences(
                                p_t.from.dictionary($).convert_to_list(
                                    ($, id) => sh.sentence([t_generate_typescript_to_paragraph.Error(
                                        $,
                                        {
                                            'id': id,
                                            'character location reporting': ['one based', null]
                                        }
                                    )])
                                )
                            ),
                            {
                                'indentation': $s['error message indentation'],
                            }
                        )
                    },
                    ($) => ({
                        'exit code': 1
                    })
                ),
            ],
            () => ({
                'exit code': 1
            })
        )
    ]
)