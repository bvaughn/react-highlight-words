// <begin>

import Highlighter from "react-highlight-words";

function RegExpExample() {
  return (
    <Highlighter
      searchWords={[/\$\d+\.\d{2}/]}
      textToHighlight="Was $12.99, today only $9.99"
    />
  );
}

// <end>

export { RegExpExample };
