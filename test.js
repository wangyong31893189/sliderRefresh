define(function(require, exports, module) {
	var Slider=require("./sliderRefresh");
	var slider=new Slider({"id":"slider","weekName":"","scroll":true,"more":true,"style":"default","vScroll":true,"hScroll":false,onPullUp:function(){
		window.location.reload();
	},onPullDown:function() {
		var listArr=[];
		var length=slider.slider.children.length;
		for (var i = 0; i <4 ; i++) {
			listArr.push('<li class="new">新加测试拉动加载控件'+(length+i+1)+'</li>');
		}
		if(length>50){
			return;
		}
		slider.slider.innerHTML+=listArr.join("");
	}});
	slider.init();
	window.slider=slider;
});