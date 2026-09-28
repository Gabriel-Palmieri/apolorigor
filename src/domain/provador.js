export const MAX_FOTO_BYTES = 10 * 1024 * 1024;
export const TIPOS_FOTO = ['image/jpeg', 'image/png', 'image/webp'];

export const ternosParaProva = produtos => produtos.filter(produto => produto.categoria === 'Terno');

export function validarFoto(file) {
  if (!file) throw new Error('Escolha uma foto para continuar.');
  if (!TIPOS_FOTO.includes(file.type)) throw new Error('Envie uma foto JPG, PNG ou WebP. Se a foto está em HEIC, exporte-a como JPG.');
  if (file.size > MAX_FOTO_BYTES) throw new Error('A foto deve ter até 10 MB. Escolha uma versão menor.');
  if (file.size === 0) throw new Error('Esse arquivo está vazio. Escolha outra foto.');
}

export function mensagemCamera(error) {
  const mensagens = {
    NotAllowedError: 'O acesso à câmera não foi autorizado. Permita o acesso nas configurações do navegador ou envie uma foto.',
    NotFoundError: 'Não encontramos uma câmera neste dispositivo. Você pode enviar uma foto.',
    NotReadableError: 'Não foi possível abrir a câmera. Feche outros aplicativos que estejam usando a câmera e tente novamente.',
    OverconstrainedError: 'Esta câmera não suporta a configuração solicitada. Tente outra câmera ou envie uma foto.',
    SecurityError: 'O navegador bloqueou a câmera. Você pode enviar uma foto.'
  };
  return mensagens[error?.name] || 'Não foi possível abrir a câmera. Tente novamente ou envie uma foto.';
}
