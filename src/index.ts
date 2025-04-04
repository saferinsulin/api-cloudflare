import { fromHono } from "chanfana";
import { Hono } from "hono";
import { Governance } from "./endpoints/governance";
import { Start } from "./endpoints/start";
import { Continue } from "./endpoints/continue";
import { Version } from "./endpoints/version";

// Start a Hono app
const app = new Hono();

// Setup OpenAPI registry
const openapi = fromHono(app, {
		docs_url: "/",
		schema: {
			info: {
				title: "Safer Insulin API",
				version: "1.3.0"
			}
		}
	},
);

/**
 * @api {get} /v1/version Returns API version information
 * @apiName GetVersion
 * @apiGroup GET
 * @apiVersion 1.3.0
 */
openapi.get("/v1/version", Version);

/**
 * @api {post} /v1/start Starting insulin infusion
 * @apiName PostStart
 * @apiGroup POST
 * @apiVersion 1.3.0
 *
 * @apiParam {Number} glucose Current blood glucose reading (mmol/L)
 *
 * @apiSuccess {String} rate Rate to set insulin (including units/hr).
 * @apiSuccess {Number} rateNum Rate as Number (Float)
 * @apiSuccess {Object} advice Advice
 * @apiSuccess {String} advice.type Type of advice
 * @apiSuccess {String[]} advice.text Line by line advice text
 * @apiSuccess {String} hex Governance hexcode
 */
openapi.post("/v1/start", Start);

/**
 * @api {post} /v1/check Governance hexcode check
 * @apiName PostCheck
 * @apiGroup POST
 * @apiVersion 1.3.0
 *
 * @apiParam {String} governance Governance hexcode generated by the saferinsulin.org algorithm
 *
 * @apiSuccess {String} function Calculator function called: 'a' (start) or 'b' (continue).
 * @apiSuccess {Number} current Current glucose parameter passed to function
 * @apiSuccess {Number} last Previous glucose parameter passed to function [b only]
 * @apiSuccess {Number} rate Rate parameter passed to function [b only]
 * @apiSuccess {String} date Date the function was invoked
 * @apiError InvalidGovernanceCode API was supplied a missing or invalid governance code which could not be processed
 */
openapi.post("/v1/check", Governance);

/**
 * @api {post} /v1/continue Continuing an insulin infusion
 * @apiName PostContinue
 * @apiGroup POST
 * @apiVersion 1.3.0
 *
 * @apiParam {Number} glucose Current blood glucose reading (mmol/L)
 * @apiParam {Number} previous Previous blood glucose reading (mmol/L)
 * @apiParam {Number} rate Current fast-acting insulin rate (ml/hr)
 *
 * @apiSuccess {String} rate Rate to set insulin (including units/hr).
 * @apiSuccess {Number} rateNum Rate as Number (Float)
 * @apiSuccess {Object} advice Advice
 * @apiSuccess {String} advice.type Type of advice
 * @apiSuccess {String[]} advice.text Line by line advice text
 * @apiSuccess {String} hex Governance hexcode
 */
openapi.post("/v1/continue", Continue);

// Export the Hono app
export default app;
