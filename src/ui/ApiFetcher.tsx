import { useEffect, useState } from "react";
import { Code } from "dokz";

export function ApiFetcher({ url }: { url: string }) {
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState({});

  useEffect(() => {
    fetch(url).then(async (data) => {
      setResponse({ status: data.status, data: await data.json() });
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
