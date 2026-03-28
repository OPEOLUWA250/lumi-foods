'use client'

import { categories } from '@/lib/products'

interface CategorySidebarProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

export function CategorySidebar({
  selectedCategory,
  onCategoryChange,
}: CategorySidebarProps) {
  return (
    <aside className="w-full md:w-64 space-y-2">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-foreground mb-4">Categories</h2>
        <div className="space-y-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                selectedCategory === category
                  ? 'bg-primary text-primary-foreground font-semibold'
                  : 'text-foreground hover:bg-muted'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
}
