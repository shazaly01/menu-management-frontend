<template>
  <div
    class="min-h-screen bg-[#070a13] text-gray-100 pb-16 font-sans selection:bg-amber-500 selection:text-white relative overflow-hidden text-right"
    dir="rtl"
  >
    <div
      class="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gradient-to-b from-amber-500/10 to-transparent rounded-full blur-[120px] pointer-events-none z-0"
    ></div>
    <div
      class="absolute bottom-10 right-10 w-[300px] h-[300px] bg-orange-500/5 rounded-full blur-[100px] pointer-events-none z-0"
    ></div>

    <header
      class="sticky top-0 z-50 backdrop-blur-xl bg-[#070a13]/80 border-b border-white/[0.06] shadow-[0_4px_30px_rgba(0,0,0,0.8)]"
    >
      <div
        class="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-70"
      ></div>

      <div class="max-w-5xl mx-auto px-4 pt-6 pb-4 text-center relative">
        <h1
          class="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-orange-500 tracking-wider filter drop-shadow-[0_0_15px_rgba(245,158,11,0.4)]"
        >
          قائمة الطعام
        </h1>
        <p
          class="text-[11px] font-bold text-amber-400/60 mt-2 tracking-widest uppercase flex items-center justify-center gap-2"
        >
          <span class="w-8 h-[1px] bg-gradient-to-l from-amber-500/50 to-transparent"></span>
          اكتشف أطباقنا المميزة
          <span class="w-8 h-[1px] bg-gradient-to-r from-amber-500/50 to-transparent"></span>
        </p>
      </div>

      <div v-if="!menuStore.loading && menuStore.categories.length > 0" class="pb-4 pt-2">
        <ul
          class="flex overflow-x-auto whitespace-nowrap hide-scrollbar py-2 px-4 max-w-5xl mx-auto justify-start sm:justify-center items-center gap-3 snap-x"
        >
          <li v-for="category in menuStore.categories" :key="category.id" class="snap-center">
            <button
              @click="selectedCategoryId = category.id"
              :class="[
                'relative px-6 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ease-out flex items-center justify-center overflow-hidden border tracking-wide',
                selectedCategoryId === category.id
                  ? 'text-black font-black bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400 border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.6)] scale-105'
                  : 'text-gray-400 bg-white/[0.03] border-white/[0.05] hover:bg-white/[0.08] hover:text-white hover:border-amber-500/30',
              ]"
            >
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

    <main class="max-w-5xl mx-auto px-4 mt-8 relative z-10">
      <div
        v-if="menuStore.loading"
        class="flex flex-col justify-center items-center py-40 space-y-4"
      >
        <div class="relative w-16 h-16">
          <div class="absolute inset-0 border-2 border-amber-500/20 rounded-full"></div>
          <div
            class="absolute inset-0 border-t-2 border-r-2 border-amber-400 rounded-full animate-spin"
          ></div>
        </div>
        <p class="text-amber-400/80 text-xs font-medium tracking-wider animate-pulse">
          جاري تنسيق التجربة الفاخرة...
        </p>
      </div>

      <div
        v-else-if="menuStore.error"
        class="bg-red-500/[0.03] border border-red-500/20 text-red-400 p-6 rounded-2xl text-center"
      >
        <p class="mb-4 text-sm">{{ menuStore.error }}</p>
        <button
          @click="fetchData"
          class="px-6 py-2 bg-red-500/20 rounded-full text-xs font-bold border border-red-500/40"
        >
          إعادة المحاولة
        </button>
      </div>

      <transition-group
        v-else
        name="staggered-fade"
        tag="div"
        class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6"
      >
        <div
          v-for="(product, index) in filteredProducts"
          :key="product.id"
          :style="{ transitionDelay: `${index * 40}ms` }"
          class="group relative bg-[#0d1222] rounded-2xl border border-white/[0.06] overflow-hidden hover:border-amber-400/50 transition-all duration-500 flex flex-col shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_25px_rgba(245,158,11,0.15)] hover:-translate-y-1"
        >
          <div
            class="absolute inset-0 bg-radial-glow opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0 pointer-events-none"
          ></div>

          <div
            class="h-40 w-full bg-[#070a13] relative overflow-hidden z-10 border-b border-white/[0.04]"
          >
            <img
              v-if="product.image_url"
              :src="product.image_url"
              :alt="product.name"
              class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out filter brightness-[0.85] group-hover:brightness-[1.05]"
            />
            <div
              v-else
              class="flex flex-col items-center justify-center w-full h-full bg-gradient-to-b from-[#111827] to-[#070a13] text-gray-600"
            >
              <svg
                class="w-10 h-10 opacity-20 text-amber-500 group-hover:scale-110 transition-transform duration-500"
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

            <div
              class="absolute inset-0 bg-gradient-to-t from-[#0d1222] via-transparent to-transparent opacity-80"
            ></div>
          </div>

          <div class="p-4 z-10 flex-1 flex flex-col justify-between bg-[#0d1222]">
            <div>
              <h3
                class="text-sm font-black text-gray-200 tracking-wide transition-colors duration-300 group-hover:text-amber-400"
              >
                {{ product.name }}
              </h3>
              <p
                v-if="product.description"
                class="text-[11px] text-gray-400/80 mt-1.5 leading-relaxed line-clamp-2 transition-colors duration-300 group-hover:text-gray-300"
              >
                {{ product.description }}
              </p>
            </div>

            <div
              class="w-0 h-[2px] bg-gradient-to-r from-amber-400 to-orange-500 mt-4 transition-all duration-500 group-hover:w-full"
            ></div>
          </div>
        </div>
      </transition-group>

      <div
        v-if="filteredProducts.length === 0 && !menuStore.loading"
        class="py-24 text-center relative"
      >
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
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* وهج النيون الدائري تحت البطاقات */
.bg-radial-glow {
  background: radial-gradient(100% 60% at 50% 100%, rgba(245, 158, 11, 0.12), transparent);
}

@keyframes shine {
  0% {
    transform: translateX(-150%) skewX(-15deg);
  }
  100% {
    transform: translateX(150%) skewX(-15deg);
  }
}
.animate-shine {
  animation: shine 3s infinite cubic-bezier(0.4, 0, 0.2, 1);
}

.staggered-fade-enter-active {
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.staggered-fade-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.95);
}
.staggered-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
  position: absolute;
}
</style>
