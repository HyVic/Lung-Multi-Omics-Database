// hooks/useEventBus.js
import { useEffect, useCallback } from 'react';
import mitt from 'mitt';

const emitter = mitt();

export function useEventBus() {
  // 订阅事件
  const subscribe = useCallback((event: any, handler: any)) => {
    emitter.on(event, handler);
    return () => emitter.off(event, handler); // 返回取消订阅函数
  }, []);

  // 发布事件
  const publish = useCallback((event, data) => {
    emitter.emit(event, data);
  }, []);

  return { subscribe, publish };
}

// 使用示例
function MyComponent() {
  const { subscribe, publish } = useEventBus();

  useEffect(() => {
    const unsubscribe = subscribe('user-login', (user) => {
      console.log('用户登录:', user);
    });
    return unsubscribe;
  }, [subscribe]);

  const handleClick = () => {
    publish('user-login', { id: 1, name: '张三' });
  };

  return <button onClick={handleClick}>登录</button>;
}