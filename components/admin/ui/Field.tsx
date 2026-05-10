import { cn } from "@/lib/utils";

type BaseProps = {
  label: string;
  hint?: string;
  error?: string;
  wrapperClassName?: string;
};

const inputCls =
  "h-10 rounded-md border border-black/10 bg-[#F7F7F5] px-3 text-sm text-ink outline-none transition-colors placeholder:text-[#999] focus:border-ink/40 focus:bg-white";

export function Field({
  label,
  hint,
  error,
  wrapperClassName,
  className,
  ...rest
}: BaseProps & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <Wrapper label={label} hint={hint} error={error} className={wrapperClassName}>
      <input {...rest} className={cn(inputCls, className)} />
    </Wrapper>
  );
}

export function Textarea({
  label,
  hint,
  error,
  wrapperClassName,
  className,
  ...rest
}: BaseProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <Wrapper label={label} hint={hint} error={error} className={wrapperClassName}>
      <textarea
        {...rest}
        className={cn(
          "min-h-24 rounded-md border border-black/10 bg-[#F7F7F5] px-3 py-2 text-sm text-ink outline-none transition-colors placeholder:text-[#999] focus:border-ink/40 focus:bg-white",
          className,
        )}
      />
    </Wrapper>
  );
}

export function Select({
  label,
  hint,
  error,
  wrapperClassName,
  className,
  children,
  ...rest
}: BaseProps & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <Wrapper label={label} hint={hint} error={error} className={wrapperClassName}>
      <select
        {...rest}
        className={cn(inputCls, "appearance-none pr-8", className)}
      >
        {children}
      </select>
    </Wrapper>
  );
}

function Wrapper({
  label,
  hint,
  error,
  className,
  children,
}: Pick<BaseProps, "label" | "hint" | "error"> & {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={cn("flex flex-col gap-1.5", className)}>
      <span className="text-[13px] font-medium text-ink">{label}</span>
      {children}
      {error ? (
        <span className="text-[12px] text-red-700">{error}</span>
      ) : hint ? (
        <span className="text-[12px] text-[#6B6B6B]">{hint}</span>
      ) : null}
    </label>
  );
}
