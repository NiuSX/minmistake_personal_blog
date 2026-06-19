# React 学习笔记：从入门到项目实战

> 这份笔记面向已经具备 HTML、CSS、JavaScript 基础，并希望系统掌握 React 的学习者。目标不是只会写几个组件，而是理解 React 的组件模型、JSX、状态、事件、Hooks、路由、状态管理、表单、性能优化、工程化、测试、项目分层和常见问题排查。

---

## 1. React 是什么

React 是一个用于构建用户界面的 JavaScript 库。它由 Meta 维护，核心思想是使用组件来描述界面，并通过状态驱动视图更新。

React 不是完整框架，它主要负责 UI 层。路由、数据请求、全局状态、构建工具、测试等通常需要配合其他库完成。

### 1.1 React 的核心特点

- 组件化：把界面拆成可复用组件。
- 声明式 UI：描述“界面应该是什么样”，而不是手动操作 DOM。
- 状态驱动：数据变化后自动重新渲染相关 UI。
- 单向数据流：父组件通过 props 向子组件传递数据。
- JSX：在 JavaScript 中编写类似 HTML 的结构。
- Hooks：在函数组件中使用状态、副作用、引用、上下文等能力。
- 生态丰富：路由、状态管理、UI 组件库、测试工具、构建工具都很成熟。

### 1.2 声明式与命令式

命令式 DOM 操作：

```js
const button = document.querySelector('#btn');
const count = document.querySelector('#count');
let value = 0;

button.addEventListener('click', () => {
  value += 1;
  count.textContent = value;
});
```

React 声明式写法：

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      {count}
    </button>
  );
}
```

React 关注的是“状态为 count 时，UI 应该如何显示”。DOM 更新细节由 React 处理。

---

## 2. 创建 React 项目

现代 React 项目常用 Vite、Next.js、Remix、Create React App 等方式。对于普通单页应用，推荐 Vite。

### 2.1 使用 Vite 创建项目

```bash
npm create vite@latest react-demo -- --template react
cd react-demo
npm install
npm run dev
```

TypeScript 模板：

```bash
npm create vite@latest react-demo -- --template react-ts
```

### 2.2 项目结构

常见结构：

```text
react-demo
├── index.html
├── package.json
├── vite.config.js
├── src
│   ├── main.jsx
│   ├── App.jsx
│   ├── assets
│   ├── components
│   ├── pages
│   ├── hooks
│   ├── services
│   ├── stores
│   └── styles
└── public
```

### 2.3 入口文件

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

`ReactDOM.createRoot` 创建 React 根节点，把 `App` 渲染到页面中。

---

## 3. JSX 基础

JSX 是 JavaScript 的语法扩展，可以在 JS 中写类似 HTML 的结构。

```jsx
const element = <h1>Hello React</h1>;
```

JSX 最终会被编译为 JavaScript 函数调用。

### 3.1 JSX 中使用表达式

```jsx
function UserCard() {
  const username = 'Alice';

  return <div>Hello, {username}</div>;
}
```

花括号中可以写 JavaScript 表达式：

```jsx
{name}
{age + 1}
{isVip ? 'VIP' : 'Normal'}
{items.length}
```

不能直接写语句：

```jsx
// 错误
{if (ok) { return 'yes'; }}
```

### 3.2 className 与 htmlFor

JSX 更接近 JavaScript，因此：

```jsx
<div className="card">Card</div>
<label htmlFor="username">Username</label>
```

而不是：

```html
<div class="card"></div>
<label for="username"></label>
```

### 3.3 style 写法

```jsx
const style = {
  color: 'red',
  fontSize: '16px',
};

return <div style={style}>Text</div>;
```

直接写：

```jsx
<div style={{ color: 'red', fontSize: 16 }}>Text</div>
```

数值型样式很多会自动加 `px`，但不是全部。更推荐 CSS 类管理样式。

### 3.4 JSX 必须有单一根节点

错误：

```jsx
return (
  <h1>Title</h1>
  <p>Content</p>
);
```

正确：

```jsx
return (
  <>
    <h1>Title</h1>
    <p>Content</p>
  </>
);
```

`<>...</>` 是 Fragment，不会产生额外 DOM。

### 3.5 条件渲染

三元表达式：

```jsx
{isLogin ? <UserMenu /> : <LoginButton />}
```

短路渲染：

```jsx
{error && <div className="error">{error}</div>}
```

注意：如果 `count` 是 0，写成：

```jsx
{count && <Badge />}
```

可能渲染出 `0`。更安全：

```jsx
{count > 0 && <Badge />}
```

### 3.6 列表渲染

```jsx
const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
];

return (
  <ul>
    {users.map(user => (
      <li key={user.id}>{user.name}</li>
    ))}
  </ul>
);
```

`key` 用于帮助 React 识别列表项变化。推荐使用稳定唯一 ID，不推荐用数组索引作为 key。

---

## 4. 组件基础

React 应用由组件组成。组件本质上是返回 UI 的函数。

### 4.1 函数组件

```jsx
function Welcome() {
  return <h1>Hello React</h1>;
}
```

使用：

```jsx
<Welcome />
```

组件名必须首字母大写。小写会被 React 当作原生 HTML 标签。

### 4.2 组件拆分

```jsx
function UserAvatar({ avatarUrl }) {
  return <img className="avatar" src={avatarUrl} alt="" />;
}

function UserInfo({ user }) {
  return (
    <div>
      <UserAvatar avatarUrl={user.avatarUrl} />
      <div>{user.name}</div>
    </div>
  );
}
```

拆分原则：

- 一个组件只负责一个明确职责。
- 可复用部分独立成组件。
- 不要过早拆得太碎。
- 组件名表达业务含义。

### 4.3 props

props 是父组件传给子组件的数据。

```jsx
function UserCard({ name, age }) {
  return (
    <div>
      <div>{name}</div>
      <div>{age}</div>
    </div>
  );
}

function App() {
  return <UserCard name="Alice" age={18} />;
}
```

props 是只读的，子组件不应该直接修改 props。

### 4.4 children

`children` 表示组件标签中间的内容。

```jsx
function Card({ title, children }) {
  return (
    <section className="card">
      <h2>{title}</h2>
      <div>{children}</div>
    </section>
  );
}
```

使用：

```jsx
<Card title="Profile">
  <p>User information</p>
</Card>
```

### 4.5 组件通信

常见通信方式：

- 父传子：props。
- 子传父：父组件传回调函数给子组件。
- 兄弟通信：状态提升到共同父组件。
- 跨层通信：Context 或状态管理库。

子传父示例：

```jsx
function SearchBox({ onSearch }) {
  const [keyword, setKeyword] = useState('');

  return (
    <div>
      <input value={keyword} onChange={e => setKeyword(e.target.value)} />
      <button onClick={() => onSearch(keyword)}>Search</button>
    </div>
  );
}
```

父组件：

```jsx
function UserPage() {
  function handleSearch(keyword) {
    console.log(keyword);
  }

  return <SearchBox onSearch={handleSearch} />;
}
```

---

## 5. 状态 useState

状态是组件内部会变化的数据。状态变化会触发组件重新渲染。

### 5.1 基本用法

```jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      {count}
    </button>
  );
}
```

`useState(0)` 返回：

- 当前状态 `count`
- 修改状态的函数 `setCount`

### 5.2 状态更新是异步批处理

不要认为 `setCount` 后下一行马上拿到新值：

```jsx
setCount(count + 1);
console.log(count); // 仍然是旧值
```

### 5.3 基于旧状态更新

如果新状态依赖旧状态，使用函数式更新：

```jsx
setCount(prev => prev + 1);
```

连续更新：

```jsx
setCount(prev => prev + 1);
setCount(prev => prev + 1);
setCount(prev => prev + 1);
```

结果会加 3。

### 5.4 对象状态更新

状态不要直接修改：

```jsx
// 错误
user.name = 'Bob';
setUser(user);
```

正确：

```jsx
setUser(prev => ({
  ...prev,
  name: 'Bob',
}));
```

### 5.5 数组状态更新

添加：

```jsx
setItems(prev => [...prev, newItem]);
```

删除：

```jsx
setItems(prev => prev.filter(item => item.id !== id));
```

修改：

```jsx
setItems(prev =>
  prev.map(item =>
    item.id === id ? { ...item, name: 'New Name' } : item
  )
);
```

React 状态更新要保持不可变，不要原地修改数组或对象。

---

## 6. 事件处理

React 事件使用驼峰命名。

```jsx
<button onClick={handleClick}>Click</button>
```

### 6.1 传递事件处理函数

```jsx
function handleClick() {
  console.log('clicked');
}

return <button onClick={handleClick}>Click</button>;
```

不要写成：

```jsx
<button onClick={handleClick()}>Click</button>
```

这会在渲染时立即执行。

### 6.2 传参

```jsx
<button onClick={() => handleDelete(user.id)}>Delete</button>
```

### 6.3 事件对象

```jsx
function handleChange(event) {
  console.log(event.target.value);
}

return <input onChange={handleChange} />;
```

### 6.4 阻止默认行为

```jsx
function handleSubmit(event) {
  event.preventDefault();
}
```

---

## 7. 表单

### 7.1 受控组件

表单值由 React 状态控制。

```jsx
function LoginForm() {
  const [username, setUsername] = useState('');

  return (
    <input
      value={username}
      onChange={e => setUsername(e.target.value)}
    />
  );
}
```

优点：

- 数据始终在 React 状态中。
- 容易校验。
- 容易联动。

缺点：

- 表单字段很多时样板代码多。

### 7.2 多字段表单

```jsx
function UserForm() {
  const [form, setForm] = useState({
    username: '',
    email: '',
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
    }));
  }

  return (
    <>
      <input name="username" value={form.username} onChange={handleChange} />
      <input name="email" value={form.email} onChange={handleChange} />
    </>
  );
}
```

### 7.3 非受控组件

通过 ref 获取 DOM 值。

```jsx
function UploadForm() {
  const fileRef = useRef(null);

  function handleSubmit() {
    const file = fileRef.current.files[0];
    console.log(file);
  }

  return <input ref={fileRef} type="file" />;
}
```

文件上传通常使用非受控方式，因为文件 input 的 value 不能由 React 完全控制。

### 7.4 表单库

常见表单库：

- React Hook Form
- Formik
- Final Form

React Hook Form 常用，性能好，样板代码少。

---

## 8. useEffect 副作用

副作用是渲染之外的操作，例如：

- 请求数据
- 订阅事件
- 手动操作 DOM
- 设置定时器
- 写 localStorage

### 8.1 基本用法

```jsx
useEffect(() => {
  document.title = `Count: ${count}`;
}, [count]);
```

依赖数组 `[count]` 表示 count 变化时执行。

### 8.2 只在挂载后执行

```jsx
useEffect(() => {
  console.log('mounted');
}, []);
```

### 8.3 每次渲染后执行

```jsx
useEffect(() => {
  console.log('rendered');
});
```

通常不推荐无依赖数组，容易造成频繁执行。

### 8.4 清理副作用

```jsx
useEffect(() => {
  const timer = setInterval(() => {
    console.log('tick');
  }, 1000);

  return () => {
    clearInterval(timer);
  };
}, []);
```

清理函数会在组件卸载或 effect 重新执行前执行。

### 8.5 请求数据

```jsx
function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function loadUsers() {
      setLoading(true);
      try {
        const res = await fetch('/api/users');
        const data = await res.json();
        if (!ignore) {
          setUsers(data);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadUsers();

    return () => {
      ignore = true;
    };
  }, []);

  if (loading) return <div>Loading...</div>;
  return users.map(user => <div key={user.id}>{user.name}</div>);
}
```

清理标记用于避免组件卸载后继续设置状态。

### 8.6 useEffect 常见错误

错误一：依赖缺失。

```jsx
useEffect(() => {
  fetchUser(userId);
}, []); // userId 缺失
```

正确：

```jsx
useEffect(() => {
  fetchUser(userId);
}, [userId]);
```

错误二：在 effect 中无条件更新依赖状态导致死循环。

```jsx
useEffect(() => {
  setCount(count + 1);
}, [count]);
```

错误三：把可以在渲染中计算的数据放进 effect。

```jsx
// 不推荐
useEffect(() => {
  setFullName(firstName + lastName);
}, [firstName, lastName]);
```

推荐：

```jsx
const fullName = firstName + lastName;
```

---

## 9. useRef

`useRef` 用于保存可变值，变化时不会触发重新渲染。

### 9.1 获取 DOM

```jsx
function SearchInput() {
  const inputRef = useRef(null);

  function focusInput() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={focusInput}>Focus</button>
    </>
  );
}
```

### 9.2 保存定时器 ID

```jsx
const timerRef = useRef(null);

function start() {
  timerRef.current = setInterval(() => {
    console.log('tick');
  }, 1000);
}

function stop() {
  clearInterval(timerRef.current);
}
```

### 9.3 保存上一次值

```jsx
function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}
```

---

## 10. useMemo 与 useCallback

这两个 Hook 用于性能优化，不应滥用。

### 10.1 useMemo

缓存计算结果。

```jsx
const filteredUsers = useMemo(() => {
  return users.filter(user => user.name.includes(keyword));
}, [users, keyword]);
```

适合：

- 计算成本较高。
- 结果需要传给 memo 子组件。
- 依赖变化不频繁。

不适合：

- 简单计算。
- 为了“看起来优化”到处加。

### 10.2 useCallback

缓存函数引用。

```jsx
const handleDelete = useCallback((id) => {
  setUsers(prev => prev.filter(user => user.id !== id));
}, []);
```

常见场景：

- 函数传给 `React.memo` 包裹的子组件。
- 函数作为 effect 依赖。

### 10.3 React.memo

```jsx
const UserItem = React.memo(function UserItem({ user, onDelete }) {
  return (
    <div>
      {user.name}
      <button onClick={() => onDelete(user.id)}>Delete</button>
    </div>
  );
});
```

`React.memo` 会在 props 没变化时跳过子组件渲染。

注意：如果传入对象或函数每次渲染都新建，memo 可能失效。

---

## 11. useReducer

当状态逻辑复杂时，可以用 `useReducer`。

### 11.1 基本用法

```jsx
function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    default:
      return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });

  return (
    <>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <span>{state.count}</span>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
    </>
  );
}
```

### 11.2 适合场景

- 状态字段较多。
- 状态变化规则复杂。
- 多个操作会影响同一组状态。
- 希望把状态更新逻辑集中管理。

简单状态不要过度使用 `useReducer`。

---

## 12. Context

Context 用于跨层传递数据，避免 props 层层传递。

### 12.1 创建 Context

```jsx
const ThemeContext = createContext('light');
```

### 12.2 Provider

```jsx
function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Layout />
    </ThemeContext.Provider>
  );
}
```

### 12.3 使用 Context

```jsx
function Toolbar() {
  const theme = useContext(ThemeContext);
  return <div className={theme}>Toolbar</div>;
}
```

### 12.4 Context 使用建议

适合：

- 主题
- 当前用户
- 国际化
- 权限信息
- 全局配置

不适合：

- 高频变化的大型状态。
- 所有业务状态都塞进一个 Context。

Context value 改变会让消费它的组件重新渲染。复杂状态管理更适合 Zustand、Redux Toolkit、Jotai 等库。

---

## 13. 自定义 Hook

自定义 Hook 用于复用状态逻辑。

### 13.1 基本规则

- 名字必须以 `use` 开头。
- 可以调用其他 Hook。
- 本质是函数，不共享状态本身。

### 13.2 useLocalStorage 示例

```jsx
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
```

使用：

```jsx
const [theme, setTheme] = useLocalStorage('theme', 'light');
```

### 13.3 useFetch 示例

```jsx
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function request() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Request failed');
        }
        const json = await response.json();
        if (!ignore) {
          setData(json);
        }
      } catch (err) {
        if (!ignore) {
          setError(err);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    request();

    return () => {
      ignore = true;
    };
  }, [url]);

  return { data, loading, error };
}
```

实际项目中，服务端状态更推荐使用 TanStack Query、SWR 等库。

---

## 14. Hooks 使用规则

React Hooks 有两条核心规则：

1. 只在 React 函数组件或自定义 Hook 顶层调用 Hook。
2. 不要在条件、循环、嵌套函数中调用 Hook。

错误：

```jsx
if (visible) {
  const [count, setCount] = useState(0);
}
```

正确：

```jsx
const [count, setCount] = useState(0);

if (!visible) {
  return null;
}
```

原因：React 依赖 Hook 调用顺序来关联状态。如果条件调用导致顺序变化，状态就会错乱。

---

## 15. React Router

React Router 是常用路由库。

### 15.1 安装

```bash
npm install react-router-dom
```

### 15.2 基本配置

```jsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/users',
    element: <UserListPage />,
  },
  {
    path: '/users/:id',
    element: <UserDetailPage />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}
```

### 15.3 Link 跳转

```jsx
import { Link } from 'react-router-dom';

<Link to="/users">Users</Link>
```

### 15.4 编程式导航

```jsx
const navigate = useNavigate();

function handleSuccess() {
  navigate('/users');
}
```

### 15.5 获取路由参数

```jsx
const { id } = useParams();
```

### 15.6 查询参数

```jsx
const [searchParams, setSearchParams] = useSearchParams();
const keyword = searchParams.get('keyword');

setSearchParams({ keyword: 'alice' });
```

### 15.7 嵌套路由

```jsx
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'users', element: <UserListPage /> },
    ],
  },
]);
```

Layout：

```jsx
import { Outlet } from 'react-router-dom';

function Layout() {
  return (
    <>
      <Nav />
      <main>
        <Outlet />
      </main>
    </>
  );
}
```

---

## 16. 数据请求

### 16.1 fetch

```jsx
async function getUsers() {
  const response = await fetch('/api/users');
  if (!response.ok) {
    throw new Error('Request failed');
  }
  return response.json();
}
```

### 16.2 axios

```bash
npm install axios
```

```js
import axios from 'axios';

const http = axios.create({
  baseURL: '/api',
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
  error => {
    return Promise.reject(error);
  }
);
```

### 16.3 服务端状态

服务端状态与客户端状态不同：

- 来自后端。
- 可能过期。
- 需要缓存。
- 需要重新请求。
- 可能多个组件共享。
- 有 loading、error、success 状态。

推荐使用 TanStack Query：

```bash
npm install @tanstack/react-query
```

```jsx
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
```

使用：

```jsx
function UserList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Failed</div>;

  return data.map(user => <div key={user.id}>{user.name}</div>);
}
```

---

## 17. 全局状态管理

### 17.1 什么时候需要全局状态

不需要一开始就引入状态管理库。只有当多个远距离组件共享和修改同一状态时，才考虑全局状态。

常见全局状态：

- 当前用户
- 权限
- 主题
- 购物车
- 多页面共享筛选条件
- 编辑器复杂状态

### 17.2 Redux Toolkit

Redux Toolkit 是官方推荐写法。

安装：

```bash
npm install @reduxjs/toolkit react-redux
```

slice：

```js
import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    currentUser: null,
  },
  reducers: {
    setCurrentUser(state, action) {
      state.currentUser = action.payload;
    },
    logout(state) {
      state.currentUser = null;
    },
  },
});

export const { setCurrentUser, logout } = userSlice.actions;
export default userSlice.reducer;
```

store：

```js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});
```

Provider：

```jsx
<Provider store={store}>
  <App />
</Provider>
```

使用：

```jsx
const user = useSelector(state => state.user.currentUser);
const dispatch = useDispatch();

dispatch(setCurrentUser(userInfo));
```

### 17.3 Zustand

Zustand 更轻量。

```bash
npm install zustand
```

```js
import { create } from 'zustand';

export const useUserStore = create(set => ({
  currentUser: null,
  setCurrentUser: user => set({ currentUser: user }),
  logout: () => set({ currentUser: null }),
}));
```

使用：

```jsx
const currentUser = useUserStore(state => state.currentUser);
const logout = useUserStore(state => state.logout);
```

选择建议：

- 大型团队、复杂状态、强规范：Redux Toolkit。
- 中小项目、轻量全局状态：Zustand。
- 服务端状态：TanStack Query，不要塞进 Redux。

---

## 18. 样式方案

### 18.1 普通 CSS

```jsx
import './Button.css';
```

```css
.button {
  height: 36px;
  padding: 0 12px;
}
```

简单直接，但类名可能冲突。

### 18.2 CSS Modules

```css
/* Button.module.css */
.button {
  height: 36px;
}
```

```jsx
import styles from './Button.module.css';

function Button() {
  return <button className={styles.button}>Save</button>;
}
```

CSS Modules 会生成局部类名，避免冲突。

### 18.3 CSS-in-JS

例如 styled-components、emotion。

```jsx
const Button = styled.button`
  height: 36px;
  padding: 0 12px;
`;
```

适合组件库、主题动态变化等场景，但会增加运行时或构建复杂度。

### 18.4 Tailwind CSS

```jsx
<button className="h-9 px-3 rounded bg-blue-600 text-white">
  Save
</button>
```

适合快速构建 UI，但需要团队约定，避免 class 过长影响可读性。

---

## 19. 组件设计

### 19.1 受控与非受控组件

受控组件由外部传入状态：

```jsx
function Modal({ open, onOpenChange }) {
  if (!open) return null;
  return <button onClick={() => onOpenChange(false)}>Close</button>;
}
```

非受控组件内部维护状态：

```jsx
function Modal() {
  const [open, setOpen] = useState(false);
}
```

通用组件通常应支持受控模式，业务组件可以内部管理状态。

### 19.2 组合优于配置

不推荐把组件设计成大量配置项控制所有细节。

推荐通过 children 组合：

```jsx
<Dialog open={open} onOpenChange={setOpen}>
  <DialogHeader>Delete user</DialogHeader>
  <DialogBody>Are you sure?</DialogBody>
  <DialogFooter>
    <Button>Cancel</Button>
    <Button variant="danger">Delete</Button>
  </DialogFooter>
</Dialog>
```

### 19.3 容器组件与展示组件

容器组件：

- 获取数据。
- 处理业务逻辑。
- 管理状态。

展示组件：

- 接收 props。
- 渲染 UI。
- 尽量无业务副作用。

这种分离有助于复用和测试。

---

## 20. 性能优化

### 20.1 不要过早优化

先确认问题：

- React DevTools Profiler。
- 浏览器 Performance。
- 接口耗时。
- bundle 大小分析。

### 20.2 常见优化手段

- 列表项使用稳定 key。
- 避免不必要的全局状态更新。
- 使用 `React.memo` 减少子组件重渲染。
- 使用 `useMemo` 缓存昂贵计算。
- 使用 `useCallback` 稳定函数引用。
- 大列表使用虚拟滚动。
- 路由级代码分割。
- 图片懒加载。
- 减少不必要的依赖包。

### 20.3 代码分割

```jsx
const UserPage = lazy(() => import('./pages/UserPage'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserPage />
    </Suspense>
  );
}
```

适合路由页面懒加载。

### 20.4 虚拟列表

当列表上千上万条时，不要全部渲染。使用：

- react-window
- react-virtual
- react-virtualized

---

## 21. 错误边界

错误边界用于捕获子组件渲染阶段错误，显示降级 UI。

目前错误边界通常需要类组件：

```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error(error, info);
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong.</div>;
    }
    return this.props.children;
  }
}
```

使用：

```jsx
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

错误边界不能捕获：

- 事件处理器中的错误。
- 异步代码错误。
- 服务端渲染错误。
- 错误边界自身错误。

---

## 22. 测试

### 22.1 常用工具

- Vitest/Jest：测试运行器。
- React Testing Library：组件测试。
- MSW：Mock API。
- Playwright/Cypress：端到端测试。

### 22.2 组件测试

```jsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Counter from './Counter';

test('increments count', async () => {
  render(<Counter />);

  await userEvent.click(screen.getByRole('button', { name: /count/i }));

  expect(screen.getByText('1')).toBeInTheDocument();
});
```

测试原则：

- 按用户行为测试，而不是组件内部实现。
- 优先使用 role、label、text 查询元素。
- 不测试 React 本身。
- 关注关键业务流程和边界状态。

---

## 23. TypeScript 与 React

### 23.1 props 类型

```tsx
type UserCardProps = {
  name: string;
  age?: number;
  onSelect: (id: number) => void;
};

function UserCard({ name, age, onSelect }: UserCardProps) {
  return <div>{name}</div>;
}
```

### 23.2 useState 类型

```tsx
const [user, setUser] = useState<User | null>(null);
```

### 23.3 事件类型

```tsx
function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
  setValue(event.target.value);
}
```

### 23.4 children 类型

```tsx
type CardProps = {
  children: React.ReactNode;
};
```

TypeScript 能显著提升 React 项目的可维护性，尤其是中大型项目。

---

## 24. 工程化

### 24.1 ESLint

用于检查代码质量和潜在错误。

常见规则：

- hooks 规则检查。
- 未使用变量。
- 不合理依赖。
- 代码风格约束。

### 24.2 Prettier

用于统一格式化。

### 24.3 目录组织

按类型：

```text
src
├── components
├── pages
├── hooks
├── services
├── stores
├── utils
└── styles
```

按业务模块：

```text
src
├── features
│   ├── user
│   │   ├── components
│   │   ├── hooks
│   │   ├── services
│   │   └── pages
│   └── order
└── shared
```

大型项目推荐按业务模块组织。

### 24.4 环境变量

Vite 中环境变量必须以 `VITE_` 开头：

```env
VITE_API_BASE_URL=https://api.example.com
```

使用：

```js
const baseUrl = import.meta.env.VITE_API_BASE_URL;
```

不要把密钥放在前端环境变量中。前端变量会被打包进浏览器代码。

---

## 25. 构建与部署

### 25.1 构建

```bash
npm run build
```

产物通常在 `dist` 目录。

### 25.2 预览

```bash
npm run preview
```

### 25.3 部署方式

常见部署：

- Nginx 静态资源。
- Vercel。
- Netlify。
- GitHub Pages。
- 对象存储 + CDN。

### 25.4 SPA 路由刷新 404

React Router 使用 history 模式时，刷新 `/users/1` 可能 404，因为服务器找不到对应文件。

Nginx 配置：

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

---

## 26. 常见问题

### 26.1 为什么 setState 后拿不到新值

React 会批量处理状态更新，当前闭包中的状态值不会立即变化。依赖旧值更新时使用函数式写法。

### 26.2 为什么组件重复渲染

可能原因：

- 父组件状态变化。
- props 引用变化。
- Context value 变化。
- StrictMode 开发环境额外检查。

### 26.3 key 为什么不能随便写

key 用于标识列表项。如果使用随机数，每次渲染 key 都变，React 会认为所有元素都是新的，导致重建 DOM 和状态丢失。

### 26.4 useEffect 为什么执行两次

React StrictMode 在开发环境中可能会额外执行 effect，用于帮助发现副作用问题。生产环境不会以同样方式重复。

### 26.5 状态应该放在哪里

原则：放在需要它的最近共同父组件。如果很多远距离组件都需要，再考虑 Context 或全局状态管理。

---

## 27. 面试常见问题

### 27.1 React 的核心思想是什么

React 使用组件化和声明式 UI 构建界面。开发者根据状态描述 UI，状态变化后 React 负责重新渲染相关组件并更新 DOM。

### 27.2 props 和 state 的区别

props 是父组件传入的数据，子组件只读。state 是组件内部维护的可变数据，变化后会触发重新渲染。

### 27.3 为什么列表需要 key

key 帮助 React 在列表更新时识别元素身份，从而高效复用 DOM 和组件状态。key 应稳定且唯一。

### 27.4 useEffect 的作用是什么

useEffect 用于处理渲染之外的副作用，例如请求数据、订阅事件、设置定时器和操作浏览器 API。

### 27.5 useMemo 和 useCallback 的区别

useMemo 缓存计算结果，useCallback 缓存函数引用。它们主要用于性能优化和稳定依赖引用。

### 27.6 React.memo 有什么用

React.memo 用于在 props 未变化时跳过函数组件重新渲染。它适合渲染成本较高且 props 稳定的组件。

### 27.7 Context 适合什么场景

Context 适合跨层传递低频变化的全局数据，例如主题、当前用户、语言、权限等。不适合承载所有高频业务状态。

### 27.8 受控组件和非受控组件区别

受控组件的值由 React state 控制，非受控组件的值由 DOM 自己管理，通常通过 ref 获取。表单输入常用受控组件，文件上传常用非受控组件。

---

## 28. 学习路线

### 28.1 第一阶段：基础

掌握：

- JSX
- 组件
- props
- state
- 事件
- 条件渲染
- 列表渲染

练习：

- Todo List。
- 计数器。
- 用户卡片列表。

### 28.2 第二阶段：Hooks

掌握：

- useState
- useEffect
- useRef
- useMemo
- useCallback
- useReducer
- useContext
- 自定义 Hook

练习：

- 搜索列表。
- 倒计时。
- localStorage 主题切换。

### 28.3 第三阶段：工程化

掌握：

- React Router
- axios/fetch
- TanStack Query
- Zustand/Redux Toolkit
- CSS Modules/Tailwind
- TypeScript

练习：

- 后台管理系统。
- 登录鉴权。
- 用户列表分页。
- 表单新增编辑。

### 28.4 第四阶段：进阶

掌握：

- 性能分析。
- 代码分割。
- 虚拟列表。
- 错误边界。
- 组件设计。
- 测试。
- 部署。

练习：

- 大数据表格。
- 复杂表单。
- 权限路由。
- 单元测试和 E2E 测试。

---

## 29. 最佳实践总结

1. 组件名首字母大写。
2. props 只读，不在子组件中修改。
3. 状态更新保持不可变。
4. 新状态依赖旧状态时使用函数式更新。
5. 列表 key 使用稳定唯一 ID。
6. 不要在条件和循环中调用 Hook。
7. useEffect 依赖要完整。
8. 不要把可计算值放入 state。
9. 表单复杂时使用表单库。
10. 服务端状态使用 TanStack Query 等工具。
11. 全局状态不要滥用。
12. Context 适合低频全局数据。
13. 性能优化先测量再处理。
14. 不要到处使用 useMemo/useCallback。
15. 路由页面适合懒加载。
16. 大列表使用虚拟滚动。
17. 前端环境变量不是密钥。
18. 组件设计优先组合。
19. 业务逻辑尽量从 UI 中拆出来。
20. 关键流程写测试。

---

## 30. 总结

React 的核心不是 API 数量，而是思维方式：

- 用组件拆分界面。
- 用状态描述变化。
- 用 props 形成单向数据流。
- 用 Hooks 复用状态逻辑和副作用。
- 用组合构建灵活组件。
- 用工程化工具支撑大型项目。

真正掌握 React，需要在项目中反复处理列表、表单、请求、路由、状态共享、权限、性能和测试。建议完成一个包含登录、用户管理、分页查询、详情页、表单编辑、权限路由、全局状态、接口缓存和部署的后台管理系统，这会覆盖大多数真实 React 项目的核心能力。

