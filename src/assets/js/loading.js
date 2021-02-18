import { Loading } from 'element-ui'
let loading = null;

export function showLoading() {
    loading = Loading.service({
        lock: true,
        spinner: "el-icon-loading",
        text: '拼命加载中…',
        background: 'rgba(0, 0, 0, 0.4)'
    })
}

export function hideLoading() {
    if (loading !== null) loading.close()
}