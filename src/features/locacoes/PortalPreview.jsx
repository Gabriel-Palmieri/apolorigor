import PortalNoivo from './PortalNoivo.jsx';
import { Dialog } from '../../shared/ui/Dialog.jsx';
// ── Portal do Noivo — página pública (somente leitura) por pacote ───
function PortalNoivoPreview({
  t,
  onClose
}) {
  return <Dialog label={"Portal do casamento de " + t.noivos} onClose={onClose} className="portal-preview">
    <button className="portal-preview-close" onClick={onClose}>Fechar pré-visualização</button>
    <PortalNoivo pacote={t} />
  </Dialog>;
}

// ── "□ Pacote selecionado" — detalhe completo de um pacote ──────────
export { PortalNoivoPreview };
