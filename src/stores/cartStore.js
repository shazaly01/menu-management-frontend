import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import remoteOrderService from '@/services/remoteOrderService'

export const useCartStore = defineStore('cart', () => {
  // --- State ---
  const selectedTableId = ref(null) // يحفظ رقم الطاولة (table_product_id)
  const items = ref([]) // مصفوفة لحفظ الأصناف المطلوبة
  const notes = ref('') // ملاحظات عامة على الطلب
  const loading = ref(false)
  const error = ref(null)

  // --- Getters (Computed) ---
  // حساب الإجمالي محلياً لعرضه للويتر قبل الإرسال
  const totalAmount = computed(() => {
    return items.value.reduce((total, item) => {
      return total + item.price * item.quantity
    }, 0)
  })

  const cartCount = computed(() => {
    return items.value.reduce((count, item) => count + item.quantity, 0)
  })

  // --- Actions ---
  // تحديد الطاولة
  function setTable(tableId) {
    selectedTableId.value = tableId
  }

  // إضافة صنف إلى السلة أو زيادة كميته إذا كان موجوداً
  function addItem(product, quantity = 1) {
    const existingItem = items.value.find((item) => item.product_id === product.id)
    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      items.value.push({
        product_id: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
      })
    }
  }

  // تحديث كمية صنف معين
  function updateItemQuantity(productId, quantity) {
    const item = items.value.find((item) => item.product_id === productId)
    if (item) {
      if (quantity > 0) {
        item.quantity = quantity
      } else {
        removeItem(productId)
      }
    }
  }

  // إزالة صنف من السلة
  function removeItem(productId) {
    items.value = items.value.filter((item) => item.product_id !== productId)
  }

  // تصفير السلة بالكامل
  function clearCart() {
    selectedTableId.value = null
    items.value = []
    notes.value = ''
    error.value = null
  }

  // إرسال الطلب إلى السيرفر
  async function submitOrder() {
    if (!selectedTableId.value) {
      error.value = 'الرجاء اختيار الطاولة أولاً.'
      throw new Error(error.value)
    }
    if (items.value.length === 0) {
      error.value = 'السلة فارغة، الرجاء إضافة أصناف.'
      throw new Error(error.value)
    }

    loading.value = true
    error.value = null

    try {
      // تجهيز الـ Payload ليتطابق تماماً مع قواعد التحقق (StoreRemoteOrderRequest)
      const payload = {
        table_product_id: selectedTableId.value,
        notes: notes.value,
        items: items.value.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
        })),
      }

      const response = await remoteOrderService.create(payload)
      clearCart() // تصفير السلة بعد نجاح الإرسال
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'فشل في إرسال الطلب.'
      console.error(err)
      throw err // إعادة رمي الخطأ ليتمكن الـ Component من عرض رسالة تنبيه للمستخدم
    } finally {
      loading.value = false
    }
  }

  // --- Return public API ---
  return {
    selectedTableId,
    items,
    notes,
    loading,
    error,
    totalAmount,
    cartCount,
    setTable,
    addItem,
    updateItemQuantity,
    removeItem,
    clearCart,
    submitOrder,
  }
})
