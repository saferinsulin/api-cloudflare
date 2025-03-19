import { Str, Num, Obj, Arr } from "chanfana";
import { z } from "zod";

export const GovReq = z.object({
	code: Str({ example: "16087091-c334928" }),
});

export const GovResp = z.object({
	function: Str({ example: "c" }),
  current: Num({ example: 13.5 }),
  last: Num({ example: 14.5 }),
  rate: Num({ example: 2.2 }),
  date: Str({ example: "Wed Mar 19 2025 11:42:00 GMT+0000 (Greenwich Mean Time)" }),
  version: Str({ example: "2.0.0" }),
});

export const StartReq = z.object({
	glucose: Num({ example: 12.2, required: true }),
});

export const StartResp = z.object({
	rate: Str({ example: "2" }),
	rateNum: Num({ example: 2 }),
	advice: Obj({
		type: Str({ example: "normal" }),
		text: Arr(Str({ example: "Start insulin at 2 units/hr" }))
	}),
	hex: Str({ example: "07a-d334ae0" }),
});
