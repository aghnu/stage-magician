export function useCleanup(run: () => (() => void) | undefined) {
  return run() ?? (() => {});
}
