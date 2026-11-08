import { Fragment, type CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { PenMark } from "./pen-mark";

type Word = { text: string; style: "plain" | "em" | "mark"; glued: boolean };

/**
 * Parses headline markup from the message files:
 *   "Berani <u>ngomong</u> dulu,|grammar nyusul."
 *   <u>…</u>  → italic word with a hand-drawn underline
 *   <em>…</em> → italic word
 *   |          → line break (only applied on wide screens)
 */
function parse(markup: string): Word[][] {
  return markup.split("|").map((line) => {
    const words: Word[] = [];
    const pattern = /<(u|em)>(.*?)<\/\1>|([^<]+)/g;
    let previousEndedWithSpace = false;
    for (const match of line.matchAll(pattern)) {
      const [, tag, tagged, plain] = match;
      const text = tag ? tagged : plain;
      const style: Word["style"] = tag === "u" ? "mark" : tag === "em" ? "em" : "plain";
      // Text that starts without a space (e.g. the "." after </u>) sticks to
      // the previous word instead of becoming a word of its own.
      const startsGlued = words.length > 0 && !previousEndedWithSpace && !/^\s/.test(text);
      previousEndedWithSpace = /\s$/.test(text);
      text
        .split(/\s+/)
        .filter(Boolean)
        .forEach((piece, i) => {
          words.push({ text: piece, style, glued: i === 0 && startsGlued });
        });
    }
    return words;
  });
}

/**
 * Hero headline: each word slides up out of a mask, once, on load.
 * Pure CSS (see .reveal-mask/.reveal-word in globals.css) so it starts on first
 * paint instead of waiting for hydration. The underline is drawn with Motion.
 */
export function RevealHeadline({
  markup,
  className,
  as: Tag = "h1",
  id,
}: {
  markup: string;
  className?: string;
  as?: "h1" | "h2";
  id?: string;
}) {
  const lines = parse(markup);
  let index = 0;

  return (
    <Tag id={id} className={className}>
      {lines.map((line, lineIndex) => (
        <Fragment key={lineIndex}>
          {lineIndex > 0 ? (
            <>
              {" "}
              <span aria-hidden="true" className="hidden xl:block" />
            </>
          ) : null}
          {line.map((word, wordIndex) => {
            const i = index++;
            const content =
              word.style === "plain" ? word.text : <em className="italic">{word.text}</em>;
            const masked = (
              <span className="reveal-mask">
                <span className="reveal-word" style={{ "--i": i } as CSSProperties}>
                  {content}
                </span>
              </span>
            );
            const separator = wordIndex > 0 && !word.glued ? " " : null;

            if (word.style !== "mark") {
              return (
                <Fragment key={wordIndex}>
                  {separator}
                  {masked}
                </Fragment>
              );
            }
            return (
              <Fragment key={wordIndex}>
                {separator}
                <span className="relative inline-block">
                  {masked}
                  <PenMark
                    variant="underline"
                    trigger="mount"
                    delay={0.55 + i * 0.055}
                    className={cn(
                      "absolute -bottom-[0.16em] -left-[0.04em] w-[108%] text-tomato",
                    )}
                  />
                </span>
              </Fragment>
            );
          })}
        </Fragment>
      ))}
    </Tag>
  );
}
