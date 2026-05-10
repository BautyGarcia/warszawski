export function FormSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-5 border-b border-black/8 pb-10">
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6B6B6B]">
        {title}
      </h2>
      <div className="flex flex-col gap-5">{children}</div>
    </section>
  );
}
