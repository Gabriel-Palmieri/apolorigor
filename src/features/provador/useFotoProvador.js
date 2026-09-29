import { useCallback, useEffect, useRef, useState } from "react";
import { mensagemCamera, validarFoto } from "../../domain/provador.js";
import { fotografar, prepararFoto } from "./foto.js";
export function useFotoProvador() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const cameraRequest = useRef(0);
  const photoRequest = useRef(0);
  const mounted = useRef(false);
  const [cameraStatus, setCameraStatus] = useState("idle");
  const [facing, setFacing] = useState("user");
  const [photo, setPhoto] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const releaseCamera = useCallback(() => {
    cameraRequest.current++;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  }, []);
  const closeCamera = useCallback(() => {
    releaseCamera();
    setCameraStatus("idle");
  }, [releaseCamera]);
  useEffect(() => {
    mounted.current = true;
    const onHidden = () => {
      if (document.hidden) closeCamera();
    };
    document.addEventListener("visibilitychange", onHidden);
    return () => {
      mounted.current = false;
      releaseCamera();
      document.removeEventListener("visibilitychange", onHidden);
    };
  }, [releaseCamera, closeCamera]);
  useEffect(
    () => () => {
      if (photo) URL.revokeObjectURL(photo.url);
    },
    [photo],
  );
  const openCamera = async (direction = facing) => {
    releaseCamera();
    setError("");
    if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
      setCameraStatus("idle");
      setError(
        "A câmera precisa de uma conexão HTTPS e de um navegador compatível. Você pode enviar uma foto.",
      );
      return;
    }
    setFacing(direction);
    setCameraStatus("requesting");
    const request = cameraRequest.current;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: { ideal: direction },
          width: { ideal: 1280 },
          height: { ideal: 1600 },
        },
      });
      if (
        !mounted.current ||
        request !== cameraRequest.current ||
        !videoRef.current
      ) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }
      streamRef.current = stream;
      setFacing(
        stream.getVideoTracks()[0]?.getSettings().facingMode || direction,
      );
      stream.getVideoTracks().forEach((track) =>
        track.addEventListener(
          "ended",
          () => {
            if (mounted.current && request === cameraRequest.current) {
              closeCamera();
              setError(
                "A câmera foi desconectada. Abra novamente ou envie uma foto.",
              );
            }
          },
          { once: true },
        ),
      );
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      if (mounted.current && request === cameraRequest.current)
        setCameraStatus("live");
    } catch (cameraError) {
      if (mounted.current && request === cameraRequest.current) {
        closeCamera();
        setError(mensagemCamera(cameraError));
      }
    }
  };
  const savePhoto = async (operation, source) => {
    const request = ++photoRequest.current;
    setBusy(true);
    setError("");
    try {
      const picture = await operation();
      if (!mounted.current || request !== photoRequest.current) return;
      closeCamera();
      setPhoto({ ...picture, source, url: URL.createObjectURL(picture.blob) });
    } catch (photoError) {
      if (mounted.current && request === photoRequest.current)
        setError(photoError.message);
    } finally {
      if (mounted.current && request === photoRequest.current) setBusy(false);
    }
  };
  const uploadPhoto = (file) => {
    if (!file) return;
    closeCamera();
    return savePhoto(() => {
      validarFoto(file);
      return prepararFoto(file);
    }, "upload");
  };
  const capturePhoto = () =>
    savePhoto(() => fotografar(videoRef.current, facing === "user"), "camera");
  const removePhoto = () => {
    photoRequest.current++;
    closeCamera();
    setPhoto(null);
    setBusy(false);
    setError("");
  };
  return {
    videoRef,
    cameraStatus,
    facing,
    photo,
    busy,
    error,
    openCamera,
    closeCamera,
    uploadPhoto,
    capturePhoto,
    removePhoto,
  };
}
