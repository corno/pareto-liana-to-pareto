import * as p_ from 'pareto-core/implementation/command'
import * as p_temp from 'pareto-core/implementation/transformer'
import p_variables from 'pareto-core/implementation/command/specials/variables'
import type * as p_inf from 'pareto-core/interface/command_interface'

//interface dependencies
import type * as command_interfaces_pareto_filesystem_unrestricted_api from "pareto-filesystem-unrestricted-api/modules/unrestricted/commands/interfaces"
import type * as query_interfaces_pareto_filesystem_unrestricted_api from "pareto-filesystem-unrestricted-api/modules/unrestricted/queries/interfaces"

// //schemas
import type * as s_schema from "pareto-liana/modules/schema.generated/schemas/resolved/schema"
import type * as s_typescript_generation from "../../schemas/typescript_generation/schema.js"

//dependencies
import { $$ as write_directory_content } from "pareto-filesystem-unrestricted-api/modules/helpers/commands/implementations/write_directory_content"
import * as r_schema from "pareto-liana/modules/schema.generated/schemas/resolved/refiners/unresolved_manual"
import * as r_unresolved_schema_from_loc from "pareto-liana/modules/schema.generated/schemas/unresolved/refiners/list_of_characters"
import * as t_liana_to_pareto_implementation from "../../schemas/schema/transformers/pareto_implementation.js"
import * as t_liana_to_pareto_interface from "../../schemas/schema/transformers/pareto_interface.js"
import * as t_pareto_implementation_to_typescript_directory from "pareto/modules/implementation_old/schemas/resolved/transformers/typescript_project"
import * as t_pareto_interface_to_typescript_directory from "pareto/modules/interface_old/schemas/resolved/transformers/to_be_written_directory_content"
import * as t_path_to_path from "pareto-filesystem-unrestricted-api/modules/unrestricted/schemas/path/transformers/path"

export const $$: p_.Command_Implementation<
    p_inf.Command_Interface<
        s_typescript_generation.Error,
        s_typescript_generation.Parameters
    >,
    {
        'file indentation': string
        'newline': string
    },
    {
        'read file': query_interfaces_pareto_filesystem_unrestricted_api.read_file
    },
    {
        'copy': command_interfaces_pareto_filesystem_unrestricted_api.copy
        'make directory': command_interfaces_pareto_filesystem_unrestricted_api.make_directory
        'remove': command_interfaces_pareto_filesystem_unrestricted_api.remove
        'write file': command_interfaces_pareto_filesystem_unrestricted_api.write_file
    }
> = p_.command(
    ($d, $s, $q, $c) => [

        p_.s.query(
            $q['read file'](
                $d.source,
                ($): s_typescript_generation.Error => ['could not read source', $]
            ),
            ($v2) => p_variables(
                () => {
                    const path = $d.target

                    const lib_path = t_path_to_path.extend_context_path_with_list(
                        path,
                        { 'addition': p_.literal.list(["typescript", "lib", "src"]) }
                    )

                    const interface_module_path = t_path_to_path.create_node_path(
                        t_path_to_path.extend_context_path_with_list(
                            lib_path,
                            { 'addition': p_.literal.list(["interface", "generated"]) }
                        ),
                        {
                            'node': "liana"
                        }
                    )
                    const implementation_module_path = t_path_to_path.create_node_path(
                        t_path_to_path.extend_context_path_with_list(
                            lib_path,
                            { 'addition': p_.literal.list(["implementation", "generated"]) }
                        ),
                        {
                            'node': "liana"
                        }
                    )


                    return [

                        p_.s.refine(
                            (abort): s_schema.Package => p_temp.from.state($d.type).decide(
                                ($) => {
                                    switch ($[0]) {
                                        case 'module specification': return p_temp.ss($, ($) => p_variables(
                                            () => {
                                                const x = r_schema.Module_Specification(
                                                    r_unresolved_schema_from_loc.Module_Specification(
                                                        $v2.data,
                                                        ($) => abort(['could not deserialize', {
                                                            'location': $d.source,
                                                            'error': $,
                                                        }]),
                                                        {
                                                            'tab size': 4,
                                                        }
                                                    ),
                                                    ($) => abort(['could not resolve module', {
                                                        'location': $d.source,
                                                        'error': $,
                                                    }]),
                                                    p_.literal.nothing(),
                                                    p_.literal.nothing(),
                                                )
                                                return {
                                                    'omit (de)serializer': false,
                                                    'schema tree': x.schema
                                                }
                                            }))
                                        case 'package': return p_temp.ss($, ($) => r_schema.Package(
                                            r_unresolved_schema_from_loc.Package(
                                                $v2.data,
                                                ($) => abort(['could not deserialize', {
                                                    'location': $d.source,
                                                    'error': $,
                                                }]),
                                                {
                                                    'tab size': 4,
                                                }
                                            ),
                                            ($) => abort(['could not resolve module', {
                                                'location': $d.source,
                                                'error': $,
                                            }]),
                                            p_.literal.nothing(),
                                            p_.literal.nothing(),
                                        ))
                                        default: return p_temp.exhaustive($[0])
                                    }
                                }),
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



                    ]

                }),
        )


    ]
)