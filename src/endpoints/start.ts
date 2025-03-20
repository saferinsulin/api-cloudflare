import { Bool, OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { StartResp, StartReq } from "../types";
// @ts-ignore
import calc from "@saferinsulin/core";

export class Start extends OpenAPIRoute {
	schema = {
		tags: ["Calculation"],
		summary: "Starting insulin infusion",
		request: {
			body: {
				content: {
					"application/json": {
						schema: StartReq,
					},
				},
			},
		},
		responses: {
			"200": {
				description: "Returns calculator advice",
				content: {
					"application/json": {
						schema: z.object({
							series: z.object({
								success: Bool(),
								result: StartResp
							}),
						}),
					},
				},
			},
		},
	};

	async handle() {
		// Get validated data
		const data = await this.getValidatedData<typeof this.schema>();

		// Retrieve the validated request body
		const userData = data.body;

		// use calculator module to calculate the rate
    const ins = new calc();
    const gov = ins.startingRate(userData.glucose); 

		// return the governance data
		return {
			success: true,
			result: {
				rate: gov.rate,
				rateNum: gov.rateNum,
				advice: gov.advice,
				hex: gov.hex,
			},
		};
	}
}
