import apiClient from './apiClient'

const resource = '/menu'

export default {
  // جلب كافة الأقسام النشطة (بما فيها قسم الطاولات)
  getCategories() {
    return apiClient.get(`${resource}/categories`)
  },

  // جلب كافة الأصناف النشطة (بما فيها الطاولات)
  getProducts() {
    return apiClient.get(`${resource}/products`)
  },
}
