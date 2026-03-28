import { useEffect, useRef, useCallback } from 'react';

interface UseWebSocketOptions {
  onMessage: (data: unknown) => void;
  onError?: (event: Event) => void;
  reconnectDelay?: number;
}

/** Persistent WebSocket connection with auto-reconnect. */
export function useWebSocket(url: string, options: UseWebSocketOptions) {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout>>();
  const { onMessage, onError, reconnectDelay = 3000 } = options;

  const connect = useCallback(() => {
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onmessage = (e) => {
      try { onMessage(JSON.parse(e.data)); } catch { onMessage(e.data); }
    };
    ws.onerror = (e) => onError?.(e);
    ws.onclose = () => {
      reconnectTimer.current = setTimeout(connect, reconnectDelay);
    };
  }, [url, onMessage, onError, reconnectDelay]);

  useEffect(() => {
    connect();
    return () => {
      clearTimeout(reconnectTimer.current);
      wsRef.current?.close();
    };
  }, [connect]);

  const send = useCallback((data: unknown) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    }
  }, []);

  return { send };
}
