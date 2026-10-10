// <begin>

import Highlighter from "react-highlight-words";

function AutoEscapeExample() {
  return (
    <Highlighter
      autoEscape={true}
      searchWords={["$9.99", "(sale)"]}
      textToHighlight="Today only (sale): $9.99"
    />
  );
}

// <end>

export { AutoEscapeExample };
