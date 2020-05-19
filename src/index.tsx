import { useEffect } from "react";

declare global {
    interface Window { _customEventTargetElement: undefined | HTMLDivElement; }
}

const getElement = () => {
    if ( !window._customEventTargetElement ) {
        window._customEventTargetElement = document.createElement('div');
    }

    return window._customEventTargetElement;
}

const useCustomEventListener = (eventName: string, eventHandler: (data?: any) => void) => {
    useEffect(() => {
        const element = getElement();
        const handleEvent = (event: CustomEvent | Event) => {
            const data = (event as CustomEvent).detail;
            eventHandler( data );
        } 
    
        element.addEventListener(eventName, handleEvent, false);
    
        return () => {
            element.removeEventListener(eventName, handleEvent, false);
        }
    })
}

const emitCustomEvent = (eventName: string, data?: any) => {
    const element = getElement();
    const event = new CustomEvent(eventName, { detail: data });
    element.dispatchEvent( event );
}

export { useCustomEventListener, emitCustomEvent };