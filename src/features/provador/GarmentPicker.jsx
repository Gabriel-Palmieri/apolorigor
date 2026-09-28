import { onImgError } from '../../shared/lib/images.js';
import { ProvadorIcon } from './ProvadorIcon.jsx';
import { cn } from '../../shared/lib/cn.js';
export default function GarmentPicker({ modelos, selected, onSelect }) {
  return <section aria-labelledby="garment-title"><div className="fitting-section-heading"><h2 id="garment-title">Seu traje</h2><span>{modelos.length} modelos</span></div>
    <div className="fitting-garments" role="group" aria-label="Escolha um terno">{modelos.map(modelo => <button key={modelo.id} type="button" aria-pressed={selected?.id === modelo.id} onClick={() => onSelect(modelo)} className={cn('fitting-garment', selected?.id === modelo.id && 'fitting-garment-selected')}>
      <span className="fitting-garment-image"><img src={modelo.foto} alt="" onError={onImgError} loading="lazy" />{selected?.id === modelo.id && <span className="fitting-garment-check"><ProvadorIcon name="check" /></span>}</span><span className="fitting-garment-name">{modelo.nome}</span><span className="fitting-garment-detail">{modelo.cor} · {modelo.tecido}</span>
    </button>)}</div></section>;
}
