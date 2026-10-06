import { useEffect, useState } from "react";
import { api } from "./apiClient.js";
import { useSyncExternalStore } from "react";
import { getSession, subscribeSession } from "./session.js";

// Results are tied to both the URL and account, never reused for another owner.
export function useRequest(path, auth = true) {
  const session = useSyncExternalStore(subscribeSession, getSession, getSession);
  const owner = auth ? session?.user.id : "public";
  const key = JSON.stringify([path, owner]);
  const [result, setResult] = useState({});
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    if (!path || (auth && !owner)) return;
    const controller = new AbortController();
    setResult({ key, loading: true });
    api(path, { auth, signal: controller.signal }).then(
      data => { if (!controller.signal.aborted) setResult({ key, data, loading: false }); },
      error => { if (!controller.signal.aborted) setResult({ key, error, loading: false }); },
    );
    return () => controller.abort();
  }, [path, key, owner, auth, revision]);
  return { ...(result.key === key ? result : { loading: Boolean(path) }), retry: () => setRevision(value => value + 1) };
}
