// <begin>

import Highlighter from "react-highlight-words";

function ClassNamesExample() {
  return (
    <Highlighter
      highlightClassName={{
        alice: "highlight-name",
        bob: "highlight-name",
        paris: "highlight-place"
      }}
      searchWords={["Alice", "Bob", "Paris"]}
      textToHighlight="Alice and Bob met for coffee in Paris."
    />
  );
}

// <end>

export { ClassNamesExample };
