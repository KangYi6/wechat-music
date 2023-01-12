// 实现rich-text富文本中图片宽度最大100%
function formatContent (html) { 
	// 去掉img标签里的style、width、height属性
	let content_data = html.replace(/<img[^>]*>/gi,function(match,capture){
		match = match.replace(/style="[^"]+"/gi, '').replace(/style='[^']+'/gi, '');
		match = match.replace(/width="[^"]+"/gi, '').replace(/width='[^']+'/gi, '');
		match = match.replace(/height="[^"]+"/gi, '').replace(/height='[^']+'/gi, '');  return match;
	}); 
	// 修改所有style里的width属性为max-width:100%
	content_data = content_data.replace(/style="[^"]+"/gi,function(match,capture){
		match = match.replace(/width:[^;]+;/gi, 'max-width:100%;').replace(/width:[^;]+;/gi, 'max-width:100%;');  return match;
	}); 
	// 去掉<br/>标签
	content_data = content_data.replace(/<br[^>]*\/>/gi, ''); // img标签添加style属性：max-width:100%;height:auto
	content_data = content_data.replace(/\<img/gi, '<img style="max-width:100%;height:auto;display:block;margin:10px auto;"'); return content_data;
} 

export {
	formatContent
};