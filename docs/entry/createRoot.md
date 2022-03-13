React 18 推荐我们用如下的方式创建入口：

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
        <App/>
);
```

createRoot是ReactDOM导出的全局方法，其在源码中的定义如下：

```javascript
function createRoot(container, options) {
  if (!isValidContainer(container)) {
    throw new Error('createRoot(...): Target container is not a DOM element.');
  }

  warnIfReactDOMContainerInDEV(container);
  var isStrictMode = false;
  var concurrentUpdatesByDefaultOverride = false;
  var identifierPrefix = '';
  var onRecoverableError = defaultOnRecoverableError;
  var transitionCallbacks = null;

  if (options !== null && options !== undefined) {
    {
      if (options.hydrate) {
        warn('hydrate through createRoot is deprecated. Use ReactDOMClient.hydrateRoot(container, <App />) instead.');
      } else {
        if (typeof options === 'object' && options !== null && options.$$typeof === REACT_ELEMENT_TYPE) {
          error('You passed a JSX element to createRoot. You probably meant to ' + 'call root.render instead. ' + 'Example usage:\n\n' + '  let root = createRoot(domContainer);\n' + '  root.render(<App />);');
        }
      }
    }

    if (options.unstable_strictMode === true) {
      isStrictMode = true;
    }

    if (options.identifierPrefix !== undefined) {
      identifierPrefix = options.identifierPrefix;
    }

    if (options.onRecoverableError !== undefined) {
      onRecoverableError = options.onRecoverableError;
    }

    if (options.transitionCallbacks !== undefined) {
      transitionCallbacks = options.transitionCallbacks;
    }
  }

  var root = createContainer(container, ConcurrentRoot, false, null, isStrictMode, concurrentUpdatesByDefaultOverride, identifierPrefix, onRecoverableError);
  markContainerAsRoot(root.current, container);
  var rootContainerElement = container.nodeType === COMMENT_NODE ? container.parentNode : container;
  listenToAllSupportedEvents(rootContainerElement);
  return new ReactDOMRoot(root);
}
```

可以看到，createRoot方法接受container和配置项options两个参数，返回一个ReactDOMRoot的实例。

其先是对传入的container做了校验，验证它是否是合法的DOM元素。其次对用户在options里传入hydrate的使用方式做了警告，并且提取了options里传入的配置等。后面直到函数体结束都是createRoot方法的核心逻辑，我们简化一下并加上注释，如下：

```javascript
function createRoot(container, options) {
    // 创建一个FiberRootNode
  var root = createContainer(container, ConcurrentRoot, false, null, isStrictMode, concurrentUpdatesByDefaultOverride, identifierPrefix, onRecoverableError);
    // 将FiberRootNode和container建立关联
  markContainerAsRoot(root.current, container);
    // 建立container上的事件监听
  var rootContainerElement = container.nodeType === COMMENT_NODE ? container.parentNode : container;
  listenToAllSupportedEvents(rootContainerElement);
    // 返回一个ReactDOMRoot的实例
  return new ReactDOMRoot(root);
}
```

先看createContainer方法：

```javascript
function createContainer(containerInfo, tag, // TODO: We can remove hydration-specific stuff from createContainer once
// we delete legacy mode. The new root API uses createHydrationContainer.
hydrate, hydrationCallbacks, isStrictMode, concurrentUpdatesByDefaultOverride, identifierPrefix, onRecoverableError, transitionCallbacks) {
  return createFiberRoot(containerInfo, tag, hydrate, hydrationCallbacks, isStrictMode, concurrentUpdatesByDefaultOverride, identifierPrefix, onRecoverableError);
}
```

可以看到，它就是调用了createFiberRoot方法：

```javascript
function createFiberRoot(containerInfo, tag, hydrate, hydrationCallbacks, isStrictMode, concurrentUpdatesByDefaultOverride, // TODO: We have several of these arguments that are conceptually part of the
// host config, but because they are passed in at runtime, we have to thread
// them through the root constructor. Perhaps we should put them all into a
// single type, like a DynamicHostConfig that is defined by the renderer.
identifierPrefix, onRecoverableError, transitionCallbacks) {
  var root = new FiberRootNode(containerInfo, tag, hydrate, identifierPrefix, onRecoverableError);
  // stateNode is any.


  var uninitializedFiber = createHostRootFiber(tag, isStrictMode);
  root.current = uninitializedFiber;
  uninitializedFiber.stateNode = root;

  {
    var _initialState = {
      element: null,
      cache: null,
      transitions: null
    };
    uninitializedFiber.memoizedState = _initialState;
  }

  initializeUpdateQueue(uninitializedFiber);
  return root;
}
```

createFiberRoot方法的核心逻辑也比较简单，先是构造了一个FiberRootNode实例(下称fiber root)，其次创建了一个还未初始化的root fiber，并将fiber root的current指向root fiber，最后返回fiber root。

然后我们看一下markContainerAsRoot方法：

```javascript
var randomKey = Math.random().toString(36).slice(2);
var internalContainerInstanceKey = '__reactContainer$' + randomKey;
function markContainerAsRoot(hostRoot, node) {
  node[internalContainerInstanceKey] = hostRoot;
}
```

它的逻辑很简单，就是在container上加了一个’__reactContainer$‘的属性，指向root fiber。

建立container上的事件监听是分支逻辑，我们先略过。最后createRoot方法返回一个ReactDOMRoot的实例：

```javascript
return new ReactDOMRoot(root);
```

ReactDOMRoot是一个构造函数，它的逻辑只有一行代码：

```javascript
function ReactDOMRoot(internalRoot) {
  this._internalRoot = internalRoot;
}

ReactDOMHydrationRoot.prototype.render = ReactDOMRoot.prototype.render = function (children) {
// ...
};

ReactDOMHydrationRoot.prototype.unmount = ReactDOMRoot.prototype.unmount = function () {
 // ...
};
```

ReactDOMRoot返回的实例上被赋予了_internalRoot的属性，指向fiber root。实例上的render，unmount方法都是从原型上获取。

**至此，createRoot执行完毕。可以看到，该方法接受container和options两个参数，主要是创建了一个fiber root并将它的current指向一个root fiber，同时在container上附加一个指向fiber root的指针。最后返回一个ReactDOMRoot对象，它的_internalRoot指向之前创建的fiber root，并且在原型上定义了render， unmount方法。**