import { render } from "@testing-library/react";
import latinize from "latinize";
import { Component, createRef } from "react";
import { describe, expect, test } from "vitest";
import type {
  HighlighterProps,
  HighlightTagProps,
  UnhighlightTagProps
} from "./types";
import { Highlighter } from "./Highlighter";

const HIGHLIGHT_CLASS = "customHighlightClass";
const HIGHLIGHT_QUERY_SELECTOR = `.${HIGHLIGHT_CLASS}`;
const UNHIGHLIGHT_CLASS = "customUnhighlightClass";
const UNHIGHLIGHT_QUERY_SELECTOR = `.${UNHIGHLIGHT_CLASS}`;

function renderHighlighter({
  highlightClassName = HIGHLIGHT_CLASS,
  ...rest
}: HighlighterProps & { [key: `data-${string}`]: string }) {
  const { container } = render(
    <Highlighter
      highlightClassName={highlightClassName}
      unhighlightClassName={UNHIGHLIGHT_CLASS}
      {...rest}
    />
  );

  return container.firstElementChild as HTMLSpanElement;
}

describe("Highlighter", () => {
  test("should properly handle an empty array for searchWords", () => {
    const node = renderHighlighter({
      searchWords: [],
      textToHighlight: "This is text"
    });
    expect(node.children).toHaveLength(1);
    expect(node.querySelectorAll(HIGHLIGHT_QUERY_SELECTOR)).toHaveLength(0);
    expect(node.textContent).toBe("This is text");
  });

  test("should properly handle an empty string for searchWords", () => {
    const node = renderHighlighter({
      searchWords: [""],
      textToHighlight: "This is text"
    });
    expect(node.children).toHaveLength(1);
    expect(node.querySelectorAll(HIGHLIGHT_QUERY_SELECTOR)).toHaveLength(0);
    expect(node.textContent).toBe("This is text");
  });

  test("should properly handle empty textToHighlight", () => {
    const node = renderHighlighter({
      searchWords: ["search"],
      textToHighlight: ""
    });
    expect(node.children).toHaveLength(0);
    expect(node.querySelectorAll(HIGHLIGHT_QUERY_SELECTOR)).toHaveLength(0);
    expect(node.textContent).toBe("");
  });

  test("should handle a missing or non-string textToHighlight", () => {
    let node = renderHighlighter({
      searchWords: ["null"],
      // @ts-expect-error Verifies that a null textToHighlight is handled at runtime
      textToHighlight: null
    });
    expect(node.textContent).toBe("");

    node = renderHighlighter({
      searchWords: ["2"],
      // @ts-expect-error Verifies that a numeric textToHighlight is handled at runtime
      textToHighlight: 123
    });
    expect(node.textContent).toBe("123");
    const matches = node.querySelectorAll(HIGHLIGHT_QUERY_SELECTOR);
    expect(matches).toHaveLength(1);
    expect(matches[0].textContent).toBe("2");
  });

  test("should match string searchWords literally by default", () => {
    const node = renderHighlighter({
      searchWords: ["$9.99", "a+"],
      textToHighlight: "Only $9.99 (or $9x99) for aaa+"
    });
    const matches = node.querySelectorAll(HIGHLIGHT_QUERY_SELECTOR);
    expect(matches).toHaveLength(2);
    expect(matches[0].textContent).toBe("$9.99");
    expect(matches[1].textContent).toBe("a+");
  });

  test("should treat string searchWords as regular expressions when autoEscape is false", () => {
    const node = renderHighlighter({
      autoEscape: false,
      searchWords: ["\\d+"],
      textToHighlight: "Room 101"
    });
    const matches = node.querySelectorAll(HIGHLIGHT_QUERY_SELECTOR);
    expect(matches).toHaveLength(1);
    expect(matches[0].textContent).toBe("101");
  });

  test("should highlight searchText words that exactly match words in textToHighlight", () => {
    const node = renderHighlighter({
      searchWords: ["text"],
      textToHighlight: "This is text"
    });
    expect(node.children).toHaveLength(2);
    const matches = node.querySelectorAll(HIGHLIGHT_QUERY_SELECTOR);
    expect(matches).toHaveLength(1);
    expect(matches[0].textContent).toBe("text");
  });

  test("should handle unclosed parentheses when autoEscape prop is truthy", () => {
    const node = renderHighlighter({
      autoEscape: true,
      searchWords: ["("],
      textToHighlight: "(This is text)"
    });
    expect(node.children).toHaveLength(2);
    expect(node.children[0].textContent).toBe("(");
    expect(node.children[1].textContent).toBe("This is text)");
    const matches = node.querySelectorAll(HIGHLIGHT_QUERY_SELECTOR);
    expect(matches).toHaveLength(1);
    expect(matches[0].textContent).toBe("(");
  });

  test("should highlight searchText words that partial-match text in textToHighlight", () => {
    const node = renderHighlighter({
      searchWords: ["Th"],
      textToHighlight: "This is text"
    });
    expect(node.children).toHaveLength(2);
    const matches = node.querySelectorAll(HIGHLIGHT_QUERY_SELECTOR);
    expect(matches).toHaveLength(1);
    expect(matches[0].textContent).toBe("Th");
    expect(node.children[0].textContent).toBe("Th");
    expect(node.children[1].textContent).toBe("is is text");
  });

  test("should highlight multiple occurrences of a searchText word", () => {
    const node = renderHighlighter({
      searchWords: ["is"],
      textToHighlight: "This is text"
    });
    expect(node.children).toHaveLength(5);
    expect(node.querySelectorAll(HIGHLIGHT_QUERY_SELECTOR)).toHaveLength(2);
    expect(node.textContent).toBe("This is text");
    expect(node.children[0].textContent).toBe("Th");
    expect(node.children[1].textContent).toBe("is");
    expect(node.children[2].textContent).toBe(" ");
    expect(node.children[3].textContent).toBe("is");
    expect(node.children[4].textContent).toBe(" text");
  });

  test("should highlight multiple searchText words", () => {
    const node = renderHighlighter({
      searchWords: ["This", "text"],
      textToHighlight: "This is text"
    });
    expect(node.children).toHaveLength(3);
    expect(node.querySelectorAll(HIGHLIGHT_QUERY_SELECTOR)).toHaveLength(2);
    expect(node.textContent).toBe("This is text");
    expect(node.children[0].textContent).toBe("This");
    expect(node.children[1].textContent).toBe(" is ");
    expect(node.children[2].textContent).toBe("text");
  });

  test("should handle Regex searchText", () => {
    const node = renderHighlighter({
      searchWords: [/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/, "This"],
      textToHighlight: "This is my phone (123) 456 7899"
    });
    expect(node.querySelectorAll(HIGHLIGHT_QUERY_SELECTOR)).toHaveLength(2);
    expect(node.textContent).toBe("This is my phone (123) 456 7899");
    expect(node.children[0].textContent).toBe("This");
    expect(node.children[1].textContent).toBe(" is my phone ");
    expect(node.children[2].textContent).toBe("(123) 456 7899");
  });

  test("should match terms in a case insensitive way but show their case-sensitive representation", () => {
    const node = renderHighlighter({
      searchWords: ["this"],
      textToHighlight: "This is text"
    });
    const matches = node.querySelectorAll(HIGHLIGHT_QUERY_SELECTOR);
    expect(matches).toHaveLength(1);
    expect(matches[0].textContent).toBe("This");
  });

  test("should use the :highlightClassName if specified", () => {
    const node = renderHighlighter({
      searchWords: ["text"],
      textToHighlight: "This is text"
    });
    expect(node.querySelector("mark")).toHaveClass(HIGHLIGHT_CLASS);
  });

  test("should use the :highlightStyle if specified", () => {
    const node = renderHighlighter({
      highlightStyle: { color: "red" },
      searchWords: ["text"],
      textToHighlight: "This is text"
    });
    expect(node.querySelector("mark")?.style.color).toBe("red");
  });

  test("should use the :unhighlightStyle if specified", () => {
    const node = renderHighlighter({
      unhighlightStyle: { color: "gray" },
      searchWords: ["text"],
      textToHighlight: "This is text"
    });
    expect(node.querySelector("span")?.style.color).toBe("gray");
  });

  test("should match terms without accents against text with accents", () => {
    const node = renderHighlighter({
      sanitize: latinize,
      searchWords: ["example"],
      textToHighlight: "ỆᶍǍᶆṔƚÉ"
    });
    const matches = node.querySelectorAll(HIGHLIGHT_QUERY_SELECTOR);
    expect(matches).toHaveLength(1);
    expect(matches[0].textContent).toBe("ỆᶍǍᶆṔƚÉ");
  });

  test("should use the :highlightTag if specified", () => {
    const node = renderHighlighter({
      autoEscape: true,
      highlightTag: "span",
      searchWords: ["text"],
      textToHighlight: "This is text"
    });
    const matches = node.querySelectorAll(HIGHLIGHT_QUERY_SELECTOR);
    expect(matches[0].tagName).toBe("SPAN");
  });

  test("should support class components via :highlightTag", () => {
    class HighlightTag extends Component<HighlightTagProps> {
      render() {
        const { highlightIndex, searchIndex, ...rest } = this.props;

        return (
          <span
            data-index={highlightIndex}
            data-search-index={searchIndex}
            {...rest}
          />
        );
      }
    }

    const node = renderHighlighter({
      autoEscape: true,
      highlightTag: HighlightTag,
      searchWords: ["text"],
      textToHighlight: "This is text"
    });
    const matches = node.querySelectorAll(HIGHLIGHT_QUERY_SELECTOR);
    expect(matches[0].tagName).toBe("SPAN");
  });

  test("should support function components via :highlightTag", () => {
    const HighlightTag = ({
      highlightIndex,
      searchIndex,
      ...rest
    }: HighlightTagProps) => (
      <span
        data-index={highlightIndex}
        data-search-index={searchIndex}
        {...rest}
      />
    );

    const node = renderHighlighter({
      autoEscape: true,
      highlightTag: HighlightTag,
      searchWords: ["text"],
      textToHighlight: "This is text"
    });
    const matches = node.querySelectorAll(HIGHLIGHT_QUERY_SELECTOR);
    expect(matches[0].tagName).toBe("SPAN");
  });

  test("should pass highlightIndex to custom :highlightTag components", () => {
    const HighlightTag = ({
      highlightIndex,
      searchIndex,
      ...rest
    }: HighlightTagProps) => (
      <span
        data-index={highlightIndex}
        data-search-index={searchIndex}
        {...rest}
      />
    );

    const node = renderHighlighter({
      highlightTag: HighlightTag,
      searchWords: ["text"],
      textToHighlight: "text and more text"
    });
    const matches = node.querySelectorAll(HIGHLIGHT_QUERY_SELECTOR);
    expect(matches[0].getAttribute("data-index")).toBe("0");
    expect(matches[1].getAttribute("data-index")).toBe("1");
  });

  test("should apply activeClassName to the match specified by activeIndex", () => {
    const activeClassName = "active";
    const node = renderHighlighter({
      activeIndex: 1,
      activeClassName,
      searchWords: ["text"],
      textToHighlight: "This is text which should have this text highlighted"
    });
    const matches = node.querySelectorAll("mark");
    expect(matches[0]).not.toHaveClass(activeClassName);
    expect(matches[1]).toHaveClass(activeClassName);
  });

  test("should apply activeStyle to the match specified by activeIndex", () => {
    const node = renderHighlighter({
      activeIndex: 1,
      activeStyle: { color: "red" },
      searchWords: ["text"],
      textToHighlight: "This is text which should have this text highlighted"
    });
    const matches = node.querySelectorAll("mark");
    expect(matches[0].style.color).toBe("");
    expect(matches[1].style.color).toBe("red");
  });

  test("should support caseSensitive search", () => {
    const node = renderHighlighter({
      caseSensitive: true,
      searchWords: ["th"],
      textToHighlight: "This the three time"
    });
    const matches = node.querySelectorAll(HIGHLIGHT_QUERY_SELECTOR);
    expect(matches).toHaveLength(2);
    expect(matches[0].textContent).toBe("th");
    expect(matches[1].textContent).toBe("th");
  });

  test("should support custom findChunks prop function", () => {
    const node = renderHighlighter({
      findChunks: () => [
        { start: 0, end: 1, searchIndex: 0 },
        { start: 5, end: 7, searchIndex: 0 }
      ],
      searchWords: ["xxx"],
      textToHighlight: "This is text"
    });
    const matches = node.querySelectorAll(HIGHLIGHT_QUERY_SELECTOR);
    expect(matches).toHaveLength(2);
    expect(matches[0].textContent).toBe("T");
    expect(matches[1].textContent).toBe("is");

    const node2 = renderHighlighter({
      findChunks: () => [],
      searchWords: ["This"],
      textToHighlight: "This is text"
    });
    expect(node2.querySelectorAll(HIGHLIGHT_QUERY_SELECTOR)).toHaveLength(0);
  });

  test("should render chunks with the appropriate classes when case-insensitive", () => {
    const node = renderHighlighter({
      searchWords: ["This", "is", "text"],
      textToHighlight: "This is text",
      highlightClassName: { This: "this", is: "is", text: "text" }
    });
    const allMatches = node.querySelectorAll("mark");
    expect(allMatches).toHaveLength(3);
    expect(allMatches[0]).toHaveClass("this");
    expect(allMatches[1]).toHaveClass("is");
    expect(allMatches[2]).toHaveClass("text");
  });

  test("should render chunks with the appropriate classes when case-sensitive", () => {
    const node = renderHighlighter({
      caseSensitive: true,
      searchWords: ["This", "is", "TEXT"],
      textToHighlight: "This is TEXT",
      highlightClassName: { this: "this", is: "is", text: "text" }
    });
    const allMatches = node.querySelectorAll("mark");
    expect(allMatches).toHaveLength(3);
    expect(allMatches[0]).not.toHaveClass("this");
    expect(allMatches[1]).toHaveClass("is");
    expect(allMatches[2]).not.toHaveClass("text");
  });

  test("should fall back to the matching search word's class when the matched text isn't in the class name map", () => {
    const node = renderHighlighter({
      sanitize: latinize,
      searchWords: ["cafe", "ab", "bc"],
      textToHighlight: "café abc",
      highlightClassName: { CAFE: "cafe", ab: "ab", bc: "bc" }
    });
    const allMatches = node.querySelectorAll("mark");
    expect(allMatches).toHaveLength(2);
    expect(allMatches[0].className).toBe("cafe");
    expect(allMatches[1].className).toBe("ab");
  });

  test("should not render an undefined class when a match isn't in the class name map", () => {
    const node = renderHighlighter({
      searchWords: [/\d+/],
      textToHighlight: "a 12",
      highlightClassName: { other: "other" }
    });
    expect(node.querySelector("mark")?.className).toBe("");
  });

  test("should not throw for missing searchWords when a custom findChunks returns chunks", () => {
    const node = renderHighlighter({
      findChunks: () => [{ start: 0, end: 1, searchIndex: 0 }],
      highlightClassName: { a: "a" },
      // @ts-expect-error Untyped callers may pass null
      searchWords: null,
      textToHighlight: "ab"
    });
    expect(node.querySelector("mark")?.textContent).toBe("a");
  });

  test("should not use inherited object properties as class names", () => {
    const node = renderHighlighter({
      searchWords: ["constructor", "toString"],
      textToHighlight: "constructor toString",
      highlightClassName: { other: "other" }
    });
    const allMatches = node.querySelectorAll("mark");
    expect(allMatches).toHaveLength(2);
    expect(allMatches[0].className).toBe("");
    expect(allMatches[1].className).toBe("");

    const caseSensitiveNode = renderHighlighter({
      caseSensitive: true,
      searchWords: ["toString"],
      textToHighlight: "toString",
      highlightClassName: { other: "other" }
    });
    expect(caseSensitiveNode.querySelector("mark")?.className).toBe("");
  });

  test("should accept readonly searchWords", () => {
    // Also a type check; this would not compile if searchWords had to be a mutable array
    const searchWords = ["is"] as const;
    const node = renderHighlighter({ searchWords, textToHighlight: "This" });
    expect(node.querySelectorAll("mark")).toHaveLength(1);
  });

  test("should not render empty class attributes", () => {
    const { container } = render(
      <Highlighter searchWords={["b"]} textToHighlight="abc" />
    );
    for (const element of container.querySelectorAll("mark, span span")) {
      expect(element.hasAttribute("class")).toBe(false);
    }
  });

  test("should pass an empty className string to custom components", () => {
    const classNames: Array<unknown> = [];
    function Tag({
      children,
      className
    }: {
      children: string;
      className: string;
    }) {
      classNames.push(className);
      return <i>{children}</i>;
    }
    render(
      <Highlighter
        highlightTag={Tag}
        searchWords={["b"]}
        textToHighlight="abc"
        unhighlightTag={Tag}
      />
    );
    expect(classNames).toEqual(["", "", ""]);
  });

  test("should not add extra whitespace to the class name of inactive matches", () => {
    const node = renderHighlighter({
      activeClassName: "active",
      activeIndex: 1,
      searchWords: ["e"],
      textToHighlight: "sleep"
    });
    const matches = node.querySelectorAll("mark");
    expect(matches[0].className).toBe(HIGHLIGHT_CLASS);
    expect(matches[1].className).toBe(`${HIGHLIGHT_CLASS} active`);
  });

  test("should spread additional custom props onto the wrapper span", () => {
    const node = renderHighlighter({
      searchWords: ["This", "is", "TEXT"],
      textToHighlight: "This is TEXT",
      "data-test-attribute": "data attribute content",
      title: "span title",
      className: "test-class"
    });

    expect(node.querySelectorAll(".test-class")).toHaveLength(0);
    expect(node.title).toBe("span title");
    expect(node).toHaveClass("test-class");
    expect(node.dataset.testAttribute).toBe("data attribute content");
  });

  test("should use :unhighlightTag if provided", () => {
    const node = renderHighlighter({
      searchWords: ["This", "is", "TEXT"],
      textToHighlight: "Hello World",
      unhighlightTag: "div"
    });

    const matches = node.querySelectorAll(UNHIGHLIGHT_QUERY_SELECTOR);
    expect(matches).toHaveLength(1);
    expect(matches[0].nodeName).toBe("DIV");
  });

  test("should support class components via :unhighlightTag", () => {
    class UnhighlightTag extends Component<UnhighlightTagProps> {
      render() {
        return <a {...this.props} />;
      }
    }

    const node = renderHighlighter({
      autoEscape: true,
      unhighlightTag: UnhighlightTag,
      searchWords: ["text"],
      textToHighlight: "This is text"
    });
    const matches = node.querySelectorAll(UNHIGHLIGHT_QUERY_SELECTOR);
    expect(matches[0].tagName).toBe("A");
  });

  test("should support function components via :unhighlightTag", () => {
    const UnhighlightTag = (props: UnhighlightTagProps) => <a {...props} />;

    const node = renderHighlighter({
      autoEscape: true,
      unhighlightTag: UnhighlightTag,
      searchWords: ["text"],
      textToHighlight: "This is text"
    });
    const matches = node.querySelectorAll(UNHIGHLIGHT_QUERY_SELECTOR);
    expect(matches[0].tagName).toBe("A");
  });

  test("should forward a ref to the wrapper span", () => {
    const ref = createRef<HTMLSpanElement>();
    const { container } = render(
      <Highlighter ref={ref} searchWords={[]} textToHighlight="text" />
    );
    expect(ref.current).toBe(container.firstElementChild);
  });

  test("should pass searchIndex to custom :highlightTag components", () => {
    const HighlightTag = ({
      highlightIndex,
      searchIndex,
      ...rest
    }: HighlightTagProps) => (
      <span
        data-index={highlightIndex}
        data-search-index={searchIndex}
        {...rest}
      />
    );

    const node = renderHighlighter({
      highlightTag: HighlightTag,
      searchWords: ["more", /te.t/],
      textToHighlight: "text and more text"
    });
    const matches = node.querySelectorAll(HIGHLIGHT_QUERY_SELECTOR);
    expect(matches).toHaveLength(3);
    expect(matches[0].getAttribute("data-search-index")).toBe("1");
    expect(matches[1].getAttribute("data-search-index")).toBe("0");
    expect(matches[2].getAttribute("data-search-index")).toBe("1");
  });

  test("should not escape RegExp searchWords when autoEscape is true", () => {
    const node = renderHighlighter({
      autoEscape: true,
      searchWords: [/t.xt/, "is."],
      textToHighlight: "This is. text"
    });
    const matches = node.querySelectorAll(HIGHLIGHT_QUERY_SELECTOR);
    expect(matches).toHaveLength(2);
    expect(matches[0].textContent).toBe("is.");
    expect(matches[1].textContent).toBe("text");
  });

  test("should match invalid regular expressions literally", () => {
    const node = renderHighlighter({
      searchWords: ["***x", "(a"],
      textToHighlight: "***x and (a"
    });
    const matches = node.querySelectorAll(HIGHLIGHT_QUERY_SELECTOR);
    expect(matches).toHaveLength(2);
    expect(matches[0].textContent).toBe("***x");
    expect(matches[1].textContent).toBe("(a");
  });

  test("should not hang on zero-length matches", () => {
    const node = renderHighlighter({
      searchWords: ["\\b"],
      textToHighlight: "word boundary"
    });
    expect(node.querySelectorAll(HIGHLIGHT_QUERY_SELECTOR)).toHaveLength(0);
    expect(node.textContent).toBe("word boundary");
  });

  test("should highlight adjacent matches individually", () => {
    const activeClassName = "active";
    const node = renderHighlighter({
      activeClassName,
      activeIndex: 1,
      searchWords: ["e"],
      textToHighlight: "sleep"
    });
    const matches = node.querySelectorAll(HIGHLIGHT_QUERY_SELECTOR);
    expect(matches).toHaveLength(2);
    expect(matches[0]).not.toHaveClass(activeClassName);
    expect(matches[1]).toHaveClass(activeClassName);
  });
});
