import { api } from "./apiClient.js";

export async function gerarProvaVirtual(photo, product) {
  const garmentResponse = await fetch(product.foto);
  if (!garmentResponse.ok)
    throw new Error("Não foi possível carregar a foto deste traje.");
  const garment = await garmentResponse.blob();
  const form = new FormData();
  form.append("photo", photo, "foto-pessoa.jpg");
  form.append("garment", garment, "foto-traje");
  form.append("consent", "true");
  return api(`/virtual-fitting/${encodeURIComponent(product.id)}`, {
    auth: false,
    method: "POST",
    body: form,
    timeoutMs: 120000,
  });
}
