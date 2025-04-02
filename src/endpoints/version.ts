import { OpenAPIRoute, Str } from "chanfana";
import { z } from "zod";

var coreVersion = (require('../../node_modules/@saferinsulin/core/package.json').version);
var apiVersion = (require('../../package.json').version);

export class Version extends OpenAPIRoute {
  schema = {
    tags: ["Info"],
    summary: "Get API & core calculator module versions",
    responses: {
      "200": {
        description: "Returns API version information",
        content: {
          "application/json": {
            schema: z.object({
              core: Str({ example: '2.0.0'}),
              api: Str({ example: '1.3.0'}),
            }),
          },
        },
      },
    },
  };

  async handle() {
    return {
      core: coreVersion,
      api: apiVersion,
    };
  }
} 