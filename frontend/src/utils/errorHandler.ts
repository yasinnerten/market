import { AxiosError } from 'axios'
import { ApiError } from '@/types'

export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const apiError = error.response?.data as ApiError
    return apiError?.message || 'An unexpected error occurred'
  }
  return 'An unexpected error occurred'
} 