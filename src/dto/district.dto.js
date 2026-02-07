import * as z from "zod";
 
export const DistrictDto = z.object({
  id: z.string(),
  name: z.string(),
});