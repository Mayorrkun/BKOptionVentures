import { useState } from 'react';
import '../css/categorysidebar.css';

const SORT_OPTIONS = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'price-asc', label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'name-asc', label: 'Name A → Z' },
];

export default function CategorySidebar({ categories, selected, onCategoryChange, sort, onSortChange }) {
  const [open, setOpen] = useState(false);

  const toggle = cat => {
    const next = selected.includes(cat)
      ? selected.filter(c => c !== cat)
      : [...selected, cat];
    onCategoryChange(next);
  };

  return (
    <aside className="sidebar">
      <button className="sidebar-toggle" onClick={() => setOpen(o => !o)}>
        Filters {open ? '▲' : '▼'}
      </button>

      <div className={`sidebar-body${open ? ' open' : ''}`}>
        <div className="sidebar-section">
          <h5>Category</h5>
          {categories.map(cat => (
            <label key={cat} className="sidebar-check">
              <input
                type="checkbox"
                checked={selected.includes(cat)}
                onChange={() => toggle(cat)}
              />
              {cat}
            </label>
          ))}
        </div>

        <div className="sidebar-section">
          <h5>Sort By</h5>
          <select
            value={sort}
            onChange={e => onSortChange(e.target.value)}
            className="sidebar-select"
          >
            {SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>
    </aside>
  );
}
