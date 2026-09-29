import { Modal } from "../../shared/ui/dialogos/Modal.jsx";
import PortalNoivo from "./PortalNoivo.jsx";
export default function PreviaPortalCasamento({ planejamento, onClose }) {
  return (
    <Modal
      title="Prévia do portal do casamento"
      subtitle="Somente visualização. As informações não foram enviadas."
      width={1000}
      onClose={onClose}
    >
      <PortalNoivo planejamento={planejamento} />
    </Modal>
  );
}
