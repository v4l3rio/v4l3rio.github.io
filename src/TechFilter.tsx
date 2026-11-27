import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type Hit = { id: string; name: string };

/** Progressive enhancement: the parent renders it only after mount. Single selection; pressing the active item clears it. */
export function TechFilter({ label, filters, selected, onSelect, hits }: { label: string; filters: string[]; selected: string | null; onSelect: (term: string | null) => void; hits: Hit[] }) {
  return <div className="tech-filter">
    <p className="metadata tech-filter-label">{label}</p>
    <ToggleGroup type="single" aria-label={label} value={selected ?? ""} onValueChange={value => onSelect(value || null)} className="tech-filter-group">
      {filters.map(term => <ToggleGroupItem key={term} value={term} className="tech-filter-item">{term}</ToggleGroupItem>)}
    </ToggleGroup>
    <p className="tech-filter-status" aria-live="polite">{selected && <>
      <span>{selected} ·</span>
      {hits.map((hit, index) => <span key={hit.id}><a href={`#${hit.id}`}>{hit.name}</a>{index < hits.length - 1 && ","}</span>)}
    </>}</p>
  </div>;
}
