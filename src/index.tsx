import { useEffect } from "react";

declare global {
    interface Window { _customEventTargetElement: undefined | HTMLDivElement; }
}

const getElement = (function () {
    const targetElement = document.createElement('div')

    return function () {
        return targetElement;
    }
}());

export function useCustomEventListener<T>(eventName: string, eventHandler: (data: T) => void): void {
    useEffect(() => {
        const element = getElement();
        const handleEvent = (event: CustomEvent | Event) => {
            const data = (event as CustomEvent).detail;
            eventHandler(data);
        };

        element.addEventListener(eventName, handleEvent, false);

        return () => {
            element.removeEventListener(eventName, handleEvent, false);
        };
    });
}

export function emitCustomEvent<T>(eventName: string, data?: T): void {
    const element = getElement();
    const event = new CustomEvent(eventName, { detail: data });
    element.dispatchEvent(event);
}
