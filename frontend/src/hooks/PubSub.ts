import { EventEmitter } from "eventemitter3";
import { useEffect } from "react";

const emitter = new EventEmitter();

export const useSub = (event: string, callback: (data: any) => void): void => {
  useEffect(() => {
    emitter.on(event, callback);
    return () => {
      emitter.off(event, callback);
    };
  }, [event, callback]);
};

export const usePub = () => {
  return (event: string, data: any) => {
    emitter.emit(event, data);
  };
};

export { emitter };
