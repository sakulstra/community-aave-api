import { useEffect, useState } from "react";
import { fetcher } from "./utils";
import { Code } from "dokz";

export function ApiFetcher({ url }: { url: string }) {
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState({});

  useEffect(() => {
    fetcher(url).then((data) => {
      setResponse(data);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      example response for `{url}`
      <Code className="json">
        {loading ? "loading..." : JSON.stringify(response, null, 1)}
      </Code>
    </div>
  );
}
