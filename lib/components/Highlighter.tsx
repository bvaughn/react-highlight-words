import { findAll } from "highlight-words-core";
import { createElement, type ReactElement } from "react";
import type { HighlighterProps } from "./types";

/**
 * Highlights all occurrences of one or more search terms within a larger body of text.
 *
 * Highlighted matches are wrapped in a `<mark>` element by default, and unhighlighted text is wrapped in a `<span>`.
 * Both of these can be customized with the `highlightTag` and `unhighlightTag` props.
 *
 * ℹ️ Any other props (such as `title` or `data-*` attributes) are applied to the outer/wrapper `<span>`.
 */
export function Highlighter({
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
}: HighlighterProps): ReactElement {
  const chunks = findAll({
    autoEscape,
    caseSensitive,
    findChunks,
    sanitize,
    searchWords,
    textToHighlight
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
    children: chunks.map((chunk, index) => {
      const text = textToHighlight.substr(chunk.start, chunk.end - chunk.start);

      if (chunk.highlight) {
        highlightIndex++;

        let highlightClass;
        if (typeof highlightClassNameMap === "object") {
          highlightClass =
            highlightClassNameMap[caseSensitive ? text : text.toLowerCase()];
        } else {
          highlightClass = highlightClassNameMap;
        }

        const isActive = highlightIndex === +activeIndex;

        const props = {
          children: text,
          className: `${highlightClass} ${isActive ? activeClassName : ""}`,
          key: index,
          style:
            isActive && activeStyle != null
              ? { ...highlightStyle, ...activeStyle }
              : highlightStyle
        };

        // Don't attach arbitrary props to DOM elements; this triggers React DEV warnings (https://fb.me/react-unknown-prop)
        // Only pass through the highlightIndex attribute for custom components.
        if (typeof highlightTag === "string") {
          return createElement(highlightTag, props);
        } else {
          return createElement(highlightTag, { ...props, highlightIndex });
        }
      } else {
        return createElement(unhighlightTag, {
          children: text,
          className: unhighlightClassName,
          key: index,
          style: unhighlightStyle
        });
      }
    })
  });
}

function lowerCaseKeys(object: Record<string, string>) {
  const mapped: Record<string, string> = {};
  for (const key in object) {
    mapped[key.toLowerCase()] = object[key];
  }
  return mapped;
}
