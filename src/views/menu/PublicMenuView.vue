<template>
  <!-- الخلفية الرئيسية متدرجة داكنة لتعطي فخامة وتبرز الإضاءة -->
  <div
    class="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black pb-12 font-sans selection:bg-amber-500 selection:text-white"
  >
    <!-- Header / ترويسة زجاجية ثابتة -->
    <header
      class="sticky top-0 z-50 backdrop-blur-xl bg-gray-900/60 border-b border-gray-800 shadow-[0_4px_30px_rgba(0,0,0,0.5)] transition-all duration-300"
    >
      <div class="max-w-3xl mx-auto px-4 py-5 text-center relative overflow-hidden">
        <!-- تأثير إضاءة خلفية في الترويسة -->
        <div
          class="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-10 bg-amber-500/20 blur-3xl rounded-full"
        ></div>

        <h1
          class="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-500 to-orange-500 drop-shadow-sm"
        >
          قائمة الطعام
        </h1>
        <p class="text-xs font-medium text-gray-400 mt-1 tracking-widest uppercase">
          اكتشف أطباقنا المميزة
        </p>
      </div>

      <!-- Categories Tabs / تبويبات الأقسام بتأثير التوهج -->
      <div v-if="!menuStore.loading && menuStore.categories.length > 0" class="pb-3 pt-1">
        <ul
          class="flex overflow-x-auto whitespace-nowrap hide-scrollbar py-2 px-4 max-w-3xl mx-auto space-x-3 space-x-reverse snap-x"
        >
          <li v-for="category in menuStore.categories" :key="category.id" class="snap-center">
            <button
              @click="selectedCategoryId = category.id"
              :class="[
                'relative px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ease-out flex items-center justify-center overflow-hidden',
                selectedCategoryId === category.id
                  ? 'text-gray-900 bg-gradient-to-r from-amber-400 to-orange-500 shadow-[0_0_20px_rgba(245,158,11,0.4)] scale-105'
                  : 'text-gray-300 bg-gray-800/80 border border-gray-700 hover:bg-gray-700 hover:text-white',
              ]"
            >
              <!-- تأثير لمعان يمر على الزر النشط -->
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

    <!-- Main Content / المحتوى الرئيسي -->
    <main class="max-w-3xl mx-auto px-4 mt-8 relative">
      <!-- Loading State / أنيميشن التحميل النبضي -->
      <div
        v-if="menuStore.loading"
        class="flex flex-col justify-center items-center py-32 space-y-4"
      >
        <div class="relative w-16 h-16">
          <div class="absolute inset-0 border-t-2 border-amber-500 rounded-full animate-spin"></div>
          <div
            class="absolute inset-2 border-t-2 border-orange-400 rounded-full animate-spin-reverse"
          ></div>
        </div>
        <p class="text-amber-500 text-sm font-medium animate-pulse">جاري تحضير القائمة...</p>
      </div>

      <!-- Error State -->
      <div
        v-else-if="menuStore.error"
        class="bg-red-500/10 border border-red-500/50 backdrop-blur-md text-red-400 p-5 rounded-2xl text-center shadow-[0_0_15px_rgba(239,68,68,0.2)]"
      >
        <p class="mb-3">{{ menuStore.error }}</p>
        <button
          @click="fetchData"
          class="px-5 py-2 bg-red-500/20 hover:bg-red-500/40 rounded-full text-sm transition-colors border border-red-500/50"
        >
          إعادة المحاولة
        </button>
      </div>

      <!-- Products Grid مع أنيميشن الدخول -->
      <transition-group
        v-else
        name="staggered-fade"
        tag="div"
        class="grid grid-cols-1 sm:grid-cols-2 gap-5"
      >
        <div
          v-for="(product, index) in filteredProducts"
          :key="product.id"
          :style="{ transitionDelay: `${index * 50}ms` }"
          class="group relative bg-gray-800/40 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden hover:border-amber-500/50 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_10px_30px_rgba(245,158,11,0.15)] flex flex-col"
        >
          <!-- إضاءة خفيفة تظهر عند مرور الماوس/اللمس -->
          <div
            class="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-amber-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"
          ></div>

          <!-- صورة المنتج -->
          <div class="h-48 bg-gray-900 relative overflow-hidden z-10">
            <img
              v-if="product.image_url"
              :src="product.image_url"
              :alt="product.name"
              class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
            />
            <!-- أيقونة بديلة أنيقة في حال غياب الصورة -->
            <div
              v-else
              class="flex flex-col items-center justify-center w-full h-full text-gray-600 bg-gray-800/50"
            >
              <svg
                class="w-12 h-12 mb-2 opacity-50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>

            <!-- شريط السعر العائم -->
            <div
              class="absolute bottom-3 left-3 bg-gray-900/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-gray-700/50 shadow-lg"
            >
              <span class="text-amber-400 font-bold tracking-wide">{{ product.price }} د.ك</span>
            </div>
          </div>

          <!-- تفاصيل المنتج -->
          <div class="p-5 z-10 flex-1 flex flex-col justify-start">
            <h3
              class="text-lg font-bold text-gray-100 group-hover:text-amber-400 transition-colors duration-300"
            >
              {{ product.name }}
            </h3>
            <p
              v-if="product.description"
              class="text-sm text-gray-400 mt-2 leading-relaxed line-clamp-2"
            >
              {{ product.description }}
            </p>
          </div>
        </div>
      </transition-group>

      <!-- رسالة القسم الفارغ -->
      <div
        v-if="filteredProducts.length === 0 && !menuStore.loading"
        class="py-20 text-center relative"
      >
        <div
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-amber-500/5 blur-3xl rounded-full"
        ></div>
        <p class="text-gray-500 text-lg relative z-10">لا توجد أصناف في هذا القسم حالياً.</p>
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
/* إخفاء شريط التمرير لأقسام المنيو */
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* تأثير لمعان الزر (Shine Animation) */
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

/* دوران عكسي لمؤشر التحميل */
.animate-spin-reverse {
  animation: spin 1s linear infinite reverse;
}

/* حركة دخول الأصناف (Vue Transition Group) */
.staggered-fade-enter-active,
.staggered-fade-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
.staggered-fade-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.95);
}
.staggered-fade-leave-to {
  opacity: 0;
  transform: translateY(-30px) scale(0.95);
  /* إخفاء العنصر فوراً عند الخروج لتجنب تداخل المساحات */
  position: absolute;
}
</style>
