import { useSearchParams } from 'react-router-dom'
import { endpoints } from '@/services/api'
import { useApiQuery } from '@/hooks/useApi'

interface Category {
  id: number
  name: string
  slug: string
}

const CategoryFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const currentCategory = searchParams.get('category')

  const { data: categories, isLoading } = useApiQuery<Category[]>(
    ['categories'],
    () => endpoints.products.getAllCategories().then(res => res.data)
  )

  const handleCategoryClick = (slug: string | null) => {
    if (slug) {
      searchParams.set('category', slug)
    } else {
      searchParams.delete('category')
    }
    setSearchParams(searchParams)
  }

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-8 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <button
        onClick={() => handleCategoryClick(null)}
        className={`block w-full text-left px-4 py-2 rounded-lg ${
          !currentCategory
            ? 'bg-primary-100 text-primary-700'
            : 'hover:bg-gray-100'
        }`}
      >
        All Products
      </button>
      {categories?.map((category) => (
        <button
          key={category.id}
          onClick={() => handleCategoryClick(category.slug)}
          className={`block w-full text-left px-4 py-2 rounded-lg ${
            currentCategory === category.slug
              ? 'bg-primary-100 text-primary-700'
              : 'hover:bg-gray-100'
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  )
}

export default CategoryFilter 