# koa-setincontext
Middleware for Koa 2 that lets you set properties to the `ctx.state` for every request.

This is particulary useful when you have dynamic properties which value may change on every request.

But you can still set the `app.context.state` if you pass your `koa app instance` as the third argument of `setInContext` (see examples for more information).

## Installation

`$ npm install koa-setincontext --save`

## Examples

#### Simple usage:
```javascript
import Koa from 'koa';
import setInContext from 'koa-setincontext';

const app = new Koa();
const events = ['one', 'two', 'three'];

app.use(setInContext('events', events));

app.use(async (ctx, next) => {
    console.log(ctx.state.events) // => ['one', 'two', 'three']
    return await next();
})
```

#### With an object
```javascript
import Koa from 'koa';
import setInContext from 'koa-setincontext';

const app = new Koa();
const events = ['one', 'two', 'three'];

app.use(setInContext({
    name: 'events',
    value: events
}));

app.use(async (ctx, next) => {
    console.log(ctx.state.events) // => ['one', 'two', 'three']
    return await next();
})
```

#### With an array of objects:
```javascript
import Koa from 'koa';
import setInContext from 'koa-setincontext';

const app = new Koa();
const events = ['one', 'two', 'three'];

app.use(setInContext([
    {
        name: 'another',
        value: 'awesome'
    },
    {
        name: 'events',
        value: events
    }
]));

app.use(async (ctx, next) => {
    console.log(ctx.state.another) // => 'awesome'
    console.log(ctx.state.events) // => ['one', 'two', 'three']
    return await next();
})
```

#### Setting properties on the `app.context.state`:
```javascript
import Koa from 'koa';
import setInContext from 'koa-setincontext';

const app = new Koa();
const events = ['one', 'two', 'three'];

/**
  * This will set the `app.context.state`,
  * which the 'ctx' inherits its properties from.
  */
app.use(setInContext('events', events, app));

app.use(async (ctx, next) => {
    console.log(ctx.state.events) // => ['one', 'two', 'three']
    return await next();
})
```
