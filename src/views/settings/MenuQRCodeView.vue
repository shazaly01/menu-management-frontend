<template>
  <div class="max-w-4xl mx-auto py-12 px-4 print:py-0 print:px-0">
    <h1 class="text-3xl font-bold text-gray-800 mb-2 text-center print:hidden">
      باركود المنيو العام
    </h1>
    <p class="text-gray-500 mb-8 text-center print:hidden max-w-lg mx-auto text-sm">
      هذا هو الباركود الخاص بقائمة الطعام لمطعمك. يمكنك طباعته ووضعه على الطاولات، أو تحميله كصورة
      لإرساله إلى شركة الطباعة.
    </p>

    <!-- الحاوية الرئيسية مع تأثير إضاءة خلفية خفيفة للإبهار البصري -->
    <div
      class="relative bg-white rounded-2xl shadow-xl border border-gray-100 p-8 flex flex-col items-center overflow-hidden print:shadow-none print:border-none print:p-0"
    >
      <!-- ديكور جمالي خلفي (يختفي عند الطباعة) -->
      <div
        class="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-300 rounded-full blur-3xl opacity-20 print:hidden"
      ></div>
      <div
        class="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-amber-400 to-pink-300 rounded-full blur-3xl opacity-20 print:hidden"
      ></div>

      <!-- حاوية الباركود (هذا الجزء فقط هو الذي سيتم طباعته) -->
      <div
        id="qr-container"
        class="relative z-10 bg-white p-8 rounded-2xl border-2 border-dashed border-gray-200 shadow-md flex flex-col items-center transition-all duration-300 hover:shadow-lg print:border-none print:shadow-none print:p-0 print:w-full"
      >
        <!-- اسم الهوية البصرية للمطعم: يظهر في الشاشة وعند الطباعة بشكل فخم -->
        <div class="text-center mb-6">
          <span
            class="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full print:hidden"
          >
            قائمة الطعام الرقمية
          </span>
          <h2
            class="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-blue-900 mt-2 print:text-black print:text-4xl"
          >
            {{ restaurantName }}
          </h2>
          <p class="text-sm text-gray-400 mt-1 print:text-gray-600 print:text-lg">
            امسح الكود لعرض المنيو
          </p>
        </div>

        <!-- مكان توليد الباركود الملون بواسطة المكتبة -->
        <div
          class="relative p-4 bg-gradient-to-tr from-amber-50 via-white to-blue-50 rounded-xl shadow-inner print:p-0"
        >
          <div id="qr-canvas-container" class="flex justify-center items-center"></div>
        </div>
      </div>

      <!-- عرض الرابط كنص (للقراءة فقط) -->
      <div class="mt-8 w-full max-w-md relative z-10 print:hidden">
        <label class="block text-sm font-semibold text-gray-700 mb-2"
          >رابط المنيو المباشر (URL):</label
        >
        <div class="relative flex items-center">
          <input
            type="text"
            readonly
            :value="menuUrl"
            class="w-full text-center bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-sm font-mono text-gray-600 focus:outline-none"
          />
        </div>
      </div>

      <!-- أزرار الإجراءات -->
      <div class="mt-8 flex gap-4 relative z-10 print:hidden">
        <button
          @click="printQR"
          class="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
            ></path>
          </svg>
          طباعة الباركود الفاخر
        </button>

        <button
          @click="downloadQR"
          class="px-8 py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl font-medium hover:from-gray-900 hover:to-black transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            ></path>
          </svg>
          تحميل كصورة عالية الدقة
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import QRCodeStyling from 'qr-code-styling'

// جلب اسم المطعم ديناميكياً من ملف الإعدادات .env.production الخاص بالـ Vite
const restaurantName = computed(() => {
  return import.meta.env.VITE_RESTAURANT_NAME || 'مطعمنا المتميز'
})

// تحديد رابط المنيو ديناميكياً بناءً على النطاق الحالي للمشروع
const menuUrl = computed(() => {
  return `${window.location.origin}/menu`
})

// إعداد كائن الباركود الملون وتحديد الخصائص الجمالية الفاخرة
const qrCode = new QRCodeStyling({
  width: 300,
  height: 300,
  type: 'svg',
  data: menuUrl.value,
  margin: 10,
  qrOptions: {
    typeNumber: 0,
    mode: 'Byte',
    errorCorrectionLevel: 'H', // أعلى مستوى حماية لضمان القراءة السريعة حتى لو تعرض الكود لخدوش
  },
  dotsOptions: {
    type: 'extra-rounded', // جعل النقاط دائرية وانسيابية مبهجة جداً للمطاعم بدلاً من المربعات الجامدة
    gradient: {
      type: 'linear',
      rotation: 45,
      colorStops: [
        { offset: 0, color: '#1e3a8a' }, // لون أزرق ملكي داكن في البداية لضمان التباين العالي عند القراءة
        { offset: 1, color: '#3b82f6' }, // يتدرج إلى اللون الأزرق المضيء الجذاب ليعطي لمسة عصرية
      ],
    },
  },
  backgroundOptions: {
    color: '#ffffff',
  },
  cornersSquareOptions: {
    type: 'extra-rounded', // تدوير الزوايا المربعة الثلاثة الكبيرة المحيطة بالباركود لتتناسق مع النقاط الداخلية
    color: '#1e3a8a',
  },
  cornersDotOptions: {
    type: 'dot', // جعل النقاط الداخلية للزوايا دائرية بالكامل لتضفي جمالاً إضافياً
    color: '#3b82f6',
  },
})

// حقن وتوليد الباركود داخل الـ DOM فور اكتمال تحميل الشاشة
onMounted(() => {
  const container = document.getElementById('qr-canvas-container')
  if (container) {
    qrCode.append(container)
  }
})

// دالة الطباعة: تفتح نافذة الطباعة الافتراضية للمتصفح مع عزل الباركود واسم المطعم
const printQR = () => {
  window.print()
}

// دالة تحميل الباركود كصورة عالية الجودة PNG للتسليم لشركات الطباعة
const downloadQR = () => {
  qrCode.download({
    name: `qrcode-${restaurantName.value.replace(/\s+/g, '-')}`,
    extension: 'png',
  })
}
</script>

<style>
/*
  تنسيقات دقيقة ومحكمة للطباعة لضمان ظهور اسم المطعم
  والباركود الملون فقط في منتصف الصفحة تماماً بدون أي تشوهات.
*/
@media print {
  body {
    background: white !important;
    background-image: none !important;
  }
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
    width: 100% !important;
    max-width: 500px !important;
    text-align: center;
    border: none !important;
    box-shadow: none !important;
    padding: 0 !important;
    margin: 0 !important;
  }
}
</style>
