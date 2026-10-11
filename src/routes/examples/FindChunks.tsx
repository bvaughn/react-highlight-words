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

  for (const [searchIndex, searchWord] of searchWords.entries()) {
    const source =
      typeof searchWord === "string"
        ? searchWord.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
        : searchWord.source;
    if (!source) {
      continue;
    }

    // Group the source so that e.g. "cat|dog" can't match part of "hotdog"
    const regex = new RegExp(`\\b(?:${source})\\b`, "gi");

    let match;
    while ((match = regex.exec(textToHighlight))) {
      if (match.index === regex.lastIndex) {
        // Skip zero-length matches (e.g. /x*/); otherwise this would loop forever
        regex.lastIndex++;
      } else {
        chunks.push({ start: match.index, end: regex.lastIndex, searchIndex });
      }
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
