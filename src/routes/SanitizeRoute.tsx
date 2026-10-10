import { Box, Code, ExternalLink, Header } from "react-lib-tools";
import { html } from "../../public/generated/examples/Sanitize.json";
import { Demo } from "../components/Demo";
import { SanitizeExample } from "./examples/Sanitize";

export default function SanitizeRoute() {
  return (
    <Box direction="column" gap={4}>
      <Header section="Examples" title="Ignoring accents" />
      <div>
        The <code>sanitize</code> prop processes the search words and the text
        before they are compared, without changing the text that is displayed.
        For example,{" "}
        <ExternalLink href="https://www.npmjs.com/package/latinize">
          latinize
        </ExternalLink>{" "}
        can be used to match text regardless of accents:
      </div>
      <Code html={html} />
      <Demo>
        <SanitizeExample />
      </Demo>
    </Box>
  );
}
