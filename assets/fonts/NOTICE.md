# Fonts

`Fraunces-Roman-opsz.woff2` and `Fraunces-Italic-opsz.woff2` are subsets of
**Fraunces** (Copyright 2018 The Fraunces Project Authors,
https://github.com/undercasetype/Fraunces), licensed under the
**SIL Open Font License 1.1** — https://openfontlicense.org.

They were generated from Google Fonts with the weight fixed at 400, the
optical-size axis (opsz 9–144) kept variable, and the character set limited to
ASCII plus common typographic punctuation and accents. That cuts them to ~60 KB
in total instead of ~146 KB, which matters for mobile load time.

If you ever need characters outside that set (e.g. Vietnamese), regenerate them
or switch back to `next/font/google`'s Fraunces in `lib/fonts.ts`.

`NanumPenScript-subset.woff2` is a subset of **Nanum Pen Script** (Copyright
2010 NAVER Corporation), licensed under the SIL Open Font License 1.1.

`assets/og-fonts/*` (used only to render the Open Graph image) are Fraunces,
Manrope and Nanum Pen Script from Google Fonts, all under the SIL OFL 1.1.
