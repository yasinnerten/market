import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { endpoints } from '@/services/api'
import { Product } from '@/types'

interface ProductFormProps {
  product?: Product
}

const ProductForm = ({ product }: ProductFormProps) => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price.toString() || '',
    stock: product?.stock.toString() || '',
    category: product?.category || '',
    image: null as File | null
  })

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      if (product) {
        return endpoints.products.update(product.id, data)
      }
      return endpoints.products.create(data)
    },
    onSuccess: () => {
      navigate('/admin/products')
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const data = new FormData()
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null) {
        data.append(key, value)
      }
    })
    mutation.mutate(data)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({ ...prev, image: file }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="input mt-1"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="input mt-1"
          rows={4}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Price
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            step="0.01"
            className="input mt-1"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Stock
          </label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            className="input mt-1"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="input mt-1"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Image
        </label>
        <input
          type="file"
          onChange={handleFileChange}
          className="mt-1"
          accept="image/*"
        />
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => navigate('/admin/products')}
          className="btn bg-gray-100 hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? 'Saving...' : 'Save Product'}
        </button>
      </div>
    </form>
  )
}

export default ProductForm 