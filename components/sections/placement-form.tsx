"use client";

import { ArrowRight, LoaderCircle, MessageCircle, RotateCcw, TriangleAlert } from "lucide-react";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { Controller, useForm, useWatch, type Resolver } from "react-hook-form";
import { submitPlacement } from "@/app/actions/placement";
import { Stamp } from "@/components/brand/sticker";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import type { ProgramSlug } from "@/content/programs";
import { cn } from "@/lib/utils";
import type { PlacementData, PlacementField, PlacementInput } from "@/lib/validations/placement";
import {
  isProgramChoice,
  scheduleOptions,
  type ProgramChoice,
  type ScheduleOption,
} from "@/lib/validations/placement-options";
import { whatsappUrl } from "@/lib/whatsapp";
import { SELECT_PROGRAM_EVENT } from "./section-link";

type ProgramOption = { value: ProgramSlug; label: string; forKids: boolean };

/**
 * Every visible string, already translated on the server (placement.tsx).
 * Templates keep "{name}" / "{program}" placeholders, filled in here.
 */
export type PlacementFormStrings = {
  name: string;
  parentName: string;
  parentNameHint: string;
  whatsapp: string;
  whatsappHint: string;
  email: string;
  program: string;
  programPlaceholder: string;
  programUnsure: string;
  schedule: string;
  scheduleOptions: Record<ScheduleOption, { label: string; time: string }>;
  message: string;
  messagePlaceholder: string;
  optional: string;
  honeypot: string;
  submit: string;
  submitting: string;
  privacy: string;
  errors: Record<string, string>;
  success: { stamp: string; title: string; body: string; cta: string; again: string };
  whatsappMessage: string;
  whatsappMessageUnsure: string;
  whatsappMessageGeneric: string;
};

type PlacementFormProps = {
  programs: ProgramOption[];
  strings: PlacementFormStrings;
};

/** "Terima kasih, {name}!" → "Terima kasih, Kevin!" */
const fill = (template: string, values: Record<string, string>) =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? "");

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * React Hook Form + Zod, with Zod loaded on demand: the schema module (shared
 * with the server action) is imported the first time the form is touched, so
 * it never weighs on the first paint. The server re-validates every submit.
 */
type FormResolver = Resolver<PlacementInput, unknown, PlacementData>;
let resolverPromise: Promise<FormResolver> | null = null;
function loadResolver() {
  resolverPromise ??= Promise.all([
    import("@hookform/resolvers/zod"),
    import("@/lib/validations/placement"),
  ]).then(([{ zodResolver }, { placementSchema }]) => zodResolver(placementSchema));
  return resolverPromise;
}
const lazyZodResolver: FormResolver = async (values, context, options) =>
  (await loadResolver())(values, context, options);

function FieldError({ id, children }: { id: string; children?: ReactNode }) {
  if (!children) return null;
  return (
    <p id={id} className="flex items-start gap-1.5 text-small font-medium text-tomato-ink">
      <TriangleAlert aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" strokeWidth={2} />
      {children}
    </p>
  );
}

export function PlacementForm({ programs, strings }: PlacementFormProps) {
  const [status, setStatus] = useState<"idle" | "error" | "success">("idle");
  const [submitted, setSubmitted] = useState<{ name: string; program: ProgramChoice } | null>(null);
  // The success panel mounts after the form's exit animation, so focus it
  // when it actually attaches (screen readers then announce the result).
  const focusOnMount = useCallback((node: HTMLHeadingElement | null) => {
    node?.focus();
  }, []);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PlacementInput, unknown, PlacementData>({
    resolver: lazyZodResolver,
    mode: "onTouched",
    defaultValues: {
      name: "",
      parentName: "",
      whatsapp: "",
      email: "",
      message: "",
      website: "",
    },
  });

  const program = useWatch({ control, name: "program" });
  const showParent = programs.find((option) => option.value === program)?.forKids ?? false;

  useEffect(() => {
    if (!showParent) setValue("parentName", "");
  }, [showParent, setValue]);

  // Pre-select a program from "?program=…" (other pages) or from in-page CTAs.
  useEffect(() => {
    const apply = (value: string | null | undefined) => {
      if (isProgramChoice(value)) setValue("program", value, { shouldDirty: true });
    };
    apply(new URLSearchParams(window.location.search).get("program"));
    const onSelect = (event: Event) => apply((event as CustomEvent<string>).detail);
    window.addEventListener(SELECT_PROGRAM_EVENT, onSelect);
    return () => window.removeEventListener(SELECT_PROGRAM_EVENT, onSelect);
  }, [setValue]);

  const onSubmit = async (data: PlacementData) => {
    setStatus("idle");
    try {
      const result = await submitPlacement(data);
      if (result.ok) {
        setSubmitted({ name: data.name, program: data.program });
        setStatus("success");
        return;
      }
      if (result.fieldErrors) {
        for (const [field, key] of Object.entries(result.fieldErrors)) {
          setError(field as PlacementField, { message: key }, { shouldFocus: true });
        }
      }
      if (result.formError) setStatus("error");
    } catch {
      setStatus("error");
    }
  };

  const errorText = (field: PlacementField) => {
    const key = errors[field]?.message;
    return key ? (strings.errors[key] ?? strings.errors.server) : undefined;
  };

  const describedBy = (...ids: (string | false | undefined)[]) =>
    ids.filter(Boolean).join(" ") || undefined;

  const programLabel = (value: ProgramChoice) =>
    programs.find((option) => option.value === value)?.label ?? strings.programUnsure;

  const whatsappMessage = submitted
    ? submitted.program === "unsure"
      ? fill(strings.whatsappMessageUnsure, { name: submitted.name })
      : fill(strings.whatsappMessage, {
          name: submitted.name,
          program: programLabel(submitted.program),
        })
    : strings.whatsappMessageGeneric;

  return (
    <AnimatePresence mode="wait" initial={false}>
      {status === "success" && submitted ? (
        <m.div
          key="success"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease }}
          className="flex flex-col items-start gap-5 py-4"
          role="status"
        >
          <Stamp tilt={-10} className="text-forest-ink">
            {strings.success.stamp}
          </Stamp>
          <h3 ref={focusOnMount} tabIndex={-1} className="font-display text-h2 outline-none">
            {fill(strings.success.title, { name: submitted.name })}
          </h3>
          <p className="max-w-[44ch] text-lead text-ink-muted">{strings.success.body}</p>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href={whatsappUrl(whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: "ink" })}
            >
              <MessageCircle aria-hidden="true" strokeWidth={1.75} />
              {strings.success.cta}
            </a>
            <button
              type="button"
              onClick={() => {
                reset();
                setSubmitted(null);
                setStatus("idle");
              }}
              className={buttonVariants({ variant: "ghost" })}
            >
              <RotateCcw aria-hidden="true" strokeWidth={1.75} />
              {strings.success.again}
            </button>
          </div>
        </m.div>
      ) : (
        <m.form
          key="form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4, ease }}
          noValidate
          onFocusCapture={() => void loadResolver()}
          onSubmit={handleSubmit(onSubmit)}
          className="relative grid gap-x-8 gap-y-7 sm:grid-cols-2"
        >
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <Label htmlFor="pt-program">{strings.program}</Label>
            <NativeSelect
              id="pt-program"
              defaultValue=""
              aria-invalid={errors.program ? true : undefined}
              aria-describedby={describedBy(errors.program && "pt-program-error")}
              {...register("program")}
            >
              <option value="" disabled>
                {strings.programPlaceholder}
              </option>
              {programs.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
              <option value="unsure">{strings.programUnsure}</option>
            </NativeSelect>
            <FieldError id="pt-program-error">{errorText("program")}</FieldError>
          </div>

          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <Label htmlFor="pt-name">{strings.name}</Label>
            <Input
              id="pt-name"
              autoComplete="name"
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={describedBy(errors.name && "pt-name-error")}
              {...register("name")}
            />
            <FieldError id="pt-name-error">{errorText("name")}</FieldError>
          </div>

          <AnimatePresence initial={false}>
            {showParent ? (
              <m.div
                key="parent"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.45, ease }}
                className="overflow-hidden sm:col-span-2"
              >
                <div className="flex flex-col gap-1.5 px-1 pb-1">
                  <Label htmlFor="pt-parent">
                    {strings.parentName}
                    <span className="font-normal text-ink-muted">({strings.optional})</span>
                  </Label>
                  <Input
                    id="pt-parent"
                    autoComplete="off"
                    aria-invalid={errors.parentName ? true : undefined}
                    aria-describedby={describedBy(
                      "pt-parent-hint",
                      errors.parentName && "pt-parent-error",
                    )}
                    {...register("parentName")}
                  />
                  <p id="pt-parent-hint" className="text-small text-ink-muted">
                    {strings.parentNameHint}
                  </p>
                  <FieldError id="pt-parent-error">{errorText("parentName")}</FieldError>
                </div>
              </m.div>
            ) : null}
          </AnimatePresence>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="pt-whatsapp">{strings.whatsapp}</Label>
            <Input
              id="pt-whatsapp"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              aria-invalid={errors.whatsapp ? true : undefined}
              aria-describedby={describedBy("pt-whatsapp-hint", errors.whatsapp && "pt-whatsapp-error")}
              {...register("whatsapp")}
            />
            <p id="pt-whatsapp-hint" className="text-small text-ink-muted">
              {strings.whatsappHint}
            </p>
            <FieldError id="pt-whatsapp-error">{errorText("whatsapp")}</FieldError>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="pt-email">
              {strings.email}
              <span className="font-normal text-ink-muted">({strings.optional})</span>
            </Label>
            <Input
              id="pt-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={describedBy(errors.email && "pt-email-error")}
              {...register("email")}
            />
            <FieldError id="pt-email-error">{errorText("email")}</FieldError>
          </div>

          <div className="flex flex-col gap-3 sm:col-span-2">
            <span id="pt-schedule-label" className="text-small font-semibold">
              {strings.schedule}
            </span>
            <Controller
              control={control}
              name="schedule"
              render={({ field }) => (
                <RadioGroup
                  ref={field.ref}
                  name={field.name}
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                  onBlur={field.onBlur}
                  aria-labelledby="pt-schedule-label"
                  aria-invalid={errors.schedule ? true : undefined}
                  aria-describedby={describedBy(errors.schedule && "pt-schedule-error")}
                  className="grid-cols-1 gap-2 sm:grid-cols-3"
                >
                  {scheduleOptions.map((option) => (
                    <label
                      key={option}
                      htmlFor={`pt-schedule-${option}`}
                      className={cn(
                        "flex cursor-pointer items-center gap-3 rounded-md border border-ink/40 bg-paper px-4 py-3 transition-colors duration-300 ease-editorial",
                        "hover:border-ink has-[[data-state=checked]]:border-ink has-[[data-state=checked]]:bg-paper-3",
                      )}
                    >
                      <RadioGroupItem
                        id={`pt-schedule-${option}`}
                        value={option}
                        aria-invalid={errors.schedule ? true : undefined}
                      />
                      <span className="flex flex-col">
                        <span className="text-small font-semibold">{strings.scheduleOptions[option].label}</span>
                        <span className="text-small text-ink-muted tabular">
                          {strings.scheduleOptions[option].time}
                        </span>
                      </span>
                    </label>
                  ))}
                </RadioGroup>
              )}
            />
            <FieldError id="pt-schedule-error">{errorText("schedule")}</FieldError>
          </div>

          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <Label htmlFor="pt-message">
              {strings.message}
              <span className="font-normal text-ink-muted">({strings.optional})</span>
            </Label>
            <Textarea
              id="pt-message"
              rows={3}
              maxLength={500}
              placeholder={strings.messagePlaceholder}
              aria-invalid={errors.message ? true : undefined}
              aria-describedby={describedBy(errors.message && "pt-message-error")}
              {...register("message")}
            />
            <FieldError id="pt-message-error">{errorText("message")}</FieldError>
          </div>

          {/* Honeypot: invisible to people, tempting to bots. */}
          <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden">
            <label htmlFor="pt-website">{strings.honeypot}</label>
            <input id="pt-website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
          </div>

          {status === "error" ? (
            <div
              role="alert"
              className="flex flex-col gap-3 border-l-2 border-tomato-ink bg-paper py-3 pr-3 pl-4 text-small sm:col-span-2"
            >
              <p className="font-semibold text-tomato-ink">{strings.errors.server}</p>
              <a
                href={whatsappUrl(strings.whatsappMessageGeneric)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-semibold underline underline-offset-4"
              >
                <MessageCircle aria-hidden="true" className="size-4" strokeWidth={1.75} />
                WhatsApp
              </a>
            </div>
          ) : null}

          <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(buttonVariants({ size: "lg" }), "w-full justify-between sm:w-auto sm:justify-center")}
            >
              {isSubmitting ? strings.submitting : strings.submit}
              {isSubmitting ? (
                <LoaderCircle aria-hidden="true" className="animate-spin" />
              ) : (
                <ArrowRight
                  aria-hidden="true"
                  className="transition-transform duration-300 ease-editorial group-hover/button:translate-x-1"
                />
              )}
            </button>
            <p className="text-small text-ink-muted sm:max-w-[26ch] sm:text-right">{strings.privacy}</p>
          </div>
        </m.form>
      )}
    </AnimatePresence>
  );
}
