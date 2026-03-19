import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// ========== 1. 创建 Store ==========
const useStore = create(
  devtools(
    persist(
      (set, get) => ({
        // 状态
        count: 0,
        user: null,
        theme: 'light',
        
        // 修改方法（兄弟组件共享）
        increment: () => set((state) => ({ count: state.count + 1 })),
        decrement: () => set((state) => ({ count: state.count - 1 })),
        setUser: (user) => set({ user }),
        toggleTheme: () => set((state) => ({ 
          theme: state.theme === 'light' ? 'dark' : 'light' 
        })),
        
        // 跨组件调用的方法
        resetAll: () => set({ count: 0, user: null }),
        
        // 计算属性
        doubleCount: () => get().count * 2
      }),
      { name: 'my-app-storage' } // 持久化配置
    ),
    { name: 'MyStore' }
  )
);

// ========== 2. 组件 A：修改状态 ==========
function CounterA() {
  const { count, increment, user, setUser } = useStore();

  return (
    <div style={{ padding: '20px', border: '2px solid #1890ff' }}>
      <h3>计数器 A</h3>
      <p>当前值: {count}</p>
      <button onClick={increment}>+1 (通知 B)</button>
      
      <div style={{ marginTop: '15px' }}>
        <input 
          value={user?.name || ''}
          onChange={(e) => setUser({ name: e.target.value })}
          placeholder="设置用户名"
        />
      </div>
    </div>
  );
}

// ========== 3. 组件 B：读取 + 响应 ==========
function CounterB() {
  const { count, decrement, user, theme, toggleTheme } = useStore();

  // 选择性订阅（性能优化）
  // const count = useStore((state) => state.count); // 只订阅 count

  return (
    <div style={{ 
      padding: '20px', 
      border: '2px solid #52c41a',
      backgroundColor: theme === 'dark' ? '#333' : '#fff',
      color: theme === 'dark' ? '#fff' : '#333'
    }}>
      <h3>计数器 B</h3>
      <p>收到值: {count}</p>
      <p>当前用户: {user?.name || '无'}</p>
      
      <button onClick={decrement}>-1 (通知 A)</button>
      <button onClick={toggleTheme} style={{ marginLeft: '10px' }}>
        切换主题 ({theme})
      </button>
    </div>
  );
}

// ========== 4. 组件 C：只读订阅 ==========
function LoggerC() {
  // 订阅所有状态变化
  const state = useStore();

  return (
    <div style={{ padding: '20px', border: '2px solid #faad14', marginTop: '20px' }}>
      <h3>状态监控 C</h3>
      <pre style={{ fontSize: '12px' }}>
        {JSON.stringify(state, null, 2)}
      </pre>
    </div>
  );
}

// ========== 5. 页面 ==========
function ZustandDemo() {
  return (
    <div style={{ padding: '20px' }}>
      <h2>Zustand 兄弟组件通信</h2>
      <div style={{ display: 'flex', gap: '20px' }}>
        <CounterA />
        <CounterB />
      </div>
      <LoggerC />
    </div>
  );
}

export default ZustandDemo;