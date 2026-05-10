/**
 * Related Content Component
 *
 * Displays related pages/commands for improved internal linking
 * and user navigation within documentation.
 */

interface RelatedLink {
  label: string;
  href: string;
  description?: string;
}

interface RelatedContentProps {
  title?: string;
  items: RelatedLink[];
}

export const RelatedContent = ({
  title = "Related",
  items,
}: RelatedContentProps) => {
  if (!items || items.length === 0) return null;

  return (
    <section className="mt-12 pt-8 border-t border-border">
      <h3 className="text-lg font-bold mb-6">{title}</h3>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              className="flex items-start gap-3 group p-3 rounded-lg hover:bg-white/5 transition-colors"
            >
              <span className="hidden md:inline text-accent opacity-0 group-hover:opacity-100 transition-opacity mt-0.5 flex-shrink-0">
                →
              </span>
              <div className="flex-1">
                <div className="font-semibold text-foreground group-hover:text-accent transition-colors">
                  {item.label}
                </div>
                {item.description && (
                  <p className="text-sm text-gray-400 mt-1">{item.description}</p>
                )}
              </div>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
};
