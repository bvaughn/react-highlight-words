// <begin>

import Highlighter, {
  type Chunk,
  type FindChunksOptions
} from "react-highlight-words";

// Only match whole words (e.g. "the" should not match "there")
function findWholeWords({
  searchWords,
  textToHighlight
}: FindChunksOptions): Chunk[] {
  const chunks: Chunk[] = [];

  for (const searchWord of searchWords) {
    const source =
      typeof searchWord === "string"
        ? searchWord.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
        : searchWord.source;
    if (!source) {
      continue;
    }

    const regex = new RegExp(`\\b${source}\\b`, "gi");

    let match;
    while ((match = regex.exec(textToHighlight))) {
      chunks.push({ start: match.index, end: regex.lastIndex });
    }
  }

  return chunks;
}

function FindChunksExample() {
  return (
    <Highlighter
      findChunks={findWholeWords}
      searchWords={["the"]}
      textToHighlight="There they go, the other way, over there."
    />
  );
}

// <end>

export { FindChunksExample };
