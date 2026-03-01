import { useEffect, useRef } from "react";

export function useSSE(
  url: string,
  onMessage: (type: string, data: any) => void
) {
  const sourceRef = useRef<EventSource | null>(null);
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;

  useEffect(() => {
    const source = new EventSource(url);
    sourceRef.current = source;

    source.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        onMessageRef.current(parsed.type, parsed.data);
      } catch (e) {
        console.error("SSE parse error:", e);
      }
    };

    source.onerror = () => {
      console.warn("SSE connection error, will retry...");
    };

    return () => {
      source.close();
    };
  }, [url]);
}
