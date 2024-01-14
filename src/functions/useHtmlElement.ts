import { Bindable } from "@/utils/Bindable.ts";
import { useAnimationLoop } from "./useAnimation.ts";
import { type ElementRectConfig } from "@/type/html.ts";

type HtmlElementPropertyReduceFunc<T> = (element: HTMLElement) => T;

export function useHtmlElementProperty<T>(
  element: HTMLElement | null,
  reduceFunc: HtmlElementPropertyReduceFunc<T>,
) {
  const value = new Bindable<T | null>(null);
  const { cleanup } = useAnimationLoop(() => {
    value.set(element === null ? null : reduceFunc(element));
  });

  return {
    value,
    cleanup,
  };
}

export function useHtmlElementRectConfig(element: HTMLElement | null) {
  const { value, cleanup } = useHtmlElementProperty<ElementRectConfig>(
    element,
    (el) =>
      (({ top, left, height, width }) => {
        return {
          top,
          left,
          height,
          width,
        };
      })(el.getBoundingClientRect()),
  );

  return {
    value,
    cleanup,
  };
}
