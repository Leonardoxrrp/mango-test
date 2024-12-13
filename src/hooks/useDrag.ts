import { useRef, useState, useEffect } from 'react';

interface UseDragArgs {
  onDrag: (deltaX: number, deltaY: number) => void;
  onDragStart?: () => void;
}

interface UseDragReturn {
  handleRef: any;
  isDragging: boolean;
}

export default function useDrag({ onDrag, onDragStart }: UseDragArgs): UseDragReturn {
  const handleRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (!isDragging) return;
      const deltaX = e.clientX - startX;
      onDrag(deltaX, 0);
    }

    function onMouseUp() {
      setIsDragging(false);
    }

    if (isDragging) {
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging, startX, onDrag]);

  useEffect(() => {
    const handle = handleRef.current;
    if (!handle) return;

    function onMouseDown(e: MouseEvent) {
      e.preventDefault();
      setStartX(e.clientX);
      setIsDragging(true);
      if (onDragStart) {
        onDragStart();
      }
    }

    handle.addEventListener('mousedown', onMouseDown);
    return () => {
      handle.removeEventListener('mousedown', onMouseDown);
    };
  }, [onDragStart]);

  return { handleRef, isDragging };
}