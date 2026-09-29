import { useEffect, useRef, useState } from 'react';
import { AJUSTE_STATUS } from '../../domain/statuses.js';

export function useAtelieDrag(onMove) {
  const active = useRef(null);
  const pointer = useRef(null);
  const [dragging, setDragging] = useState(null);
  const [over, setOver] = useState(null);
  const reset = () => {
    active.current = null;
    pointer.current = null;
    setDragging(null);
    setOver(null);
  };
  useEffect(() => {
    const cancel = event => { if (event.key === 'Escape') reset(); };
    window.addEventListener('keydown', cancel);
    return () => window.removeEventListener('keydown', cancel);
  }, []);
  const start = id => {
    active.current = id;
    setDragging(id);
  };
  const finish = status => {
    const id = active.current;
    reset();
    if (id !== null && AJUSTE_STATUS.includes(status)) onMove(id, status);
  };
  const targetAt = event => document.elementFromPoint(event.clientX, event.clientY)
    ?.closest('[data-atelie-status]')?.getAttribute('data-atelie-status');

  return {
    dragging,
    over,
    cardProps: id => ({
      draggable: true,
      onDragStart: event => {
        start(id);
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', String(id));
      },
      onDragEnd: reset,
    }),
    columnProps: status => ({
      'data-atelie-status': status,
      onDragOver: event => {
        if (active.current === null) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        setOver(status);
      },
      onDragLeave: event => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOver(null);
      },
      onDrop: event => {
        if (active.current === null) return;
        event.preventDefault();
        finish(status);
      },
    }),
    touchProps: id => ({
      onPointerDown: event => {
        if (event.pointerType === 'mouse' || !event.isPrimary) return;
        pointer.current = { id, x: event.clientX, y: event.clientY };
        event.currentTarget.setPointerCapture(event.pointerId);
      },
      onPointerMove: event => {
        const origin = pointer.current;
        if (!origin) return;
        if (active.current === null && Math.hypot(event.clientX - origin.x, event.clientY - origin.y) < 8) return;
        if (active.current === null) start(origin.id);
        setOver(targetAt(event) || null);
        if (event.clientY < 64) window.scrollBy(0, -20);
        if (event.clientY > window.innerHeight - 64) window.scrollBy(0, 20);
      },
      onPointerUp: event => { if (pointer.current) finish(targetAt(event)); },
      onPointerCancel: reset,
      onLostPointerCapture: reset,
    }),
  };
}
