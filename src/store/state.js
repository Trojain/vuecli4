import { getStore } from 'js/store'

const state = {
    // 主题颜色
    theme: getStore({ name: 'theme' }) || '#1E56A0'
}

export default state