import { defineStore } from 'pinia'
import { ref } from 'vue'
import publicMenuService from '@/services/publicMenuService'

export const usePublicMenuStore = defineStore('publicMenu', () => {
  // --- State ---
  const categories = ref([])
  const products = ref([])
  const loading = ref(false)
  const error = ref(null)

  // --- Actions ---
  // جلب أقسام المنيو للزبائن (بدون الطاولات)
  async function fetchCategories() {
    loading.value = true
    error.value = null
    try {
      const response = await publicMenuService.getCategories()
      categories.value = response.data || []
    } catch (err) {
      error.value = err.response?.data?.message || 'فشل في جلب أقسام المنيو.'
      console.error(err)
      categories.value = []
    } finally {
      loading.value = false
    }
  }

  // جلب أصناف المنيو للزبائن (بدون الطاولات)
  async function fetchProducts() {
    loading.value = true
    error.value = null
    try {
      const response = await publicMenuService.getProducts()
      products.value = response.data || []
    } catch (err) {
      error.value = err.response?.data?.message || 'فشل في جلب أصناف المنيو.'
      console.error(err)
      products.value = []
    } finally {
      loading.value = false
    }
  }

  // --- Return public API ---
  return {
    categories,
    products,
    loading,
    error,
    fetchCategories,
    fetchProducts,
  }
})
