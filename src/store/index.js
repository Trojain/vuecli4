import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import state from './state'
import mutations from './mutations'

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
    actions,
    getters,
    state,
    mutations,
    // strict: debug, // 当debug=true时开启严格模式(性能有损耗)
    // plugins: debug ? [createLogger()] : []
})