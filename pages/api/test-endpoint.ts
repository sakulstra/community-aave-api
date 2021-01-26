import { gqlSdkV2 } from "@api/subgraph";
import { applyCacheHeaders } from "@api/utils/responseHelpers";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  applyCacheHeaders(res);
  const response = await gqlSdkV2.Oracle();
  res.json(JSON.stringify(response.data));
};
