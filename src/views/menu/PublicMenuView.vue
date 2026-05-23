<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-black pb-12 font-sans selection:bg-amber-500 selection:text-white"
  >
    <header
      class="sticky top-0 z-50 backdrop-blur-xl bg-gray-950/70 border-b border-gray-800/60 shadow-[0_4px_30px_rgba(0,0,0,0.6)] transition-all duration-300"
    >
      <div class="max-w-3xl mx-auto px-4 py-5 text-center relative overflow-hidden">
        <div
          class="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-10 bg-amber-500/10 blur-3xl rounded-full"
        ></div>

        <h1
          class="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-orange-500 tracking-wide drop-shadow-sm sm:text-3xl"
        >
          قائمة الطعام
        </h1>
        <p class="text-[10px] font-bold text-gray-400 mt-1 tracking-widest uppercase opacity-80">
          اكتشف أطباقنا المميزة
        </p>
      </div>

      <div v-if="!menuStore.loading && menuStore.categories.length > 0" class="pb-3 pt-1">
        <ul
          class="flex overflow-x-auto whitespace-nowrap hide-scrollbar py-2 px-4 max-w-3xl mx-auto space-x-2 space-x-reverse snap-x"
        >
          <li v-for="category in menuStore.categories" :key="category.id" class="snap-center">
            <button
              @click="selectedCategoryId = category.id"
              :class="[
                'relative px-5 py-2 rounded-full text-xs font-black transition-all duration-300 ease-out flex items-center justify-center overflow-hidden tracking-wide',
                selectedCategoryId === category.id
                  ? 'text-gray-900 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 shadow-[0_0_15px_rgba(245,158,11,0.35)] scale-105'
                  : 'text-gray-300 bg-gray-900/90 border border-gray-800 hover:bg-gray-800 hover:text-white',
              ]"
            >
              <div
                v-if="selectedCategoryId === category.id"
                class="absolute inset-0 bg-white/20 -skew-x-12 animate-shine"
              ></div>
              <span class="relative z-10">{{ category.name }}</span>
            </button>
          </li>
        </ul>
      </div>
    </header>

    <main class="max-w-3xl mx-auto px-3 mt-5 relative">
      <div
        v-if="menuStore.loading"
        class="flex flex-col justify-center items-center py-32 space-y-4"
      >
        <div class="relative w-14 h-14">
          <div class="absolute inset-0 border-t-2 border-amber-500 rounded-full animate-spin"></div>
          <div
            class="absolute inset-2 border-t-2 border-orange-400 rounded-full animate-spin-reverse"
          ></div>
        </div>
        <p class="text-amber-500 text-xs font-semibold animate-pulse">
          جاري تحضير القائمة الفاخرة...
        </p>
      </div>

      <div
        v-else-if="menuStore.error"
        class="bg-red-500/10 border border-red-500/40 backdrop-blur-md text-red-400 p-5 rounded-2xl text-center shadow-[0_0_15px_rgba(239,68,68,0.15)]"
      >
        <p class="mb-3 text-sm">{{ menuStore.error }}</p>
        <button
          @click="fetchData"
          class="px-5 py-2 bg-red-500/20 hover:bg-red-500/40 rounded-full text-xs transition-colors border border-red-500/40 font-bold"
        >
          إعادة المحاولة
        </button>
      </div>

      <transition-group
        v-else
        name="staggered-fade"
        tag="div"
        class="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5"
      >
        <div
          v-for="(product, index) in filteredProducts"
          :key="product.id"
          :style="{ transitionDelay: `${index * 40}ms` }"
          class="group relative bg-gradient-to-b from-gray-900/40 to-gray-950/80 backdrop-blur-md rounded-xl border border-gray-800/80 overflow-hidden hover:border-amber-500/30 transition-all duration-300 flex flex-col"
        >
          <div
            class="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0 pointer-events-none"
          ></div>

          <div
            class="h-28 w-full bg-gray-950 relative overflow-hidden z-10 sm:h-44 border-b border-gray-900"
          >
            <img
              v-if="product.image_url"
              :src="product.image_url"
              :alt="product.name"
              class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out"
            />
            <div
              v-else
              class="flex flex-col items-center justify-center w-full h-full text-gray-700 bg-gray-900/40"
            >
              <svg class="w-8 h-8 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
          </div>

          <div class="p-3 z-10 flex-1 flex flex-col justify-between bg-gray-950/30">
            <div>
              <h3
                class="text-xs font-black text-amber-100/90 glow-text group-hover:text-amber-400 transition-colors duration-300 line-clamp-1 sm:text-base"
              >
                {{ product.name }}
              </h3>
              <p
                v-if="product.description"
                class="text-[10px] text-gray-400 mt-1 leading-relaxed line-clamp-2 opacity-75 sm:text-xs sm:mt-1.5"
              >
                {{ product.description }}
              </p>
            </div>
          </div>
        </div>
      </transition-group>

      <div
        v-if="filteredProducts.length === 0 && !menuStore.loading"
        class="py-20 text-center relative"
      >
        <div
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-amber-500/5 blur-3xl rounded-full"
        ></div>
        <p class="text-gray-500 text-sm relative z-10">لا توجد أصناف في هذا القسم حالياً.</p>
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
/* إخفاء شريط التمرير لأقسام المنيو ليبقى المظهر رصيناً ونظيفاً */
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* تأثير لمعان الزر الجاذب للعين (Shine Animation) */
@keyframes shine {
  0% {
    left: -100%;
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    left: 200%;
    opacity: 0;
  }
}
.animate-shine {
  animation: shine 3s infinite cubic-bezier(0.4, 0, 0.2, 1);
}

/* دوران عكسي ناعم لمؤشر التحميل */
.animate-spin-reverse {
  animation: spin 1s linear infinite reverse;
}

/* حركة دخول الأصناف الرشيقة الهادئة */
.staggered-fade-enter-active,
.staggered-fade-leave-active {
  transition: all 0.35s cubic-bezier(0.25, 1, 0.5, 1);
}
.staggered-fade-enter-from {
  opacity: 0;
  transform: translateY(12px) scale(0.98);
}
.staggered-fade-leave-to {
  opacity: 0;
  transform: translateY(-12px) scale(0.98);
  position: absolute;
}

/* تأثير النص المضيء المتوهج (Glowing Text Shadow Effect) */
.glow-text {
  text-shadow:
    0 0 4px rgba(251, 191, 36, 0.2),
    0 0 12px rgba(245, 158, 11, 0.1);
}
.group:hover .glow-text {
  text-shadow:
    0 0 6px rgba(251, 191, 36, 0.5),
    0 0 18px rgba(245, 158, 11, 0.3);
}
</style>
