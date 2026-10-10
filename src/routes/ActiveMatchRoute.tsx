import { useState } from "react";
import { Box, Button, Code, Header } from "react-lib-tools";
import { html } from "../../public/generated/examples/ActiveMatch.json";
import { html as stylesHTML } from "../../public/generated/examples/ActiveMatchStyles.json";
import { Demo } from "../components/Demo";
import { ActiveMatchExample } from "./examples/ActiveMatch";

const MATCH_COUNT = 4;

export default function ActiveMatchRoute() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <Box direction="column" gap={4}>
      <Header section="Examples" title="Active match" />
      <div>
        Use the <code>activeIndex</code> prop to mark one of the matches as
        active (for example, to implement "find next" functionality). The active
        match is styled with <code>activeClassName</code> and/or{" "}
        <code>activeStyle</code>.
      </div>
      <Code html={html} />
      <Code html={stylesHTML} />
      <Demo>
        <ActiveMatchExample activeIndex={activeIndex} />
      </Demo>
      <Box direction="row" gap={2} align="center">
        <Button
          onClick={() =>
            setActiveIndex((activeIndex + MATCH_COUNT - 1) % MATCH_COUNT)
          }
        >
          Previous
        </Button>
        <Button onClick={() => setActiveIndex((activeIndex + 1) % MATCH_COUNT)}>
          Next
        </Button>
        <span>
          Match {activeIndex + 1} of {MATCH_COUNT}
        </span>
      </Box>
    </Box>
  );
}
