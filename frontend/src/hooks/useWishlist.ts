import { useState } from 'react'
import { Product } from '@/types'
import { endpoints } from '@/services/api'

export const useWishlist = () => {
  const [wishlist, setWishlist] = useState<Product[]>([])

  const addToWishlist = async (productId: number) => {
    try {
      await endpoints.wishlist.add(productId)
      setWishlist(current => [...current])
    } catch (error) {
      console.error('Failed to add to wishlist:', error)
    }
  }

  const removeFromWishlist = async (productId: number) => {
    try {
      await endpoints.wishlist.remove(productId)
      setWishlist(current => current.filter(item => item.id !== productId))
    } catch (error) {
      console.error('Failed to remove from wishlist:', error)
    }
  }

  const isInWishlist = (productId: number) => {
    return wishlist.some(item => item.id === productId)
  }

  return {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist
  }
} 