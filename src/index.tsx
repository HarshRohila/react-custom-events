import { useEffect } from 'react'

let targetElement: undefined | HTMLDivElement

function getElement() {
	if (!targetElement) {
		targetElement = document.createElement('div')
	}

	return targetElement
}

export function useCustomEventListener<T>(
	eventName: string,
	eventHandler: (data: T) => void
): (el: HTMLElement | null) => void {
	let element: HTMLElement | null
	useEffect(() => {
		element = element || getElement()
		const handleEvent = (event: CustomEvent | Event) => {
			const data = (event as CustomEvent).detail
			eventHandler(data)
		}

		element.addEventListener(eventName, handleEvent, false)

		return () => {
			element?.removeEventListener(eventName, handleEvent, false)
		}
	}, [])

	return (el: HTMLElement | null) => {
		element = el
	}
}

export function emitCustomEvent<T>(eventName: string, data?: T): void {
	const element = getElement()
	const event = new CustomEvent(eventName, { detail: data })
	element.dispatchEvent(event)
}

export function newCustomEventEmitter() {
	let element: HTMLElement | null
	function setElement(el: HTMLElement | null) {
		element = el
	}

	setElement.emit = function <T>(eventName: string, data?: T) {
		const event = new CustomEvent(eventName, { bubbles: true, detail: data })
		element?.dispatchEvent(event)
	}

	return setElement
}
