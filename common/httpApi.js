// +------------------------------
// API接口配置文件
// +------------------------------

module.exports = {
	// +-------------------
	// |openid
	// +-------------------
	getOpenID:'wechat/getOpenID',//获取openid
	
	// +-------------------
	// |地址相关接口
	// +-------------------
	getJz:"passReport/getJz",//街镇
	getJwh:"passReport/getJwh",//居委会
	getJddm:"passReport/getJddm",//街路巷
	getMpid:"passReport/getMpid",//门牌号--
	getZhid:"passReport/getZhid",//门牌号
	getFhid:"passReport/getFhid",//单元
	getPersonByZjhm:"passReport/getPersonByZjhm",//获取来穗【人员信息】
	// +-------------------
	// |管理员相关接口
	// +-------------------
	isAdmittance:"passLink/isAdmittance",//扫码登记获取准入信息
	edit:"passLink/infoDetail",//获取审核人员信息
	checkList:"passLink/getCheckList",//根据姓名证件号码查审核人员
	passInApplet:"passLink/passInApplet",//审核出入证接口
	register:"passLink/register",//扫码登记入门
	getRegisterLog:"passReport/getRegisterLog",//管理员操作放行记录
	getCheckLog:"passReport/getCheckLog",//管理员操作审核记录
	
	
	// +-------------------
	// |用户相关接口
	// +-------------------
	getQCcode:"passLink/getQCcode",//获取用户二维码
	getMyRegisterLog:"passReport/getMyRegisterLog",//用户通行记录
	isAdmin:"passReport/isAdmin",//区分用户
	getMyInfo:"passLink/getMyInfo",//获取个人信息
}