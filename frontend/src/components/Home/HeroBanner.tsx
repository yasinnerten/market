import { Link } from 'react-router-dom'
import { endpoints } from '@/services/api'
import { useApiQuery } from '@/hooks/useApi'

interface Banner {
  id: number
  title: string
  subtitle: string
  imageUrl: string
  ctaText: string
  ctaLink: string
}

export default function HeroBanner() {
  const { data: banner, isLoading } = useApiQuery<Banner>(
    ['active-banner'],
    () => endpoints.banners.getActive().then(res => res.data)
  )

  if (isLoading || !banner) {
    return <div className="h-96 bg-gray-100 animate-pulse" />
  }

  return (
    <div className="relative h-96">
      <img
        src={banner.imageUrl}
        alt={banner.title}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            {banner.title}
          </h1>
          <p className="text-xl text-white mb-8">
            {banner.subtitle}
          </p>
          <Link
            to={banner.ctaLink}
            className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            {banner.ctaText}
          </Link>
        </div>
      </div>
    </div>
  )
} 