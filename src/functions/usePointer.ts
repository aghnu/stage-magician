import { Bindable } from "@/utils/Bindable.ts";
import { useAnimationLoop } from "./useAnimation.ts";

interface Position {
  x: number;
  y: number;
}

export function usePointerPosition() {
  const pointerPositionX = new Bindable(0);
  const pointerPositionY = new Bindable(0);
  const pointerPosition = new Bindable<Position>({ x: 0, y: 0 });

  const {
    start: startpPointerPositionUpdate,
    stop: stopPointerPositionUpdate,
  } = useAnimationLoop(() => {
    pointerPosition.set({
      x: pointerPositionX.get(),
      y: pointerPositionY.get(),
    });
  });

  function handleMousePositionUpdate(e: MouseEvent) {
    pointerPositionX.set(e.clientX);
    pointerPositionY.set(e.clientY);
  }

  function handleTouchPositionUpdate(e: TouchEvent) {
    pointerPositionX.set(e.touches[0].clientX);
    pointerPositionY.set(e.touches[0].clientY);
  }

  function start() {
    startpPointerPositionUpdate();
    window.addEventListener("mousedown", handleMousePositionUpdate);
    window.addEventListener("touchmove", handleTouchPositionUpdate);

    window.addEventListener("mousemove", handleMousePositionUpdate);
    window.addEventListener("touchmove", handleTouchPositionUpdate);
  }

  function stop() {
    stopPointerPositionUpdate();
    window.removeEventListener("mousedown", handleMousePositionUpdate);
    window.removeEventListener("touchmove", handleTouchPositionUpdate);

    window.removeEventListener("mousemove", handleMousePositionUpdate);
    window.removeEventListener("touchmove", handleTouchPositionUpdate);
  }

  return {
    pointerPositionX,
    pointerPositionY,
    pointerPosition,

    start,
    stop,
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

  function start() {
    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("touchstart", handlePointerDown);

    window.addEventListener("mouseout", handlePointerUp);
    window.addEventListener("mouseup", handlePointerUp);
    window.addEventListener("touchend", handlePointerUp);
    window.addEventListener("touchcancel", handlePointerUp);
  }

  function stop() {
    window.removeEventListener("mousedown", handlePointerDown);
    window.removeEventListener("touchstart", handlePointerDown);

    window.removeEventListener("mouseout", handlePointerUp);
    window.removeEventListener("mouseup", handlePointerUp);
    window.removeEventListener("touchend", handlePointerUp);
    window.removeEventListener("touchcancel", handlePointerUp);
  }

  return {
    pointerDown,

    start,
    stop,
  };
}

export function usePointerDragVector() {
  const {
    pointerPosition,
    start: startPointerPosition,
    stop: stopPointerPosition,
  } = usePointerPosition();

  const {
    pointerDown,
    start: startPointerState,
    stop: stopPointerState,
  } = usePointerState();

  const pointerDragVectorX = new Bindable(0);
  const pointerDragVectorY = new Bindable(0);
  const pointerDragVector = new Bindable<Position>({ x: 0, y: 0 });

  function handleSetVector(
    positionNew: Position,
    positionOld: Position | undefined,
  ) {
    if (!pointerDown.get() || positionOld === undefined) {
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

  function start() {
    startPointerPosition();
    startPointerState();
    pointerPosition.bind(handleSetVector);
  }

  function stop() {
    stopPointerPosition();
    stopPointerState();
    pointerPosition.unbind(handleSetVector);
  }

  return {
    pointerDragVectorX,
    pointerDragVectorY,
    pointerDragVector,

    start,
    stop,
  };
}
