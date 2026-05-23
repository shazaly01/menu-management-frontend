import { defineStore } from 'pinia'
import { ref } from 'vue'
import menuService from '@/services/menuService'

export const useMenuStore = defineStore('menu', () => {
  // --- State ---
  const categories = ref([])
  const products = ref([])
  const loading = ref(false)
  const error = ref(null)

  // --- Actions ---
  // جلب الأقسام
  async function fetchCategories() {
    loading.value = true
    error.value = null
    try {
      const response = await menuService.getCategories()
      // الواجهة الخلفية تعيد البيانات داخل كائن JSON، غالباً بداخل مفتاح اسمه data بسبب Resource
      categories.value = response.data || []
    } catch (err) {
      error.value = err.response?.data?.message || 'فشل في جلب الأقسام.'
      console.error(err)
      categories.value = []
    } finally {
      loading.value = false
    }
  }

  // جلب الأصناف
  async function fetchProducts() {
    loading.value = true
    error.value = null
    try {
      const response = await menuService.getProducts()
      products.value = response.data || []
    } catch (err) {
      error.value = err.response?.data?.message || 'فشل في جلب الأصناف.'
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
