import { lazy, type ComponentType, type LazyExoticComponent } from "react";

export type Route = LazyExoticComponent<ComponentType<unknown>>;

export const routes = {
  "/examples/basic": lazy(() => import("./routes/BasicUsageRoute")),
  "/examples/active-match": lazy(() => import("./routes/ActiveMatchRoute")),
  "/examples/class-names": lazy(() => import("./routes/ClassNamesRoute")),
  "/examples/custom-tags": lazy(() => import("./routes/CustomTagsRoute")),
  "/examples/find-chunks": lazy(() => import("./routes/FindChunksRoute")),
  "/examples/sanitize": lazy(() => import("./routes/SanitizeRoute")),
  "/playground": lazy(() => import("./routes/PlaygroundRoute")),
  "/props": lazy(() => import("./routes/HighlighterPropsRoute"))
} satisfies Record<string, Route>;

export type Routes = Record<keyof typeof routes, Route>;
export type Path = keyof Routes;
