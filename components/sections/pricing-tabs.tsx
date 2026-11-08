"use client";

import { ArrowRight, Check, MessageCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ProgramSlug } from "@/content/programs";
import { cn } from "@/lib/utils";
import { SectionLink } from "./section-link";

type Row = { label: string; value: string; sub?: string };

export type PricingPanel = {
  slug: ProgramSlug;
  name: string;
  caption: string;
  group: { format: Row; schedule: string; duration: string; fee: Row; levelFees?: string[] };
  private: { format: Row; schedule: string; duration: string; fee: string; feeHref: string };
  cta: string;
};

type PricingTabsProps = {
  panels: PricingPanel[];
  labels: {
    tabs: string;
    columns: { format: string; schedule: string; duration: string; fee: string };
    included: string;
    includedItems: string[];
    newTab: string;
  };
};

export function PricingTabs({ panels, labels }: PricingTabsProps) {
  return (
    <Tabs defaultValue={panels[0]?.slug}>
      <TabsList
        aria-label={labels.tabs}
        className="-mx-1 px-1 [mask-image:linear-gradient(to_right,black_82%,transparent)] md:[mask-image:none]"
      >
        {panels.map((panel) => (
          <TabsTrigger key={panel.slug} value={panel.slug} className="lg:text-[1.1875rem] 2xl:text-h4">
            {panel.name}
          </TabsTrigger>
        ))}
      </TabsList>

      {panels.map((panel) => (
        <TabsContent key={panel.slug} value={panel.slug}>
          {/* md+: a plain table */}
          <table className="hidden w-full border-collapse text-left md:table">
            <caption className="sr-only">{panel.caption}</caption>
            <thead>
              <tr className="label border-b border-ink text-ink-muted">
                <th scope="col" className="w-[24%] pb-3 font-semibold">
                  {labels.columns.format}
                </th>
                <th scope="col" className="w-[30%] pb-3 font-semibold">
                  {labels.columns.schedule}
                </th>
                <th scope="col" className="w-[20%] pb-3 font-semibold">
                  {labels.columns.duration}
                </th>
                <th scope="col" className="pb-3 text-right font-semibold">
                  {labels.columns.fee}
                </th>
              </tr>
            </thead>
            <tbody className="align-top">
              <tr className="border-b border-ink/25">
                <th scope="row" className="py-6 pr-4 font-normal">
                  <span className="block font-display text-h4">{panel.group.format.label}</span>
                  <span className="mt-1 block text-small text-ink-muted">{panel.group.format.value}</span>
                </th>
                <td className="py-6 pr-4 text-small">{panel.group.schedule}</td>
                <td className="py-6 pr-4 text-small">{panel.group.duration}</td>
                <td className="py-6 text-right">
                  <span className="block font-display text-h3 tabular">{panel.group.fee.value}</span>
                  {panel.group.fee.sub ? (
                    <span className="mt-1 block text-small text-ink-muted tabular">{panel.group.fee.sub}</span>
                  ) : null}
                  {panel.group.levelFees?.map((line) => (
                    <span key={line} className="block text-small text-ink-muted tabular">
                      {line}
                    </span>
                  ))}
                </td>
              </tr>
              <tr className="border-b border-ink/25">
                <th scope="row" className="py-6 pr-4 font-normal">
                  <span className="block font-display text-h4">{panel.private.format.label}</span>
                  <span className="mt-1 block text-small text-ink-muted">{panel.private.format.value}</span>
                </th>
                <td className="py-6 pr-4 text-small">{panel.private.schedule}</td>
                <td className="py-6 pr-4 text-small">{panel.private.duration}</td>
                <td className="py-6 text-right">
                  <a
                    href={panel.private.feeHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border-b border-ink pb-0.5 text-small font-semibold transition-colors hover:border-tomato hover:text-tomato-ink"
                  >
                    <MessageCircle aria-hidden="true" className="size-4" strokeWidth={1.75} />
                    {panel.private.fee}
                    <span className="sr-only">{labels.newTab}</span>
                  </a>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Mobile: the same data as stacked rows */}
          <div className="md:hidden">
            {[
              {
                key: "group",
                format: panel.group.format,
                schedule: panel.group.schedule,
                duration: panel.group.duration,
                fee: (
                  <>
                    <span className="font-display text-h3 tabular">{panel.group.fee.value}</span>
                    {panel.group.fee.sub ? (
                      <span className="block text-small text-ink-muted tabular">{panel.group.fee.sub}</span>
                    ) : null}
                    {panel.group.levelFees?.map((line) => (
                      <span key={line} className="block text-small text-ink-muted tabular">
                        {line}
                      </span>
                    ))}
                  </>
                ),
              },
              {
                key: "private",
                format: panel.private.format,
                schedule: panel.private.schedule,
                duration: panel.private.duration,
                fee: (
                  <a
                    href={panel.private.feeHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border-b border-ink pb-0.5 text-small font-semibold"
                  >
                    <MessageCircle aria-hidden="true" className="size-4" strokeWidth={1.75} />
                    {panel.private.fee}
                    <span className="sr-only">{labels.newTab}</span>
                  </a>
                ),
              },
            ].map((row) => (
              <div key={row.key} className="border-b border-ink/25 py-5 first:border-t first:border-t-ink">
                <p className="font-display text-h4">{row.format.label}</p>
                <p className="text-small text-ink-muted">{row.format.value}</p>
                <dl className="mt-4 grid grid-cols-[6.5rem_1fr] gap-x-4 gap-y-2 text-small">
                  <dt className="label pt-0.5 text-ink-muted">{labels.columns.schedule}</dt>
                  <dd>{row.schedule}</dd>
                  <dt className="label pt-0.5 text-ink-muted">{labels.columns.duration}</dt>
                  <dd>{row.duration}</dd>
                  <dt className="label pt-1.5 text-ink-muted">{labels.columns.fee}</dt>
                  <dd>{row.fee}</dd>
                </dl>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-8">
            <div>
              <p className="label text-ink-muted">{labels.included}</p>
              <ul className="mt-3 grid gap-x-8 gap-y-2 sm:grid-cols-2">
                {labels.includedItems.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-small">
                    <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-forest-ink" strokeWidth={2.25} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <SectionLink
              section="placement-test"
              program={panel.slug}
              className={cn(buttonVariants({ size: "md" }), "justify-between self-start")}
            >
              {panel.cta}
              <ArrowRight
                aria-hidden="true"
                className="transition-transform duration-300 ease-editorial group-hover/button:translate-x-1"
              />
            </SectionLink>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
