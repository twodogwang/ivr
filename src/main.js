// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import store from './vuex/store'
// Vue.use(router)
Vue.use(iView)
    //定义全局变量
Vue.prototype.$http = axios;
// Vue.prototype.baseUrl = 'http://yk101-8180.ynt.ai:7001/ivrcms/' //电信实际业务
   Vue.prototype.baseUrl = 'http://192.168.88.14:8380/ivrcms/'
//Vue.prototype.baseUrl = '/ivrcms/'


Vue.prototype.postID = function(id) {
    if (!window.localStorage) {
        alert("您的浏览器不支持localStorage，请更换其他浏览器");
    } else {
        window.localStorage.setItem('ALL_ID', id); //用户模板点击编辑之后改变值
        Vue.prototype.commonID = window.localStorage.getItem('ALL_ID');
    }
}
var id = window.localStorage.getItem('ALL_ID');
if (id == undefined) {

} else {
    id = window.localStorage.getItem('ALL_ID');
    Vue.prototype.commonID = id;
}
Vue.prototype.clickThisTab = function(name) {
        var trans = document.getElementsByClassName('ivu-tabs-content-animated')[0];
        if (name == 1) {
            trans.style.display = 'initial';
        } else {
            trans.style.display = 'none';
        }
    }
    //axios post表单请求
Vue.prototype.$httpPostForm = function(url, data, callback) {
        let config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
        this.$http.post(this.baseUrl + url, data, config)
            .then(res => {
                if (res.data.status === 1000) {
                    if (typeof callback == 'function') {
                        callback(res)
                    }
                } else {
                    // console.log(res.status)
                    this.$Message.error(res.data.msg);
                    // alert(res.status)
                }
            })
    }
    //axios post请求
Vue.prototype.$httpPost = function(url, data, callback) {
        this.$http.post(this.baseUrl + url, data)
            .then(res => {
                if (res.data.status === 1000) {
                    if (typeof callback == 'function') {
                        callback(res)
                    }
                } else {
                    // console.log(res.status)
                    this.$Message.error(res.data.msg);
                    // alert(res.status)
                }
            })
    }
    //axios get请求
Vue.prototype.$httpGet = function(url, data, callback) {
        this.$http.get(this.baseUrl + url, data)
            .then(res => {
                if (res.data.status === 1000) {
                    if (typeof callback == 'function') {
                        callback(res)
                    }
                } else {
                    this.$Message.error(res.data.msg);
                }
            })
    }
    // ajax POST请求
    // Vue.prototype.$post = function(url, data, callback) {
    //     $.ajax({
    //         url: this.baseUrl + url,
    //         data: data,
    //         type: 'POST',
    //         success: function(res) {
    //             if (res.status === 1000) {
    //                 if (typeof callback == 'function') {
    //                     callback(res)
    //                 }
    //             } else {
    //                 console.log(res.status)
    //             }
    //         }
    //     })
    // }

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: { App },
    data() {
        return {
            businessTableData: ''
        }
    }
})