import Vue from 'vue'
import Vuex from './vuex'

Vue.use(Vuex)
export default new Vuex.Store({
	state: {
		age: 10,
	},
	getters: {
		myAge(state) {
			return state.age + 20
		},
	},
	mutations: {
		syncAdd(state, payload) {
			state.age += payload
		},
	},
	actions: {
		add({ commit, dispatch }, payload) {
			setTimeout(() => {
				commit('syncAdd', payload)
			}, 1000)
		},
	},
	modules: {
		a: {
			state: {
				x: 1,
			},
      getters:{
        getA(state){
          return state.x + 'a'
        }
      },
      mutations:{
        changeX(state){
          return state.x = 100
        }
      },
			modules: {
				c: {
					state: {
						z: 1,
					},
					modules: {
            d: {
              state: {
                v: 1
              }
            }
          },
				},
			},
		},
		b: {
			state: {
				y: 1,
			},
		},
	},
})
