import { Bindable } from "@/utils/Bindable.ts";
import { useAnimationLoop } from "./useAnimation.ts";
import { useCleanup } from "./useCleanup.ts";
import { type Vector } from "@/type/html.ts";

export function usePointerPosition() {
  const pointerPositionX = new Bindable<number | null>(null);
  const pointerPositionY = new Bindable<number | null>(null);
  const pointerPosition = new Bindable<Vector | null>(null);

  const { cleanup: cleanupAnimationLoop } = useAnimationLoop(() => {
    const x = pointerPositionX.get();
    const y = pointerPositionY.get();

    pointerPosition.set(
      x !== null && y !== null
        ? {
            x,
            y,
          }
        : null,
    );
  });

  function resetPosition() {
    pointerPositionX.set(null);
    pointerPositionX.set(null);
  }

  function handleMousePositionUpdate(e: MouseEvent) {
    pointerPositionX.set(e.clientX);
    pointerPositionY.set(e.clientY);
  }

  function handleTouchPositionUpdate(e: TouchEvent) {
    pointerPositionX.set(e.touches[0].clientX);
    pointerPositionY.set(e.touches[0].clientY);
  }

  const cleanup = useCleanup(() => {
    window.addEventListener("touchcancel", resetPosition);
    window.addEventListener("touchend", resetPosition);

    window.addEventListener("mousemove", handleMousePositionUpdate);
    window.addEventListener("touchmove", handleTouchPositionUpdate);

    return () => {
      cleanupAnimationLoop();
      window.removeEventListener("touchcancel", resetPosition);
      window.removeEventListener("touchend", resetPosition);

      window.removeEventListener("mousemove", handleMousePositionUpdate);
      window.removeEventListener("touchmove", handleTouchPositionUpdate);
    };
  });

  return {
    pointerPositionX,
    pointerPositionY,
    pointerPosition,

    cleanup,
  };
}

export function usePointerState() {
  const pointerDown = new Bindable(false);

  function handlePointerUp() {
    pointerDown.set(false);
  }

  function handlePointerDown() {
    pointerDown.set(true);
  }

  const cleanup = useCleanup(() => {
    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("touchstart", handlePointerDown);

    window.addEventListener("blur", handlePointerUp);
    window.addEventListener("mouseup", handlePointerUp);
    window.addEventListener("touchend", handlePointerUp);
    window.addEventListener("touchcancel", handlePointerUp);

    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("touchstart", handlePointerDown);

      window.removeEventListener("blur", handlePointerUp);
      window.removeEventListener("mouseup", handlePointerUp);
      window.removeEventListener("touchend", handlePointerUp);
      window.removeEventListener("touchcancel", handlePointerUp);
    };
  });

  return {
    pointerDown,

    cleanup,
  };
}

export function usePointerDragVector() {
  const { pointerPosition, cleanup: cleanupPointerPosition } =
    usePointerPosition();

  const { pointerDown, cleanup: cleanupPointerState } = usePointerState();

  const pointerDragVectorX = new Bindable(0);
  const pointerDragVectorY = new Bindable(0);
  const pointerDragVector = new Bindable<Vector>({ x: 0, y: 0 });

  function handleSetVector(
    positionNew: Vector | null,
    positionOld: Vector | null | undefined,
  ) {
    if (
      !pointerDown.get() ||
      positionOld === null ||
      positionNew === null ||
      positionOld === undefined
    ) {
      pointerDragVectorX.set(0);
      pointerDragVectorY.set(0);
    } else {
      pointerDragVectorX.set(positionNew.x - positionOld.x);
      pointerDragVectorY.set(positionNew.y - positionOld.y);
    }
    pointerDragVector.set({
      x: pointerDragVectorX.get(),
      y: pointerDragVectorY.get(),
    });
  }

  const cleanup = useCleanup(() => {
    pointerPosition.bind(handleSetVector);

    return () => {
      cleanupPointerPosition();
      cleanupPointerState();
      pointerPosition.unbind(handleSetVector);
    };
  });

  return {
    pointerDragVectorX,
    pointerDragVectorY,
    pointerDragVector,

    cleanup,
  };
}
