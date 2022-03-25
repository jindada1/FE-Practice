function Vue(options) {
    // 初始化 options
    this._init(options)
}

// 初始化的东西都在这里做
function initMixin(Vue) {
    // 将具体的初始化方法挂载到 Vue 原型上
    Vue.prototype._init = function (options) {
        // 记录当前的 Vue 实例为 vm（vue model）
        const vm = this
        // 挂载 options 到实例上
        vm.$options = options
        // 初始化实例的状态
        initState(vm)
    }
}

function initState(vm) {
    const opts = vm.$options
    // if (opts.props) {
    //     initProps(vm)
    // }
    // if (opts.methods) {
    //     initMethods(vm)
    // }
    if (opts.data) {
        // 如有有options里有data，则初始化data
        initData(vm)
    }
    // if (opts.computed) {
    //     initComputed(vm)
    // }
    // if (opts.watch) {
    //     initWatch(vm)
    // }
}

function initData(vm) {
    // 获取传入的 data
    let data = vm.$options.data;
    // 判断data是否为函数，是函数就执行（注意this指向vm），否则就直接赋值给vm上的_data
    // 这里建议data应为一个函数，return 一个 {}，这样做的好处是防止组件的变量污染
    data = vm._data = typeof data === 'function' ? data.call(vm) : data || {}

    // 为 data 上的每个数据都进行代理
    // 将 this.data.a 代理到 this.a
    for (let key in data) {
        proxy(vm, '_data', key)
    }

    // 对data里的数据进行响应式处理
    // 重头戏
    observe(data)
}

function proxy(obj, sourceData, key) {
    // 调用 obj[key] 时，返回 obj[sourceData][key]
    Object.defineProperty(obj, key, {
        get() {
            return obj[sourceData][key]
        },
        set(newVal) {
            obj[sourceData][key] = newVal
        }
    })
}

class Observer {
    constructor(value) {
        // 给传进来的对象或者数组设置一个 __ob__ 属性
        // 后续通过判断 __ob__ 属性来确定对象是否做了响应式处理
        Object.defineProperty(value, '__ob__', {
            value: this, // 值为this，也就是new出来的Observer实例
            enumerable: false, // 不可被枚举
            writable: true, // 可用赋值运算符改写__ob__
            configurable: true // 可改写可删除
        })

        if (Array.isArray(value)) {
            // 修改数组的原型，起到拦截数组方法的作用
            // value.__proto__ = arrayMethods
            // 对数组进行响应式处理
            this.observeArray(value)
        }
        else {
            // 响应式处理对象
            this.walk(value)
        }
    }

    walk(data) {
        let keys = Object.keys(data)

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i]
            const value = data[key]

            // 拦截对 data 上 key 属性的操作
            defineReactive(data, key, value)
        }
    }

    observeArray(arr) {
        for (let i = 0; i < arr.length; i++) {
            // 对每个元素响应式处理
            observe(arr[i])
        }
    }
}

function observe(value) {
    // 如果是对象或者数组
    if (Object.prototype.toString.call(value) === '[object Object]' || Array.isArray(value)) {
        // TODO: 为什么要 return
        return new Observer(value)
    }
}

class Dep {
    constructor() {
        // 用来保存 Watcher 对象
        this.subs = []
    }

    depend() {
        // Dep.target 指向的是某个 Watcher 对象
        if (Dep.target) {
            // 把 dep 传给 Watcher 对象，让 Watcher 把自己加到 dep 的订阅者里面
            Dep.target.addDep(this)
        }
    }

    notify() {
        // 通知subs里的每个Wacther都去通知更新
        const tempSubs = this.subs.slice()
        tempSubs.reverse().forEach(watcher => watcher.update())
    }

    addSub(watcher) {
        // 将 watcher 收进 subs 里
        this.subs.push(watcher)
    }
}

class Watcher {
    constructor() {
        this.deps = []
    }

    addDep(dep) {
        let id = dep.id
        if (!this.depsId.has(id)) {
            this.depsId.add(id)
            this.deps.push(dep)
            dep.addSub(this);
        }
    }

    // 所有的属性收集当前的watcer
    depend() {
        let i = this.deps.length
        while (i--) {
            this.deps[i].depend()
        }
    }
}

function defineReactive(data, key, value) {
    // 每个变量都有自己的 dep
    const dep = new Dep()
    // 劫持变量的 get 和 set 属性
    Object.defineProperty(data, key, {
        get() {
            console.log(`[get] ${key} from ${data}`);
            if (Dep.target) {
                // 如果 Dep.target 指向某个 Watcher，则把此 Watcher 收入此 dep 的队列里
                dep.depend()
            }
            return value
        },
        set(newVal) {
            if (newVal === value) return
            console.log(`[set] ${key} of ${data}`);
            value = newVal
            // 新设置的值需要响应式处理
            observe(newVal);
            // 通知 dep，dep 去更新里面的 Watcher
            dep.notify()
        }
    })
    // 递归处理 value
    observe(value)
}

initMixin(Vue)