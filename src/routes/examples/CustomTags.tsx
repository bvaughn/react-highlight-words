// <begin>

import Highlighter, { type HighlightTagProps } from "react-highlight-words";

function Highlight({ children, highlightIndex }: HighlightTagProps) {
  return (
    <strong className="highlight" title={`Match #${highlightIndex + 1}`}>
      {children}
    </strong>
  );
}

function CustomTagsExample() {
  return (
    <Highlighter
      highlightTag={Highlight}
      searchWords={["the"]}
      textToHighlight="The dog is chasing the cat."
      unhighlightTag="em"
    />
  );
}

// <end>

export { CustomTagsExample };
