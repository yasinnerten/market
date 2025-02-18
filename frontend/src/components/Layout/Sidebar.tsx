interface SidebarProps {
  onCategoryChange: (category: string | null) => void;
  onPriceRangeChange: (range: [number, number] | null) => void;
}

export default function Sidebar({ onCategoryChange, onPriceRangeChange }: SidebarProps) {
  const categories = [
    'All',
    'Electronics',
    'Clothing',
    'Books',
    'Home & Garden',
    'Sports',
  ];

  const priceRanges = [
    { label: 'All', range: null },
    { label: 'Under $25', range: [0, 25] },
    { label: '$25 - $50', range: [25, 50] },
    { label: '$50 - $100', range: [50, 100] },
    { label: 'Over $100', range: [100, Infinity] },
  ];

  return (
    <div className="w-64 flex-shrink-0">
      <div className="sticky top-4 space-y-6">
        {/* Categories */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Categories</h3>
          <ul className="space-y-2">
            {categories.map((category) => (
              <li key={category}>
                <button
                  onClick={() => onCategoryChange(category === 'All' ? null : category)}
                  className="text-gray-600 hover:text-gray-900"
                >
                  {category}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Price Range */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Price Range</h3>
          <ul className="space-y-2">
            {priceRanges.map((price) => (
              <li key={price.label}>
                <button
                  onClick={() => onPriceRangeChange(price.range as [number, number] | null)}
                  className="text-gray-600 hover:text-gray-900"
                >
                  {price.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
} 