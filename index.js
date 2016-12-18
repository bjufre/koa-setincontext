'use strict';

const Koa = require('koa');
const isPlainObject = require('lodash.isplainobject');

function _setPropertiesToContext(ctx, props, value) {
  let _props;

  if (typeof props === 'string') {
    _props = [{
      name: props,
      value: value
    }];
  }

  if (isPlainObject(props)) {
    _props = [props];
  }

  if (Array.isArray(props)) {
    _props = props;
  }

  _props.forEach(prop => {
    ctx[prop.name] = prop.value;
  });
}

module.exports = function setInContextMiddleware(props, value, app) {

  if (typeof props === 'string' && !value) {
    throw new Error(`When passing a String as 'props', you must pass a value for to set it in the 'ctx.state'.`);
  }

  if (Array.isArray(props) && (isPlainObject(props[0]) && !(props[0].name) || !(props[0].value))) {
    throw new Error(`
      When passing an array of objects they must in the form of:
        [{
          name: 'name-of-your-property',
          value: 'your value'
        }]
    `);
  }

  if (isPlainObject(props) && (!(props.name) || !(props.value))) {
    throw new Error(`
      When passing an object it must be in the form of:
        {
          name: 'name-of-your-property',
          value: 'your value'
        }
    `);
  }

  if (app) {
    if (!(app instanceof Koa)) {
      throw new Error(`When passing the 'app' argument it must be an instance of Koa.`);
    }

    _setPropertiesToContext(app.context, props, value);
  }

  return function setInContext(ctx, next) {
    if (!app) {
      _setPropertiesToContext(ctx.state, props, value);
    }

    return next();
  };
};
