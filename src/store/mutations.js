import { setStore } from 'js/store'

const mutations = {
    // 主题颜色
    SET_THEME: (state, color) => {
        state.theme = color
        setStore({
            name: 'theme',
            content: state.theme
        })
    },
}


export default mutations