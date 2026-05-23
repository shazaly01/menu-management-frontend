import { defineStore } from 'pinia'
import { ref } from 'vue'
import remoteOrderService from '@/services/remoteOrderService'

export const useRemoteOrderStore = defineStore('remoteOrder', () => {
  // --- State ---
  const orders = ref([]) // قائمة الطلبات (للكاشير أو الويتر)
  const currentOrder = ref(null) // تفاصيل طلب محدد
  const loading = ref(false)
  const error = ref(null)

  // --- Actions ---
  // جلب قائمة الطلبات
  async function fetchOrders() {
    loading.value = true
    error.value = null
    try {
      const response = await remoteOrderService.get()
      orders.value = response.data.data || [] // نفترض أن الـ Resource يعيد البيانات داخل 'data'
    } catch (err) {
      error.value = 'فشل في جلب قائمة الطلبات.'
      console.error(err)
      orders.value = []
    } finally {
      loading.value = false
    }
  }

  // جلب تفاصيل طلب معين
  async function fetchOrder(id) {
    loading.value = true
    error.value = null
    currentOrder.value = null
    try {
      const response = await remoteOrderService.find(id)
      currentOrder.value = response.data.data || response.data
    } catch (err) {
      error.value = 'فشل في جلب تفاصيل الطلب.'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  // تحديث حالة الطلب (تأكيد السحب أو الإلغاء - يستخدم عادةً من جهة الكاشير أو لوحة الإدارة)
  async function updateOrderStatus(id, status) {
    loading.value = true
    error.value = null
    try {
      const response = await remoteOrderService.updateStatus(id, status)

      // تحديث حالة الطلب محلياً في المصفوفة دون الحاجة لطلب جلب جديد من السيرفر
      const index = orders.value.findIndex((o) => o.id === id)
      if (index !== -1) {
        orders.value[index].status = status
      }

      // إذا كان الطلب المفتوح حالياً هو نفس الطلب، نقوم بتحديث حالته أيضاً
      if (currentOrder.value && currentOrder.value.id === id) {
        currentOrder.value.status = status
      }

      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'فشل في تحديث حالة الطلب.'
      console.error(err)
      throw err // إعادة رمي الخطأ للتعامل معه في واجهة المستخدم (عرض إشعار مثلاً)
    } finally {
      loading.value = false
    }
  }

  // --- Return public API ---
  return {
    orders,
    currentOrder,
    loading,
    error,
    fetchOrders,
    fetchOrder,
    updateOrderStatus,
  }
})
