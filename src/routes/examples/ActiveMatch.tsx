// <begin>

import Highlighter from "react-highlight-words";

function ActiveMatchExample({ activeIndex }: { activeIndex: number }) {
  return (
    <Highlighter
      activeClassName="active"
      activeIndex={activeIndex}
      searchWords={["the"]}
      textToHighlight="The dog is chasing the cat. Or perhaps they're just playing in the yard?"
    />
  );
}

// <end>

export { ActiveMatchExample };
