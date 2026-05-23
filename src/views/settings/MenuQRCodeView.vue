<template>
  <div class="max-w-4xl mx-auto py-8 px-4">
    <h1 class="text-2xl font-bold text-gray-800 mb-6 text-center print:hidden">
      باركود المنيو العام
    </h1>

    <!-- الحاوية الرئيسية -->
    <div
      class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center"
    >
      <p class="text-gray-500 mb-8 text-center print:hidden max-w-lg">
        هذا هو الباركود الخاص بقائمة الطعام لمطعمك. يمكنك طباعته ووضعه على الطاولات، أو تحميله كصورة
        لإرساله إلى شركة الطباعة.
      </p>

      <!-- حاوية الباركود (هذا الجزء فقط هو الذي سيتم طباعته) -->
      <div
        id="qr-container"
        class="bg-white p-6 rounded-xl border-2 border-dashed border-gray-200 shadow-sm print:border-none print:shadow-none print:p-0 flex flex-col items-center"
      >
        <!-- عنوان يظهر فقط عند الطباعة -->
        <h2 class="text-2xl font-bold text-center mb-6 text-gray-800 print:block hidden">
          امسح الكود لعرض قائمة الطعام
        </h2>

        <!-- مكون توليد الباركود -->
        <qrcode-vue :value="menuUrl" :size="300" level="H" id="qr-canvas" />
      </div>

      <!-- عرض الرابط كنص (للقراءة فقط) -->
      <div class="mt-8 w-full max-w-md print:hidden">
        <label class="block text-sm font-medium text-gray-700 mb-2">رابط المنيو (URL):</label>
        <input
          type="text"
          readonly
          :value="menuUrl"
          class="w-full text-center bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <!-- أزرار الإجراءات -->
      <div class="mt-8 flex gap-4 print:hidden">
        <button
          @click="printQR"
          class="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
            ></path>
          </svg>
          طباعة الباركود
        </button>

        <button
          @click="downloadQR"
          class="px-6 py-2.5 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition-colors flex items-center gap-2 shadow-sm"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            ></path>
          </svg>
          تحميل كصورة
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import QrcodeVue from 'qrcode.vue'

// تحديد رابط المنيو ديناميكياً بناءً على النطاق (Domain) الحالي للمشروع
const menuUrl = computed(() => {
  return `${window.location.origin}/menu`
})

// دالة الطباعة: تفتح نافذة الطباعة الخاصة بالمتصفح
const printQR = () => {
  window.print()
}

// دالة تحميل الباركود كصورة PNG
const downloadQR = () => {
  const canvas = document.getElementById('qr-canvas')
  if (canvas) {
    const url = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.href = url
    link.download = 'restaurant-menu-qrcode.png'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}
</script>

<style>
/*
  تنسيقات مخصصة للطباعة (@media print)
  تقوم بإخفاء كل عناصر الواجهة الجانبية والعلوية،
  وتضع الباركود مع العنوان في منتصف ورقة الطباعة البيضاء.
*/
@media print {
  body * {
    visibility: hidden;
  }
  #qr-container,
  #qr-container * {
    visibility: visible;
  }
  #qr-container {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    text-align: center;
  }
}
</style>
