'use strict';

const Koa = require('koa');
const isPlainObject = require('lodash.isplainobject');

/**
 * Set in context middleware for Koa 2 application.
 */
module.exports = function setInContextMiddleware(props, value) {

  /**
   * We have an array of objects.
   * Check that the object have the correct form.
   * With the properties "name and value".
   * If any of the objects doesn't comply with the form,
   * throw an error.
   */
  if (Array.isArray(props) && !(props.every(isObjectAndHasCorrectForm))) {
    throw new Error(`
      When passing an array of objects they must in the form of:
        [{
          name: 'name-of-your-property',
          value: 'your value'
        }]
    `);
  }

  /**
   * If we only have an object, check that it has the correct form.
   * "name and value". If not throw an error.
   */
  if (isObjectAndHasCorrectForm(props)) {
    throw new Error(`
      When passing an object it must be in the form of:
        {
          name: 'name-of-your-property',
          value: 'your value'
        }
    `);
  }

  /**
   * Return the actual middleware.
   */
  return function setInContext(ctx, next) {
    setPropertiesIntoState(ctx.state, props, value);
    return next();
  };
};

/**
 * setPropertiesIntoState: Actual function that normalizes the parameters
 * that the user passes so we can work with easely.
 *
 * If a string is passed, create an array with only one object with the form
 *  'key', 'value' => [{ name: 'key', value: 'value' }]
 *
 * If an object is given, just wrap it in an array.
 * { name: 'key', value: 'value' } => [{ name: 'key', value: 'value' }]
 *
 * If an array of objects is given, just continue.
 *
 * @param Object state The "context.state" of the request.
 * @param mixed props  The key|value to set in the context.
 * @param mixed value  The value to set in the context, if "props" is a string.
 * @return void
 */
function setPropertiesIntoState(state, props, value) {
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
    state[prop.name] = prop.value;
  });
}

/**
 * isObjectAndHasCorrectForm: Check whether "obj" is
 * plain object with the form: { name: 'key', value: 'value' }.
 *
 * @param mixed obj The value to check.
 * @return Boolean
 */
function isObjectAndHasCorrectForm(obj) {
  return isPlainObject(obj) &&
    obj.hasOwnProperty('name') &&
    obj.hasOwnProperty('value');
}
