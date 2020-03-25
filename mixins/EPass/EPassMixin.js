const mixin = {
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
			
			// 证件类型
			zjlx: '',
			zjlxIndex: -1,
			zjlxList: [],
	
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
			addressTypeList: ['居住地址', '工作地址', '来访地址', '其他地址'],
	
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
	
			// 授权角色
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
			confirmInputData: '',
	
			// 近期旅居史
			travelRegionClass: '', // 提交值, 逗号隔开的 travelRegionClassList 的 value
			travelRegionClassName: '', // 提交值, 逗号隔开的 travelRegionClassList 的 name
			travelRegionClassList: [{
				value: 1,
				name: '武汉',
				checked: false
			}, {
				value: 2,
				name: '湖北(不包含武汉)',
				checked: false
			}, {
				value: 6,
				name: '温州市',
				checked: false
			}, {
				value: 3,
				name: '中国港澳台地区',
				checked: false
			}, {
				value: 4,
				name: '中国大陆其他省(自治区)市',
				checked: false
			}, {
				value: 5,
				name: '国外',
				checked: false
			}],
	
			// 个人健康状况
			symptoms: '',
			symptomsName: '',
			symptomsIndex: -1,
			symptomsList: [{
				value: 0,
				name: '无'
			}, {
				value: 11,
				name: '发热37.5 ℃以下'
			}, {
				value: 12,
				name: '发热37.5 ℃（含）以上'
			}, {
				value: 13,
				name: '干咳'
			}],
			
			// 是否常住广州
			residentFlag: '',
			residentFlagName: '',
			residentFlagIndex: -1,
			residentFlagList: [{
				value: 1,
				name: '是'
			}, {
				value: 2,
				name: '否'
			}],
			
			// 授权照片base64
			sqPic: '',
			// 回显图片
			fid: ''
	
		}
	},
	computed: {
		// 授权角色为房东或租客时候,不显示选项中没有我的房屋地址
		canShowHomeAddress() {
			if (this.sqdx == 0 || this.sqdx == 1) {
				return false
			} else {
				return true
			}
		}
	},
	watch: {
		// 为防止数据问题, 每次授权角色为房东或租客时候, isHomeAddress 都回到默认值 false
		canShowHomeAddress(val) {
			this.isHomeAddress = false
		}
	},
	methods: {
		// 回显数据
		dataDisplay(registerData) {
			this.registerData = registerData[0]
			this.xm = this.registerData.xm //姓名
			this.zjlx = this.registerData.zjlx	// 证件类型
			// 回显证件类型滚动选择器 start
			this.zjlxIndex = this.zjlxList.findIndex(({
				dictCode
			}, index, arr) => {
				return dictCode == this.zjlx
			})
			// 回显证件类型滚动选择器 end
			this.zjhm = this.registerData.zjhm //证件号码
			this.lxdh = this.registerData.lxdh //联系电话
			this.jg = this.registerData.jg // 籍贯
			this.isTenant = this.registerData.isTenant // 是否租客
			if (this.isTenant == 1) {
				this.isCheckZuke = true // 勾选为租客
				this.renterName = this.registerData.renterName // 房东姓名
				this.renterPhone = this.registerData.renterPhone // 房东电话
			} else if (this.isTenant == 0) {
				this.isCheckZuke = false // 不勾选租客
			}
			this.selfCompiledAddress = this.registerData.selfCompiledAddress // 居住详址
			this.selfCompiledAddress ? this.isHomeAddress = true : this.isHomeAddress = false // 居住详址勾选框回显
			this.workAddress = this.registerData.workAddress // 工作地址
			this.sqdx = this.registerData.sqdx // 授权角色
			// 回显授权角色滚动选择器 start
			this.sqdxIndex = this.sqdxList.findIndex(({
				value,
				name
			}, index, arr) => {
				return value == this.sqdx
			})
			this.sqdxName = this.sqdxList[this.sqdxIndex].name
			// 回显授权角色滚动选择器 end
			this.alwaysInGz = this.registerData.alwaysInGz // 是否一直在穗 0 => 否 1 => 是
			if (this.alwaysInGz == 0) {
				this.isCheckSui = false
				this.returnTime = this.registerData.returnTime.split(' ')[0] // 返穗时间
				this.cfd = this.registerData.departAddress // 出发地
				this.vehicle = this.registerData.vehicle
				// 回显返穗交通工具滚动选择器 start
				this.vehicleIndex = this.vehicle - 1
				// 回显返穗交通工具滚动选择器 end
				this.vehicleNum = this.registerData.vehicleNum // 车牌号码
			} else if (this.alwaysInGz == 1) {
				this.isCheckSui = true
			}
			this.fid = this.registerData.fid	// 回显图片
			this.symptoms = this.registerData.symptoms	// 个人健康状况
			this.symptomsName = this.registerData.symptomsName
			// 回显个人健康状况滚动选择器 start
			this.symptomsIndex = this.symptomsList.findIndex(({
				value
			}, index, arr) => {
				return value == this.symptoms
			})
			// 回显个人健康状况滚动选择器 end
			this.residentFlag = this.registerData.residentFlag	// 是否常住广州
			this.residentFlagName = this.registerData.residentFlagName
			// 回显常住广州滚动选择器 start
			this.residentFlagIndex = this.residentFlagList.findIndex(({
				value
			}, index, arr) => {
				return value == this.residentFlag
			})
			// 回显常住广州滚动选择器 end
			// 回显近期旅居史滚动选择器 start
			this.travelRegionClass = this.registerData.travelRegionClass
			this.travelRegionClassName = this.registerData.travelRegionClassName
			this.travelRegionClassFmt()
			// 回显近期旅居史滚动选择器 start
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
		
		// ----搜索门牌号
		searchMp() {
			// 重置分页参数
			this.resetPageStr()
			// 更改状态
			this.status = 'mp'
			// 加载门牌数据
			this.loadMp()
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
				case 'zjlx':
					this.zjlxIndex = dropIndex //显示的值
					this.zjlx = this.zjlxList[this.zjlxIndex].dictCode //提交的值
					break
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
				case 'sqdx': // 授权角色
					this.sqdxIndex = dropIndex
					this.sqdx = this.sqdxList[dropIndex].value
					this.sqdxName = this.sqdxList[dropIndex].name
					break
				case 'addressType': // 地址类型
					this.addressTypeIndex = dropIndex
					this.addressType = this.addressTypeList[this.addressTypeIndex] //提交的值
					break
				case 'symptoms':	// 个人健康状况
					this.symptomsIndex = dropIndex
					const data = this.symptomsList[this.symptomsIndex]
					this.symptoms = data.value.toString() //提交的值
					this.symptomsName = data.name.toString() //提交的值
					break
				case 'residentFlag':	// 是否常住广州
					this.residentFlagIndex = dropIndex
					this.residentFlag = this.residentFlagList[this.residentFlagIndex].value //提交的值
					this.residentFlagName = this.residentFlagList[this.residentFlagIndex].name //提交的值
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
			switch (this.status) {
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
		},
		// 打开多选下拉框
		openEPassCheckbox() {
			this.$refs.EPassCheckbox.open()
		},
		// 获取下拉框选中的 data
		getCheckboxData(val) {
			this.travelRegionClass = val.value
			this.travelRegionClassName = val.name
		},
		// 获取 choose-image 组件传出来的 img的 base64
		getImgSrcBase64(val) {
			this.sqPic = val
		},
		// 格式化回显的近期旅游史
		travelRegionClassFmt() {
			const arr = this.travelRegionClass.split(',')
			for(const [key, value] of this.travelRegionClassList.entries()) {
				for(const i of arr) {
					if (i == value.value) {
						value.checked = true
					}
				}
			}
		}
	}
}

export default mixin
