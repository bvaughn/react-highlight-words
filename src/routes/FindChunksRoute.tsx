import { Box, Code, ExternalLink, Header } from "react-lib-tools";
import { html } from "../../public/generated/examples/FindChunks.json";
import { Demo } from "../components/Demo";
import { FindChunksExample } from "./examples/FindChunks";

export default function FindChunksRoute() {
  return (
    <Box direction="column" gap={4}>
      <Header section="Examples" title="Custom matching" />
      <div>
        The <code>findChunks</code> prop replaces the default matching logic. It
        receives the search options and returns the <code>start</code> and{" "}
        <code>end</code> index of each range of text to highlight, along with
        the <code>searchIndex</code> of the search word that matched it;
        overlapping ranges are combined automatically.
      </div>
      <div>
        The example below only matches whole words. See the default
        implementation in{" "}
        <ExternalLink href="https://github.com/bvaughn/highlight-words-core">
          highlight-words-core
        </ExternalLink>{" "}
        for reference.
      </div>
      <Code html={html} />
      <Demo>
        <FindChunksExample />
      </Demo>
    </Box>
  );
}
