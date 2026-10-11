import preserveDirectives from "rollup-preserve-directives";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, type UserConfig } from "vite";
import dts from "vite-plugin-dts";
import svgr from "vite-plugin-svgr";
import { visualizer } from "rollup-plugin-visualizer";

const __dirname = dirname(fileURLToPath(import.meta.url));

const libraryConfig: UserConfig = {
  build: {
    lib: {
      entry: resolve(__dirname, "lib/index.ts"),
      name: "react-highlight-words",
      fileName: "react-highlight-words",
      formats: ["cjs", "es"]
    },
    rollupOptions: {
      external: [
        "highlight-words-core",
        "react",
        "react-dom",
        "react/jsx-runtime"
      ]
    },
    sourcemap: true
  },
  plugins: [
    react(),
    dts({ afterBuild: writeCommonJSDeclarations, rollupTypes: true }),
    preserveDirectives()
  ],
  publicDir: false
};

/**
 * CommonJS consumers need their own declaration file:
 * in a "type": "module" package, a .d.ts file describes an ES module,
 * and require() returns the component itself (module.exports = Highlighter) rather than a default export.
 *
 * The CommonJS declarations are generated from the ES module declarations (so they can't drift apart)
 * and are self-contained, since importing ES module types from a CommonJS file requires TypeScript 5.3+.
 */
function writeCommonJSDeclarations() {
  // vite-plugin-dts writes the rolled up (ES module) declarations to the package.json "types" path,
  // which points to the CommonJS declarations (for older "moduleResolution": "node" consumers),
  // so move them to the .d.ts path before writing the CommonJS declarations
  const { types } = JSON.parse(
    readFileSync(resolve(__dirname, "package.json"), "utf8")
  );
  const declarations = readFileSync(resolve(__dirname, types), "utf8")
    // The rolled up declarations (from API Extractor) use CRLF line endings
    .replace(/\r\n/g, "\n");
  writeFileSync(
    resolve(__dirname, "dist/react-highlight-words.d.ts"),
    declarations
  );

  const typeNames = [
    ...declarations.matchAll(/^export declare type (\w+)/gm),
    ...declarations.matchAll(/^export \{ (\w+) \}$/gm)
  ]
    .map(([, name]) => name)
    .sort();
  if (
    !typeNames.includes("HighlighterProps") ||
    !declarations.includes("\nexport default Highlighter;\n")
  ) {
    throw Error("Unexpected format of the ES module declaration file");
  }

  // A module with "export =" can't have any other exports,
  // so the types are exported as members of a namespace that merges with the component.
  // (The aliases are needed because a namespace member can't refer to an outer type with the same name.)
  const body = declarations
    .replace(/^export declare type /gm, "declare type ")
    .replace(/^export \{ \w* ?\}\n*/gm, "")
    .replace("\nexport default Highlighter;\n", "\n");

  writeFileSync(
    resolve(__dirname, "dist/react-highlight-words.d.cts"),
    [
      body.trimEnd(),
      ``,
      ...typeNames.map((name) => `declare type _${name} = ${name};`),
      ``,
      `declare namespace Highlighter {`,
      ...typeNames.map((name) => `  export type ${name} = _${name};`),
      `}`,
      ``,
      `export = Highlighter;`,
      ``
    ].join("\n")
  );
}

const websiteConfig: UserConfig = {
  base: "/",
  build: {
    minify: "terser",
    outDir: "docs",
    sourcemap: true,
    terserOptions: {
      format: {
        comments: false
      }
    }
  },
  plugins: [
    react(),
    svgr(),
    tailwindcss(),
    visualizer({
      emitFile: true,
      filename: "stats.html"
    })
  ],
  resolve: {
    alias: {
      "react-highlight-words": resolve(__dirname, "lib")
    }
  }
};

// Allow iPhone to connect to the DEV site using a local IP
if (process.env.NODE_ENV === "development") {
  websiteConfig.server = {
    host: true,
    port: 3000
  };
}

let config: UserConfig = {};
switch (process.env.TARGET) {
  case "lib": {
    config = libraryConfig;
    break;
  }
  default: {
    config = websiteConfig;
    break;
  }
}

// https://vite.dev/config/
export default defineConfig(config);
