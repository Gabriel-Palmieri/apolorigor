import { useRef } from 'react';
import { Button } from '../../shared/ui/Button.jsx';
import { ProvadorIcon } from './ProvadorIcon.jsx';
import { cn } from '../../shared/lib/cn.js';
export default function PhotoCapture({ capture }) {
  const inputRef = useRef(null);
  const { videoRef, cameraStatus, facing, photo, busy, error, openCamera, closeCamera, uploadPhoto, capturePhoto, removePhoto } = capture;
  const cameraOpen = cameraStatus !== 'idle';
  return <section aria-labelledby="photo-title" className="fitting-photo">
    <div className="fitting-section-heading"><h2 id="photo-title">Sua foto</h2><span>{photo ? 'Foto escolhida' : 'De frente, com boa luz'}</span></div>
    <div className={cn('fitting-mirror', cameraOpen && 'fitting-mirror-live')} aria-busy={busy || cameraStatus === 'requesting'}>
      <video ref={videoRef} autoPlay muted playsInline aria-label="Imagem ao vivo da câmera" className={cn('fitting-video', !cameraOpen && 'hidden', facing === 'user' && 'fitting-video-mirrored')} />
      {photo && !cameraOpen ? <img src={photo.url} alt="Sua foto escolhida para a prova" className="fitting-person-photo" /> : !cameraOpen ? <div className="fitting-photo-empty">
        <ProvadorIcon className="fitting-camera-icon" /><p>O provador começa<br />com você.</p><span>Enquadre o rosto e o corpo.<br />Um fundo simples faz a diferença.</span>
      </div> : <div className="fitting-camera-guides" aria-hidden="true"><span /><span /></div>}
      {cameraStatus === 'requesting' && <p role="status" className="fitting-camera-notice">Aguardando a câmera…<br /><span>Autorize o acesso no navegador.</span></p>}
      {busy && <p role="status" className="fitting-camera-notice">Preparando sua foto…</p>}
      {cameraStatus === 'live' && <span className="fitting-camera-caption">Câmera ligada · sem áudio</span>}
    </div>
    {error && <p role="alert" className="fitting-error">{error}</p>}
    <div className="fitting-photo-actions">
      {cameraOpen ? <><Button onClick={capturePhoto} disabled={busy || cameraStatus !== 'live'}><ProvadorIcon />Tirar foto</Button><Button variant="ghost" onClick={closeCamera}>Fechar câmera</Button>{cameraStatus === 'live' && <button type="button" className="fitting-text-button" onClick={() => openCamera(facing === 'user' ? 'environment' : 'user')} disabled={busy}>Trocar câmera</button>}</> : <>
        <Button onClick={() => openCamera()} disabled={busy}><ProvadorIcon />{photo ? 'Tirar outra foto' : 'Abrir câmera'}</Button><Button variant="ghost" onClick={() => inputRef.current?.click()} disabled={busy}><ProvadorIcon name="upload" />{photo ? 'Trocar arquivo' : 'Enviar foto'}</Button>{photo && <button type="button" className="fitting-text-button" onClick={removePhoto} disabled={busy}>Remover foto</button>}
      </>}
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" aria-label="Enviar sua foto" className="sr-only" tabIndex={-1} onChange={event => { uploadPhoto(event.target.files?.[0]); event.target.value = ''; }} />
    </div>
    <p className="fitting-photo-footnote">JPG, PNG ou WebP, até 10 MB. Sua foto fica somente nesta página e é descartada ao sair.</p>
  </section>;
}
