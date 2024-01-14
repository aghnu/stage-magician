import { useCleanup } from "./useCleanup.ts";

type AnimationFrameFunc = (context: {
  timeStamp: number;
  timeElapsed: number;
}) => void;

export function useAnimationLoop(animationFrameFunc: AnimationFrameFunc) {
  let currentAnimationFrameId: number | undefined;
  let timeStampLast: number | undefined;

  function loop() {
    currentAnimationFrameId = window.requestAnimationFrame((timeStamp) => {
      if (timeStampLast === undefined) timeStampLast = timeStamp;
      const timeElapsed = timeStamp - timeStampLast;

      animationFrameFunc({ timeStamp, timeElapsed });
      loop();
    });
  }

  const cleanup = useCleanup(() => {
    loop();
    return () => {
      if (currentAnimationFrameId === undefined) return;
      window.cancelAnimationFrame(currentAnimationFrameId);
      currentAnimationFrameId = undefined;
    };
  });

  return {
    cleanup,
  };
}
