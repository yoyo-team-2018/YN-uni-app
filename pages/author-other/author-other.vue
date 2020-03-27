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
				<!-- 证件类型 -->
				<view class="cu-form-group">
					<view class="title require-ico">证件类型</view>
					<picker @change="bindDropChange" data-name="zjlx" :value="zjlxIndex" :range="zjlxList" range-key="dictValue"
					 :disabled="disabledType">
						<view class="picker" :class="disabledType ? 'disabledBg' : ''">
							{{zjlxIndex>-1?zjlxList[zjlxIndex].dictValue:'请选择'}}
						</view>
					</picker>
					<!-- 隐藏证件类型提交 -->
					<input type="text" class="h-input" name="zjlx" :value="zjlx" />
				</view>
				<!-- 证件号码 -->
				<view class="cu-form-group">
					<view class="title require-ico">证件号码</view>
					<input v-model="zjhm" type="idcard" name="zjhm" placeholder="请输入" :class="disabledType ? 'disabledBg' : ''"
					 :disabled="disabledType"></input>
					<!-- <input value="430725198508152171" type="text" name="zjhm"  placeholder="请输入"></input> -->
				</view>
				<!-- 籍贯 -->
				<view class="cu-form-group">
					<view class="title require-ico">籍贯</view>
					<PickerRegion mode="region" name="jg" @change-picker="setChangePicker" ClearBtnFlag="true" :echo="jg"></PickerRegion>
					<!-- 隐藏籍贯提交 -->
					<input type="text" class="h-input" name="jg" :value="jg" />
				</view>
				<!-- 联系电话 -->
				<view class="cu-form-group">
					<view class="title require-ico">联系电话</view>
					<input :value="lxdh" type="text" name="lxdh" placeholder="请输入"></input>
					<!-- <input value="18823837917" type="text" name="lxdh"  placeholder="请输入"></input> -->
				</view>
				<!-- 授权角色 -->
				<view class="cu-form-group">
					<view class="title require-ico">授权角色</view>
					<picker @change="bindDropChange" data-name="sqdx" range-key="name" :range="sqdxList" :value="sqdxIndex">
						<view class="picker">
							{{sqdxIndex>-1?sqdxList[sqdxIndex].name:'请选择'}}
						</view>
					</picker>
					<!-- 隐藏授权角色提交 -->
					<input type="text" class="h-input" name="sqdx" :value="sqdx" />
				</view>
				<!-- 是否租客checkbox -->
				<view class="cu-form-group">
					<view class="title text-blue">我是租客</view>
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
				<view v-if="canShowHomeAddress" class="cu-form-group">
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
					<textarea name="selfCompiledAddress" maxlength="100" placeholder="请输入您的房屋地址" :value="selfCompiledAddress"></textarea>
				</view>
				<!-- 工作地址 -->
				<view class="cu-form-group">
					<view class="title">工作地址</view>
					<input type="text" placeholder="请输入" name="workAddress" v-model="workAddress"></input>
				</view>
				<!-- 是否居住多个地址 -->
				<view class="cu-form-group">
					<view class="title require-ico">是否居住多个地址</view>
					<picker @change="bindDropChange" data-name="sftz" range-key="name" :range="sftzList" :value="sqdxIndex">
						<view class="picker">
							{{sftzList[sftzIndex].name}}
						</view>
					</picker>
					<!-- 隐藏是否居住多个地址提交 -->
					<input type="text" class="h-input" name="sftz" :value="sftz" />
				</view>
				<!-- 授权进门照片 -->
				<view class="cu-form-group">
					<view class="title longTitle require-ico">授权进门照片</view>
					<view class="img-tips">该图片用于人脸识别门禁开门，请务必上传本人照片并保证图片中头像清晰！</view>
					<choose-image @imgSrcBase64="getImgSrcBase64" :echo="fid" />
					<!-- 隐藏授权进门照片提交 -->
					<input type="text" maxlength="-1" class="h-input" name="sqPic" :value="sqPic" />
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
					<PickerRegion mode="region" name="cfd" @change-picker="setChangePicker" ClearBtnFlag="true" :echo="cfd"></PickerRegion>
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
				<view class="action margin-top">
					<text class="cuIcon-titles">近期状况</text>
				</view>
				<!-- 个人健康状况 -->
				<view class="cu-form-group margin-top">
					<view class="title require-ico">个人健康状况</view>
					<picker @change="bindDropChange" data-name="symptoms" :range="symptomsList" range-key="name" :value="symptoms">
						<view class="picker">
							{{symptomsIndex>-1?symptomsList[symptomsIndex].name:'请选择'}}
						</view>
					</picker>
					<!-- 隐藏个人健康状况提交 -->
					<input type="text" class="h-input" name="symptoms" :value="symptoms" />
					<input type="text" class="h-input" name="symptomsName" :value="symptomsName" />
				</view>
				<!-- 是否常住广州 -->
				<view class="cu-form-group">
					<view class="title require-ico">是否常住广州</view>
					<picker @change="bindDropChange" data-name="residentFlag" :range="residentFlagList" range-key="name" :value="residentFlag">
						<view class="picker">
							{{residentFlagIndex>-1?residentFlagList[residentFlagIndex].name:'请选择'}}
						</view>
					</picker>
					<!-- 隐藏是否常住广州提交 -->
					<input type="text" class="h-input" name="residentFlag" :value="residentFlag" />
					<input type="text" class="h-input" name="residentFlagName" :value="residentFlagName" />
				</view>
				<!-- 近期旅居史 -->
				<view class="cu-form-group">
					<view class="title require-ico">近期旅居史</view>
					<view class="mask" @click="openEPassCheckbox"></view>
					<view class="content">
						<EPassCheckbox ref="EPassCheckbox" :items="travelRegionClassList" @getCheckboxData="getCheckboxData" :echoName="travelRegionClassName" />
					</view>
					<!-- 隐藏近期旅居史提交 -->
					<input type="text" class="h-input" name="travelRegionClass" :value="travelRegionClass" />
					<input type="text" class="h-input" name="travelRegionClassName" :value="travelRegionClassName" />
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
					<input class="uni-input search-input" confirm-type="search" v-model="confirmInputData" placeholder="搜索" @confirm="SearchConfirm" />
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
	import PickerRegion from '@/components/Picker-region.vue'
	import EPassCheckbox from '@/components/EPass-checkbox.vue'
	import ChooseImage from '@/components/choose-image.vue'
	import config from '@/common/config.js'
	import req from '@/common/req.js'
	import EPassMixin from '../../mixins/EPass/EPassMixin.js'
	import EPassLoadDataMixin from '../../mixins/EPass/EPassLoadDataMixin.js'
	import {
		mapState
	} from 'vuex'
	export default {
		components: {
			uniPagination,
			PickerRegion,
			ChooseImage,
			EPassCheckbox
		},
		mixins: [EPassMixin, EPassLoadDataMixin],
		computed: mapState([
			'authorOtherData'
		]),
		onLoad(val) {;
			(async () => {
				const listData = this.authorOtherData
				// 传入 id 二次登记, 无 id 首次登记
				if (listData.hasOwnProperty('id')) {
					this.id = listData.id
					uni.setNavigationBarTitle({
						title: '修改用户授权信息'
					});
				}
				// 初始加载街镇
				await this.getDropJz()
				// 初始加载证件类型
				await this.getZjlx()
				await this.getSqdx()

				// 回显数据
				if (!this.$custom.isEmpty(listData)) {
					// 数据回显
					this.dataDisplay(listData, async () => {
						// 地址类型 start
						this.addressType = listData.addressType
						this.addressTypeIndex = this.addressTypeList.findIndex((item, index, arr) => {
							return item == this.addressType
						})
						// 地址类型 end
						// 街镇 start
						this.jzCode = listData.jz
						this.jzName = listData.jzName
						this.jzIndex = this.jzList.findIndex(({
							jzmc,
							jzdm
						}, index, arr) => {
							return jzdm == this.jzCode
						})
						// 街镇 end

						// 居委会 start
						await this.getDropJwh()
						this.jwhCode = listData.jwh
						this.jwhName = listData.jwhName
						this.jwhIndex = this.jwhList.findIndex(({
							jwhmc,
							jwhdm
						}, index, arr) => {
							return jwhdm == this.jwhCode
						})
						// 居委会 end

						if (!listData.canShowHomeAddress && listData.isHomeAddress) { // 授权角色为房东或租客 且 选项中没有我的地址
							this.selfCompiledAddress = listData.selfCompiledAddress
						} else {
							// 街路巷
							this.jddm = listData.jddm
							this.jddmName = listData.jddmName
							// 门牌号
							this.mp = listData.mpid
							this.mph = listData.mph
							this.dong = listData.zhid
							this.dongName = listData.jddmName + listData.mph
							// 单元
							this.tao = listData.fhid
							this.taoName = listData.dy
						}
					})
					// 打开禁用
					this.disabledType = true
				}
			})()

		},
		methods: {
			// 提交请求
			formSubmit(e) {
				let data = e.detail.value
				console.log(data)
				if (this.$custom.isEmpty(data.xm)) {
					this.$refs['Message'].error('请输入姓名')
					return false
				}
				if (this.$custom.isEmpty(data.zjlx)) {
					this.$refs['Message'].error('请选择证件类型')
					return false
				}
				if (this.$custom.isEmpty(data.zjhm)) {
					this.$refs['Message'].error('请输入证件号码')
					return false
				}
				if (data.zjlx == '01') {
					if (
						/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(data.zjhm.trim()) === false
					) {
						this.$refs['Message'].error('身份证输入不合法')
						return false
					}
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
					this.$refs['Message'].error('请选择授权角色')
					return false
				}
				if (this.$custom.isEmpty(this.fid) && this.$custom.isEmpty(this.sqPic)) {
					this.$refs['Message'].error('请选择授权图片')
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
				if (this.$custom.isEmpty(data.symptoms)) {
					this.$refs['Message'].error('请选择个人健康状况')
					return false
				}
				if (this.$custom.isEmpty(data.residentFlag)) {
					this.$refs['Message'].error('请选择是否常住广州')
					return false
				}
				if (this.$custom.isEmpty(data.travelRegionClass)) {
					this.$refs['Message'].error('请选择近期旅游史')
					return false
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
				if (this.id == '') {
					req.http('savePassLinkByAdmin', data, 'post').then(data => {
						uni.hideLoading()
						if (data.appCode == 1) {
							this.$refs['Message'].success('登记成功')
							// 保存openid到状态
							// this.$store.dispatch('refreshRegisterStatus', 1)
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
					req.http('updatePassLinkByAdmin', data, 'post').then(data => {
						uni.hideLoading()
						if (data.appCode == 1) {
							this.$refs['Message'].success('修改成功')
							// 保存openid到状态
							let timeout = setTimeout(() => {
								// const compList = getCurrentPages()
								// const comp = compList[compList.length - 2]
								// comp.$vm.loadData()
								this.$routes.navBack()
								clearTimeout(timeout)
							}, 2000)
						} else {
							this.$refs['Message'].error(data.appMsg)
						}
					})
				}
			},
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
			position: relative;

			// label宽度
			.title {
				min-width: calc(5em + 15px);
			}

			.longTitle {
				min-width: calc(5em + 45px)
			}

			.img-tips {
				color: red;
				font-size: 24rpx;
			}

			.content {
				flex: 1;
				text-align: right;
			}

			.mask {
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				z-index: 10;
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
