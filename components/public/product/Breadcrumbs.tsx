import Link from "next/link";
import { Fragment } from "react";

type Item = { label: string; href?: string };

export function Breadcrumbs({ items }: { items: Item[] }) {
  return (
    <nav className="flex w-full items-center gap-2 bg-bg px-20 py-6 text-xs">
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <Fragment key={i}>
            {item.href && !isLast ? (
              <Link href={item.href} className="text-ink-soft transition-colors hover:text-ink">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? "text-ink" : "text-ink-soft"}>{item.label}</span>
            )}
            {!isLast ? <span className="text-bg-warm">/</span> : null}
          </Fragment>
        );
      })}
    </nav>
  );
}
