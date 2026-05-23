import apiClient from './apiClient'

const resource = '/remote-orders'

export default {
  // جلب قائمة الطلبات الوسيطة (طلبات الويتر الحالي أو كل الطلبات للكاشير)
  get() {
    return apiClient.get(resource)
  },

  // استعراض تفاصيل طلب وسيط محدد
  find(id) {
    return apiClient.get(`${resource}/${id}`)
  },

  // إنشاء طلب وسيط جديد (إرسال السلة والطاولة)
  create(payload) {
    return apiClient.post(resource, payload)
  },

  // تحديث حالة الطلب من قبل الكاشير (confirmed أو cancelled)
  updateStatus(id, status) {
    return apiClient.patch(`${resource}/${id}/status`, { status })
  },
}
