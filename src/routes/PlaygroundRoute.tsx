import latinize from "latinize";
import { useState } from "react";
import { Box, Checkbox, Header, Input } from "react-lib-tools";
import Highlighter from "react-highlight-words";
import { Demo } from "../components/Demo";

// Overrides the react-lib-tools Input defaults (transparent border, emerald focus ring),
// which are nearly invisible against the dark page background
const FIELD_CLASS_NAME =
  "bg-zinc-900! border-zinc-600! hover:border-zinc-400! focus:border-yellow-300! transition-colors";

const DEFAULT_TEXT =
  "When in the Course of human events it becomes necessary for one people to dissolve the political bands which have connected them with another and to assume among the powers of the earth, the separate and equal station to which the Laws of Nature and of Nature's God entitle them, a decent respect to the opinions of mankind requires that they should declare the causes which impel them to the separation.";

export default function PlaygroundRoute() {
  const [searchText, setSearchText] = useState("and or the");
  const [textToHighlight, setTextToHighlight] = useState(DEFAULT_TEXT);
  const [activeIndex, setActiveIndex] = useState("-1");
  const [caseSensitive, setCaseSensitive] = useState(false);

  const searchWords = searchText.split(/\s/).filter((word) => word);

  return (
    <Box direction="column" gap={4}>
      <Header title="Playground" />
      <Box direction="row" gap={4} wrap>
        <label className="flex flex-col gap-1 grow">
          Search terms
          <Input
            className={FIELD_CLASS_NAME}
            onChange={setSearchText}
            value={searchText}
          />
        </label>
        <label className="flex flex-col gap-1">
          Active index
          <Input
            className={`w-24 ${FIELD_CLASS_NAME}`}
            onChange={setActiveIndex}
            type="number"
            value={activeIndex}
          />
        </label>
      </Box>
      <label className="flex flex-col gap-1">
        Body of text
        <textarea
          className={`rounded-md border-2 py-1 px-2 outline-none h-32 resize-y ${FIELD_CLASS_NAME}`}
          onChange={(event) => setTextToHighlight(event.currentTarget.value)}
          value={textToHighlight}
        />
      </label>
      <Checkbox checked={caseSensitive} onChange={setCaseSensitive}>
        Case sensitive
      </Checkbox>
      <Demo>
        <Highlighter
          activeClassName="active"
          activeIndex={parseInt(activeIndex, 10)}
          caseSensitive={caseSensitive}
          sanitize={latinize}
          searchWords={searchWords}
          textToHighlight={textToHighlight}
        />
      </Demo>
    </Box>
  );
}
