var platform = uni.getSystemInfoSync().platform;
//获取设备MAC地址
function getMac() {
	var mac = "xxx-xxx-xxx-xxx"
	if (platform == 'ios') {
		return mac
	} else if (platform == 'android'){
		try{
			// 导入UIAlertView类
			//WifiManager
			var Context = plus.android.importClass("android.content.Context")
			var WifiManager = plus.android.importClass("android.net.wifi.WifiManager")
			var wifiManager = plus.android.runtimeMainActivity().getSystemService(Context.WIFI_SERVICE)
			var WifiInfo = plus.android.importClass("android.net.wifi.WifiInfo")
			var wifiInfo = wifiManager.getConnectionInfo()
			// mac = wifiInfo.getMacAddress()
			mac = wifiInfo.getBSSID().toUpperCase();
		} catch(e) {
			mac = 'windows'
		}
	} else {
		mac = 'windows'
	}
	return mac;	
}

//设备内存信息
function getMemorySize() {  
    var memoryInfo = '' 
    if (platform == 'ios') {
    	return 0
    } else  if (platform == 'android'){  
        var Context = plus.android.importClass("android.content.Context")
        var ActivityManager = plus.android.importClass("android.app.ActivityManager")
		var mi = new ActivityManager.MemoryInfo()
        var activityService = plus.android.runtimeMainActivity().getSystemService(Context.ACTIVITY_SERVICE)
        activityService.getMemoryInfo(mi)
        memoryInfo = mi.plusGetAttribute("availMem")
    } else {
		memoryInfo = 0
	}
    return memoryInfo  
}

/*获取内部总的存储空间*/  
function getTotalInternalMemorySize() {  
    var internalMemSize = 0;  
    if (platform == 'ios') {
    	return 0
    } else if (platform == 'android'){
        var environment = plus.android.importClass("android.os.Environment");  
        var statFs = plus.android.importClass("android.os.StatFs");  
        var files = plus.android.importClass("java.io.File");  

        var Files = environment.getDataDirectory();  
        var StatFs = new statFs(Files.getPath());  
        var blockSize = parseFloat(StatFs.getBlockSize());  
        var blockCount = parseFloat(StatFs.getBlockCount());  
        internalMemSize = blockSize * blockCount;  
    } else {
		internalMemSize = 0
	}  
    return internalMemSize;  
}

/*获取总内存*/  
function getTotalRamSize() {
	var ramSize = 0
	if (platform == 'ios') {

	} else if (platform == 'android') {
		var memInfo = '/proc/meminfo';  
		var temp = '',  
			ramSize = 0,  
			arrays, initMemory;  
		var fileReader = plus.android.importClass("java.io.FileReader");  
		var bufferedReader = plus.android.importClass("java.io.BufferedReader");  
		var FileReader = new fileReader(memInfo);  
		var BufferedReader = new bufferedReader(FileReader, 8192);  
		while ((temp = BufferedReader.readLine()) != null) {  
			if (-1 != temp.indexOf('MemTotal:')) {  
				var value = temp.replace(/[^0-9]/ig, "");  
				ramSize = Math.floor(parseInt(value) / (1024));  
			}  
		}
	} else {
		
	}
    return ramSize;  
}

/*获取CPU信息*/  
function getCpuInfo() {
    var cpuInfo = '/proc/cpuinfo';  
    var temp = '',  
        cpuHardware;  
    var fileReader = plus.android.importClass("java.io.FileReader");  
    var bufferedReader = plus.android.importClass("java.io.BufferedReader");  
    var FileReader = new fileReader(cpuInfo);  
    var BufferedReader = new bufferedReader(FileReader, 8192);  
    while ((temp = BufferedReader.readLine()) != null) {  
        if (-1 != temp.indexOf('Hardware')) {  
            cpuHardware = temp.substr(parseInt(temp.indexOf(":")) + 1);  
        }  
    }  
    return cpuHardware;  
}

/*获取CPU核数*/  
function getCpuCount() {  
    var Runtime = plus.android.importClass("java.lang.Runtime");  
    var cpuCount = Runtime.getRuntime().availableProcessors();  
    return cpuCount;  
}

/*获取应用本地版本号*/  
function versionCode() {
	if (platform == 'ios') {
		return 0
	} else if (platform == 'android') {
		plus.runtime.getProperty(plus.runtime.appid,function(info){
			// console.log(info)
			return info.versionCode
		}); 
	} else {
		return 0
	}
}

/**
 * 获取设备信息
 * mac MAC地址
 * memorysize 设备内存信息
 * totalinternalmemorysize  内部总的存储空间
 * totalramsize 获取总内存
 * cpuinfo CPU信息
 * cpucount CPU核数
 */
function getInfo(type){
	if (type == 'mac') {
		return getMac()
	} else if (type == 'memorysize') {
		return getMemorySize()
	} else if (type == 'totalinternalmemorysize') {
		return getTotalInternalMemorySize()
	} else if (type == 'totalramsize') {
		return getTotalRamSize()
	} else if (type == 'cpuinfo') {
		return getCpuInfo()
	} else if (type == 'cpucount') {
		return getCpuCount()
	} else if (type == 'versioncode') {
		return versionCode()
	}
}

/*获取WIFI列表 获取wifi都需要添加两个位置权限*/
function loadWifiInfo(){  
    var Context = plus.android.importClass("android.content.Context");  
    var WifiManager = plus.android.importClass("android.net.wifi.WifiManager")  
    var wifiManager = plus.android.runtimeMainActivity().getSystemService(Context.WIFI_SERVICE);  
    var List = plus.android.importClass("java.util.List");  
    var ArrayList = plus.android.importClass("java.util.ArrayList");  
    var ScanResult = plus.android.importClass("android.net.wifi.ScanResult");     
    var wifis = new ArrayList();  
    wifis = wifiManager.getScanResults();  
    return wifis;  
}

/*打开网络设置*/
function netSet() {
	if (isIos) {
		return '待完善';
	} else {
		var main = plus.android.runtimeMainActivity();
		var Intent = plus.android.importClass("android.content.Intent");
		var mIntent = new Intent('android.settings.WIFI_SETTINGS');
		main.startActivity(mIntent);
	}
}

export {
	getInfo,
	loadWifiInfo,
	netSet,
}
