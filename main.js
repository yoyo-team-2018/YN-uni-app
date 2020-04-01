// 引入vue框架js
import Vue from 'vue'
// 引入入口文件app.vue(引擎会自动扫描App目录下的名称为App，后缀为.vue的文件)
import App from './App'
// 引入vuex状态管理  ----用来做数据通讯交互
import store from './store'
// 引入 接口数据  ----管理各个模块的请求api地址
import httpApi from '@/common/httpApi'
// 引入 请求方法     ----管理所有请求公用方法
import httpRequest from '@/common/httpRequest'
// 引入 工具方法      -----管理所有工具方法
import custom from '@/common/custom'
// 引入 内置方法      -----管理所有内置方法
import system from '@/common/system'
// 引入 路由方法      -----管理所有页面跳转方法
import routes from '@/common/routes'

Vue.config.productionTip = false
// 挂载模块到vue原型
Vue.prototype.$store = store
Vue.prototype.$api = httpApi
Vue.prototype.$request = httpRequest
Vue.prototype.$config = httpRequest.config
Vue.prototype.$custom = custom
Vue.prototype.$system = system
Vue.prototype.$routes = routes

// +----------------------
// |使用自定义消息模块
// |<message ref="Message" :duration="1000" background></message>
// |this.$refs['Message'].info/warn/success/info();
// +----------------------
import message from './components/message.vue'
Vue.component('message', message)

// +-------------------
// 过滤null 转换为'' 定义全局过滤器  @页面在需要格式化的参数后加 ｜	tp 使用
// +-------------------
Vue.filter('tp', function(v) {
	return v == null ? '' : v;
});

// +-------------------
// 过滤身份证号 转换为'4307************72'   @页面在需要格式化的参数后加 ｜	rp 使用
// +-------------------
Vue.filter('rp', function(v) {
	if(v == undefined || v == null || v == "") return "";
	let zjhm = String(v).slice(4,16);
	let str = String(v).replace(new RegExp(zjhm,'g'),"************");
	return str;
});
// +-------------------
// 过滤身份证号 转换为'4307************72'   @页面在需要格式化的参数后加 ｜	rp 使用
// +-------------------
Vue.filter('rp', function(v) {
	if(v == undefined || v == null || v == "") return "";
	let zjhm = String(v).slice(4,16);
	let str = String(v).replace(new RegExp(zjhm,'g'),"************");
	return str;
});

import { checkUpdateApp } from './common/updateManager.js'
checkUpdateApp()


Vue.prototype.$fire = new Vue();

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()