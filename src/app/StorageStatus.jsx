import { useStorageStatus } from "../data/useData.js";
import { useSessionStorageStatus } from "../features/conta/session.js";
export function StorageStatus() {
  const dataMessage = useStorageStatus();
  const sessionMessage = useSessionStorageStatus();
  const message = dataMessage || sessionMessage;
  return message ? (
    <div className="storage-status" role="alert">
      {message}
    </div>
  ) : null;
}
