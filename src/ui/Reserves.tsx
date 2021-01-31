import { Version } from "@api/enums";
import { useState } from "react";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((r) => r.json());

export function Reserves() {
  const [version, setVersion] = useState(Version.V2);
  const { data } = useSWR(`/api/liquidity?version=${version}`, fetcher);
  return (
    <div>
      <button
        disabled={version === Version.V1}
        onClick={() => setVersion(Version.V1)}
      >
        V1
      </button>
      &nbsp;
      <button
        disabled={version === Version.V2}
        onClick={() => setVersion(Version.V2)}
      >
        V2
      </button>
      {data?.map((r) => (
        <div key={r.key}>{r.name}</div>
      ))}
    </div>
  );
}
