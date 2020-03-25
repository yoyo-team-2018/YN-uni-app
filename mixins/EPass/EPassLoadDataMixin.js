const EPassLoadDataMixin = {
	methods: {
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
		// 获取证件类型字典
		async getZjlx(callback) {
			const {
				data
			} = await this.$request.post(
				this.$api.getZjlx
			)
			this.zjlxList = data
			callback()
		},
	}
}

export default EPassLoadDataMixin