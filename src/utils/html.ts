import { type ElementRectConfig } from "@/type/html.ts";

export function checkIsElementInView(
  elementRectConfig: ElementRectConfig,
  viewRectConfig: ElementRectConfig,
  {
    detectTop = true,
    detectBottom = true,
    detectRight = true,
    detectLeft = true,
  }: {
    detectTop?: boolean;
    detectBottom?: boolean;
    detectRight?: boolean;
    detectLeft?: boolean;
  } = {},
) {
  return (
    (!detectTop || elementRectConfig.top >= viewRectConfig.top) &&
    (!detectLeft || elementRectConfig.left >= viewRectConfig.left) &&
    (!detectBottom ||
      viewRectConfig.top + viewRectConfig.height >=
        elementRectConfig.top + elementRectConfig.height) &&
    (!detectRight ||
      viewRectConfig.left + viewRectConfig.width >=
        elementRectConfig.left + elementRectConfig.width)
  );
}
