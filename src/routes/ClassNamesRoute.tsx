import { Box, Code, Header } from "react-lib-tools";
import { html } from "../../public/generated/examples/ClassNames.json";
import { html as stylesHTML } from "../../public/generated/examples/ClassNamesStyles.json";
import { Demo } from "../components/Demo";
import { ClassNamesExample } from "./examples/ClassNames";

export default function ClassNamesRoute() {
  return (
    <Box direction="column" gap={4}>
      <Header section="Examples" title="Class names per term" />
      <div>
        The <code>highlightClassName</code> prop also accepts an object that
        maps matched text to class names, so different search terms can be
        styled differently.
      </div>
      <Code html={html} />
      <Code html={stylesHTML} />
      <Demo>
        <ClassNamesExample />
      </Demo>
      <div>
        Keys should be lower case unless the <code>caseSensitive</code> prop is
        set, in which case they must match the text exactly.
      </div>
    </Box>
  );
}
