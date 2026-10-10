import type { ComponentType, CSSProperties, HTMLAttributes } from "react";

/**
 * A range of text (start inclusive, end exclusive) that should be highlighted.
 */
export type Chunk = {
  end: number;
  start: number;
};

/**
 * Options passed to a custom `findChunks` function.
 */
export type FindChunksOptions = {
  autoEscape?: boolean | undefined;
  caseSensitive?: boolean | undefined;
  sanitize?: ((text: string) => string) | undefined;
  searchWords: Array<string | RegExp>;
  textToHighlight: string;
};

/**
 * Props passed to a custom `highlightTag` component.
 */
export type HighlightTagProps = {
  children: string;
  className: string;
  highlightIndex: number;
  style: CSSProperties;
};

/**
 * Props passed to a custom `unhighlightTag` component.
 */
export type UnhighlightTagProps = {
  children: string;
  className: string;
  style: CSSProperties | undefined;
};

export type HighlighterProps = Omit<
  HTMLAttributes<HTMLSpanElement>,
  "children"
> & {
  /**
   * Class name applied to the active match.
   *
   * ℹ️ Use along with `activeIndex`.
   */
  activeClassName?: string | undefined;

  /**
   * Index of the match that should be actively highlighted.
   *
   * ℹ️ Use along with `activeClassName` or `activeStyle`.
   */
  activeIndex?: number | undefined;

  /**
   * Inline styles applied to the active match.
   *
   * ℹ️ Use along with `activeIndex`.
   */
  activeStyle?: CSSProperties | undefined;

  /**
   * Escape characters in `searchWords` that are meaningful in regular expressions.
   */
  autoEscape?: boolean | undefined;

  /**
   * Search should be case sensitive.
   */
  caseSensitive?: boolean | undefined;

  /**
   * Class name applied to the outer/wrapper `<span>`.
   */
  className?: string | undefined;

  /**
   * Custom function to search for matching chunks.
   * This makes it possible to use arbitrary logic when looking for matches.
   *
   * See the default `findChunks` function in [highlight-words-core](https://github.com/bvaughn/highlight-words-core) for its signature.
   */
  findChunks?: ((options: FindChunksOptions) => Chunk[]) | undefined;

  /**
   * Class name applied to highlighted text,
   * or an object mapping search term matches to class names.
   */
  highlightClassName?: string | Record<string, string> | undefined;

  /**
   * Inline styles applied to highlighted text.
   */
  highlightStyle?: CSSProperties | undefined;

  /**
   * Type of tag to wrap around highlighted matches.
   * Defaults to `mark` but can also be a React component (class or function).
   *
   * ℹ️ Custom components will receive `children`, `className`, `highlightIndex`, and `style` props.
   */
  highlightTag?: string | ComponentType<HighlightTagProps> | undefined;

  /**
   * Process each search word and the text to highlight before comparing (e.g. to remove accents).
   */
  sanitize?: ((text: string) => string) | undefined;

  /**
   * Array of search words.
   * String search terms are automatically cast to RegExps unless `autoEscape` is true.
   */
  searchWords: Array<string | RegExp>;

  /**
   * Text to highlight matches in.
   */
  textToHighlight: string;

  /**
   * Class name applied to unhighlighted text.
   */
  unhighlightClassName?: string | undefined;

  /**
   * Inline styles applied to unhighlighted text.
   */
  unhighlightStyle?: CSSProperties | undefined;

  /**
   * Type of tag applied to unhighlighted parts of the text.
   * Defaults to `span` but can also be a React component (class or function).
   */
  unhighlightTag?: string | ComponentType<UnhighlightTagProps> | undefined;
};
