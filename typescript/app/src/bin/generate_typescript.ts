#!/usr/bin/env -S node --enable-source-maps

import * as p_h from 'pareto-core-application/index'


import * as rs_filesystem_unrestricted from "pareto-resource-filesystem-unrestricted/index"
import * as rs_stream from "pareto-resource-stream/index"

import { $$ as c_command } from "lib/implementation/commands/generate_typescript_cli"

p_h.run_main_command(
    () => {
        return c_command(
            {
                'error message indentation': "    ",
                'file indentation': "    ",
                'newline': "\n",
            },
            {
                'read file': rs_filesystem_unrestricted.$.queries['read file'],
            },
            {
                'make directory': rs_filesystem_unrestricted.$.commands['make directory'],
                'remove': rs_filesystem_unrestricted.$.commands.remove,
                'copy': rs_filesystem_unrestricted.$.commands.copy,
                'log lines': rs_stream.$.commands['log lines'],
                'log error lines': rs_stream.$.commands['log error lines'],
                'write file': rs_filesystem_unrestricted.$.commands['write file'],
            },
        )
    },
)
