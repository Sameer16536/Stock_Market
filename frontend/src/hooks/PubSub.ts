import { EventEmitter } from 'eventemitter3'
import { useEffect } from 'react'



const emitter = new EventEmitter()

const useSub = (event: string, callback: (data: any) => void) => {
    useEffect(() => {
        emitter.on(event, callback)
        return () => {
            emitter.off(event, callback)
        }
    }, [event, callback])
}


const usePub = () => {
    return (event: string, data: any) => {
        emitter.emit(event, data);
    };
};

export { usePub, useSub, emitter };