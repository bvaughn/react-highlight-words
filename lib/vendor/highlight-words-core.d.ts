declare module "highlight-words-core" {
  import type { Chunk, FindChunksOptions } from "../components/types";

  export function findAll(
    options: FindChunksOptions & {
      findChunks?: ((options: FindChunksOptions) => Chunk[]) | undefined;
    }
  ): Array<Chunk & { highlight: boolean }>;
}
