import type { FindChunksOptions, FoundChunk } from "highlight-words-core";
import type { ComponentType, CSSProperties, HTMLAttributes } from "react";

/**
 * A range of text to highlight, as returned by a custom `findChunks` function: `{ start, end, searchIndex }`.
 *
 * ℹ️ This is `FoundChunk` in highlight-words-core (whose own `Chunk` type is different; it also includes a `highlight` property).
 */
export type Chunk = FoundChunk;

export type { FindChunksOptions, FoundChunk };

/**
 * Props passed to a custom `highlightTag` component.
 */
export type HighlightTagProps = {
  children: string;
  className: string;
  highlightIndex: number;

  /**
   * Index (within `searchWords`) of the search word that matched this text.
   *
   * ℹ️ If matches for multiple search words overlap, this is the index of the match that starts first
   * (or, if several start at the same index, the longest of them).
   */
  searchIndex: number;

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
   * Match string search terms literally (defaults to `true`).
   * Set to `false` to treat them as regular expressions.
   * (They are compiled without the `u` flag, so syntax that requires it, such as `\p{L}`, only works in RegExp search terms.)
   *
   * ⚠️ Only set this to `false` for trusted search terms;
   * a malicious regular expression can take an extremely long time to run.
   */
  autoEscape?: boolean | undefined;

  /**
   * Match string search terms case sensitively.
   * RegExp search terms are case sensitive unless they have the `i` flag.
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
   * It receives the search options (with defaults applied) and returns the `start` and `end` index of each range of text to highlight,
   * along with the `searchIndex` of the search word that matched it.
   * Overlapping ranges are combined automatically.
   *
   * See the default `findChunks` function in [highlight-words-core](https://github.com/bvaughn/highlight-words-core) for reference.
   */
  findChunks?: ((options: Required<FindChunksOptions>) => Chunk[]) | undefined;

  /**
   * Class name applied to highlighted text,
   * or an object mapping search term matches to class names.
   *
   * ℹ️ Object keys are compared with the matched text first, then with the string search term that matched it
   * (case insensitively, unless `caseSensitive` is true).
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
   * ℹ️ Custom components will receive `children`, `className`, `highlightIndex`, `searchIndex`, and `style` props.
   */
  highlightTag?: string | ComponentType<HighlightTagProps> | undefined;

  /**
   * Process each string search word and the text to highlight before comparing (e.g. to remove accents).
   * Matches always refer to the original text, even if sanitizing changes its length (e.g. "Æ" to "AE").
   *
   * ℹ️ Sanitizing should transform characters independently;
   * if it changes the text, it is applied to each character separately.
   * RegExp search terms are not sanitized, but they are matched against the sanitized text.
   */
  sanitize?: ((text: string) => string) | undefined;

  /**
   * Array of search words.
   * String search terms are matched literally, unless `autoEscape` is false
   * (in which case they are treated as regular expressions, and strings that aren't valid regular expressions are matched literally).
   * RegExp search terms are used as-is (with their own flags).
   */
  searchWords: ReadonlyArray<string | RegExp>;

  /**
   * Text to highlight matches in.
   *
   * ℹ️ Browsers collapse whitespace and newlines by default; to preserve them, set the `white-space` style (e.g. `style={{ whiteSpace: "pre-wrap" }}`).
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
