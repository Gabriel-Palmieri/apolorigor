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
    let busy = false;
    const refresh = () => {
      if (busy || document.hidden) return;
      busy = true;
      setResult(previous => ({ ...(previous.key === key ? previous : {}), key, loading: true, error: undefined }));
      api(path, { auth, signal: controller.signal }).then(
        data => { if (!controller.signal.aborted) setResult({ key, data, loading: false }); },
        error => { if (!controller.signal.aborted) setResult(previous => ({ ...previous, key, error, loading: false })); },
      ).finally(() => { busy = false; });
    };
    refresh();
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    const timer = auth ? window.setInterval(refresh, 30000) : null;
    return () => {
      controller.abort();
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
      if (timer !== null) window.clearInterval(timer);
    };
  }, [path, key, owner, auth, revision]);
  return { ...(result.key === key ? result : { loading: Boolean(path) }), retry: () => setRevision(value => value + 1) };
}
