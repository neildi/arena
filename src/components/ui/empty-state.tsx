import React from "react";

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-6 rounded-2xl border border-dashed border-champagne-dark/50 bg-ivory-100/50">
      {icon ? (
        <div className="mb-3 text-gold-dark">{icon}</div>
      ) : null}
      <h3 className="font-serif text-lg text-charcoal-900">{title}</h3>
      {description ? (
        <p className="mt-1.5 text-sm text-charcoal-500 max-w-sm">{description}</p>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
