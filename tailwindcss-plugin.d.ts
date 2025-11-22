declare module "tailwindcss/lib/util/flattenColorPalette" {
  import type { RecursiveKeyValuePair } from "tailwindcss/types/config";

  export default function flattenColorPalette(
    colors: RecursiveKeyValuePair<string, string>
  ): Record<string, string>;
}
