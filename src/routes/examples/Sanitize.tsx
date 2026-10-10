// <begin>

import latinize from "latinize";
import Highlighter from "react-highlight-words";

function SanitizeExample() {
  return (
    <Highlighter
      sanitize={latinize}
      searchWords={["cafe", "creme"]}
      textToHighlight="Café au lait or crème brûlée?"
    />
  );
}

// <end>

export { SanitizeExample };
