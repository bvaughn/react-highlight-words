import {
  AppRoot,
  Code,
  type CommonQuestion,
  type DefaultPath,
  type NavConfig
} from "react-lib-tools";
import { repository } from "../package.json";
import Logo from "../public/favicon.svg?react";
import { html as regExpHTML } from "../public/generated/examples/FaqRegExp.json";
import { html as basicUsageHTML } from "../public/generated/examples/BasicUsage.json";
import { Link } from "./components/Link";
import { routes, type Path } from "./routes";

export default function App() {
  return (
    <AppRoot
      commonQuestions={commonQuestions}
      enableSiteSearch
      nav={nav}
      packageDescription="highlight words within text"
      packageLogo={<Logo className="rhw-logo-header w-8 h-8" />}
      packageName="react-highlight-words"
      repositoryUrl={repository.url}
      routes={routes}
      overview={
        <>
          <div>
            <strong>react-highlight-words</strong> is a React component that
            highlights words within a larger body of text. Give it an array of
            search terms and a body of text, and it will mark every occurrence
            of those terms:
          </div>
          <Code html={basicUsageHTML} />
          <div>
            Refer to the <Link to="/examples/basic">examples</Link> or the{" "}
            <Link to="/props">props</Link> page for more information, or try it
            out in the <Link to="/playground">playground</Link>.
          </div>
        </>
      }
    />
  );
}

const nav: NavConfig<Path | DefaultPath> = [
  { path: "/", title: "Getting started" },
  {
    title: "Examples",
    links: [
      { path: "/examples/basic", title: "Basic usage" },
      { path: "/examples/active-match", title: "Active match" },
      { path: "/examples/class-names", title: "Class names per term" },
      { path: "/examples/custom-tags", title: "Custom tags" },
      { path: "/examples/find-chunks", title: "Custom matching" },
      { path: "/examples/sanitize", title: "Ignoring accents" }
    ]
  },
  { path: "/playground", title: "Playground" },
  { path: "/props", title: "Highlighter props" },
  { path: "/common-questions", title: "Common questions" },
  { path: "/support", title: "Support" }
];

const commonQuestions: CommonQuestion[] = [
  {
    id: "regular-expressions",
    question: "How do I match a pattern instead of a literal word?",
    answer: (
      <>
        <p>
          String search terms are matched literally, so characters like{" "}
          <code>(</code>, <code>.</code>, or <code>$</code> match themselves. To
          match a pattern, pass a <code>RegExp</code> search term (which is used
          as-is, with its own flags):
        </p>
        <Code html={regExpHTML} />
        <p>
          Alternatively, set the <code>autoEscape</code> prop to{" "}
          <code>false</code> to treat every string search term as a regular
          expression. Only do this for trusted search terms; a malicious regular
          expression can take an extremely long time to run.
        </p>
      </>
    )
  },
  {
    id: "typescript",
    question: "Does this package include TypeScript types?",
    answer: (
      <p>
        Yes. Type definitions are included in the published package, so the{" "}
        <code>@types/react-highlight-words</code> package is no longer needed.
      </p>
    )
  },
  {
    id: "whole-words",
    question: "Can I match whole words only?",
    answer: (
      <p>
        Yes. Use the <code>findChunks</code> prop to provide your own matching
        logic; see the{" "}
        <Link to="/examples/find-chunks">custom matching example</Link>.
      </p>
    )
  }
];
