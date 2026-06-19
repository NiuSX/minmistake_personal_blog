# Vue 学习笔记：从入门到项目实战

> 这份笔记面向已经具备 HTML、CSS、JavaScript 基础，并希望系统掌握 Vue 的学习者。内容以 Vue 3 为主，覆盖模板语法、响应式、组件、指令、Composition API、Options API、路由、状态管理、表单、工程化、性能优化、测试、部署和真实项目实践。

---

## 1. Vue 是什么

Vue 是一套用于构建用户界面的渐进式 JavaScript 框架。它的核心能力是声明式渲染和响应式数据绑定。

Vue 可以只用于页面中的一小块交互，也可以配合 Vue Router、Pinia、Vite、组件库等构建完整单页应用。

### 1.1 Vue 的核心特点

- 渐进式：可以按需引入，不强制一次使用完整生态。
- 声明式渲染：数据变化后自动更新视图。
- 响应式系统：自动追踪依赖并触发更新。
- 单文件组件：把模板、脚本、样式组织在 `.vue` 文件中。
- 指令系统：`v-if`、`v-for`、`v-model` 等简化模板逻辑。
- Composition API：更灵活地组织和复用逻辑。
- 生态完善：Vue Router、Pinia、Vite、Nuxt、组件库都很成熟。

### 1.2 Vue 2 与 Vue 3 简要区别

| 对比项 | Vue 2 | Vue 3 |
| --- | --- | --- |
| 响应式实现 | Object.defineProperty | Proxy |
| 逻辑复用 | mixins 为主 | Composition API |
| TypeScript 支持 | 一般 | 更好 |
| 多根节点 | 不支持 | 支持 Fragment |
| 性能 | 较好 | 更好 |
| 官方状态管理 | Vuex | Pinia |

现代新项目优先选择 Vue 3。

---

## 2. 创建 Vue 项目

### 2.1 使用 Vite

```bash
npm create vue@latest vue-demo
cd vue-demo
npm install
npm run dev
```

创建时可选择：

- TypeScript
- JSX
- Vue Router
- Pinia
- Vitest
- ESLint
- Prettier

### 2.2 项目结构

常见结构：

```text
vue-demo
├── index.html
├── package.json
├── vite.config.js
├── src
│   ├── main.js
│   ├── App.vue
│   ├── assets
│   ├── components
│   ├── views
│   ├── router
│   ├── stores
│   ├── services
│   ├── composables
│   └── styles
└── public
```

### 2.3 入口文件

```js
import { createApp } from 'vue';
import App from './App.vue';

createApp(App).mount('#app');
```

如果使用路由和 Pinia：

```js
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router';
import App from './App.vue';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.mount('#app');
```

---

## 3. 单文件组件 SFC

Vue 单文件组件通常是 `.vue` 文件。

```vue
<template>
  <div class="user-card">
    <h2>{{ username }}</h2>
  </div>
</template>

<script setup>
const username = 'Alice';
</script>

<style scoped>
.user-card {
  padding: 16px;
}
</style>
```

### 3.1 template

用于写模板结构。

### 3.2 script

用于写组件逻辑。Vue 3 推荐使用：

```vue
<script setup>
</script>
```

它语法更简洁，编译时自动处理组件暴露。

### 3.3 style

用于写样式。添加 `scoped` 后样式只作用于当前组件。

```vue
<style scoped>
.title {
  color: red;
}
</style>
```

---

## 4. 模板语法

### 4.1 文本插值

```vue
<template>
  <p>{{ message }}</p>
</template>

<script setup>
const message = 'Hello Vue';
</script>
```

### 4.2 JavaScript 表达式

```vue
<p>{{ count + 1 }}</p>
<p>{{ ok ? 'Yes' : 'No' }}</p>
<p>{{ message.toUpperCase() }}</p>
```

模板中可以写表达式，但不应该写复杂逻辑。复杂逻辑应放到 computed 或方法中。

### 4.3 v-html

```vue
<div v-html="html"></div>
```

注意：`v-html` 可能导致 XSS。如果内容来自用户输入，必须经过安全处理。

### 4.4 属性绑定 v-bind

```vue
<img v-bind:src="imageUrl" />
```

简写：

```vue
<img :src="imageUrl" />
```

绑定布尔属性：

```vue
<button :disabled="loading">Submit</button>
```

### 4.5 class 绑定

对象写法：

```vue
<div :class="{ active: isActive, disabled: isDisabled }"></div>
```

数组写法：

```vue
<div :class="['card', statusClass]"></div>
```

### 4.6 style 绑定

```vue
<div :style="{ color: textColor, fontSize: size + 'px' }"></div>
```

---

## 5. 条件渲染

### 5.1 v-if

```vue
<div v-if="loading">Loading...</div>
<div v-else-if="error">Failed</div>
<div v-else>Content</div>
```

`v-if` 会真正创建或销毁 DOM。

### 5.2 v-show

```vue
<div v-show="visible">Content</div>
```

`v-show` 只是切换 CSS `display`。

### 5.3 v-if 与 v-show 的选择

| 指令 | 特点 | 场景 |
| --- | --- | --- |
| `v-if` | 创建/销毁 DOM | 条件不频繁变化 |
| `v-show` | display 显隐 | 频繁切换 |

---

## 6. 列表渲染

### 6.1 v-for

```vue
<ul>
  <li v-for="user in users" :key="user.id">
    {{ user.name }}
  </li>
</ul>
```

### 6.2 获取索引

```vue
<li v-for="(user, index) in users" :key="user.id">
  {{ index + 1 }} - {{ user.name }}
</li>
```

### 6.3 遍历对象

```vue
<div v-for="(value, key) in user" :key="key">
  {{ key }}: {{ value }}
</div>
```

### 6.4 key 的作用

`key` 用于帮助 Vue 识别节点身份，提高更新准确性和效率。

推荐使用稳定唯一 ID：

```vue
:key="user.id"
```

不推荐使用数组索引，尤其是列表会新增、删除、排序时。

### 6.5 v-if 与 v-for 不建议同时用

不推荐：

```vue
<li v-for="user in users" v-if="user.active" :key="user.id">
  {{ user.name }}
</li>
```

推荐先计算过滤结果：

```js
const activeUsers = computed(() => users.value.filter(user => user.active));
```

```vue
<li v-for="user in activeUsers" :key="user.id">
  {{ user.name }}
</li>
```

---

## 7. 事件处理

### 7.1 v-on

```vue
<button v-on:click="handleClick">Click</button>
```

简写：

```vue
<button @click="handleClick">Click</button>
```

### 7.2 传参

```vue
<button @click="deleteUser(user.id)">Delete</button>
```

### 7.3 访问事件对象

```vue
<input @input="handleInput" />
```

```js
function handleInput(event) {
  console.log(event.target.value);
}
```

传参同时传事件：

```vue
<button @click="handleClick(user.id, $event)">Click</button>
```

### 7.4 事件修饰符

```vue
<form @submit.prevent="submitForm"></form>
<button @click.stop="handleClick">Click</button>
<button @click.once="handleClick">Only once</button>
```

常见修饰符：

- `.prevent`
- `.stop`
- `.once`
- `.capture`
- `.self`
- `.passive`

### 7.5 按键修饰符

```vue
<input @keyup.enter="submit" />
<input @keyup.esc="cancel" />
```

---

## 8. 表单与 v-model

`v-model` 用于双向绑定表单数据。

### 8.1 input

```vue
<input v-model="username" />
<p>{{ username }}</p>
```

```js
const username = ref('');
```

### 8.2 textarea

```vue
<textarea v-model="content"></textarea>
```

### 8.3 checkbox

单个布尔：

```vue
<input type="checkbox" v-model="checked" />
```

多个选项：

```vue
<input type="checkbox" value="read" v-model="permissions" />
<input type="checkbox" value="write" v-model="permissions" />
```

```js
const permissions = ref([]);
```

### 8.4 radio

```vue
<input type="radio" value="male" v-model="gender" />
<input type="radio" value="female" v-model="gender" />
```

### 8.5 select

```vue
<select v-model="role">
  <option value="admin">Admin</option>
  <option value="user">User</option>
</select>
```

### 8.6 v-model 修饰符

```vue
<input v-model.trim="username" />
<input v-model.number="age" />
<input v-model.lazy="keyword" />
```

| 修饰符 | 说明 |
| --- | --- |
| `.trim` | 去除首尾空格 |
| `.number` | 转为数字 |
| `.lazy` | change 时更新，而不是 input 时 |

---

## 9. 响应式基础

Vue 的核心是响应式系统。数据变化后，依赖这些数据的视图会自动更新。

### 9.1 ref

`ref` 用于创建响应式值。

```js
import { ref } from 'vue';

const count = ref(0);

function increment() {
  count.value++;
}
```

模板中会自动解包：

```vue
<button @click="increment">{{ count }}</button>
```

脚本中访问和修改需要 `.value`。

### 9.2 reactive

`reactive` 用于创建响应式对象。

```js
const user = reactive({
  name: 'Alice',
  age: 18,
});

user.age++;
```

### 9.3 ref 与 reactive 选择

| API | 适合 |
| --- | --- |
| `ref` | 基本类型、单个值、数组、对象都可 |
| `reactive` | 对象状态 |

实践建议：

- 基本类型用 `ref`。
- 需要整体替换的对象用 `ref`。
- 复杂对象也可以用 `reactive`。
- 团队内保持一致风格。

### 9.4 reactive 解构丢失响应式

```js
const user = reactive({ name: 'Alice', age: 18 });
const { name } = user; // name 不是响应式
```

解决：

```js
const { name, age } = toRefs(user);
```

### 9.5 shallowRef 与 shallowReactive

浅层响应式，只追踪第一层。

适合：

- 大对象。
- 第三方实例。
- 不希望深层代理的数据。

```js
const chart = shallowRef(null);
```

---

## 10. computed 计算属性

计算属性用于从已有状态派生新值。

```js
const firstName = ref('Alice');
const lastName = ref('Smith');

const fullName = computed(() => `${firstName.value} ${lastName.value}`);
```

模板：

```vue
<p>{{ fullName }}</p>
```

### 10.1 computed 的特点

- 基于依赖缓存。
- 依赖不变时不会重复计算。
- 适合派生数据。

### 10.2 可写 computed

```js
const fullName = computed({
  get() {
    return `${firstName.value} ${lastName.value}`;
  },
  set(value) {
    const parts = value.split(' ');
    firstName.value = parts[0];
    lastName.value = parts[1];
  },
});
```

### 10.3 computed 与 methods 区别

| 对比项 | computed | method |
| --- | --- | --- |
| 是否缓存 | 是 | 否 |
| 调用方式 | 像属性 | 像函数 |
| 适合场景 | 派生状态 | 事件处理或普通逻辑 |

---

## 11. watch 与 watchEffect

### 11.1 watch

监听指定数据变化。

```js
watch(keyword, (newValue, oldValue) => {
  console.log(newValue, oldValue);
});
```

监听多个：

```js
watch([firstName, lastName], ([newFirst, newLast]) => {
  console.log(newFirst, newLast);
});
```

监听对象属性：

```js
watch(
  () => user.id,
  (id) => {
    loadUser(id);
  }
);
```

### 11.2 immediate

```js
watch(
  keyword,
  () => {
    search();
  },
  { immediate: true }
);
```

### 11.3 deep

```js
watch(
  user,
  () => {
    console.log('user changed');
  },
  { deep: true }
);
```

深度监听成本较高，不要滥用。

### 11.4 watchEffect

自动收集依赖。

```js
watchEffect(() => {
  console.log(count.value);
});
```

适合依赖简单、自动追踪更方便的场景。

### 11.5 watch 与 watchEffect 区别

| 对比项 | watch | watchEffect |
| --- | --- | --- |
| 依赖声明 | 显式 | 自动 |
| 是否能拿旧值 | 能 | 通常不关注 |
| 初始执行 | 默认不执行 | 默认立即执行 |
| 适合 | 精确监听 | 简单副作用 |

---

## 12. 组件基础

### 12.1 定义组件

`UserCard.vue`：

```vue
<template>
  <div class="user-card">
    <h3>{{ name }}</h3>
  </div>
</template>

<script setup>
defineProps({
  name: String,
});
</script>
```

使用：

```vue
<template>
  <UserCard name="Alice" />
</template>

<script setup>
import UserCard from './components/UserCard.vue';
</script>
```

### 12.2 props

```js
const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    default: 18,
  },
});
```

TypeScript 写法：

```ts
defineProps<{
  name: string;
  age?: number;
}>();
```

### 12.3 props 只读

子组件不应该直接修改 props。

错误：

```js
props.name = 'Bob';
```

正确做法：

- 通过 emit 通知父组件修改。
- 在子组件中创建本地副本。

### 12.4 emit

子组件：

```vue
<script setup>
const emit = defineEmits(['delete']);

function handleDelete() {
  emit('delete', 1);
}
</script>

<template>
  <button @click="handleDelete">Delete</button>
</template>
```

父组件：

```vue
<UserCard @delete="deleteUser" />
```

### 12.5 v-model 组件通信

子组件：

```vue
<script setup>
defineProps({
  modelValue: String,
});

const emit = defineEmits(['update:modelValue']);
</script>

<template>
  <input
    :value="modelValue"
    @input="emit('update:modelValue', $event.target.value)"
  />
</template>
```

父组件：

```vue
<BaseInput v-model="username" />
```

Vue 3.4+ 可使用 `defineModel`：

```vue
<script setup>
const model = defineModel();
</script>

<template>
  <input v-model="model" />
</template>
```

---

## 13. 插槽 slot

插槽用于组件内容分发。

### 13.1 默认插槽

```vue
<!-- BaseCard.vue -->
<template>
  <div class="card">
    <slot />
  </div>
</template>
```

使用：

```vue
<BaseCard>
  <h2>Title</h2>
  <p>Content</p>
</BaseCard>
```

### 13.2 具名插槽

```vue
<template>
  <div class="card">
    <header>
      <slot name="header" />
    </header>
    <main>
      <slot />
    </main>
    <footer>
      <slot name="footer" />
    </footer>
  </div>
</template>
```

使用：

```vue
<BaseCard>
  <template #header>
    <h2>User</h2>
  </template>

  <p>User content</p>

  <template #footer>
    <button>Save</button>
  </template>
</BaseCard>
```

### 13.3 作用域插槽

子组件向插槽传数据：

```vue
<slot :user="user" />
```

父组件接收：

```vue
<UserProvider v-slot="{ user }">
  {{ user.name }}
</UserProvider>
```

---

## 14. 生命周期

Composition API 生命周期：

```js
onMounted(() => {
  console.log('mounted');
});

onUpdated(() => {
  console.log('updated');
});

onUnmounted(() => {
  console.log('unmounted');
});
```

常见钩子：

| 钩子 | 说明 |
| --- | --- |
| `onBeforeMount` | 挂载前 |
| `onMounted` | 挂载后，可访问 DOM |
| `onBeforeUpdate` | 更新前 |
| `onUpdated` | 更新后 |
| `onBeforeUnmount` | 卸载前 |
| `onUnmounted` | 卸载后 |
| `onErrorCaptured` | 捕获子组件错误 |

### 14.1 请求数据放哪里

常见写法：

```js
onMounted(() => {
  loadUsers();
});
```

如果请求依赖路由参数，可以配合 `watch`：

```js
watch(
  () => route.params.id,
  (id) => {
    loadUser(id);
  },
  { immediate: true }
);
```

---

## 15. Composition API

Composition API 是 Vue 3 的核心能力，用函数组织逻辑。

### 15.1 script setup

```vue
<script setup>
import { ref } from 'vue';

const count = ref(0);

function increment() {
  count.value++;
}
</script>

<template>
  <button @click="increment">{{ count }}</button>
</template>
```

`script setup` 中的变量和函数可以直接在模板中使用。

### 15.2 逻辑复用 composable

`useMouse.js`：

```js
import { ref, onMounted, onUnmounted } from 'vue';

export function useMouse() {
  const x = ref(0);
  const y = ref(0);

  function update(event) {
    x.value = event.pageX;
    y.value = event.pageY;
  }

  onMounted(() => window.addEventListener('mousemove', update));
  onUnmounted(() => window.removeEventListener('mousemove', update));

  return { x, y };
}
```

使用：

```js
const { x, y } = useMouse();
```

### 15.3 Composition API 优点

- 相关逻辑可以聚合在一起。
- 逻辑复用比 mixin 清晰。
- TypeScript 支持更好。
- 适合复杂组件。

---

## 16. Options API

Vue 2 和很多老项目中常见 Options API。

```vue
<script>
export default {
  data() {
    return {
      count: 0,
    };
  },
  computed: {
    doubleCount() {
      return this.count * 2;
    },
  },
  methods: {
    increment() {
      this.count++;
    },
  },
  mounted() {
    console.log('mounted');
  },
};
</script>
```

Options API 优点：

- 结构固定。
- 初学者容易理解。
- 老项目广泛存在。

缺点：

- 复杂组件中同一功能逻辑分散在 data、methods、computed、watch 中。
- 逻辑复用主要依赖 mixin，容易命名冲突和来源不清。

新项目推荐 Composition API，但理解 Options API 有助于维护老项目。

---

## 17. provide 与 inject

用于跨层级依赖注入。

父组件：

```js
provide('theme', theme);
```

子孙组件：

```js
const theme = inject('theme');
```

适合：

- 主题。
- 表单上下文。
- 组件库内部状态。
- 多层嵌套组件共享数据。

不适合：

- 替代所有全局状态。
- 高频复杂业务状态。

---

## 18. Vue Router

### 18.1 安装

```bash
npm install vue-router
```

### 18.2 创建路由

```js
import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import UserListView from '@/views/UserListView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomeView },
    { path: '/users', component: UserListView },
    { path: '/users/:id', component: () => import('@/views/UserDetailView.vue') },
  ],
});

export default router;
```

### 18.3 注册路由

```js
app.use(router);
```

### 18.4 路由出口

```vue
<RouterView />
```

### 18.5 路由跳转

声明式：

```vue
<RouterLink to="/users">Users</RouterLink>
```

编程式：

```js
const router = useRouter();

router.push('/users');
router.push({ name: 'userDetail', params: { id: 1 } });
```

### 18.6 获取路由参数

```js
const route = useRoute();
const id = route.params.id;
```

### 18.7 导航守卫

```js
router.beforeEach((to) => {
  const token = localStorage.getItem('token');
  if (to.meta.requiresAuth && !token) {
    return '/login';
  }
});
```

路由配置：

```js
{
  path: '/admin',
  component: AdminView,
  meta: { requiresAuth: true }
}
```

### 18.8 嵌套路由

```js
{
  path: '/settings',
  component: SettingsLayout,
  children: [
    { path: 'profile', component: ProfileSettings },
    { path: 'security', component: SecuritySettings },
  ],
}
```

父组件中放：

```vue
<RouterView />
```

---

## 19. Pinia 状态管理

Pinia 是 Vue 官方推荐状态管理库。

### 19.1 安装

```bash
npm install pinia
```

### 19.2 注册

```js
import { createPinia } from 'pinia';

app.use(createPinia());
```

### 19.3 定义 store

```js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useUserStore = defineStore('user', () => {
  const currentUser = ref(null);

  const isLogin = computed(() => currentUser.value !== null);

  function setCurrentUser(user) {
    currentUser.value = user;
  }

  function logout() {
    currentUser.value = null;
  }

  return {
    currentUser,
    isLogin,
    setCurrentUser,
    logout,
  };
});
```

### 19.4 使用 store

```js
const userStore = useUserStore();

userStore.setCurrentUser({ id: 1, name: 'Alice' });
```

模板：

```vue
<p>{{ userStore.currentUser?.name }}</p>
```

### 19.5 storeToRefs

直接解构 store 会丢失响应式。使用：

```js
const userStore = useUserStore();
const { currentUser, isLogin } = storeToRefs(userStore);
const { logout } = userStore;
```

### 19.6 Pinia 适合管理什么

适合：

- 用户信息。
- 权限。
- 购物车。
- 跨页面筛选状态。
- 全局业务配置。

不适合：

- 所有组件局部状态。
- 服务端缓存全部手写进 store。

服务端数据缓存可考虑 TanStack Query for Vue。

---

## 20. 数据请求

### 20.1 fetch

```js
async function getUsers() {
  const response = await fetch('/api/users');
  if (!response.ok) {
    throw new Error('Request failed');
  }
  return response.json();
}
```

### 20.2 axios 封装

```bash
npm install axios
```

```js
import axios from 'axios';

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
});

http.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  response => response.data,
  error => Promise.reject(error)
);

export default http;
```

### 20.3 在组件中请求

```js
const users = ref([]);
const loading = ref(false);
const error = ref(null);

async function loadUsers() {
  loading.value = true;
  error.value = null;
  try {
    users.value = await getUsers();
  } catch (err) {
    error.value = err;
  } finally {
    loading.value = false;
  }
}

onMounted(loadUsers);
```

---

## 21. 组件通信总结

| 场景 | 方式 |
| --- | --- |
| 父传子 | props |
| 子传父 | emit |
| 双向绑定 | v-model |
| 插槽内容分发 | slot |
| 跨多层传递 | provide/inject |
| 全局状态 | Pinia |
| 路由页面通信 | route params/query |

选择原则：

- 近距离通信用 props/emit。
- 表单类组件用 v-model。
- 内容结构变化用 slot。
- 跨层组件库上下文用 provide/inject。
- 多页面共享状态用 Pinia。

---

## 22. 样式

### 22.1 scoped

```vue
<style scoped>
.title {
  color: red;
}
</style>
```

Vue 会给当前组件元素加属性选择器，实现局部作用域。

### 22.2 CSS Modules

```vue
<template>
  <div :class="$style.card">Card</div>
</template>

<style module>
.card {
  padding: 16px;
}
</style>
```

### 22.3 预处理器

```bash
npm install -D sass
```

```vue
<style scoped lang="scss">
.card {
  .title {
    font-weight: 600;
  }
}
</style>
```

### 22.4 深度选择器

修改子组件内部样式：

```css
:deep(.child-class) {
  color: red;
}
```

谨慎使用，容易破坏组件封装。

---

## 23. TypeScript 与 Vue

### 23.1 props 类型

```vue
<script setup lang="ts">
defineProps<{
  name: string;
  age?: number;
}>();
</script>
```

### 23.2 emit 类型

```ts
const emit = defineEmits<{
  delete: [id: number];
  change: [value: string];
}>();
```

### 23.3 ref 类型

```ts
const count = ref<number>(0);
const user = ref<User | null>(null);
```

### 23.4 模板 ref 类型

```vue
<script setup lang="ts">
const inputRef = ref<HTMLInputElement | null>(null);

function focus() {
  inputRef.value?.focus();
}
</script>

<template>
  <input ref="inputRef" />
</template>
```

Vue 3 对 TypeScript 支持较好，中大型项目推荐使用 TypeScript。

---

## 24. 性能优化

### 24.1 常见优化方向

- 合理拆分组件。
- 避免超大响应式对象。
- 大列表使用虚拟滚动。
- 路由懒加载。
- 使用 computed 缓存派生数据。
- 避免深度 watch。
- 避免不必要的全局状态。
- 图片懒加载和压缩。
- 减小 bundle 体积。

### 24.2 v-once

只渲染一次：

```vue
<h1 v-once>{{ title }}</h1>
```

适合完全静态内容。

### 24.3 v-memo

缓存模板片段：

```vue
<div v-for="item in list" :key="item.id" v-memo="[item.id, item.selected]">
  {{ item.name }}
</div>
```

依赖不变时跳过更新。

### 24.4 路由懒加载

```js
{
  path: '/users',
  component: () => import('@/views/UserListView.vue')
}
```

### 24.5 KeepAlive

缓存组件实例。

```vue
<KeepAlive>
  <component :is="currentComponent" />
</KeepAlive>
```

与路由配合：

```vue
<RouterView v-slot="{ Component }">
  <KeepAlive>
    <component :is="Component" />
  </KeepAlive>
</RouterView>
```

适合需要保留状态的页面，例如列表页返回时保留筛选条件。

---

## 25. 异步组件与 Suspense

### 25.1 defineAsyncComponent

```js
const AsyncUserPanel = defineAsyncComponent(() => import('./UserPanel.vue'));
```

带配置：

```js
const AsyncUserPanel = defineAsyncComponent({
  loader: () => import('./UserPanel.vue'),
  loadingComponent: Loading,
  errorComponent: ErrorView,
  delay: 200,
  timeout: 3000,
});
```

### 25.2 Suspense

```vue
<Suspense>
  <template #default>
    <AsyncUserPanel />
  </template>
  <template #fallback>
    <Loading />
  </template>
</Suspense>
```

---

## 26. 自定义指令

### 26.1 局部指令

```vue
<script setup>
const vFocus = {
  mounted(el) {
    el.focus();
  },
};
</script>

<template>
  <input v-focus />
</template>
```

### 26.2 全局指令

```js
app.directive('focus', {
  mounted(el) {
    el.focus();
  },
});
```

使用：

```vue
<input v-focus />
```

自定义指令适合直接操作 DOM 的低层行为，例如自动聚焦、权限显示、点击外部关闭等。

---

## 27. Teleport

Teleport 可以把组件 DOM 渲染到指定位置。

```vue
<Teleport to="body">
  <div class="modal">
    Modal content
  </div>
</Teleport>
```

适合：

- Modal
- Toast
- Dropdown
- Tooltip

这些组件常需要脱离父元素层级，避免被 `overflow:hidden` 或 z-index 影响。

---

## 28. 测试

### 28.1 工具

- Vitest
- Vue Test Utils
- Testing Library Vue
- Playwright/Cypress
- MSW

### 28.2 组件测试示例

```js
import { mount } from '@vue/test-utils';
import Counter from './Counter.vue';

test('increments count', async () => {
  const wrapper = mount(Counter);

  await wrapper.find('button').trigger('click');

  expect(wrapper.text()).toContain('1');
});
```

### 28.3 测试原则

- 测用户可见行为。
- 不过度测试内部实现。
- 关键业务流程写测试。
- API 请求用 mock。
- 复杂表单、权限、路由跳转应重点覆盖。

---

## 29. 构建与部署

### 29.1 构建

```bash
npm run build
```

Vite 默认输出 `dist` 目录。

### 29.2 预览

```bash
npm run preview
```

### 29.3 Nginx 部署

```nginx
server {
    listen 80;
    server_name example.com;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### 29.4 环境变量

Vite 环境变量必须以 `VITE_` 开头：

```env
VITE_API_BASE_URL=https://api.example.com
```

使用：

```js
const baseUrl = import.meta.env.VITE_API_BASE_URL;
```

不要在前端环境变量中保存密钥，因为它会被打包到浏览器代码里。

---

## 30. 项目分层实践

### 30.1 中小项目结构

```text
src
├── assets
├── components
├── views
├── router
├── stores
├── services
├── composables
├── utils
└── styles
```

### 30.2 大型项目结构

```text
src
├── features
│   ├── user
│   │   ├── components
│   │   ├── views
│   │   ├── services
│   │   ├── stores
│   │   └── composables
│   └── order
├── shared
│   ├── components
│   ├── utils
│   └── services
└── router
```

### 30.3 分层建议

- `views` 放路由页面。
- `components` 放可复用组件。
- `services` 放 API 请求。
- `stores` 放 Pinia 状态。
- `composables` 放可复用逻辑。
- `utils` 放纯工具函数。

不要把请求、状态、复杂业务判断全部堆在 `.vue` 文件里。

---

## 31. 常见问题

### 31.1 ref 为什么要 `.value`

在 JavaScript 中，`ref` 是一个对象，真实值放在 `.value` 中。模板中 Vue 会自动解包，所以模板里不用写 `.value`。

### 31.2 reactive 解构后为什么不更新

解构会拿到普通值，失去响应式连接。应使用 `toRefs` 或避免直接解构。

### 31.3 v-if 和 v-for 为什么不建议一起用

两者放在同一元素上会让逻辑不清晰，也可能影响性能。推荐先用 computed 过滤数据，再 v-for 渲染。

### 31.4 computed 和 watch 怎么选

需要从状态派生新值时用 computed。需要在数据变化后执行副作用时用 watch，例如请求接口、写 localStorage。

### 31.5 Pinia 中解构为什么失去响应式

直接解构 store 的 state/getter 会丢失响应式，应使用 `storeToRefs`。

### 31.6 路由刷新 404

history 模式需要服务端把未知路径回退到 `index.html`。Nginx 使用 `try_files $uri $uri/ /index.html;`。

---

## 32. 面试常见问题

### 32.1 Vue 的响应式原理是什么

Vue 3 使用 Proxy 创建响应式代理。读取数据时收集依赖，修改数据时触发依赖更新，从而重新渲染相关组件或执行相关 effect。

### 32.2 ref 和 reactive 的区别

ref 用于创建响应式引用，访问时需要 `.value`，适合基本类型和需要整体替换的数据。reactive 用于创建响应式对象，直接访问属性，但解构时会丢失响应式。

### 32.3 computed 和 watch 的区别

computed 用于计算派生值，具有缓存。watch 用于监听数据变化并执行副作用，例如请求接口、手动同步外部状态。

### 32.4 v-if 和 v-show 的区别

v-if 会创建和销毁 DOM，适合条件不频繁变化。v-show 通过 display 控制显隐，适合频繁切换。

### 32.5 Vue 组件通信方式有哪些

props、emit、v-model、slot、provide/inject、Pinia、路由参数等。

### 32.6 Vue Router 导航守卫有什么用

导航守卫可以在路由跳转前后执行逻辑，常用于登录校验、权限控制、页面标题设置、埋点等。

### 32.7 Pinia 和 Vuex 的区别

Pinia 是 Vue 官方推荐的新状态管理库，API 更简洁，TypeScript 支持更好，不需要 mutation，模块组织更自然。

### 32.8 scoped 样式原理是什么

Vue 会给组件模板元素和 CSS 选择器添加特殊属性，使样式只匹配当前组件内元素。

---

## 33. 学习路线

### 33.1 第一阶段：基础

掌握：

- 模板语法
- v-bind
- v-on
- v-if/v-show
- v-for
- v-model
- 组件基础

练习：

- Todo List。
- 用户列表。
- 简单表单。

### 33.2 第二阶段：响应式与组件

掌握：

- ref
- reactive
- computed
- watch
- props
- emit
- slot
- 生命周期

练习：

- 搜索过滤。
- 用户详情弹窗。
- 可复用表单组件。

### 33.3 第三阶段：工程化

掌握：

- Vue Router
- Pinia
- axios 封装
- Vite
- TypeScript
- 组件库
- 环境变量

练习：

- 后台管理系统。
- 登录鉴权。
- 权限路由。
- 用户分页查询。

### 33.4 第四阶段：进阶

掌握：

- Composition API 逻辑复用。
- 自定义指令。
- Teleport。
- KeepAlive。
- 性能优化。
- 测试。
- 部署。

练习：

- 复杂筛选页面。
- 大列表虚拟滚动。
- 权限按钮指令。
- E2E 测试。

---

## 34. 最佳实践总结

1. 新项目优先 Vue 3 + Vite。
2. 复杂项目推荐 TypeScript。
3. 基本类型优先用 ref。
4. reactive 解构时使用 toRefs。
5. 派生数据用 computed。
6. 副作用用 watch。
7. 不要滥用 deep watch。
8. props 只读，子组件通过 emit 通知父组件。
9. 组件内容扩展优先用 slot。
10. 多页面共享状态用 Pinia。
11. store 解构使用 storeToRefs。
12. 请求逻辑放 services，不要散落在组件中。
13. 路由页面使用懒加载。
14. 大列表使用虚拟滚动。
15. v-if 和 v-for 不放同一元素。
16. v-html 必须注意 XSS。
17. 前端环境变量不能保存密钥。
18. 样式 scoped 不能替代良好命名。
19. 组件逻辑复杂时抽 composable。
20. 关键业务流程写测试。

---

## 35. 总结

Vue 的核心是响应式和组件化。开发者通过模板声明 UI，通过响应式状态驱动视图变化，通过组件和组合式函数组织复杂应用。

学习 Vue 要抓住几条主线：

- 模板语法让 UI 描述更直观。
- ref、reactive、computed、watch 构成响应式基础。
- props、emit、slot、provide/inject 解决组件通信。
- Composition API 让逻辑复用和组织更清晰。
- Vue Router 和 Pinia 支撑完整单页应用。
- 工程化、性能优化、测试和部署决定项目能否长期维护。

建议最终完成一个包含登录、权限路由、用户管理、分页筛选、表单编辑、Pinia 全局状态、axios 请求封装、组件复用、构建部署和测试的 Vue 后台管理系统。这样的项目能覆盖 Vue 在真实业务中的大多数核心能力。

