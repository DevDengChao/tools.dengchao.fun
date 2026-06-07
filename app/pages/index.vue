<script setup lang="ts">
const tools = [
  {
    name: 'DNS Dig',
    path: '/dig/example.com',
    description: '查询域名的 DNS 记录',
  },
  {
    name: 'UUID Generator',
    path: '/uuid',
    description: '生成随机 UUID',
  },
  {
    name: 'Dice',
    path: '/dice',
    description: '掷骰子，返回 1-6 随机数（支持 ?min=&max= 参数）',
  },
  {
    name: 'Multi-WeChat',
    path: 'https://multi-wechat.dengchao.fun',
    description: '微信多开工具',
    external: true,
  },
]
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4">
    <div class="max-w-2xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">
        Tools
      </h1>
      <ul class="space-y-4">
        <li v-for="tool in tools" :key="tool.path">
          <a
            :href="tool.path"
            :target="tool.external ? '_blank' : undefined"
            class="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <h2 class="text-xl font-semibold text-gray-800 mb-2">
              {{ tool.name }}
            </h2>
            <p class="text-gray-600">
              {{ tool.description }}
            </p>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>
