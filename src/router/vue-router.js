let Vue //缓存vue实例

class VueRouter{
  constructor(options){
    this.$options = options //缓存routes对象
    let initial = this.getHash() //获取当前hash值

    Vue.util.defineReactive(this,"current",initial) //当前路由-设置成响应式对象，当路由发生变化重新渲染组件
    window.addEventListener("hashchange",()=>{ //监听hash值变化，current重新赋值
      this.current = this.getHash()

    })
  }
  static install = (_Vue) => {
    Vue = _Vue
    Vue.mixin({
      beforeCreate(){
        //每个组件实例化时都会调用
        //根实例有router配置项，则全局挂载
        if(this.$options.router){
          Vue.prototype.$router = this.$options.router
        }
      }
    })
    //<router-link to="/">Home</router-link> -> <a href="/">Home</a>
    //将to转化为a标签的href属性
    Vue.component("router-link",{
      props:{
        to: {
          type: String,
          require: true,
        }
      },
      render(h){
        return h("a",{
          attrs: {
            href: `#${this.to}`
          },
        },
        this.$slots.default  //默认插槽内容-Home
      )}
    })
    //路由出口
    Vue.component("router-view",{
      render(h){
        const current = this.$router.current //获取当前路由
        //获取当前路由对应的组件
        let component = this.$router.$options.routes.find(route => current === route.path).component
        //渲染当前路由对应的组件
        return h(component)
      }
    })
  }
  getHash(){
    return location.hash.slice(1) || '/'
  }
  push(hash){ //添加this.$router.push()方法
    location.hash = hash
  }
}

export default VueRouter