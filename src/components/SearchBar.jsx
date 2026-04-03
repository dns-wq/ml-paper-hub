import { useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { CATEGORIES, DIFFICULTY_LABELS } from '../data/papers.js';

export default function SearchBar({ filters, onFiltersChange }) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="search-bar-container">
      <div className="search-bar-row">
        <div className="search-bar-input">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search papers by title, author, or keyword..."
            value={filters.query}
            onChange={e => onFiltersChange({ ...filters, query: e.target.value })}
          />
          {filters.query && (
            <button className="clear-search" onClick={() => onFiltersChange({ ...filters, query: '' })}>
              <X size={14} />
            </button>
          )}
        </div>
        <button
          className={`filter-toggle ${showFilters ? 'active' : ''}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal size={16} />
          Filters
          {hasActiveFilters(filters) && <span className="filter-dot" />}
        </button>
      </div>

      {showFilters && (
        <div className="filter-panel">
          <div className="filter-group">
            <label>Difficulty</label>
            <div className="filter-chips">
              {Object.entries(DIFFICULTY_LABELS).map(([level, label]) => (
                <button
                  key={level}
                  className={`filter-chip ${filters.difficulty.includes(Number(level)) ? 'active' : ''}`}
                  onClick={() => {
                    const num = Number(level);
                    const next = filters.difficulty.includes(num)
                      ? filters.difficulty.filter(d => d !== num)
                      : [...filters.difficulty, num];
                    onFiltersChange({ ...filters, difficulty: next });
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <label>Source</label>
            <div className="filter-chips">
              {['ilya', 'karpathy', 'both', 'user'].map(source => (
                <button
                  key={source}
                  className={`filter-chip source-chip-${source} ${filters.source.includes(source) ? 'active' : ''}`}
                  onClick={() => {
                    const next = filters.source.includes(source)
                      ? filters.source.filter(s => s !== source)
                      : [...filters.source, source];
                    onFiltersChange({ ...filters, source: next });
                  }}
                >
                  {source === 'both' ? 'Both' : source === 'user' ? 'Added' : source.charAt(0).toUpperCase() + source.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <label>Sort by</label>
            <select
              value={filters.sort}
              onChange={e => onFiltersChange({ ...filters, sort: e.target.value })}
            >
              <option value="category">Category</option>
              <option value="title">Title A-Z</option>
              <option value="year-desc">Year (newest)</option>
              <option value="year-asc">Year (oldest)</option>
              <option value="difficulty">Difficulty</option>
            </select>
          </div>

          {hasActiveFilters(filters) && (
            <button
              className="clear-filters"
              onClick={() => onFiltersChange({ query: filters.query, difficulty: [], source: [], sort: 'category' })}
            >
              Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function hasActiveFilters(filters) {
  return filters.difficulty.length > 0 || filters.source.length > 0 || filters.sort !== 'category';
}
