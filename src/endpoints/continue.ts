import { Bool, OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { ContinueResp, ContinueReq } from "../types";
// @ts-ignore
import calc from "@saferinsulin/core";

export class Continue extends OpenAPIRoute {
	schema = {
		tags: ["Calculation"],
		summary: "Continuing insulin infusion",
		request: {
			body: {
				content: {
					"application/json": {
						schema: ContinueReq,
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
								result: ContinueResp
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
    const gov = ins.ongoingRate(userData.glucose, userData.previous, userData.rate); 

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
