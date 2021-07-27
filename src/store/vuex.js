let Vue //vue的构造函数
const foreEach = (obj, cb) => {
	Object.keys(obj).forEach((key) => {
		cb(key, obj[key])
	})
}

const getValue = (path, root) => {
	//[a,c,d] -> a._children[c]
	return path.slice(0, -1).reduce((root, current) => {
		return root._children[current]
	}, root)
}

//递归树形结构，将getters,mutations,actions挂载到this.$store
const installModule = (store, state, path, rootModule) => {
	//处理模块的state
	if (path.length > 0) {
		//子模块状态放到父模块上
		let parent = path.slice(0, -1).reduce((state, current) => {
			return state[current]
		}, state)
		Vue.set(parent, path[path.length - 1], rootModule.state)
	}

	//处理模块的getters
	let getters = rootModule._raw.getters
	if (getters) {
		foreEach(getters, (key, fn) => {
			Object.defineProperty(store.getters, key, {
				get: () => fn(rootModule.state),
			})
		})
	}

	//处理模块的mutations
	let mutations = rootModule._raw.mutations
	if (mutations) {
		foreEach(mutations, (key, fn) => {
			let arr = store.mutations[key] || (store.mutations[key] = [])
			arr.push((payload) => fn(rootModule.state, payload))
		})
	}

	//处理模块的actions
	let actions = rootModule._raw.actions
	if (actions) {
		foreEach(actions, (key, fn) => {
			let arr = store.actions[key] || (store.actions[key] = [])
			arr.push((payload) => fn(store, payload))
		})
	}

	foreEach(rootModule._children, (key, fn) => {
		installModule(store, state, path.concat(key), fn)
	})
}

class ModuleCollection {
	constructor(options) {
		this.register([], options)
	}
	register(path, rootModule) {
		let newModule = {
			_raw: rootModule,
			_children: {},
			state: rootModule.state,
		}
		if (path.length === 0) {
			this.root = newModule
		} else {
			let parent = getValue(path, this.root)
			parent._children[path[path.length - 1]] = newModule
		}
		if (rootModule.modules) {
			foreEach(rootModule.modules, (moduleName, module) => {
				this.register(path.concat(moduleName), module)
			})
		}
	}
}

class Store {
	constructor(options) {
		// 1.处理state
		let state = options.state
		this.getters = {}
		this.mutations = {}
		this.actions = {}

		// 2.处理getters属性 具有缓存的 computed 带有缓存 （多次取值是如果值不变是不会重新取值）
		// let getters = options.getters //用户传递的getters
		// let computed = {}
		//把getter属性定义到this.getter中，并根据状态的变化重新执行函数
		// foreEach(getters, (key, fn) => {
		// 	// 将用户的getters 定义在实例上
		// 	computed[key] = () => fn(this.state)
		// 	// 当取值的时候执行计算属性的逻辑，此时就有缓存功能
		// 	Object.defineProperty(this.getters, key, {
		// 		get: () => {
		// 			return this._vm[key]
		// 		},
		// 	})
		// })

		this._vm = new Vue({
			data: {
				// 属性如果是通过$开头的 默认不会将这个属性挂载到vm上
				$state: state, //把对象变成响应式
			},
			// computed,
		})

		// 3.处理mutations属性,用于处理同步操作
		// let mutations = options.mutations || {}
		// foreEach(mutations, (key, fn) => {
		// 	this.mutations[key] = (payload) => {
		// 		fn.call(this, this.state, payload) //绑定this防止this丢失
		// 	}
		// })

		// 4.处理actions属性,用于处理异步操作
		// let actions = options.actions || {}
		// foreEach(actions, (key, fn) => {
		// 	this.actions[key] = (payload) => {
		// 		fn.call(this, this, payload)
		// 	}
		// })

		// 5.处理modules
		this.modules = new ModuleCollection(options) //收集模块,格式化结构
		installModule(this, this.state, [], this.modules.root) //注册模块
	}
	commit = (type, payload) => {
		//在actions直接调用解构后的{ commit } , this指向会丢失，故使用箭头函数获取外层this
		this.mutations[type].forEach((fn) => fn(payload))
	}
	dispatch = (type, payload) => {
		this.actions[type].forEach((fn) => fn(payload))
	}
	get state() {
		return this._vm._data.$state
	}
}

// export default vuex
const install = (_Vue) => {
	Vue = _Vue
	//给每个组件注册this.$store属性
	Vue.mixin({
		beforeCreate() {
			if (this.$options.store) {
				//当根实例存在store属性时挂载到原型上
				Vue.prototype.$store = this.$options.store
			}
		},
	})
}
export default {
	install,
	Store,
}
