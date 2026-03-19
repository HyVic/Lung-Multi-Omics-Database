// hooks/useEventBus.ts
import { useCallback } from 'react';
import mitt, { Emitter } from 'mitt';

type Events = {
  'user-login': { id: number; name: string };
  'dataset-upload': { datasetId: string };
  [key: string]: unknown;
};

const emitter: Emitter<Events> = mitt();

export function useEventBus() {
  // 订阅事件
  const subscribe = useCallback(<K extends keyof Events>(event: K, handler: (data: Events[K]) => void) => {
    emitter.on(event, handler);
    return () => emitter.off(event, handler); // 返回取消订阅函数
  }, []);

  // 发布事件
  const publish = useCallback(<K extends keyof Events>(event: K, data: Events[K]) => {
    emitter.emit(event, data);
  }, []);

  return { subscribe, publish };
}

// 使用示例:
// import { useEventBus } from './hooks/useEventBus';
//
// function MyComponent() {
//   const { subscribe, publish } = useEventBus();
//   useEffect(() => {
//     const unsubscribe = subscribe('user-login', (user) => {
//       console.log('用户登录:', user);
//     });
//     return unsubscribe;
//   }, [subscribe]);
//
//   const handleClick = () => {
//     publish('user-login', { id: 1, name: '张三' });
//   };
// }