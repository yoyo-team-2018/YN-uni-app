module.exports = {
    /**
     * 判断是否为空 
     * @param v [判断的值]
     */
	isEmpty : function (v){
		switch (typeof v) {
			case 'undefined':
				return true;
			case 'string':
				if (module.exports.trim(v).length == 0) return true;
				break;
			case 'boolean':
				if (!v) return true;
				break;
			case 'number':
				if (0 === v) return true;
				break;
			case 'object':
				if (null === v) return true;
				if (undefined !== v.length && v.length == 0) return true;
				for ( var k in v) {
					return false;
				}
				return true;
				break;
		}
		return false;
	},
	/**
	 * 判断参数类型 
	 * @param basic [判断的值]
	 */
	isType : function(basic) {
		var type = Object.prototype.toString.call(basic);
		switch(type) {
			case '[object Object]':
				return '1';
			case '[object String]':
				return '2';
			case '[object Array]':
				return '3';
			case '[object Function]':
				return '4';
			default:
				return false;
		}
	},
	// 去除空格
	trim : function(basic){
		return basic.replace(/\s+/g,'');;
	},
	/*
	* 数组/字符串  去重复(重复的值保留一个)
	* @param basic [数组/字符串]
	*/
	clearRepeatData : function(basic){
		var index = this.isType(basic);
		switch(index){
			// 字符串
			case '2':
				var hash=[],basic = basic.split(",");
				for (var i = 0; i < basic.length; i++) {
					if(hash.indexOf(basic[i])==-1){
						hash.push(basic[i]);
					}
				}
				return hash.join(",");	
				break;
			// 数组
			case '3':
				var hash=[];
				for (var i = 0; i < basic.length; i++) {
					 if(hash.indexOf(basic[i])==-1){
						hash.push(basic[i]);
					 }
				}
				return hash;												
				break;
		}
	},
	/*
	* 数组排序
	* @param basic [数组]
	* @param index [1/数字 2/中文 3/英文]
	*/
	sort : function(basic,index){
		switch(index){
			// 数字排序
			case 1:
				basic.sort(function(a,b){return a - b;});
				break;
			// 纯中文排序
			case 2:
				basic.sort(function compareFunction(a, b) {return a.localeCompare(b,"zh");});
				break;
			// 纯字母
			case 3:
				basic.sort(function(a,b){return a.localeCompare(b)});
				break;
		}
	},
	/*
	* 字符串转大写
	* @param basic [字符串]
	* @param flag  [默认true全部转大写  false首字母转大写]
	*/
	toUpperCase : function(basic,flag){
		if(this.isEmpty(flag) && flag !=false) flag = true;
		if(flag) return basic.toUpperCase();
		var newarr,newarr1; 
		newarr =basic.toLowerCase().split(" ");
		for(var i=0;i<newarr.length;i++){
			newarr[i] = newarr[i][0].toUpperCase()+newarr[i].substring(1,newarr[i].length);
		}
		newarr1 = newarr.join(" ");
		return newarr1;
	},
	/*
	* 生成随机数
	* @param length [随机数长度]
	* @param index [随机数类型1,2数字,3小写,4大写,5大小写,6大写数字,7小写数字,8大小写数字]
	*/
	getRandom : function(length,index){
		var result = [];
		switch (index) {
			case 1:
				str = '1234567890';
			break;
			case 2:
				str = 'abcdefghijklmnopqrstuvwxyz';
			break;
			case 3:
				str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
			break;
			case 4:
				str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
			break;
			case 5:
				str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
			break;
			case 6:
				str = 'abcdefghijklmnopqrstuvwxyz1234567890';
			break;
			default:
				str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
			break;
		}
		var str = str.split("");
		for(var i = 0; i < length ; i++) {
			var arr = i>0? arr : str;
			var index = Math.ceil(Math.random()*parseInt(arr.length-1));
			var addStr = arr[index];
			arr.splice(index,1);
			result.push(addStr);
		}
		return result.join(",");
	},
	/*
	* 获取身份证相关信息
	* @param basic [身份证号码]
	* @param separator [返回的日期以""隔开,默认为空]
	*/
	getIDCard : function(basic,separator){
	  if(this.isEmpty(separator)) separator = "";
		if(basic.length != 15 || basic.length != 18) return "身份证号码格式不正确";
		var csrqStr="",year,month,csrq,xb;
		if(basic.length == 15){
			csrqStr = basic.substr(6,6);
			year = "19"+csrqStr.substr(0,2);
			month = csrqStr.substr(2,2);
			day = csrqStr.substr(4);
			xb = basic.substr(14,1)%2==0?"2":"1";
		}else{
			csrqStr = basic.substr(6,8);
			year = csrqStr.substr(0,4);
			month = csrqStr.substr(4,2);
			day = csrqStr.substr(6);
			xb = basic.substr(16,1)%2==0?"2":"1";
		}
		return {
			csrq:year+separator+month+separator+day,
			xb:xb==1?'男':'女'
		}
	},
	// 获取年月日
	getYMD:function(){
		let date = new Date();
		let y = date.getFullYear();
		let m = (date.getMonth()+1).toString().padStart(2,'0');
		let d = date.getDate().toString().padStart(2,'0');
		return y+"-"+m+"-"+d;
	},
	//判断保留1位小数
	numberCheck:function (val) {
		var str = val;
		var len1 = str.substr(0, 1);
		var len2 = str.substr(1, 1);
		//如果第一位是0，第二位不是点，就用数字把点替换掉
		if (str.length > 1 && len1 == 0 && len2 != ".") {
			str = str.substr(1, 1);
		}
		//第一位不能是.
		if (len1 == ".") {
			str = "";
		}
		//限制只能输入一个小数点
		if (str.indexOf(".") != -1) {
			var str_ = str.substr(str.indexOf(".") + 1);
			if (str_.indexOf(".") != -1) {
			  str = str.substr(0, str.indexOf(".") + str_.indexOf(".") + 1);
			}
		}
		//正则替换，保留数字和小数点
		str = (str.match(/^\d*(\.?\d{0,1})/g)[0]) || null
		return str;
	}
	
}