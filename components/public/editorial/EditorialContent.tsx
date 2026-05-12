export function EditorialContent({ content }: { content: string }) {
  // Split por bloques separados por linea en blanco. Cada bloque es un parrafo.
  const blocks = content
    .split(/\n{2,}/g)
    .map((b) => b.trim())
    .filter((b) => b.length > 0);

  return (
    <div className="flex flex-col gap-6">
      {blocks.map((block, i) => (
        <p
          key={i}
          className="whitespace-pre-line text-base font-light leading-[28px] text-ink-soft md:text-[17px] md:leading-[30px]"
        >
          {block}
        </p>
      ))}
    </div>
  );
}
