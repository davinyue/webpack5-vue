/** 参数验证 */
function validate() {
  let args = arguments[0];
  let result = false;
  for (let i = 0; i < args.length; i++) {
    if (i === 0) {
      if (args[i] instanceof Object) {
        result = true;
      } else {
        result = false;
        break;
      }
    }
    else if (i === 1) {
      if (typeof (args[i]) === 'string') {
        result = true;
      } else {
        result = false;
        break;
      }
    }
    else {
      if (args[i] instanceof Function) {
        result = true;
      } else {
        result = false;
        break;
      }
    }
  }
  return result;
}
/** 前置切面
 * @param target 需要aop的对象
 * @param methodName 需要aop的函数名称
 * @param advice 执行函数前执行的函数
 */
function before(target, methodName, advice) {
  if (validate(arguments)) {
    let main = target[methodName];
    function newMain() {
      advice.apply(this, arguments);
      return main.apply(this, arguments);
    }
    target[methodName] = newMain;
  }
}

/** 后置切面
 * @param target 需要aop的对象
 * @param methodName 需要aop的函数名称
 * @param advice 执行函数后执行的函数
 */
function after(target, methodName, advice) {
  if (validate(arguments)) {
    let main = target[methodName];
    function newMain() {
      let result = main.apply(this, arguments);
      return advice.call(this, arguments, result);
    }
    target[methodName] = newMain;
  }
}

/** 前置和后置切面 
 * @param target 需要aop的对象
 * @param methodName 需要aop的函数名称
 * @param beforeAdvice 执行函数前执行的函数
 * @param afterAdvice 执行函数后执行的函数
*/
function beforeAndAfter(target, methodName, beforeAdvice, afterAdvice) {
  if (validate(arguments)) {
    let main = target[methodName];
    function newMain() {
      beforeAdvice.apply(this, arguments);
      let result = main.apply(this, arguments);
      return afterAdvice.call(this, arguments, result);
    }
    target[methodName] = newMain;
  }
}

export default {
  before: before,
  after: after,
  beforeAndAfter: beforeAndAfter
};