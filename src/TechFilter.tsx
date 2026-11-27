import { Fragment } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type Hit = { id: string; name: string };

/**
 * Progressive enhancement: the parent renders it only after mount. Single selection; pressing the active item clears it.
 * data-motion="off" keeps the kit's organic outline away, so the pills match the site's other quiet controls.
 */
export function TechFilter({ label, filters, selected, onSelect, hits }: { label: string; filters: string[]; selected: string | null; onSelect: (term: string | null) => void; hits: Hit[] }) {
  return <div className="tech-filter" data-motion="off">
    <p className="metadata tech-filter-label">{label}</p>
    <ToggleGroup type="single" aria-label={label} value={selected ?? ""} onValueChange={value => onSelect(value || null)} className="tech-filter-group">
      {filters.map(term => <ToggleGroupItem key={term} value={term} className="tech-filter-item">{term}</ToggleGroupItem>)}
    </ToggleGroup>
    <p className="tech-filter-status" aria-live="polite">{selected && <>
      {selected} <span className="tech-filter-sep" aria-hidden="true">·</span>{" "}
      {/* Link and comma form one unbreakable unit, so a line never starts with a comma. */}
      {hits.map((hit, index) => <Fragment key={hit.id}>{index > 0 && " "}<span className="tech-filter-hit"><a href={`#${hit.id}`}>{hit.name}</a>{index < hits.length - 1 && ","}</span></Fragment>)}
    </>}</p>
  </div>;
}
