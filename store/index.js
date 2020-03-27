// 此为vue状态管理页面(使用模块管理的前提:父组件下有多个子组件，子组件之间的通讯就会非常繁琐，父组件也需要监听大量的事件)
import Vue from 'vue'
import Vuex from 'vuex'
// 在Vue中使用Vuex
Vue.use(Vuex)

//---------------------状态管理使用------------------------------------------------
/*
* ------state------- 
* (1.state 是vuex中的数据源，我们需要保存的数据就保存在这里,可以在页面通过 )
* (2.使用 this.$store.state.变量名 来获取state里面定义的数据)
* 
* -----getters------
* (1.getter相当于vue中的computed计算属性,getter 的返回值会根据它的依赖被缓存起来，
* 且只有当它的依赖值发生了改变才会被重新计算)
* (2.使用 this.$store.getters.getters中方法名 来获取getter里面定义的方法)
* --传参--@param
* (3.使用 this.$store.getters.getters中方法名(param) 调用)
* --getters中方法需要这样的结构写法接收----
* getters:{
*   方法名:(state) => (param) =>{
*		//处理逻辑
*	}
* }
* 
* -----mutations----
* (1.如果需要修改/改变 state数据源里面的数据状态,就需要用到mutation，通过提交mutation来修改)
* --传参--@param
* (2.使用  this.$store.commit('mutations中的方法名',param) 调用)
* --mutations中方法需要这样的结构写法接收----
* mutations:{
* 	方法名(state,param){
*		//处理逻辑
*   }
* } 
* 
* -----actions-------***********重要*********-----------
* (1.官方并不介意我们这样(通过commit)直接去修改store里面的值,
* 而是让我们去提交一个actions，在actions中提交mutation再去修改状态值)
* --传参--@param
* (2.使用  this.$store.dispatch('actions中的方法名',param) 调用)
* --actions中方法需要这样的结构写法接收----
* actions:{
	//context一个与store实例具有相同方法和属性的context对象 param是接收你传的参数
* 	方法名(context,param){
*		//提交mutation再去修改状态值
* 		context.commit('mutations中的方法名',param);
*   }
* } 
*/
//  分模块的状态管理
const moduleA = {
  state: {},
  mutations: { },
  actions: {  },
  getters: {  }
}

const moduleB = {
  state: {  },
  mutations: {  },
  actions: {  }
}

// 管理接口公用参数
const moduleC = {
  state: { },
  mutations: {  },
  actions: {  }
}

const store = new Vuex.Store({
	state: {
		// 扫描信息
		personScanPersonData:{},
		// 用户个人信息
		personData:{},
		// openId
		openId:"",
		// 用户类型 1管理员  0用户
		userType:"",
		// 登记信息用于重新申请通行证是回显数据
		registerData:"",
		//  默认没有登记 默认没有登记0
		registerStatus:0,
		authorOtherData: {}
	},
	mutations: {
		// +------------------
		// |更新扫码放行信息
		// +------------------
		refreshScanPersonData(state,data){
			state.personScanPersonData = data;
		},
		// +------------------
		// |更新个人信息
		// +------------------
		refreshPersonData(state,data){
			state.personData = data;
		},
		// +------------------
		// |更新openid
		// +------------------
		refreshOpenId(state,openId){
			state.openId = openId;
		},
		// +------------------
		// |更新用户权限
		// +------------------
		refreshUserType(state,index){
			state.userType = index;
		},
		// +------------------
		// |更新登记信息
		// +------------------
		refreshRegisterData(state,data){
			state.registerData = data;
		},
		// +------------------
		// |更新登记成功状态
		// +------------------
		refreshRegisterStatus(state,status){
			state.registerStatus = status;
		},
		
		refreshAuthorOtherData(state,status){
			state.authorOtherData = {
				...status
			};
		},
	},
	actions: {
		// +------------------
		// |更新扫码放行信息
		// +------------------
		refreshScanPersonData(context,data){
			context.commit('refreshScanPersonData',data);
		},
		// +------------------
		// |更新个人信息
		// +------------------
		refreshPersonData(context,data){
			context.commit('refreshPersonData',data);
		},
		// +------------------
		// |更新openid
		// +------------------
		refreshOpenId(context,openId){
			context.commit('refreshOpenId',openId);
		},
		// +------------------
		// |更新用户类型
		// +------------------
		refreshUserType(context,index){
			context.commit('refreshUserType',index);
		},
		// +------------------
		// |更新登记信息
		// +------------------
		refreshRegisterData(context,data){
			context.commit('refreshRegisterData',data);
		},
		// +------------------
		// |更新登记成功状态
		// +------------------
		refreshRegisterStatus(context,status){
			context.commit('refreshRegisterStatus',status);
		},
		
		refreshAuthorOtherData(context,status){
			context.commit('refreshAuthorOtherData',status);
		},
		
	}
})

export default store
