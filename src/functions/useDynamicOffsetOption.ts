import { Bindable } from "@/utils/Bindable.ts";
import { useAnimationLoop } from "./useAnimation.ts";
import {
  type Vector,
  type ElementRectConfig,
  type OffsetOption,
} from "@/type/html.ts";
import { useCleanup } from "./useCleanup.ts";
import { checkIsElementInView } from "@/utils/html.ts";

export function useDynamicOffsetOption<T extends string>(
  rectContent: () => ElementRectConfig,
  rectAnchor: () => ElementRectConfig,
  positionDefault: () => T,
  positionOffsetOptions: (context: {
    distanceOffsets: Vector;
    rectContent: ElementRectConfig;
    rectAnchor: ElementRectConfig;
  }) => Array<OffsetOption<T>>,
  {
    detectLeft = () => true,
    detectRight = () => true,
    detectTop = () => true,
    detectBottom = () => true,
    rectView = () => {
      return {
        top: 0,
        left: 0,
        height: window.innerHeight,
        width: window.innerWidth,
      };
    },
  }: {
    detectLeft?: () => boolean;
    detectRight?: () => boolean;
    detectTop?: () => boolean;
    detectBottom?: () => boolean;
    rectView?: () => ElementRectConfig;
  } = {},
) {
  const position = new Bindable<T>(positionDefault());
  const state = new Bindable<ReturnType<typeof calculateState>>(
    calculateState(),
  );

  const { cleanup: stopAnimationLoop } = useAnimationLoop(() => {
    state.set(calculateState());
  });

  function handlePositionChange(state: ReturnType<typeof calculateState>) {
    const anchorCenterY = state.rectAnchor.top + state.rectAnchor.height / 2;
    const anchorCenterX = state.rectAnchor.left + state.rectAnchor.width / 2;

    const avaliableOffsetOptions = state.positionOffsetOptions
      .filter((o) =>
        checkIsElementInView(
          {
            width: state.rectContent.width,
            height: state.rectContent.height,
            top: anchorCenterY + o.offset.y - state.rectContent.height / 2,
            left: anchorCenterX + o.offset.x - state.rectContent.width / 2,
          },
          state.rectView,
          {
            detectBottom: state.detectBottom,
            detectLeft: state.detectLeft,
            detectRight: state.detectRight,
            detectTop: state.detectTop,
          },
        ),
      )
      .map((o) => o.option);

    position.set(
      avaliableOffsetOptions.length === 0
        ? position.get()
        : avaliableOffsetOptions.includes(state.positionDefault)
          ? state.positionDefault
          : avaliableOffsetOptions[0],
    );
  }

  function calculateState() {
    const contentRect = rectContent();
    const anchorRect = rectAnchor();

    return {
      rectContent: contentRect,
      rectAnchor: anchorRect,
      rectView: rectView(),
      positionDefault: positionDefault(),
      positionOffsetOptions: positionOffsetOptions({
        distanceOffsets: {
          x: (contentRect.width + anchorRect.width) / 2,
          y: (contentRect.height + anchorRect.height) / 2,
        },
        rectContent: contentRect,
        rectAnchor: anchorRect,
      }),
      detectBottom: detectBottom(),
      detectRight: detectRight(),
      detectLeft: detectLeft(),
      detectTop: detectTop(),
    };
  }

  const cleanup = useCleanup(() => {
    state.bind(handlePositionChange);
    return () => {
      stopAnimationLoop();
      state.unbind(handlePositionChange);
    };
  });

  return { position, cleanup };
}
