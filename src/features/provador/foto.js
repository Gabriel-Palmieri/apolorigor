const MAX_LADO = 1600;
function jpegFrom(source, width, height, espelhada = false) {
  const escala = Math.min(1, MAX_LADO / Math.max(width, height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width * escala));
  canvas.height = Math.max(1, Math.round(height * escala));
  const context = canvas.getContext("2d");
  if (!context)
    throw new Error("Não foi possível preparar a foto neste navegador.");
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  if (espelhada) {
    context.translate(canvas.width, 0);
    context.scale(-1, 1);
  }
  context.drawImage(source, 0, 0, canvas.width, canvas.height);
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) => {
        if (blob) resolve({ blob, width: canvas.width, height: canvas.height });
        else
          reject(
            new Error("Não foi possível preparar a foto. Tente outra imagem."),
          );
      },
      "image/jpeg",
      0.9,
    ),
  );
}
export async function prepararFoto(file) {
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    if (!image.naturalWidth || !image.naturalHeight)
      throw new Error("Imagem inválida.");
    return await jpegFrom(image, image.naturalWidth, image.naturalHeight);
  } catch {
    throw new Error(
      "Não conseguimos ler essa foto. Escolha outro arquivo JPG, PNG ou WebP.",
    );
  } finally {
    URL.revokeObjectURL(url);
  }
}
export function fotografar(video, espelhada) {
  if (!video || video.readyState < 2 || !video.videoWidth)
    throw new Error(
      "A câmera ainda está preparando a imagem. Aguarde um instante.",
    );
  return jpegFrom(video, video.videoWidth, video.videoHeight, espelhada);
}
