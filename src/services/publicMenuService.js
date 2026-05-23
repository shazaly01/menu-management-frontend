import apiClient from './apiClient'

const resource = '/public-menu'

export default {
  // جلب الأقسام للزبائن (مستبعد منها القسم 13 الخاص بالطاولات)
  getCategories() {
    return apiClient.get(`${resource}/categories`)
  },

  // جلب الأصناف للزبائن (مستبعد منها الطاولات)
  getProducts() {
    return apiClient.get(`${resource}/products`)
  },
}
