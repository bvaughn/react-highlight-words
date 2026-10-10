import { Box, Code, Header } from "react-lib-tools";
import { html } from "../../public/generated/examples/BasicUsage.json";
import { html as stylesHTML } from "../../public/generated/examples/HighlightStyles.json";
import { Demo } from "../components/Demo";
import { BasicUsageExample } from "./examples/BasicUsage";

export default function BasicUsageRoute() {
  return (
    <Box direction="column" gap={4}>
      <Header section="Examples" title="Basic usage" />
      <div>
        Provide an array of <code>searchWords</code> and the{" "}
        <code>textToHighlight</code>. Matches are case insensitive by default.
      </div>
      <Code html={html} />
      <Demo>
        <BasicUsageExample />
      </Demo>
      <div>
        Matches are wrapped in a <code>{"<mark>"}</code> element. Use the{" "}
        <code>highlightClassName</code> (or <code>highlightStyle</code>) prop to
        style them:
      </div>
      <Code html={stylesHTML} />
    </Box>
  );
}
