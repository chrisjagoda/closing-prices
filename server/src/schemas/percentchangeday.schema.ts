import { checkSchema } from "express-validator";

import { companyTickers, page, pageSize } from "../schemas/shared.schema";

const PercentChangeDaySchema = checkSchema({
  page,
  pageSize,
  companyTickers
});

export default PercentChangeDaySchema;
