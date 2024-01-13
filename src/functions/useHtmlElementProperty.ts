import { Bindable } from "@/utils/Bindable.ts";
import { useAnimationLoop } from "./useAnimation.ts";

type HtmlElementPropertyReduceFunc<T> = (element: HTMLElement) => T;

export function useHtmlElementProperty<T>(
  element: Bindable<HTMLElement | undefined | null>,
  reduceFunc: HtmlElementPropertyReduceFunc<T>,
) {
  const propertyVal = new Bindable<T | null>(null);

  const { start, stop } = useAnimationLoop(() => {
    const el = element.get();
    if (el !== null && el !== undefined) propertyVal.set(reduceFunc(el));
  });

  return {
    propertyVal,

    stop,
    start,
  };
}
