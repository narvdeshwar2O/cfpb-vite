import { lazy, type ComponentType } from "react";

// Named exports lazy loading utility
export function lazyImport<
  T extends ComponentType<unknown>,
  I extends { [K2 in K]: T },
  K extends keyof I
>(factory: () => Promise<I>, name: K): React.LazyExoticComponent<T> {
  return lazy(() =>
    factory().then((module) => ({
      default: module[name],
    }))
  );
}
