// <begin>

import Highlighter from "react-highlight-words";

function BasicUsageExample() {
  return (
    <Highlighter
      highlightClassName="highlight"
      searchWords={["and", "or", "the"]}
      autoEscape={true}
      textToHighlight="The dog is chasing the cat. Or perhaps they're just playing?"
    />
  );
}

// <end>

export { BasicUsageExample };
