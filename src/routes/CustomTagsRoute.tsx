import { Box, Code, Header } from "react-lib-tools";
import { html } from "../../public/generated/examples/CustomTags.json";
import { Demo } from "../components/Demo";
import { CustomTagsExample } from "./examples/CustomTags";

export default function CustomTagsRoute() {
  return (
    <Box direction="column" gap={4}>
      <Header section="Examples" title="Custom tags" />
      <div>
        By default, matches are wrapped in a <code>{"<mark>"}</code> element,
        and the rest of the text is wrapped in a <code>{"<span>"}</code>. Use
        the <code>highlightTag</code> and <code>unhighlightTag</code> props to
        render a different element or a React component instead.
      </div>
      <div>
        Custom highlight components receive <code>children</code>,{" "}
        <code>className</code>, <code>style</code>, and the index of the match (
        <code>highlightIndex</code>).
      </div>
      <Code html={html} />
      <Demo>
        <CustomTagsExample />
      </Demo>
    </Box>
  );
}
