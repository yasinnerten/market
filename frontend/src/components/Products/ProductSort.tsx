import { useSearchParams } from 'react-router-dom'

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'name_asc', label: 'Name: A to Z' },
  { value: 'name_desc', label: 'Name: Z to A' }
]

const ProductSort = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const currentSort = searchParams.get('sort') || 'newest'

  const handleSortChange = (value: string) => {
    searchParams.set('sort', value)
    setSearchParams(searchParams)
  }

  return (
    <select
      value={currentSort}
      onChange={(e) => handleSortChange(e.target.value)}
      className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500"
    >
      {sortOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}

export default ProductSort 