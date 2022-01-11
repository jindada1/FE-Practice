
## Vue

### 八股文

https://juejin.cn/post/6844903918753808398

### 生命周期

`beforeCreate()` 在实例创建之间执行，数据未加载状态

`created()` 在实例创建、数据加载后，能初始化数据，`dom`渲染之前执行

`beforeMount()` 虚拟`dom`已创建完成，在数据渲染前最后一次更改数据

`mounted()` 页面、数据渲染完成，真实`dom`挂载完成

`beforeUpadate()` 重新渲染之前触发

`updated()` 数据已经更改完成，`dom` 也重新 `render` 完成,更改数据会陷入死循环

`beforeDestory()` 和 `destoryed()` 前者是销毁前执行（实例仍然完全可用），后者则是销毁后执行



**一般在哪个生命周期请求异步数据**

> 异步请求在哪个阶段都可以调用，因为会先执行完生命周期的钩子函数之后，才会执行异步函数，但如果考虑用户体验方面的话，在created 中调用异步请求最佳，用户就越早感知页面的已加载，毕竟越早获取数据，在 mounted 实例挂载的时候就越及时。



v-if 和 v-show 的差别

> `v-if` 是“真正”的条件渲染，因为它会确保在切换过程中条件块内的事件监听器和子组件适当地被销毁和重建。
>
> `v-if` 也是**惰性的**：如果在初始渲染时条件为假，则什么也不做——直到条件第一次变为真时，才会开始渲染条件块。
>
> 相比之下，`v-show` 就简单得多——不管初始条件是什么，元素总是会被渲染，并且只是简单地基于 CSS 进行切换。当v-show赋值为false时，元素被隐藏，此时查看代码时，该元素上会多一个内联样式style=“display:none”
>
> 一般来说，`v-if` 有更高的切换开销，而 `v-show` 有更高的初始渲染开销。因此，如果需要非常频繁地切换，则使用 `v-show` 较好；如果在运行时条件很少改变，则使用 `v-if` 较好。



### nextTick 



### vue-router

#### hash / history

**hash**

通过 url 后面的 hash 实现路由，hash 值的变化，并不会导致浏览器向服务器发出请求，浏览器不发出请求，也就不会刷新页面。

另外每次 hash 值的变化，还会触发`hashchange` 这个事件，通过这个事件我们就可以知道 hash 值发生了哪些变化。

```javascript
window.addEventListener('hashchange', matchAndUpdate)
```



**history**：

通过 `window.history` 的两个 API `pushState` 和 `replaceState`，改变 url 地址且不会发送请求

需要后端配合

### vuex
