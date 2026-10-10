import { Highlighter } from "./components/Highlighter";

export type {
  Chunk,
  FindChunksOptions,
  HighlighterProps,
  HighlightTagProps,
  UnhighlightTagProps
} from "./components/types";

// Only a default (value) export, so that require("react-highlight-words") continues to return the component
export default Highlighter;
