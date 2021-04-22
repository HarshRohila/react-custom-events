# react-custom-events

### Why

React way of handling events is to pass callbacks to child components. This becomes cumbersome when child is several levels deep.

One way to avoid passing callbacks deep is using [Context](https://reactjs.org/docs/context.html)

But context is not meant for all use cases and not so intuitive.

I prefer the [web components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) way, as they are close to native html tags and
most common way of handling events in them is [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent).

This package is a react layer above CustomEvent

### How to use

##### Installation

```sh
npm i react-custom-events
```

##### Emit Event

The emitting element could be a `RefObject<HTMLElement>`, `MutableRefObject<HTMLElement>` or a `HTMLElement`.

```typescript
import { useRef } from 'react';
import { emitCustomEvent } from 'react-custom-events';

const emittingElement = useRef(null);

const handleClick = (): void => {
	emitCustomEvent(emittingElement, 'my-event');
};

return (
	<button ref={emittingElement} onClick={handleClick}>Label</button>
);
```

Attach data to event

```typescript
emitCustomEvent<boolean>(emittingElement, 'my-event', false);
```

Custom event options

```typescript
emitCustomEvent<boolean>(emittingElement, 'my-event', false, {
	bubbles: true,
	cancelable: true,
	composed: true
});
```

##### Listen Event

The listener element could be a `RefObject<HTMLElement>`, `MutableRefObject<HTMLElement>` or a `HTMLElement`.

The provided callback is called with a type native CustomEvent of which you can use the common features like preventing the default behavior
and so on. The payload is part of the event as the member `detail`.

```typescript
import { useRef } from 'react';
import { useCustomEventListener } from 'react-custom-events';

const listenerElement = useRef(null);

useCustomEventListener<boolean>(listenerElement, 'my-event', (event): void => {
	event.stopPropagation();
	console.debug(event.detail);
});

return (
	<div ref ={listenerElement} />
);
```

`useCustomEventListener` is a custom hook, so can be used in function component only (see notes below)

No need to remove event listener, it uses react's useEffect hook to remove listener on component unmount

##### Notes

* Will support class components in future, for now addEventListener can be used
