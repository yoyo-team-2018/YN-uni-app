<template>
	<view>
		<scroll-view scroll-y class="DrawerPage" :class="modalName=='viewModal'?'show':''">
			<form @submit="formSubmit" @reset="formReset">
				<view class="action margin-top">
					<text class="cuIcon-titles text-blue"></text>个人信息
				</view>
				<!-- 姓名 -->
				<view class="cu-form-group margin-top">
					<view class="title require-ico">姓名</view>
					<input :value="xm" type="text" name="xm" placeholder="请输入" :class="disabledType ? 'disabledBg' : ''" :disabled="disabledType"></input>
					<!-- <input value="胖虎" type="text" name="xm"  placeholder="请输入"></input> -->
				</view>
				<!-- 身份证号 -->
				<view class="cu-form-group">
					<view class="title require-ico">身份证号</view>
					<input v-model="zjhm" type="idcard" name="zjhm" placeholder="请输入" :class="disabledType ? 'disabledBg' : ''" :disabled="disabledType"></input>
					<!-- <input value="430725198508152171" type="text" name="zjhm"  placeholder="请输入"></input> -->
				</view>
				<!-- 籍贯 -->
				<view class="cu-form-group">
					<view class="title require-ico">籍贯</view>
					<EPassPicker mode="region" name="jg" @change-picker="setChangePicker" ClearBtnFlag="true" :echo="jg"></EPassPicker>
					<!-- 隐藏籍贯提交 -->
					<input type="text" class="h-input" name="jg" :value="jg" />
				</view>
				<!-- 联系电话 -->
				<view class="cu-form-group">
					<view class="title require-ico">联系电话</view>
					<input :value="lxdh" type="text" name="lxdh" placeholder="请输入"></input>
					<!-- <input value="18823837917" type="text" name="lxdh"  placeholder="请输入"></input> -->
				</view>
				<!-- 是否租客checkbox -->
				<view class="cu-form-group">
					<view class="title text-blue">是否租客</view>
					<checkbox-group @change="checkboxZukeChange">
						<view class="cu-form-group">
							<checkbox :class="isCheckZuke?'checked':''" :checked="isCheckZuke?true:false" value="1"></checkbox>
						</view>
					</checkbox-group>
					<input type="text" class="h-input" name="isTenant" :value="isTenant" />
				</view>
				<!-- 房东姓名 -->
				<view v-if="isCheckZuke" class="cu-form-group">
					<view class="title require-ico">房东姓名</view>
					<input type="text" name="renterName" placeholder="请输入" v-model="renterName"></input>
				</view>
				<!-- 房东电话 -->
				<view v-if="isCheckZuke" class="cu-form-group">
					<view class="title require-ico">房东电话</view>
					<input type="text" name="renterPhone" placeholder="请输入" v-model="renterPhone"></input>
				</view>
				<!-- 地址类型 -->
				<view class="cu-form-group">
					<view class="title require-ico">地址类型</view>
					<picker @change="bindDropChange" data-name="addressType" :range="addressTypeList" :value="addressType">
						<view class="picker">
							{{addressTypeIndex>-1?addressTypeList[addressTypeIndex]:'请选择'}}
						</view>
					</picker>
					<!-- 隐藏地址类型提交 -->
					<input type="text" class="h-input" name="addressType" :value="addressType" />
				</view>
				<!-- 街镇 -->
				<view class="cu-form-group">
					<view class="title require-ico">街镇</view>
					<picker @change="bindDropChange" data-name="jz" :value="jzIndex" :range="jzDropList">
						<view class="picker">
							{{jzIndex>-1?jzDropList[jzIndex]:'请选择'}}
						</view>
					</picker>
					<!-- 隐藏街镇code提交 -->
					<input type="text" class="h-input" name="jz" :value="jzCode" />
					<!-- 隐藏街镇名称提交 -->
					<input type="text" class="h-input" name="jzName" :value="jzName" />
				</view>
				<!-- 居委会 -->
				<view class="cu-form-group">
					<view class="title require-ico">居委会</view>
					<picker @change="bindDropChange" data-name="jwh" :value="jwhIndex" :range="jwhDropList">
						<view class="picker">
							{{jwhIndex>-1?jwhDropList[jwhIndex]:'请选择'}}
						</view>
					</picker>
					<!-- 隐藏居委会code提交 -->
					<input type="text" class="h-input" name="jwh" :value="jwhCode" />
					<!-- 隐藏居委会名称提交 -->
					<input type="text" class="h-input" name="jwhName" :value="jwhName" />
				</view>
				<!-- 街镇 -->
				<!-- <view class="cu-form-group">
						<view class="title require-ico">街镇</view>
						<view v-if="jzName" class="text5">{{jzName}} </view>
						<input @input="changeJz" v-model="jzSearch"></input>
						<button @tap="searchJz" class="cu-btn bg-blue">搜索</button>
					</view> -->
				<!-- 居委会 -->
				<!-- <view class="cu-form-group">
						<view class="title require-ico">居委会</view>
						<view v-if="jwhName" class="text5">{{jwhName}} </view>
						<input @input="changeJwh" v-model="jwhSearch"></input>
						<button @tap="searchJwh" class="cu-btn  bg-blue">搜索</button>
					</view> -->
				<!-- 街路巷 -->
				<view v-if="!isHomeAddress" class="cu-form-group">
					<view class="title require-ico">街路巷</view>
					<view v-if="jddmName" class="text5">{{jddmName}}</view>
					<!-- <input @input="changeJlx" v-model="jddmSearch"></input> -->
					<button @tap="searchJddm" class="cu-btn  bg-blue">请选择</button>
				</view>
				<!-- 门牌号 -->
				<view v-if="!isHomeAddress" class="cu-form-group">
					<view class="title require-ico">门牌号</view>
					<view v-if="dongName" class="text5">{{dongName}}</view>
					<!-- <input @input="changeDong" v-model="dongSearch"></input> -->
					<button @tap="searchDong" class="cu-btn  bg-blue">请选择</button>
				</view>
				<!-- 单元 -->
				<view v-if="!isHomeAddress" class="cu-form-group">
					<view class="title require-ico">单元</view>
					<view v-if="taoName" class="text5">{{taoName}} </view>
					<!-- <input @input="changeTao" v-model="taoSearch"></input> -->
					<button @tap="searchTao" class="cu-btn  bg-blue">请选择</button>
				</view>
				<!-- 选项中没有我的房屋地址 -->
				<view class="cu-form-group">
					<view class="title text-blue">选项中没有我的房屋地址</view>
					<checkbox-group @change="checkboxHomeChange">
						<view class="cu-form-group">
							<checkbox :class="isHomeAddress?'checked':''" :checked="isHomeAddress?true:false" value="1"></checkbox>
						</view>
					</checkbox-group>
				</view>
				<!-- 居住详址 -->
				<view class="cu-form-group align-start" v-if="isHomeAddress">
					<view class="title require-ico">居住详址</view>
					<textarea name="selfCompiledAddress" maxlength="100" placeholder="请输入您的房屋地址" v-model="selfCompiledAddress"></textarea>
				</view>
				<!-- 工作地址 -->
				<view class="cu-form-group">
					<view class="title">工作地址</view>
					<input type="text" placeholder="请输入" name="workAddress" v-model="workAddress"></input>
				</view>
				<!-- 授权对象 -->
				<view class="cu-form-group">
					<view class="title require-ico">授权对象</view>
					<picker @change="bindDropChange" data-name="sqdx" range-key="name" :range="sqdxList" :value="sqdxIndex">
						<view class="picker">
							{{sqdxIndex>-1?sqdxList[sqdxIndex].name:'请选择'}}
						</view>
					</picker>
					<!-- 隐藏授权对象提交 -->
					<input type="text" class="h-input" name="sqdx" :value="sqdx" />
				</view>
				<view class="action margin-top">
					<text class="cuIcon-titles">返穗情况</text>
				</view>
				<!-- 是否在穗checkbox -->
				<view class="cu-form-group margin-top">
					<view class="title text-blue">一直在穗</view>
					<checkbox-group @change="checkboxSuiChange">
						<view class="cu-form-group">
							<checkbox :class="isCheckSui?'checked':''" :checked="isCheckSui?true:false" value="1"></checkbox>
						</view>
					</checkbox-group>
					<!-- 隐藏一直在穗提交 -->
					<input type="text" class="h-input" name="alwaysInGz" :value="alwaysInGz" />
				</view>
				<!-- 返穗日期 -->
				<view v-if="!isCheckSui" class="cu-form-group">
					<view class="title require-ico">返穗日期</view>
					<picker mode="date" :value="returnTime" @change="bindDropChange" data-name="date">
						<view class="picker">{{returnTime}}</view>
					</picker>
					<!-- 隐藏返穗日期提交 -->
					<input type="text" class="h-input" name="returnTime" :value="returnTime" />
				</view>
				<!-- 出发地 -->
				<view v-if="!isCheckSui" class="cu-form-group">
					<view class="title require-ico">出发地</view>
					<EPassPicker mode="region" name="cfd" @change-picker="setChangePicker" ClearBtnFlag="true" :echo="cfd"></EPassPicker>
					<!-- 隐藏出发地提交 -->
					<input type="text" class="h-input" name="departAddress" :value="cfd" />
				</view>
				<!-- 返穗交通工具 -->
				<view v-if="!isCheckSui" class="cu-form-group">
					<view class="title require-ico">返穗交通工具</view>
					<picker :value="vehicleIndex" :range="vehicleList" @change="bindDropChange" data-name="vehicle">
						<view class="picker">
							{{vehicleIndex>-1?vehicleList[vehicleIndex]:'请选择'}}
						</view>
					</picker>
					<!-- 隐藏返穗交通工具提交 -->
					<input type="text" class="h-input" name="vehicle" :value="vehicle" />
				</view>
				<!-- 车牌/车次/航班号 -->
				<view v-if="!isCheckSui" class="cu-form-group">
					<view class="title">车牌/车次/航班号</view>
					<input type="text" placeholder="请输入" name="vehicleNum" v-model="vehicleNum"></input>
				</view>
				<!-- 提交 -->
				<view class="padding">
					<button form-type="submit" class="cu-btn block bg-blue margin-tb-sm lg">提交</button>
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
			<view class="uni-common-mt">
				<view class="uni-form-item uni-column">
					<input class="uni-input search-input" v-model="confirmInputData" placeholder="搜索" @confirm="SearchConfirm" />
				</view>
			</view>
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
	import EPassPicker from '@/components/EPass-picker.vue'
	import config from '@/common/config.js'
	import req from '@/common/req.js'
	export default {
		components: {
			uniPagination,
			EPassPicker
		},
		data() {
			return {
				// 在onLoad时传入, 如果有, 意味是update或二次申请出入证, 没有就是第一次申请
				id: '',
				
				// 控制是否禁用
				disabledType: false,

				// 双向绑定数据-用于数据回显
				xm: '', // 姓名
				zjhm: '', // 证件号码
				lxdh: '', // 联系电话
				
				// 选择籍贯绑定变量
				jg: '', 

				// checkbox是否租客 默认false
				isCheckZuke: false,
				// 是否租客
				isTenant: 0,
				
				// 房东姓名和电话
				renterName: '',
				renterPhone: '',
				
				// 地址类型
				addressTypeIndex: -1,
				addressType: '',
				addressTypeList: ['居住地址','工作地址', '来访地址', '其他地址'],
				
				// 街镇下拉框
				jzDropList: [],
				jzList: [],
				jzCode: '',
				jzName: '',
				jzIndex: -1,
				
				// 居委会下拉框
				jwhDropList: [],
				jwhList: [],
				jwhCode: '',
				jwhName: '',
				jwhIndex: -1,
				
				// 街路巷参数
				jddm: '', //街路巷编码
				jddmName: '', //街路巷名称
				jddmSearch: '', //街路巷搜索名称
				
				// 门牌
				mp: '',
				mph: '',
				mpName: '',
				mpSearch: '',
				
				// 门牌号
				dong: '',
				dongName: '',
				dongSearch: '',
				
				// 单元
				tao: '',
				taoName: '',
				taoSearch: '',
				
				// 选项中没有我的房屋地址 默认false
				isHomeAddress: false,
				// 居住详址
				selfCompiledAddress: '',
				
				// 工作地址
				workAddress: '',
				
				// 授权对象
				sqdxIndex: -1,
				sqdx: -1,
				sqdxName: '',
				sqdxList: [{
						value: 1,
						name: '出租屋租客'
					},
					{
						value: 2,
						name: '出租屋房东'
					},
					{
						value: 0,
						name: '自住业主'
					}
				],

				//出发地
				cfd: '',

				// 是否在穗checkbox 默认false
				isCheckSui: false,
				alwaysInGz: 0, //是否在穗1  否0
				date: this.$custom.getYMD(),
				returnTime: this.$custom.getYMD(), //返穗日期

				// +--------------------
				// |返穗交通工具下拉数据集合
				// +--------------------
				vehicleList: ['大巴', '火车', '自驾', '飞机', '其他'],
				vehicle: '', //反穗交通提交字段
				vehicleIndex: -1, //下拉下标
				
				// 车牌/车次/航班号
				vehicleNum: '',

				// 切换modal显示
				modalName: null,

				// 分页切换按钮状态
				canFetch: true,

				// 分页数据集合
				jddmList: [],
				currentPage: 1, //当前页数
				total: 0, //总页数
				pageSize: 20, //每页显示数据行数
				status: '', //分页名字状态，用于判断当前分页显示的什么地址数据

				// 登记数据
				registerData: '',
				
				// 模糊搜索input存放值
				confirmInputData: ''

			}
		},
		onLoad(val) {
			if (val.hasOwnProperty('id')) this.id = val.id
			// 获取登记数据
			const registerData = this.$store.state.registerData
			// 回显数据
			if (!this.$custom.isEmpty(registerData)) {
			  // 数据回显
			  this.dataDisplay(registerData)
				this.disabledType = true
			} else {
			  this.registerData = ''
			}
			// 初始加载街镇
			this.getDropJz()
		},
		methods: {
			// 回显数据
			dataDisplay(registerData) {
				this.registerData = registerData[0]
				this.xm = this.registerData.xm	//姓名
				this.zjhm = this.registerData.zjhm	//证件号码
				this.lxdh = this.registerData.lxdh	//联系电话
				this.jg = this.registerData.jg	// 籍贯
				this.isTenant = this.registerData.isTenant	// 是否租客
				if (this.isTenant == 1) {
					this.isCheckZuke = true	// 勾选为租客
					this.renterName = this.registerData.renterName	// 房东姓名
					this.renterPhone = this.registerData.renterPhone	// 房东电话
				} else if (this.isTenant == 0) {
					this.isCheckZuke = false	// 不勾选租客
				}
				this.selfCompiledAddress = this.registerData.selfCompiledAddress	// 居住详址
				this.selfCompiledAddress ? this.isHomeAddress = true : this.isHomeAddress = false	// 居住详址勾选框回显
				this.workAddress = this.registerData.workAddress	// 工作地址
				this.sqdx = this.registerData.sqdx	// 授权对象
				// 回显授权对象滚动选择器 start
				this.sqdxIndex = this.sqdxList.findIndex(({ value, name }, index, arr) => {
					return value == this.sqdx
				})
				this.sqdxName = this.sqdxList[this.sqdxIndex].name
				// 回显授权对象滚动选择器 end
				this.alwaysInGz = this.registerData.alwaysInGz	// 是否一直在穗 0 => 否 1 => 是
				if (this.alwaysInGz == 0) {
					this.isCheckSui = false
					this.returnTime = this.registerData.returnTime.split(' ')[0]	// 返穗时间
					this.cfd = this.registerData.departAddress	// 出发地
					this.vehicle = this.registerData.vehicle
					// 回显返穗交通工具滚动选择器 start
					this.vehicleIndex = this.vehicle - 1
					// 回显返穗交通工具滚动选择器 end
					this.vehicleNum = this.registerData.vehicleNum	// 车牌号码
				} else if (this.alwaysInGz == 1) {
					this.isCheckSui = true
				}
			},
			// 提交请求
			formSubmit(e) {
				let data = e.detail.value
				console.log(data)
				if (this.$custom.isEmpty(data.xm)) {
					this.$refs['Message'].error('请输入姓名')
					return false
				}
				if (this.$custom.isEmpty(data.zjhm)) {
					this.$refs['Message'].error('请输入身份证号')
					return false
				}
				if (
					/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(data.zjhm) === false
				) {
					this.$refs['Message'].error('身份证输入不合法')
					return false
				}
				if (this.$custom.isEmpty(data.jg)) {
					this.$refs['Message'].error('请选择籍贯')
					return false
				}
				if (this.$custom.isEmpty(data.lxdh)) {
					this.$refs['Message'].error('请输入联系电话')
					return false
				}
				if (
					!(
						/^1[3|4|5|6|7|8|9]\d{9}$/.test(data.lxdh) ||
						/^0\d{2,3}-?\d{7,8}$/.test(data.lxdh)
					)
				) {
					this.$refs['Message'].error('请输入正确的联系电话')
					return false
				}
				//如果是租客 1租客  0 不是租客
				if (data.isTenant == 1) {
					if (data.renterName == '') {
						this.$refs['Message'].error('请输入房东姓名')
						return false
					}
					if (data.renterPhone == '') {
						this.$refs['Message'].error('请输入房东电话')
						return false
					}
					if (
						!(
							/^1[3|4|5|6|7|8|9]\d{9}$/.test(data.renterPhone) ||
							/^0\d{2,3}-?\d{7,8}$/.test(data.renterPhone) ||
							/^(0\d{2,3}\-)?([2-9]\d{6,7})+(\-\d{1,6})?$/.test(data.renterPhone)
						)
					) {
						this.$refs['Message'].error('请输入正确的房东电话')
						return false
					}
				}
				if (this.$custom.isEmpty(data.addressType)) {
					this.$refs['Message'].error('请选择地址类型')
					return false
				}
				if (this.$custom.isEmpty(this.jzCode)) {
					this.$refs['Message'].error('请选择街镇')
					return false
				}
				if (this.$custom.isEmpty(this.jwhCode)) {
					this.$refs['Message'].error('请选择居委会')
					return false
				}
				// 如果没有选择居住详址
				if (!this.isHomeAddress) {
					data.jddm = this.jddm
					data.jddmName = this.jddmName
					data.mpid = this.mp
					data.mph = this.mph
					data.dy = this.taoName
					data.mpmc = this.dongName
					data.zhid = this.dong
					data.fhid = this.tao
					if (this.$custom.isEmpty(this.jddm)) {
						this.$refs['Message'].error('请选择街路巷')
						return false
					}
					if (this.$custom.isEmpty(this.mph)) {
						this.$refs['Message'].error('请选择门牌号')
						return false
					}
					if (this.$custom.isEmpty(this.taoName)) {
						this.$refs['Message'].error('请选择单元')
						return false
					}
				} else {
					if (this.$custom.isEmpty(data.selfCompiledAddress)) {
						this.$refs['Message'].error('请填写居住详址')
						return false
					}
				}
				if (this.$custom.isEmpty(data.sqdx)) {
					this.$refs['Message'].error('请选授权对象')
					return false
				}
				// 如果没有勾选一直在穗,就验证   1在穗  0不在穗
				if (data.alwaysInGz == 0) {
					if (this.$custom.isEmpty(this.date)) {
						this.$refs['Message'].error('请选择返穗日期')
						return false
					}
					if (this.$custom.isEmpty(data.departAddress)) {
						this.$refs['Message'].error('请输入出发地')
						return false
					}
					if (this.$custom.isEmpty(data.vehicle)) {
						this.$refs['Message'].error('请选择返穗交通工具')
						return false
					}
				} else {
					// 清空反穗日期
					data.returnTime = ''
				}
				// 证件号码转大写
				data.zjhm = data.zjhm.toUpperCase()

				// openid
				data.openId = this.$store.state.openId
				// 加载动画
				uni.showLoading({
					title: '提交中!',
					mask: true
				})
				if(this.id == '') {
					req.http('save', data, 'post').then(data => {
						uni.hideLoading()
						if (data.appCode == 1) {
							this.$refs['Message'].success('登记成功')
							// 保存openid到状态
							this.$store.dispatch('refreshRegisterStatus', 1)
							let timeout = setTimeout(() => {
								// 如果是管理员
								if (this.$store.state.userType == 1) {
									this.$routes.redTo('/pages/index/manager')
								} else {
									this.$routes.redTo('/pages/index/index')
								}
								clearTimeout(timeout)
							}, 2000)
						} else {
							this.$refs['Message'].error(data.appMsg)
						}
					})
				} else {
					data.id = this.id
					req.http('updateMyPassLink', data, 'post').then(data => {
						uni.hideLoading()
						if (data.appCode == 1) {
							this.$refs['Message'].success('登记成功')
							// 保存openid到状态
							this.$store.dispatch('refreshRegisterStatus', 1)
							let timeout = setTimeout(() => {
								// 如果是管理员
								if (this.$store.state.userType == 1) {
									this.$routes.redTo('/pages/index/manager')
								} else {
									this.$routes.redTo('/pages/index/index')
								}
								clearTimeout(timeout)
							}, 2000)
						} else {
							this.$refs['Message'].error(data.appMsg)
						}
					})
				}
			},
			// 获取街镇下拉街镇
			async getDropJz() {
				let result = await this.$request.post(this.$api.getJz)
				if (result.appCode == 1) {
					let resultDropList = []
					result.data.forEach(item => {
						resultDropList.push(item.jzmc)
					})
					// 下拉框数据
					this.jzDropList = resultDropList
					// 下拉集合
					this.jzList = result.data
				}
			},
			// 获取居委会下拉街镇
			async getDropJwh() {
				let result = await this.$request.post(this.$api.getJwh, {
					jz: this.jzCode
				})
				if (result.appCode == 1) {
					let resultDropList = []
					result.data.forEach(item => {
						resultDropList.push(item.jwhmc)
					})
					// 下拉框数据
					this.jwhDropList = resultDropList
					// 下拉集合
					this.jwhList = result.data
				}
			},
			// 街路巷输入清空
			changeJlx() {
				this.jddmName = ''
				this.jddm = ''
				this.mpName = ''
				this.mp = ''
				this.dong = ''
				this.dongName = ''
				this.tao = ''
				this.taoName = ''
				this.dy = ''
			},
			// 门牌号输入清空
			changeDong() {
				this.mpName = ''
				this.mp = ''
				this.dong = ''
				this.dongName = ''
				this.tao = ''
				this.taoName = ''
				this.dy = ''
			},
			// 单元输入清空
			changeTao() {
				this.tao = ''
				this.taoName = ''
				this.dy = ''
			},
			// 选择分页行的地址
			selectJddm(item) {
				this.modalName = null //隐藏分页modal
				// 如果是街路巷
				if (this.status == 'jddm') {
					this.jddm = item.itemCode
					this.jddmName = item.itemName
					this.jddmSearch = ''
					// 清空门牌号
					this.mp = ''
					this.mph = ''
					this.mpSearch = ''
					// 清空栋
					this.dong = ''
					this.dongName = ''
					this.dongSearch = ''
					// 清空套
					this.tao = ''
					this.taoSearch = ''
					this.taoName = ''
				}
				// 如果是门牌
				if (this.status == 'mp') {
					this.mp = item.mpid
					this.mph = item.mph
					this.mpName = item.mpmc
					this.mpSearch = ''
					// 清空栋
					this.dong = ''
					this.dongName = ''
					this.dongSearch = ''
					// 清空套
					this.tao = ''
					this.taoSearch = ''
					this.taoName = ''
				}
				// 如果是栋
				if (this.status == 'dong') {
					this.dong = item.zhid
					this.mp = item.mpid
					this.mph = item.mph
					// this.mph = item.mph;
					this.dongName = item.mpmc
					this.mpSearch = ''
					// this.dong = '';
					// this.dongName = '';
					this.dongSearch = ''
					this.tao = ''
					this.taoSearch = ''
					this.taoName = ''
				}
				// 如果是套
				if (this.status == 'tao') {
					this.tao = item.fhid
					this.dy = item.dy
					// this.mph = item.mph;
					this.taoName = item.dy
					this.taoSearch = ''
				}
				this.confirmInputData = ''
			},
			// 重置分页参数
			resetPageStr() {
				// 置初始分页为1
				this.currentPage = 1
				// 置总页数为0
				this.total = 0
				// 清空分页数据
				this.jddmList = []
			},
			// 搜索街路巷地址
			searchJddm() {
				if (this.$custom.isEmpty(this.jzCode)) {
					this.$refs['Message'].error('请选择街镇')
					return false
				}
				// 重置分页参数
				this.resetPageStr()
				// 修改状态为jddm
				this.status = 'jddm'
				// 加载街路巷数据
				this.loadJddm()
			},
			// 加载街路巷数据
			async loadJddm() {
				uni.showLoading({})
				let data = {}
				data.pageSize = this.pageSize //每页显示数据条数
				data.currentPage = this.currentPage //起始页
				data.jddmName = this.jddmSearch //模糊搜索搜索名称
				data.jz = this.jzCode //街镇地址
				data.jwh = this.jwhCode //居委会地址
				// 请求
				let result = await this.$request.post(this.$api.getJddm, data)
				if (result.appCode == 1) {
					this.total = result.count || 1
					this.currentPage = result.currentPage || 1
					this.jddmList = result.dataInfo || []
					uni.hideLoading()
					// 判断是否有数据，点击下一页时会判断
					this.canFetch = true
				}
				// 显示modal
				this.modalName = 'viewModal'
			},
			// ----搜索门牌号
			searchMp() {
				// 重置分页参数
				this.resetPageStr()
				// 更改状态
				this.status = 'mp'
				// 加载门牌数据
				this.loadMp()
			},
			// ----加载门牌号数据
			async loadMp() {
				uni.showLoading({})
				let data = {}
				data.pageSize = this.pageSize
				data.currentPage = this.currentPage
				data.mpmc = this.mpSearch
				data.jddm = this.jddm
				// 请求
				let result = await this.$request.post(this.$api.getMpid, data)
				if (result.appCode == 1) {
					this.total = result.count
					this.currentPage = result.currentPage || 1
					this.jddmList = data.dataInfo || []
					uni.hideLoading()
					// 判断是否有数据，点击下一页时会判断
					this.canFetch = true
				}
				// 显示modal
				this.modalName = 'viewModal'
			},
			// 搜索门牌号地址
			searchDong() {
				if (this.$custom.isEmpty(this.jddm)) {
					this.$refs['Message'].error('请先选择街路巷')
					return false
				}
				// 重置分页参数
				this.resetPageStr()
				this.status = 'dong'
				this.loadDong()
			},
			// 加载门牌号地址
			async loadDong() {
				uni.showLoading({})
				let data = {}
				data.pageSize = this.pageSize
				data.currentPage = this.currentPage
				data.mpmc = this.dongSearch // 模糊搜索
				data.jddm = this.jddm
				data.jwh = this.jwhCode
				let result = await this.$request.post(this.$api.getZhid, data)
				if (result.appCode == 1) {
					this.total = result.count || 1
					this.currentPage = result.currentPage || 1
					this.jddmList = result.dataInfo || []
					uni.hideLoading()
					this.canFetch = true
				}
				this.modalName = 'viewModal'
			},
			// 搜索单元地址
			searchTao() {
				if (this.$custom.isEmpty(this.dong)) {
					this.$refs['Message'].error('请先选择门牌号')
					return false
				}
				// 重置分页参数
				this.resetPageStr()
				this.status = 'tao'
				this.loadTao()
			},
			// 加载单元地址
			async loadTao() {
				uni.showLoading({})
				let data = {}
				data.pageSize = this.pageSize
				data.currentPage = this.currentPage
				data.dy = this.taoSearch // 模糊搜索
				data.zhid = this.dong
				let result = await this.$request.post(this.$api.getFhid, data)
				if (result.appCode == 1) {
					this.total = result.count || 1
					this.currentPage = result.currentPage || 1
					this.jddmList = result.dataInfo || []
					uni.hideLoading()
					this.canFetch = true
				}
				this.modalName = 'viewModal'
			},
			// 获取来穗的人员信息, 传入人员的身份证
			async getPersonByZjhm() {
				uni.showLoading({
					title: '匹配数据中',
					mask: true
				})
				const {
					data,
					appCode
				} = await this.$request.post(
					this.$api.getPersonByZjhm, {
						zjhm: this.zjhm
					}
				)
				uni.hideLoading()
				if (appCode == 1) {
					if (data === '' || data === null) {
						return false
					}
					if (data.jz === this.jzCode) {
						// 居委会赋值
						this.jwhCode = data.jwh || ''
						this.jwhName = data.jwh_dict || ''
						// 居委会回显
						for (const [index, elem] of this.jwhList.entries()) {
							if (elem.jwhdm === data.jwh) {
								this.jwhIndex = index
							}
						}
						// 街路巷
						this.jddm = data.jddm || ''
						this.jddmName = data.jddm_dict || ''
						// 门牌号
						this.mp = data.mpid || ''
						this.mph = data.mpmc || ''
						this.dong = data.zhid || ''
						this.dongName = data.jddm_dict + data.mpmc || ''
						// 单元
						this.tao = data.fhid || ''
						this.taoName = data.dy || ''
					}
				}
			},
			// 点击分页
			jumpPage(e) {
				// 如果有数据
				if (this.canFetch) {
					this.canFetch = false
					// 当前页码
					this.currentPage = e.current
					// 加载街路巷
					if (this.status == 'jddm') this.loadJddm()
					// 门牌号
					if (this.status == 'mp') this.loadMp()
					// 门牌号
					if (this.status == 'dong') this.loadDong()
					// 单元
					if (this.status == 'tao') this.loadTao()
				}
			},

			//隐藏modal
			hideModal(e) {
				this.modalName = null
			},
			//---------------下拉框事件开始------------
			bindDropChange(e) {
				let dropIndex = e.detail.value //下标位置
				let dropName = e.currentTarget.dataset.name //下拉框识别名称
				switch (dropName) {
					case 'date': //返穗日期
						this.date = dropIndex //显示的值
						this.returnTime = dropIndex //提交的值
						break
					case 'vehicle': //返穗交通工具
						this.vehicle = parseInt(dropIndex) + 1 //提交的值
						this.vehicleIndex = dropIndex
						break
					case 'jz': //街镇
						this.jzIndex = dropIndex
						this.jzCode = String(this.jzList[dropIndex]['jzdm']) //提交的值
						this.jzName = String(this.jzList[dropIndex]['jzmc']) //提交的值

						// 清空居委会
						this.jwhIndex = -1
						this.jwhCode = ''
						this.jwhName = ''

						// 加载居委会
						this.getDropJwh()

						// 清空街路巷
						this.jddm = ''
						this.jddmName = ''
						this.jddmSearch = ''
						// 清空门牌号
						this.mp = ''
						this.mph = ''
						this.mpSearch = ''
						// 清空单元
						this.dong = ''
						this.dongName = ''
						this.dongSearch = ''

						this.tao = ''
						this.taoSearch = ''
						this.taoName = ''

						// 使用请求来穗的数据
						this.getPersonByZjhm()
						break
					case 'jwh': //居委会
						this.jwhIndex = dropIndex
						this.jwhCode = String(this.jwhList[dropIndex]['jwhdm']) //提交的值
						this.jwhName = String(this.jwhList[dropIndex]['jwhmc']) //提交的值
						// 清空街路巷
						this.jddm = ''
						this.jddmName = ''
						this.jddmSearch = ''
						// 清空门牌号
						this.mp = ''
						this.mph = ''
						this.mpSearch = ''
						// 清空单元
						this.dong = ''
						this.dongName = ''
						this.dongSearch = ''

						this.tao = ''
						this.taoSearch = ''
						this.taoName = ''
						break
					case 'sqdx': // 授权对象
						this.sqdxIndex = dropIndex
						this.sqdx = this.sqdxList[dropIndex].value
						this.sqdxName = this.sqdxList[dropIndex].name
						break
					case 'addressType': // 地址类型
						this.addressTypeIndex = dropIndex
						this.addressType = this.addressTypeList[this.addressTypeIndex] //提交的值
						break
				}
			},
			//---------------下拉框事件结束------------

			// --------------checkbox事件开始-----------
			//  是否有居住地址checkbox
			checkboxHomeChange(e) {
				let value = e.detail.value
				// 1勾选  0没勾选
				this.isHomeAddress = value.length > 0 ? true : false
			},
			//  一直在穗checkbox
			checkboxSuiChange(e) {
				// 1在穗  0不在穗
				this.isCheckSui = !this.isCheckSui
				this.isCheckSui ? this.alwaysInGz = 1 : this.alwaysInGz = 0
			},
			//  是否租客checkbox
			checkboxZukeChange(e) {
				// 1租客  0不是租客
				this.isCheckZuke = !this.isCheckZuke
				this.isCheckZuke ? this.isTenant = 1 : this.isTenant = 0
			},
			// 街路巷模糊搜索
			SearchConfirm(e) {
				const value = e.detail.value
				switch(this.status) {
					case 'jddm':
						this.jddmSearch = value
						this.searchJddm()
						break
					case 'dong':
						this.dongSearch = value
						this.searchDong()
						break
					case 'tao':
						this.taoSearch = value
						this.searchTao()
						break
				}
			},
			setChangePicker(val) {
				this[val.name] = val.ChangeArray
			}
		}
	}
</script>

<style lang="scss">
	page {
		.disabledBg {
			color: #a5a5a5;
		}
		// 行区域
		.cu-form-group {

			// label宽度
			.title {
				min-width: calc(5em + 15px);
			}

			// 文字对齐
			input {
				text-align: right;
			}

			// 必填标识红色
			.require-ico:after {
				color: red;
				content: ' * ';
				font-size: 24rpx;
			}

			// 隐藏输入框
			.h-input {
				display: none;
			}

			// 指定没有箭头
			&.none-right-arrow {

				// 隐藏箭头
				uni-picker::after,
				picker::after {
					display: none;
				}

				uni-picker,
				picker {
					height: 50px;

					view {
						height: 50px;
					}
				}
			}

			// 地址输入框
			.text5 {
				color: #555;
				overflow: hidden;
				white-space: nowrap;
				flex: 1;
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
			background-image: linear-gradient(90deg,
				rgba(0, 0, 0, 0.01),
				rgba(0, 0, 0, 0.6));
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
			content: '';
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

		.search-input {
			background-color: #fff;
			text-align: 2;
			padding: 0.5rem;
			margin: 0.8rem;
			border-radius: 0.5rem;
			height: unset;
		}
	}
</style>
