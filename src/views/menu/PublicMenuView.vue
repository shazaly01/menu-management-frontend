<template>
  <div
    class="min-h-screen bg-[#030712] text-gray-100 pb-16 font-sans selection:bg-amber-500 selection:text-white relative overflow-hidden"
  >
    <!-- أنوار خلفية ديناميكية متحركة لتعزيز إحساس الإضاءة الداكنة -->
    <div
      class="absolute top-[-10%] left-[-20%] w-[80vw] h-[80vw] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none animate-pulse"
      style="animation-duration: 8s"
    ></div>
    <div
      class="absolute bottom-[20%] right-[-20%] w-[70vw] h-[70vw] bg-orange-600/5 rounded-full blur-[100px] pointer-events-none animate-pulse"
      style="animation-duration: 12s"
    ></div>

    <header
      class="sticky top-0 z-50 backdrop-blur-xl bg-gray-950/40 border-b border-white/[0.04] shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]"
    >
      <!-- خط مضيء رفيع جداً في أعلى الهيدر لشعور الـ Premium -->
      <div
        class="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/40 to-transparent"
      ></div>

      <div class="max-w-3xl mx-auto px-4 pt-6 pb-4 text-center relative">
        <h1
          class="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-400 to-orange-500 tracking-wider drop-shadow-[0_2px_10px_rgba(245,158,11,0.2)]"
        >
          قائمة الطعام
        </h1>
        <p
          class="text-[10px] font-bold text-amber-500/70 mt-1.5 tracking-widest uppercase flex items-center justify-center gap-2"
        >
          <span class="w-1.5 h-[1px] bg-amber-500/30"></span>
          اكتشف أطباقنا المميزة
          <span class="w-1.5 h-[1px] bg-amber-500/30"></span>
        </p>
      </div>

      <!-- قائمة الأقسام بتصميم كبسولات زجاجية متوهجة -->
      <div v-if="!menuStore.loading && menuStore.categories.length > 0" class="pb-4 pt-1">
        <ul
          class="flex overflow-x-auto whitespace-nowrap hide-scrollbar py-2 px-4 max-w-3xl mx-auto space-x-3 space-x-reverse snap-x"
        >
          <li v-for="category in menuStore.categories" :key="category.id" class="snap-center">
            <button
              @click="selectedCategoryId = category.id"
              :class="[
                'relative px-6 py-2.5 rounded-full text-xs font-bold transition-all duration-500 ease-out flex items-center justify-center overflow-hidden tracking-wide border backdrop-blur-md',
                selectedCategoryId === category.id
                  ? 'text-black font-black bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 border-amber-300 shadow-[0_0_25px_rgba(245,158,11,0.45)] scale-105'
                  : 'text-gray-400 bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.05] hover:text-white',
              ]"
            >
              <!-- بريق متحرك داخل الزر النشط -->
              <div
                v-if="selectedCategoryId === category.id"
                class="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 animate-shine"
              ></div>
              <span class="relative z-10">{{ category.name }}</span>
            </button>
          </li>
        </ul>
      </div>
    </header>

    <main class="max-w-3xl mx-auto px-4 mt-6 relative z-10">
      <!-- شاشة التحميل السينمائية -->
      <div
        v-if="menuStore.loading"
        class="flex flex-col justify-center items-center py-40 space-y-4"
      >
        <div class="relative w-16 h-16">
          <div class="absolute inset-0 border-2 border-amber-500/20 rounded-full"></div>
          <div
            class="absolute inset-0 border-t-2 border-r-2 border-amber-400 rounded-full animate-spin"
          ></div>
          <div
            class="absolute inset-3 border-b-2 border-l-2 border-orange-500 rounded-full animate-spin-reverse"
          ></div>
        </div>
        <p class="text-amber-400/80 text-xs font-medium tracking-widest animate-pulse mt-2">
          جاري تنسيق التجربة الفاخرة...
        </p>
      </div>

      <div
        v-else-if="menuStore.error"
        class="bg-red-500/[0.03] border border-red-500/20 backdrop-blur-xl text-red-400 p-6 rounded-2xl text-center shadow-[0_0_30px_rgba(239,68,68,0.05)]"
      >
        <p class="mb-4 text-sm font-medium">{{ menuStore.error }}</p>
        <button
          @click="fetchData"
          class="px-6 py-2.5 bg-red-500/10 hover:bg-red-500/20 rounded-full text-xs transition-all border border-red-500/30 font-bold tracking-wide"
        >
          إعادة المحاولة
        </button>
      </div>

      <!-- شبكة المنتجات المستوحاة من تطبيقات الهواتف الفاخرة -->
      <transition-group v-else name="staggered-fade" tag="div" class="grid grid-cols-2 gap-4">
        <div
          v-for="(product, index) in filteredProducts"
          :key="product.id"
          :style="{ transitionDelay: `${index * 50}ms` }"
          class="group relative bg-gradient-to-b from-white/[0.03] to-white/[0.01] backdrop-blur-md rounded-2xl border border-white/[0.05] overflow-hidden hover:border-amber-500/40 transition-all duration-500 flex flex-col shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]"
        >
          <!-- هالة ضوئية خلفية تظهر فقط عند عمل الحوم (Hover/Touch) على الكرت -->
          <div
            class="absolute inset-0 bg-radial-glow opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-0 pointer-events-none"
          ></div>

          <!-- حاوي الصورة الفاخر مع تأثير الانعكاس -->
          <div
            class="h-32 w-full bg-gray-950 relative overflow-hidden z-10 border-b border-white/[0.03]"
          >
            <img
              v-if="product.image_url"
              :src="product.image_url"
              :alt="product.name"
              class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out filter brightness-[0.9] group-hover:brightness-[1.05]"
            />
            <div
              v-else
              class="flex flex-col items-center justify-center w-full h-full bg-gradient-to-b from-gray-900 to-gray-950 text-gray-600"
            >
              <svg
                class="w-8 h-8 opacity-20 group-hover:text-amber-500/40 transition-colors duration-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>

            <!-- طبقة تدرج داكنة ناعمة فوق الصورة لحماية تباين النصوص إن وجدت -->
            <div
              class="absolute inset-0 bg-gradient-to-t from-gray-950/40 via-transparent to-transparent"
            ></div>
          </div>

          <!-- تفاصيل المنتج مع النصوص المتوهجة هيدروليكياً -->
          <div class="p-3.5 z-10 flex-1 flex flex-col justify-between relative">
            <div>
              <h3
                class="text-xs font-bold text-gray-200 tracking-wide glow-text group-hover:text-amber-300 transition-colors duration-300 line-clamp-1 sm:text-base"
              >
                {{ product.name }}
              </h3>
              <p
                v-if="product.description"
                class="text-[10px] text-gray-400/80 mt-1 leading-relaxed line-clamp-2 transition-colors duration-300 group-hover:text-gray-300 sm:text-xs sm:mt-1.5"
              >
                {{ product.description }}
              </p>
            </div>
          </div>
        </div>
      </transition-group>

      <!-- حالة عدم وجود منتجات -->
      <div
        v-if="filteredProducts.length === 0 && !menuStore.loading"
        class="py-24 text-center relative"
      >
        <div
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-amber-500/5 blur-[50px] rounded-full"
        ></div>
        <p class="text-gray-500 text-xs font-medium tracking-wide relative z-10">
          لا توجد أصناف في هذا القسم حالياً.
        </p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { usePublicMenuStore } from '@/stores/publicMenuStore'

const menuStore = usePublicMenuStore()
const selectedCategoryId = ref(null)

const fetchData = async () => {
  await menuStore.fetchCategories()
  await menuStore.fetchProducts()

  if (menuStore.categories.length > 0) {
    selectedCategoryId.value = menuStore.categories[0].id
  }
}

onMounted(() => {
  fetchData()
})

const filteredProducts = computed(() => {
  if (!selectedCategoryId.value) return []
  return menuStore.products.filter((product) => product.category_id === selectedCategoryId.value)
})
</script>

<style scoped>
/* إخفاء شريط التمرير تماماً بسلاسة */
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* حركة التوهج القطري للبطاقات */
.bg-radial-glow {
  background: radial-gradient(80% 40% at 50% 100%, rgba(245, 158, 11, 0.08), transparent);
}

/* تأثير لمعان الكبسولة الفاخر السريع (Premium Linear Shine) */
@keyframes shine {
  0% {
    transform: translateX(-150%) skewX(-15deg);
  }
  100% {
    transform: translateX(150%) skewX(-15deg);
  }
}
.animate-shine {
  animation: shine 3.5s infinite cubic-bezier(0.4, 0, 0.2, 1);
}

/* دوران عكسي ناعم لمؤشر التحميل */
.animate-spin-reverse {
  animation: spin 1.5s linear infinite reverse;
}

/* تأثير الدخول المتدرج السينمائي للأصناف */
.staggered-fade-enter-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.staggered-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.staggered-fade-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.96);
}
.staggered-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.96);
  position: absolute;
}

/* تأثير نيون النصوص الهادئ الحواف */
.glow-text {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
}
.group:hover .glow-text {
  text-shadow: 0 0 8px rgba(251, 191, 36, 0.3);
}
</style>
