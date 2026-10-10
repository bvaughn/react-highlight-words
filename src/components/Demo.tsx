import type { PropsWithChildren } from "react";
import { Block } from "react-lib-tools";

export function Demo({ children }: PropsWithChildren) {
  return <Block className="demo p-4 leading-7">{children}</Block>;
}
