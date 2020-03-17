<template>
	 <view>
		 <scroll-view scroll-y class="DrawerPage" :class="modalName=='viewModal'?'show':''">
		 		<form  @submit="formSubmit" @reset="formReset">
		 			<view class="action margin-top">
		 				<text class="cuIcon-titles text-blue"></text>个人信息
		 			</view>
					<!-- 姓名 -->
		 			<view class="cu-form-group margin-top">
		 				<view class="title require-ico">姓名</view>
						<!-- <input :value="xm" type="text" name="xm"  placeholder="请输入"></input> -->
						<input value="胖虎" type="text" name="xm"  placeholder="请输入"></input>
		 			</view>
					<!-- 身份证号 -->
		 			<view class="cu-form-group">
		 				<view class="title require-ico">身份证号</view>
		 				<!-- <input :value="zjhm" type="idcard" name="zjhm" placeholder="请输入"></input> -->
						<input value="430725198508152171" type="text" name="zjhm"  placeholder="请输入"></input>
		 			</view>
					<!-- 籍贯 -->
					<view class="cu-form-group none-right-arrow">
						<view class="title">籍贯</view>
						<picker mode="region" @change="bindDropChange" @click.stop="swiperShow" data-name="departAddress" :value="hjdzData" > 
						    <view v-if="showPicker" class="picker" > 
						      {{hjdzData[0]}}{{hjdzData[1]}}{{hjdzData[2]}} 
						    </view> 
							<view v-else class="picker" ></view> 
						</picker>
						<button @click.stop="clearAddress" class="cu-btn  bg-blue">清空</button>
						<!-- 隐藏籍贯提交 -->
						<input type="text" class="h-input" name="jg"  :value="jg" />
					</view>
					<!-- 联系电话 -->
		 			<view class="cu-form-group">
		 				<view class="title require-ico">联系电话</view>
		 				<!-- <input :value="lxdh" type="text" name="lxdh" placeholder="请输入"></input> -->
						<input value="18823837917" type="text" name="lxdh"  placeholder="请输入"></input>
		 			</view>
					<!-- 是否租客checkbox -->
					<view class="cu-form-group">
						<view class="title text-blue">是否租客</view>
						<checkbox-group  @change="checkboxZukeChange">
							<view class="cu-form-group">
								<checkbox :class="isCheckZuke?'checked':''" :checked="isCheckZuke?true:false" value="1"></checkbox>
							</view>
						</checkbox-group>
						<input type="text" class="h-input" name="isTenant" :value="isTenant" />
					</view>
					<!-- 房东姓名 -->
					<view v-if="isCheckZuke" class="cu-form-group">
						<view class="title require-ico">房东姓名</view>
						<input type="text" name="renterName"  placeholder="请输入"></input>
					</view>
					<!-- 房东电话 -->
					<view v-if="isCheckZuke" class="cu-form-group">
						<view class="title require-ico">房东电话</view>
						<input type="text" name="renterPhone" placeholder="请输入"></input>
					</view>
		 			<view class="cu-form-group">
		 				<view class="title require-ico">街镇</view>
		 				<picker @change="PickerChange" :value="index" :range="picker">
		 					<view class="picker">
		 						{{index>-1?picker[index]:'请选择'}}
		 					</view>
		 				</picker>
		 			</view>
					<!-- 街镇 -->
					<view class="cu-form-group">
						<view class="title require-ico">街镇</view>
						<view v-if="jzName" class="text5">{{jzName}} </view>
						<input @input="changeJz" v-model="jzSearch"></input>
						<button @tap="searchJz" class="cu-btn bg-blue">搜索</button>
					</view>
					<!-- 居委会 -->
					<view class="cu-form-group">
						<view class="title require-ico">居委会</view>
						<view v-if="jwhName" class="text5">{{jwhName}} </view>
						<input @input="changeJwh" v-model="jwhSearch"></input>
						<button @tap="searchJwh" class="cu-btn  bg-blue">搜索</button>
					</view>
					<!-- 街路巷 -->
					<view v-if="!isHomeAddress" class="cu-form-group">
						<view class="title require-ico">街路巷</view>
						<view v-if="jddmName" class="text5">{{jddmName}} </view>
						<input @input="changeJlx" v-model="jddmSearch"></input>
						<button @tap="searchJddm" class="cu-btn  bg-blue">搜索</button>
					</view>
					<!-- 门牌号 -->
					<view v-if="!isHomeAddress" class="cu-form-group">
						<view class="title require-ico">门牌号</view>
						<view v-if="dongName" class="text5">{{dongName}} </view>
						<input @input="changeDong" v-model="dongSearch"></input>
						<button @tap="searchDong" class="cu-btn  bg-blue">搜索</button>
					</view>
					<!-- 单元 -->
					<view v-if="!isHomeAddress" class="cu-form-group">
						<view class="title require-ico">单元</view>
						<view v-if="taoName" class="text5">{{taoName}} </view>
						<input @input="changeTao" v-model="taoSearch"></input>
						<button @tap="searchTao" class="cu-btn  bg-blue">搜索</button>
					</view>
					<!-- 选项中没有我的房屋地址 -->
					<view class="cu-form-group">
						<view class="title text-blue">选项中没有我的房屋地址</view>
						<checkbox-group  @change="checkboxHomeChange">
							<view class="cu-form-group">
								<checkbox :class="isHomeAddress?'checked':''" :checked="isHomeAddress?true:false" value="1"></checkbox>
							</view>
						</checkbox-group>
					</view>
					<!-- 居住详址 -->
		 			<view class="cu-form-group align-start" v-if="isHomeAddress">
		 				<view class="title require-ico">居住详址</view>
		 				<textarea name="selfCompiledAddress" maxlength="100"  placeholder="请输入您的房屋地址"></textarea>
		 			</view>
					<!-- 工作地址 -->
		 			<view class="cu-form-group">
		 				<view class="title">工作地址</view>
		 				<input type="text" placeholder="请输入" name="workAddress"></input>
		 			</view>
					<!--  -->
		 			<view class="action margin-top">
		 				<text class="cuIcon-titles">返穗情况</text>
		 			</view>
					<!-- 是否在穗checkbox -->
					<view class="cu-form-group margin-top">
						<view class="title text-blue">一直在穗</view>
						<checkbox-group  @change="checkboxSuiChange">
							<view class="cu-form-group">
								<checkbox :class="isCheckSui?'checked':''" :checked="isCheckSui?true:false" value="1"></checkbox>
							</view>
						</checkbox-group>
						<!-- 隐藏一直在穗提交 -->
						<input type="text" class="h-input" name="alwaysInGz"  :value="alwaysInGz" />
					</view>
					<!-- 返穗日期 -->
		 			<view v-if="!isCheckSui" class="cu-form-group">
		 				<view class="title require-ico">返穗日期</view>
		 				<picker mode="date" :value="date"  @change="bindDropChange" data-name="date">
		 					<view class="picker">{{date}}</view>
		 				</picker>
						<!-- 隐藏返穗日期提交 -->
						<input type="text" class="h-input" name="returnTime"  :value="returnTime" />
		 			</view>
					<!-- 出发地 -->
		 			<view v-if="!isCheckSui" class="cu-form-group">
		 				<view class="title require-ico">出发地</view>
		 				<input type="text" placeholder="请输入" name="departAddress"></input>
		 			</view>
					<!-- 返穗交通工具 -->
		 			<view v-if="!isCheckSui" class="cu-form-group">
		 				<view class="title require-ico">返穗交通工具</view>
		 				<picker :value="vehicleIndex" :range="vehicleList"   @change="bindDropChange" data-name="vehicle">
		 					<view class="picker">
		 						{{vehicleIndex>-1?vehicleList[vehicleIndex]:'请选择'}}
		 					</view>
		 				</picker>
						<!-- 隐藏返穗交通工具提交 -->
						<input type="text" class="h-input" name="vehicle"  :value="vehicle" />
		 			</view>
					<!-- 车牌/车次/航班号 -->
		 			<view v-if="!isCheckSui" class="cu-form-group">
		 				<view class="title">车牌/车次/航班号</view>
		 				<input type="text" placeholder="请输入" name="vehicleNum"></input>
		 			</view>
					<!-- 提交 -->
		 			<view class="padding">
		 				<button  form-type="submit" class="cu-btn block bg-blue margin-tb-sm lg">提交</button>
		 			</view>
					<view style="margin-top: 100rpx;"></view>
		 		</form>	
		 </scroll-view>
		 <!-- 抽屉关闭 -->
		 <view class="DrawerClose" :class="modalName=='viewModal'?'show':''" @tap="hideModal">
		 	<text class="cuIcon-pullright"></text>
		 </view>
		 <!-- 抽屉盒子 -->
		 <scroll-view scroll-y class="DrawerWindow" :class="modalName=='viewModal'?'show':''">
			 <uni-pagination @change="jumpPage" title="标题文字" :pageSize="pageSize" :total="total" :current="currentPage" :canClick="canFetch"></uni-pagination>
		 	<view class="cu-list menu card-menu margin-top-xl margin-bottom-xl shadow-lg">
		 		<view @tap="selectJddm(item)" class="cu-item arrow" v-for="(item,index) in jddmList" :key="index">
		 			<view class="content">
		 				
		 				<text class="text-grey">{{item.dy||item.itemName||item.mpmc||item.jwhmc||item.jzmc}}</text>
		 			</view>
		 		</view>
		 	</view>
		 </scroll-view>
	<!-- 消息提示组件 -->
	<message ref="Message" :duration="2000" background></message>	
	</view> 
</template>

<script>
	import uniPagination from '@/components/uni-pagination/uni-pagination.vue'
	import config from '@/common/config.js'
	import req from '@/common/req.js'
	export default {
		components: {uniPagination},
		data() {
			return {
				// 是否显示籍贯内容
				showPicker:true,
				jg:"广东省广州市海珠区",//选择籍贯绑定变量
				hjdzData: ['广东省', '广州市', '海珠区'],//默认籍贯地址
				
				// checkbox是否租客 默认false
				isCheckZuke:false,
				
				// 双向绑定数据-用于数据回显
				xm:'',//姓名
				zjhm:'',//证件号码
				lxdh:'',//联系电话
				
				// 是否租客
				isTenant:0,
				
				// 选项中没有我的房屋地址 默认false
				isHomeAddress:false,
				
				// 是否在穗checkbox 默认false
				isCheckSui:false,
				alwaysInGz:0, //是否在穗1  否0
				date: this.$custom.getYMD(),
				returnTime:this.$custom.getYMD(),//返穗日期
				
				// +--------------------
				// |返穗交通工具下拉数据集合
				// +--------------------
				vehicleList:['大巴','火车','自驾','飞机','其他'],
				vehicle:"",//反穗交通提交字段
				vehicleIndex:-1,//下拉下标
				
				// 切换modal显示
				modalName:null,
				
				jwhArr:void 0,
				workAddress:'',
				vehicleNum:'',
				index2:-1,
				jwh:'',
				jwhName:'',
				jwhSearch:'',
				mph:'',
				mpSearch:'',
				dongSearch:'',
				taoSearch:'',
				jz:'',
				jzName:'',
				jddm:'',
				jddmName:'',
				dongName:'',
				taoName:'',
				mpName:'',
				mp:'',
				dong:'',
				tao:'',
				
				canFetch:true,
				total:0,
				
				jddmList:[],
				jzList:[],
				currentPage:1,
				pageSize:20,
				jddmSearch:'',
				jzSearch:'',
				index: -1,
				
				status:'',
				
				// 登记数据
				registerData:"",
			};
		},
		onLoad() {
			// 获取登记数据
			let registerData = this.$store.state.registerData;
			// 回显数据
			if(!this.$custom.isEmpty(registerData)){
				this.xm = registerData.xm;//姓名
				this.zjhm = registerData.zjhm;//证件号码
				this.lxdh = registerData.lxdh;//联系电话
				this.registerData =  registerData;
			}else{
				this.registerData = "";
			}
		},
		created() {
			// this.getJwh();
		},
		methods: {
			// 提交请求
			formSubmit(e){
				let data = e.detail.value;
				console.log(data);
				if(this.$custom.isEmpty(data.xm)){
					this.$refs['Message'].error("请输入姓名");
					return false;
				};
				if(this.$custom.isEmpty(data.zjhm)){
					this.$refs['Message'].error("请输入身份证号");
					return false;
				};
				if(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(data.zjhm) === false){
					this.$refs['Message'].error("身份证输入不合法");
					return false;
				};
				if(this.$custom.isEmpty(data.lxdh)){
					this.$refs['Message'].error("请输入联系电话");
					return false;
				};
				//如果是租客 1租客  0 不是租客
				if(data.isTenant == 1){
					if(data.renterName == ''){
						this.$refs['Message'].error("请输入房东姓名");
						return false;
					};
					if(data.renterPhone == ''){
						this.$refs['Message'].error("请输入房东电话");
						return false;
					};
					if (!(/^1[3|4|5|6|7|8|9]\d{9}$/.test(data.renterPhone) || /^0\d{2,3}-?\d{7,8}$/.test(data.renterPhone) ) ) {
						this.$refs['Message'].error("请输入正确的房东电话");
					    return false;
					};
				}
				
				if(this.jz == ''){
					this.$refs['Message'].error("请选择街镇");
					 return false;
				};
				if(this.jwh == ''){
					this.$refs['Message'].error("请选择居委会");
					 return false;
				};
				// 如果没有选择居住详址
				if(!this.isHomeAddress){
					data.jddm = this.jddm;
					data.jddmName = this.jddmName;
					data.mpid = this.mp;
					data.mph = this.mph;
					data.dy = this.dy;
					data.zhid = this.dong;
					data.fhid = this.tao;	
					if(this.$custom.isEmpty(this.jddm)){
						this.$refs['Message'].error("请选择街路巷");
						return false;
					};
					if(this.$custom.isEmpty(this.mph)){
						this.$refs['Message'].error("请选择门牌号");
						return false;
					};
					if(this.$custom.isEmpty(this.dy)){
						this.$refs['Message'].error("请选择单元");
						return false;
					};
				}else {
					if(this.$custom.isEmpty(data.selfCompiledAddress)){
						this.$refs['Message'].error("请填写居住详址");
						return false;
					};
				}
				// 如果没有勾选一直在穗,就验证   1在穗  0不在穗
				if(data.alwaysInGz == 0){
					if(this.$custom.isEmpty(this.date)){
						this.$refs['Message'].error("请选择返穗日期");
						return false;
					};
					if(this.$custom.isEmpty(data.departAddress)){
						this.$refs['Message'].error("请输入出发地");
						return false;
					};
					if(this.$custom.isEmpty(data.vehicle)){
						this.$refs['Message'].error("请选择返穗交通工具");
						return false;
					};
				}else{
					// 清空反穗日期
					data.returnTime = "";
				}
				// 证件号码转大写
				data.zjhm = data.zjhm.toUpperCase();
				
				// 街镇信息
				data.jz = this.jz;
				data.jzName = this.jzName;
				data.jwh = this.jwh;
				data.jwhName = this.jwhName;
				data.workAddress = this.workAddress;
				// data.vehicle = (Number(this.index2) + 1);
				
				data.openId = this.$store.state.openId;
				
				// 加载动画
				uni.showLoading({});
				
				let _this = this;
				//如果是首次登记
				if(!this.registerData.checkStatus == 1){
					// 发起请求
					req.http('save',data,'post').then(data=>{
						uni.hideLoading();
						if(data.appCode == 1){
							this.$refs['Message'].success("登记成功");
							// 保存openid到状态
							this.$store.dispatch('refreshRegisterStatus',1);
							let timeout = setTimeout(function() {
								// 如果是管理员
								if(_this.$store.state.userType == 1){
									_this.$routes.redTo("/pages/index/manager");
								}else{
									_this.$routes.redTo("/pages/index/index");
								}
								clearTimeout(timeout);
							}, 2000);
						}else{
							_this.$refs['Message'].error(data.appMsg);
						}
					});
				}else{	
					// 增加识别id
					data.id = this.registerData.id;
					req.http('updateMyPassReport',data,'post').then(data=>{
						uni.hideLoading();
						if(data.appCode == 1){
							this.$refs['Message'].success("登记成功");
							// 保存登录到状态
							this.$store.dispatch('refreshRegisterStatus',1);
							let timeout = setTimeout(function() {
								// 如果是管理员
								if(_this.$store.state.userType == 1){
									_this.$routes.redTo("/pages/index/manager");
								}else{
									_this.$routes.redTo("/pages/index/index");
								}
								
								clearTimeout(timeout);
							}, 2000);
						}else{
							_this.$refs['Message'].error(data.appMsg);
						}
					});
				}
			},
			changeJz(){
				this.jz = '';
				this.jzName = '';
				this.jwh = '';
				this.jwhName = '';
				this.jddmName = '';
				this.jddm = '';
				this.mpName = '';
				this.mp = '';
				this.dong = '';
				this.dongName = '';
				this.tao = '';
				this.taoName = '';
				this.dy = '';
			},
			changeJwh(){
				this.jwh = '';
				this.jwhName = '';
				this.jddmName = '';
				this.jddm = '';
				this.mpName = '';
				this.mp = '';
				this.dong = '';
				this.dongName = '';
				this.tao = '';
				this.taoName = '';
				this.dy = '';
			},
			changeJlx(){
				this.jddmName = '';
				this.jddm = '';
				this.mpName = '';
				this.mp = '';
				this.dong = '';
				this.dongName = '';
				this.tao = '';
				this.taoName = '';
				this.dy = '';
			},
			changeDong(){
				// this.jddmName = '';
				// this.jddm = '';
				this.mpName = '';
				this.mp = '';
				this.dong = '';
				this.dongName = '';
				this.tao = '';
				this.taoName = '';
				this.dy = '';
			},
			changeTao(){
				// this.jddmName = '';
				// this.jddm = '';
				// this.mpName = '';
				// this.mp = '';
				// this.dong = '';
				// this.dongName = '';
				this.tao = '';
				this.taoName = '';
				this.dy = '';
			},
			selectJddm(item){
				if(this.status == 'jz'){
					this.jzName = item.jzmc;
					this.jz = item.jzdm;
				this.jddm = '';
				this.jddmName = '';
				this.jddmSearch = '';
				this.modalName = null;
				this.mp = '';
				this.mph = '';
				this.mpSearch = '';
				this.dong = '';
				this.dongName = '';
				this.dongSearch = '';
				this.tao = '';
				this.taoSearch = '';
				this.taoName = '';
				}
				if(this.status == 'jwh'){
					 this.jwhName = item.jwhmc;
					 this.jwh = item.jwhdm;
				this.jddm = '';
				this.jddmName ='';
				this.jddmSearch = '';
				this.modalName = null;
				this.mp = '';
				this.mph = '';
				this.mpSearch = '';
				this.dong = '';
				this.dongName = '';
				this.dongSearch = '';
				this.tao = '';
				this.taoSearch = '';
				this.taoName = '';
				}
				if(this.status == 'jddm'){
				this.jddm = item.itemCode;
				this.jddmName = item.itemName;
				this.jddmSearch = '';
				this.modalName = null;
				this.mp = '';
				this.mph = '';
				this.mpSearch = '';
				this.dong = '';
				this.dongName = '';
				this.dongSearch = '';
				this.tao = '';
				this.taoSearch = '';
				this.taoName = '';
				}
				if(this.status == 'mp'){
				this.mp = item.mpid;
				this.mph = item.mph;
				this.mpName = item.mpmc;
				this.mpSearch = '';
				this.modalName = null;
				this.dong = '';
				this.dongName = '';
				this.dongSearch = '';
				this.tao = '';
				this.taoSearch = '';
				this.taoName = '';
				}
				if(this.status == 'dong'){
				this.dong = item.zhid;
				this.mp = item.mpid;
				this.mph = item.mph;
				// this.mph = item.mph;
				this.dongName = item.mpmc;
				this.mpSearch = '';
				this.modalName = null;
				// this.dong = '';
				// this.dongName = '';
				this.dongSearch = '';
				this.tao = '';
				this.taoSearch = '';
				this.taoName = '';
				}
				if(this.status == 'tao'){
				this.tao = item.fhid;
				this.dy = item.dy;
				
				// this.mph = item.mph;
				this.taoName = item.dy;
				this.taoSearch = '';
				this.modalName = null;
				}
			},
			searchJz(){
				this.jddmList = [];
				this.currentPage = 1;
				this.total = 0;
				this.status = 'jz';
				this.getJz();
			},
			searchJwh(){
				if(this.jz == ''){
					this.$refs['Message'].error("请先选择街镇");
					return
				}
				this.jddmList = [];
				this.currentPage = 1;
				this.total = 0;
				this.status = 'jwh';
				this.getJwh2();
			},
			searchJddm(){
				if(this.jz == ''){
					this.$refs['Message'].error("请先选择街镇");
					return
				}
				this.jddmList = [];
				this.currentPage = 1;
				this.total = 0;
				this.status = 'jddm';
				this.getJddm();
			},
			changeMp(){
				
				this.mpName = '';
				this.mp = '';
				this.dy = '';
				this.dong = '';
				this.dongName = '';
				this.tao = '';
				this.taoName = '';
			},
			selectMp(item){
				this.mp = item.mpid;
				this.mph = item.mph;
				this.mpName = item.mpmc;
				this.mpSearch = '';
				this.modalName = null;
			},
			searchMp(){
				this.total = 0;
				this.jddmList = [];
				this.currentPage = 1;
				this.status = 'mp';
				this.getMp();
			},
			searchDong(){
				// console.log(this.jddm)
				if(this.jddm == ''){
					// uni.showToast({title:"请先选择街路巷",icon:'none'});
					this.$refs['Message'].error("请先选择街路巷	");
					return
				}
				this.total = 0;
				this.jddmList = [];
				this.currentPage = 1;
				this.status = 'dong';
				this.getDong();
			},
			searchTao(){
				
				if(this.dong == ''){
					// uni.showToast({title:"请先选择门牌号",icon:'none'});
					this.$refs['Message'].error("请先选择门牌号");
					return
				}
				this.total = 0;
				this.jddmList = [];
				this.currentPage = 1;
				this.status = 'tao';
				this.getTao();
			},
			jumpPage(e){
				if(this.canFetch){
					this.canFetch = false;
					this.currentPage = e.current;
					if(this.status == 'jddm')this.getJddm();
					if(this.status == 'mp')this.getMp();
					if(this.status == 'dong')this.getDong();
					if(this.status == 'tao')this.getTao();
				}
				
			},
			showModal(e) {
				this.modalName = e.currentTarget.dataset.target
			},
			hideModal(e) {
				this.modalName = null
			},
			tabSelect(e) {
				this.TabCur = e.currentTarget.dataset.id;
				this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60
			},
			getJz(){
			  uni.showLoading({});
			  // console.log(this.jddmSearch)
			  let data = {};
			  data.pageSize = this.pageSize;
			  data.currentPage = this.currentPage;
			  data.jzName = this.jzSearch;
			  req.http('getJz',data,'post').then(data=>{
			  this.total = data.count||data.length;
			  this.currentPage = data.currentPage||1;
			  	// console.log(data)
			  this.jddmList = data.data||[];
			  	 uni.hideLoading();
				 this.canFetch = true;
			  });
			  this.modalName = 'viewModal';
			},
			getJwh2(){
				let data = {};
				data.pageSize = this.pageSize;
				data.currentPage = this.currentPage;
				data.jz =this.jz;
				// data.jwhName = this.jwhSearch;
				uni.showLoading({});
				// this.loading();
				req.http('getJwh',data,'post').then(data=>{
					// console.log(data)
				this.total = data.count||data.length;
				this.currentPage = data.currentPage||1;
					// console.log(data)
				this.jddmList = data.data||[];
					 uni.hideLoading();
								 this.canFetch = true;
				});
				this.modalName = 'viewModal';
				 
			},
			getJwh(){
				uni.showLoading({});
			    // this.loading();
				req.http('getJwh',{},'post').then(data=>{
					// console.log(data)
					let tempRes = [];
					let tempRes2 = {};
					for(let i =0;i<data.data.length;i++){
						tempRes.push(data.data[i].jwhmc);
						tempRes2[data.data[i].jwhmc] = data.data[i].jwhdm;
					};
					this.jwhArr = tempRes2;
					 this.picker = tempRes;
					 uni.hideLoading();
				});
			   },
			   getJddm(){
				   uni.showLoading({});
				   // console.log(this.jddmSearch)
				   let data = {};
				   data.pageSize = this.pageSize;
				   data.currentPage = this.currentPage;
				   data.jddmName = this.jddmSearch;
				   data.jz = this.jz;
				   req.http('getJddm',data,'post').then(data=>{
				   this.total = data.count||data.length;
				   this.currentPage = data.currentPage||1;
				   	// console.log(data)
				   this.jddmList = data.dataInfo||[];
				   	 uni.hideLoading();
					 this.canFetch = true;
				   });
				   this.modalName = 'viewModal';
			   },
			   getMp(){
				   uni.showLoading({});
			   				   // console.log(this.jddmSearch)
			   				   let data = {};
			   				   data.pageSize = this.pageSize;
			   				   data.currentPage = this.currentPage;
			   				   data.mpmc = this.mpSearch;
							   data.jddm = this.jddm;
			   				   req.http('getMpid',data,'post').then(data=>{
			   				   this.total = data.count||data.length;
			   				   this.currentPage = data.currentPage||1;
			   				   	// console.log(data)
			   				   this.jddmList = data.dataInfo||[];
			   				   	 uni.hideLoading();
			   					 this.canFetch = true;
			   				   });
			   				   this.modalName = 'viewModal';
			   },
			   getDong(){
				   uni.showLoading({});
			   				   // console.log(this.jddmSearch)
			   				   let data = {};
			   				   data.pageSize = this.pageSize;
			   				   data.currentPage = this.currentPage;
			   				   data.mpmc = this.dongSearch;
			   				   data.jddm = this.jddm;
			   				   req.http('getZhid',data,'post').then(data=>{
			   				   this.total = data.count||data.length;
			   				   this.currentPage = data.currentPage||1;
			   				   	// console.log(data)
			   				   this.jddmList = data.dataInfo||[];
			   				   	 uni.hideLoading();
			   					 this.canFetch = true;
			   				   });
			   				   this.modalName = 'viewModal';
			   },
			   getTao(){
				   uni.showLoading({});
			   				   // console.log(this.jddmSearch)
			   				   let data = {};
			   				   data.pageSize = this.pageSize;
			   				   data.currentPage = this.currentPage;
			   				   data.dy = this.taoSearch;
			   				   data.zhid = this.dong;
			   				   req.http('getFhid',data,'post').then(data=>{
			   				   this.total = data.count||data.length;
			   				   this.currentPage = data.currentPage||1;
			   				   	// console.log(data)
			   				   this.jddmList = data.dataInfo||[];
			   				   	 uni.hideLoading();
			   					 this.canFetch = true;
			   				   });
			   				   this.modalName = 'viewModal';
			   },
			PickerChange(e) {
				// console.log(e.detail.value)
				if(e.detail.value == -1){
					this.index = 0;
				}else{
					this.index = e.detail.value
				}
				
			},
			PickerChange2(e) {
				if(e.detail.value == -1){
					this.index2 = 0;
				}else{
					this.index2 = e.detail.value
				}
			},
			//---------------下拉框事件开始------------
			bindDropChange(e){
				let dropIndex = e.detail.value;//下标位置
				let dropName =  e.currentTarget.dataset.name;//下拉框识别名称
				switch(dropName){
					case 'departAddress'://籍贯
						this.jg = dropIndex;
						this.hjdzData = dropIndex;
						break;
					case 'date'://返穗日期
						this.date = dropIndex;
						this.returnTime = dropIndex;
						break;
					case 'vehicle'://返穗交通工具
						this.vehicle = parseInt(dropIndex) + 1;
						this.vehicleIndex = dropIndex;
						break;
				}
				
			},
			//---------------下拉框事件结束------------
			
			//---------------籍贯事件start------------
			// 清空籍贯
			clearAddress(){
				// 切换隐藏内容
				this.showPicker = false;
				this.jg = "";
			},
			// 点击籍贯内容切换显示
			swiperShow(){
				// 切换显示内容
				this.showPicker = true;
				this.jg = this.hjdzData.join("");
			},
			//--------------籍贯事件end----------
			
			// --------------checkbox事件开始-----------
			//  是否有居住地址checkbox
			checkboxHomeChange(e){
				let value = e.detail.value;
				// 1勾选  0没勾选
				this.isHomeAddress = value.length>0 ? true : false;
			},
			//  一直在穗checkbox
			checkboxSuiChange(e){
				let value = e.detail.value;
				// 1在穗  0不在穗
				this.isCheckSui = value.length>0 ? 1 : 0;
				this.alwaysInGz = this.isCheckSui;
			},
			//  是否租客checkbox
			checkboxZukeChange(e){
				let value = e.detail.value;
				// 1租客  0不是租客
				this.isCheckZuke = value.length>0 ? 1 : 0;
				this.isTenant = this.isCheckZuke;
			}
		}
	}
</script>

<style lang="scss">
	page{
		// 行区域
		.cu-form-group{
			// label宽度 
			.title{
				min-width: calc(5em + 15px);
			}
			// 文字对齐
			input{text-align: right;}
			// 必填标识红色
			.require-ico:after{
				color: red;
				content: ' * ';
				font-size: 24rpx;
			}
			// 隐藏输入框
			.h-input{
				display: none;
			}
			// 指定没有箭头
			&.none-right-arrow{
				// 隐藏箭头
				uni-picker::after,
				picker::after{
					display: none;
				}
				uni-picker,
				picker{
					height: 50px;
					view{
						height: 50px;
					}
				}
			}
			// 地址输入框
			.text5{
				color: #555;
			}
			
		}
		
		.DrawerPage {
			position: fixed;
			width: 100vw;
			height: 100vh;
			left: 0vw;
			background-color: #f1f1f1;
			transition: all 0.4s;
		}
		
		.DrawerPage.show {
			transform: scale(0.9, 0.9);
			left: 85vw;
			box-shadow: 0 0 60upx rgba(0, 0, 0, 0.2);
			transform-origin: 0;
		}
		
		.DrawerWindow {
			position: absolute;
			width: 85vw;
			height: 100vh;
			left: 0;
			top: 0;
			transform: scale(0.9, 0.9) translateX(-100%);
			opacity: 0;
			pointer-events: none;
			transition: all 0.4s;
			padding: 100upx 0;
			background-color: #f1f1f1;
		}
		
		.DrawerWindow.show {
			transform: scale(1, 1) translateX(0%);
			opacity: 1;
			pointer-events: all;
		}
		
		.DrawerClose {
			position: absolute;
			width: 40vw;
			height: 100vh;
			right: 0;
			top: 0;
			color: transparent;
			padding-bottom: 30upx;
			display: flex;
			align-items: flex-end;
			justify-content: center;
			background-image: linear-gradient(90deg, rgba(0, 0, 0, 0.01), rgba(0, 0, 0, 0.6));
			letter-spacing: 5px;
			font-size: 50upx;
			opacity: 0;
			pointer-events: none;
			transition: all 0.4s;
		}
		
		.DrawerClose.show {
			opacity: 1;
			pointer-events: all;
			width: 15vw;
			color: #fff;
		}
		
		.DrawerPage .cu-bar.tabbar .action button.cuIcon {
			width: 64upx;
			height: 64upx;
			line-height: 64upx;
			margin: 0;
			display: inline-block;
		}
		
		.DrawerPage .cu-bar.tabbar .action .cu-avatar {
			margin: 0;
		}
		
		.DrawerPage .nav {
			flex: 1;
		}
		
		.DrawerPage .nav .cu-item.cur {
			border-bottom: 0;
			position: relative;
		}
		
		.DrawerPage .nav .cu-item.cur::after {
			content: "";
			width: 10upx;
			height: 10upx;
			background-color: currentColor;
			position: absolute;
			bottom: 10upx;
			border-radius: 10upx;
			left: 0;
			right: 0;
			margin: auto;
		}
		
		.DrawerPage .cu-bar.tabbar .action {
			flex: initial;
		}
	}
</style>
