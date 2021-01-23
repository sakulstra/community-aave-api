import { GraphQLClient } from "graphql-request";
import { getSdk as getSdkV1, Sdk as SdkV1 } from "./v1Client";
import { getSdk as getSdkV2, Sdk as SdkV2 } from "./v2Client";

export const gqlSdkV1 = getSdkV1(
  new GraphQLClient(
    "https://api.thegraph.com/subgraphs/name/aave/protocol-multy-raw"
  )
);
export const gqlSdkV2 = getSdkV2(
  new GraphQLClient("https://api.thegraph.com/subgraphs/name/aave/protocol-v2")
);
export type { SdkV1, SdkV2 };
