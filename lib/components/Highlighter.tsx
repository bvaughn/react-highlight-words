import { findAll } from "highlight-words-core";
import { createElement, forwardRef } from "react";
import type { HighlighterProps } from "./types";

/**
 * Highlights all occurrences of one or more search terms within a larger body of text.
 *
 * Highlighted matches are wrapped in a `<mark>` element by default, and unhighlighted text is wrapped in a `<span>`.
 * Both of these can be customized with the `highlightTag` and `unhighlightTag` props.
 *
 * ℹ️ Any other props (such as `title` or `data-*` attributes) are applied to the outer/wrapper `<span>`, and a `ref` is forwarded to it.
 */
export const Highlighter = forwardRef<HTMLSpanElement, HighlighterProps>(
  function Highlighter(
    {
      activeClassName = "",
      activeIndex = -1,
      activeStyle,
      autoEscape,
      caseSensitive = false,
      className,
      findChunks,
      highlightClassName = "",
      highlightStyle = {},
      highlightTag = "mark",
      sanitize,
      searchWords,
      textToHighlight,
      unhighlightClassName = "",
      unhighlightStyle,
      unhighlightTag = "span",
      ...rest
    },
    ref
  ) {
    // Match highlight-words-core, which accepts e.g. a number or a missing value from untyped callers
    const text = String(textToHighlight ?? "");

    const chunks = findAll({
      autoEscape,
      caseSensitive,
      findChunks,
      sanitize,
      searchWords,
      textToHighlight: text
    });

    // Class name maps are matched against lowercased text unless the search is case sensitive
    const highlightClassNameMap =
      typeof highlightClassName === "object" && !caseSensitive
        ? lowerCaseKeys(highlightClassName)
        : highlightClassName;

    let highlightIndex = -1;

    return createElement("span", {
      className,
      ...rest,
      ref,
      children: chunks.map((chunk, index) => {
        const chunkText = text.substring(chunk.start, chunk.end);

        if (chunk.highlight) {
          highlightIndex++;

          let highlightClass;
          if (typeof highlightClassNameMap === "object") {
            // The matched text may not be a key (e.g. if sanitize changed it, or overlapping matches were combined),
            // so fall back to the search word that matched.
            // (Untyped callers may pass null searchWords, even though a custom findChunks returned chunks.)
            const searchWord = searchWords?.[chunk.searchIndex];
            highlightClass =
              getOwnValue(
                highlightClassNameMap,
                caseSensitive ? chunkText : chunkText.toLowerCase()
              ) ??
              (typeof searchWord === "string"
                ? getOwnValue(
                    highlightClassNameMap,
                    caseSensitive ? searchWord : searchWord.toLowerCase()
                  )
                : undefined);
          } else {
            highlightClass = highlightClassNameMap;
          }

          const isActive = highlightIndex === +activeIndex;

          const props = {
            children: chunkText,
            className: [highlightClass, isActive ? activeClassName : ""]
              .filter(Boolean)
              .join(" "),
            key: index,
            style:
              isActive && activeStyle != null
                ? { ...highlightStyle, ...activeStyle }
                : highlightStyle
          };

          // Don't attach arbitrary props to DOM elements; this triggers React DEV warnings (https://fb.me/react-unknown-prop)
          // Only pass through the highlightIndex and searchIndex props for custom components.
          if (typeof highlightTag === "string") {
            return createElement(highlightTag, {
              ...props,
              // Omit the attribute rather than rendering class=""
              className: props.className || undefined
            });
          } else {
            return createElement(highlightTag, {
              ...props,
              highlightIndex,
              searchIndex: chunk.searchIndex
            });
          }
        } else {
          const props = {
            children: chunkText,
            className: unhighlightClassName,
            key: index,
            style: unhighlightStyle
          };

          if (typeof unhighlightTag === "string") {
            return createElement(unhighlightTag, {
              ...props,
              // Omit the attribute rather than rendering class=""
              className: props.className || undefined
            });
          } else {
            return createElement(unhighlightTag, props);
          }
        }
      })
    });
  }
);

/**
 * Only reads the object's own properties;
 * inherited ones (e.g. "constructor" or "toString") aren't class names, even if the text matches them.
 */
function getOwnValue(
  object: Record<string, string>,
  key: string
): string | undefined {
  return Object.prototype.hasOwnProperty.call(object, key)
    ? object[key]
    : undefined;
}

function lowerCaseKeys(object: Record<string, string>) {
  // No prototype, so that keys like "__proto__" are stored as regular keys
  const mapped: Record<string, string> = Object.create(null);
  for (const key in object) {
    mapped[key.toLowerCase()] = object[key];
  }
  return mapped;
}
