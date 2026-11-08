import type { ReactNode } from "react";

/** Tag renderers for next-intl rich text: "Dari TK sampai <em>siap TOEFL.</em>" */
export const rich = {
  em: (chunks: ReactNode) => <em>{chunks}</em>,
};
