# react-custom-events

### Why
React way of handling events is to pass callbacks to child components.
This becomes cumbersome when child is several levels deep.

One way to avoid passing callbacks deep is using [Context](https://reactjs.org/docs/context.html)

But context is not meant for all use cases and not so intuitive.

I prefer the [web components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) way, as they are close to native html tags and most common way of handling events in them is [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent).

This package is a react layer above CustomEvent

### How to use

##### Installation
```sh
npm i react-custom-events
```

##### Emit Event
```javascript
import { emitCustomEvent } from 'react-custom-events';

emitCustomEvent('my-event');
```
Attach data to event
```javascript
emitCustomEvent('my-event', data);
```

##### Listen Event
```javascript
import { useCustomEventListener } from 'react-custom-events';
```

its a custom hook, so can be used in function component only(see notes below)
```javascript

useCustomEventListener('my-event', data => {
    doSomethingWithData( data );
});
```

No need to remove event listener, it uses react's useEffect hook to remove listener on component unmount

And no need to worry about where component is present in dom, these events can be sent and listened to anywhere
