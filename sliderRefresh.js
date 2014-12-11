define(function(require, exports, module) {

	function prefixStyle (style) {
	if ( vendor === '' ) return style;

	style = style.charAt(0).toUpperCase() + style.substr(1);
	return vendor + style;
}

var doc=document;
var m = Math,dummyStyle = doc.createElement('div').style,
	vendor = (function () {
		var vendors = 't,webkitT,MozT,msT,OT'.split(','),
			t,
			i = 0,
			l = vendors.length;

		for ( ; i < l; i++ ) {
			t = vendors[i] + 'ransform';
			if ( t in dummyStyle ) {
				return vendors[i].substr(0, vendors[i].length - 1);
			}
		}

		return false;
	})(),// Style properties
	cssVendor = vendor ? '-' + vendor.toLowerCase() + '-' : '',
	transform = prefixStyle('transform'),
	transitionProperty = prefixStyle('transitionProperty'),
	transitionDuration = prefixStyle('transitionDuration'),
	transformOrigin = prefixStyle('transformOrigin'),
	transitionTimingFunction = prefixStyle('transitionTimingFunction'),
	transitionDelay = prefixStyle('transitionDelay'),isTouchPad = (/hp-tablet/gi).test(navigator.appVersion),
			hasTouch = 'ontouchstart' in window && !isTouchPad,
			hasTransform = vendor !== false,
			hasTransitionEnd = prefixStyle('transition') in dummyStyle,

			RESIZE_EV = 'onorientationchange' in window ? 'orientationchange' : 'resize',
			START_EV = hasTouch ? 'touchstart' : 'mousedown',
			MOVE_EV = hasTouch ? 'touchmove' : 'mousemove',
			END_EV = hasTouch ? 'touchend' : 'mouseup',
			CANCEL_EV = hasTouch ? 'touchcancel' : 'touchcancel';
			TRNEND_EV = (function () {
				if ( vendor === false ){
					return false;
				}

				var transitionEnd = {
						''			: 'transitionend',
						'webkit'	: 'webkitTransitionEnd',
						'Moz'		: 'transitionend',
						'O'			: 'otransitionend',
						'ms'		: 'MSTransitionEnd'
					};

				return transitionEnd[vendor];
			})();
	var Slider=function(options){
		this.options={
			id:"slider",
			scroll:true,//是否需要滑动
			style:"default",//默认皮肤									
			//oneByOne:true,//是否需要 一月一月的滚动  true为需要  false为不需要
			container:"window",  //外层容器   默认为整个窗口   其它则填写对应的ID	
			debug:false,//是否开启调试模式		
			vScroll:true,//竖向
			hScroll:false,//横向 
			more:false,//是否显示加载更多按钮
			moreName:"点击加载更多",//显示加载更多按钮上的文字
			//header:false,//是否需要头部
			//headerName:"选择日期",//头部显示名称
			animateTime:500,//动画时间
			onPullStart:function(){
				console.log("执行拉动加载开始函数！");
			},
			onPullMove:function(){
				console.log("执行拉动加载移动函数！");
			},
			onPullEnd:function(){
				console.log("执行拉动加载结束函数！");
			},	
			onPullUp:function(){ //选择日期
				console.log("执行向上拉动加载函数！");
			},
			onPullDown:function(){
				console.log("执行向下拉动加载函数！");
			},loadMore:function() {//使用此函数请将参数scroll 设置为false  不允许滑动
				console.log("加载更多...");
			}
		};
		for(var i in options ){
			this.options[i]=options[i];
		}
		
		this.initFlag=false;//是否进行过初始化
		//this.init();
	}
	
	var Pos=function (){
		this.x=0;
		this.y=0;
	};
	var startPos=new Pos();
	var movePos=new Pos();
	var endPos=new Pos();
	
	function getViewSizeWithoutScrollbar(){//不包含滚动条 
		return { 
		width : document.body.offsetWidth, 
		height: document.documentElement.clientHeight
		};
	} 
	function getViewSizeWithScrollbar(){//包含滚动条 
		if(window.innerWidth){ 
			return { 
				width : window.innerWidth, 
				height: window.innerHeight 
			};
		}else if(document.documentElement.offsetWidth == document.documentElement.clientWidth){ 
			return { 
			width : document.documentElement.offsetWidth, 
			height: document.documentElement.offsetHeight 
			};
		}else{ 
			return { 
				width : document.documentElement.clientWidth + getScrollWith(), 
				height: document.documentElement.clientHeight + getScrollWith() 
			};
		} 
	}
	
	Slider.prototype={
		$:function(id){
			return typeof(id)==="object"?id:document.getElementById(id);
		},
		init:function(){
			var that=this;
			if(that.initFlag){
				return;
			}
			seajs.use("./"+that.options.style+".css");
			var slider=that.slider=that.$(that.options.id);			
			var unit=that.unit="width";
			var moveBy=that.moveBy="marginLeft";
			var moveStyleBy=that.moveStyleBy="margin-left";			
			if(that.options.vScroll){//竖向滚动
				unit=that.unit="heightt";
				moveBy=that.moveBy="marginTop";
				moveStyleBy=that.moveStyleBy="margin-top";
			}
			if(that.options.more){
				var elem=document.createElement("button");
				elem.setAttribute("class","slider_more");
				elem.setAttribute("id","slider_more");
				elem.innerHTML=that.options.moreName;
				that.slider.parentNode.appendChild(elem);
			}
			var wh={width:0,height:0};
			if(that.options.container==="window"){
				wh=getViewSizeWithoutScrollbar();
			}else{
				var container=that.$(that.options.container);
				if(container){
					wh={width:container.offsetWidth,height:container.offsetHeight};
				}
			}
			if(that.options.hScroll&&!that.options.vScroll){//横向滚动 true 并且竖向滚动为false
				browserWidth=that.browserWidth=that.options.containerWidth;
				if(!browserWidth){
					browserWidth=that.browserWidth=wh.width;			
				}
			}else if(!that.options.hScroll&&that.options.vScroll){//横向滚动 false 并且竖向滚动为 true
				browserWidth=that.browserWidth=that.options.containerHeight;
				if(!browserWidth){
					browserWidth=that.browserWidth=wh.height;		
				}
			}else{
				if(that.options.debug){					
					console.error("对不起，滚动方向请重新设置！");
				}
				slider.style.display="none";
				return false;
			}
			that.sliderType={"ease":"cubic-bezier(0.25, 0.1, 0.25, 1.0)","linear":"cubic-bezier(0.0, 0.0, 1.0, 1.0)","ease-in":"cubic-bezier(0.42, 0, 1.0, 1.0)","ease-out":"cubic-bezier(0, 0, 0.58, 1.0)",  "ease-in-out":"cubic-bezier(0.42, 0, 0.58, 1.0)"};
			that.sliderFunc=that.sliderType[that.options.scrollType];
			that.slider.style[transitionProperty] = that.options.useTransform ? cssVendor + 'transform' : moveStyleBy;
			that.slider.style[transitionDuration] =that.options.animateTime/1000+"s";
			that.slider.style[transformOrigin] = '0 0';
			if (that.options.useTransition){
				that.slider.style[transitionTimingFunction] =that.sliderFunc;		
			}
			
			slider.parentNode.style[unit]=browserWidth+"px";
			

			that.initFlag=true;			
			that.dataLoading=true;//有数据需要加载
			var scroll=that.options.scroll;
			if(scroll){			
				that._bind(START_EV,null,function(e){that.handlerEvent(e,that)});//绑定鼠标按下或触摸开始事件
				that._bind(MOVE_EV,null,function(e){that.handlerEvent(e,that)});//绑定鼠标移动或触摸移动事件
				that._bind(END_EV,null,function(e){that.handlerEvent(e,that)});//绑定鼠标弹上或触摸停止事件
				//that._bind("DOMMouseScroll",null,function(e){that.handlerEvent(e,that)});//绑定鼠标弹上或触摸停止事件
					//window.addEventListener('DOMMouseScroll', wheel, false);
					//window.onmousewheel = document.onmousewheel = wheel;
				/*注册事件*/
				if(document.addEventListener){
				    document.addEventListener('DOMMouseScroll',function(e){that.wheelFunc(e);},false);
				}//W3C
				window.onmousewheel=document.onmousewheel=function(e){
					that.wheelFunc(e);//IE/Opera/Chrome
				};
			}

			that.bindSliderEvent();
		},
		wheelFunc:function(e){
			var that=this;
		 	var direct=0;
			e=e || window.event;
			var delta=0;
		    if(e.wheelDelta){//IE/Opera/Chrome
      			delta=e.wheelDelta/120;
    		}else if(e.detail){//Firefox
        		delta=-e.detail/3;
        	}
        	that.wheelHandler(delta);
		},wheelHandler:function(delta){
			var that=this;
			var s = delta + ": ";
			var slider=that.slider;
			var moveBy=that.moveBy;
			var browserWidth=that.browserWidth;//=that.slider.parentNode.offsetHeight;
			var oHeight=0;
			if(that.options.hScroll){
				oHeight=slider.offsetWidth;
			}else{
				oHeight=slider.offsetHeight;
			}
			var left=parseFloat(slider.style[moveBy]);

			if(isNaN(left)){
				left=0;
			}
		    if (delta <0){
		    	if(that.options.debug){
		        	console.log(s +"您在向下滚……");		        
		    	}
		    }else{
		    	if(that.options.debug){
		    	 	console.log(s+"您在向上滚……");	
		    	}
		    }
		    left=left+delta;
		    if(left>0){
		    	left=0;
		    	if (that.options.onPullUp){that.options.onPullUp.call(that)};
		    }else{
		    	if(Math.abs(left)+browserWidth>oHeight){
		    		if(browserWidth>oHeight){
							left=0;
					}else{
						left=browserWidth-oHeight;					
					}
		    	}
		    	if(that.dataLoading){						
						if (that.options.onPullDown){that.options.onPullDown.call(that)};
				}
		    }
		    that.slider.style[transitionDuration] = that.options.animateTime/1000+"s";
			slider.style[moveBy]=left+"px";	    
		},
		show:function(){
			var that=this;
			that.slider.parentNode.style.display="block";
			//that.sliderBg.style.display="block";
			//that.reloadCalender(slider);
			//that.bindCalenderEvent(slider);
		},hide:function(){
			var that=this;
			that.slider.parentNode.style.display="none";
			//that.sliderBg.style.display="block";
			//that.reloadCalender(slider);
			//that.bindCalenderEvent(slider);
		},		
		bindSliderEvent:function(){//日历显示类型 是附加还是替换  append 附加   before 插入   replace替换
	    	var that=this;
			var slider_more=that.$("slider_more");
			if(slider_more){
				slider_more.onclick=function(){//执行加载更多函数
					if (that.options.loadMore){that.options.loadMore.call(that)};
				};
			}
			//that.bindCalenderEvent(slider);			
		},
		handlerEvent:function(e,that){
		    // var that=this;
			switch(e.type) {
				case START_EV:
					if (!hasTouch && e.button !== 0) return;
					that._start(e);
					break;
				case MOVE_EV: that._move(e); break;
				case END_EV:
				case CANCEL_EV: that._end(e); break;
			 //  case RESIZE_EV: that._resize(); break;
			   // case 'DOMMouseScroll': case 'mousewheel': that._wheel(e); break;
			   // case TRNEND_EV: that._transitionEnd(e); break;
			}
		},
		_start:function(e){  //开始事件
			var that=this;
			//clearInterval(that.intervalId);
			//e.preventDefault();
			that.isMoved=false;
			if(e.changedTouches){
				e=e.changedTouches[e.changedTouches.length-1];
			}
			var eX=startPos.x=e.clientX || e.pageX;
			var eY=startPos.y=e.clientY || e.pageY;			
			that.isMouseDown=true;
			if (that.options.onPullStart){that.options.onPullStart.call(that,e)};
		},
		_move:function(e){//
			var that=this;			
			e.preventDefault();
			var slider=that.slider;
			var moveBy=that.moveBy;
			if(that.isMouseDown){
				if(e.changedTouches){
					e=e.changedTouches[e.changedTouches.length-1];
				}
				var eX=movePos.x=e.clientX || e.pageX;
				var eY=movePos.y=e.clientY || e.pageY;
				var left=parseFloat(slider.style[moveBy]);
				if(isNaN(left)){
					left=0;
				}
				if(that.options.hScroll){
					left=left+(eX-startPos.x);
					startPos.x=eX;
				}else{
					left=left+(eY-startPos.y);
					startPos.y=eY;
				}
				if(Math.abs(left)>10){
					that.isMoved=true;
				}else{					
					that.isMoved=false;
				}
				that.slider.style[transitionDuration] = "0";
				slider.style[moveBy]=left+"px";
				//console.log("---------"+that.slider.scrollTop+"----"+(eY-startPos.y));
				if (that.options.onPullMove){that.options.onPullMove.call(that,e)};
			}
		},
		_end: function (e) {
			var that=this;
			var slider=that.slider;
			var moveBy=that.moveBy;
			var browserWidth=that.browserWidth;//=that.slider.parentNode.offsetHeight;
			var oHeight=0;
			if(that.isMoved){
				e.preventDefault();			
				that.isLoaded=false;//是否有加载数据
				if(that.options.hScroll){
					oHeight=slider.offsetWidth;
				}else{
					oHeight=slider.offsetHeight;
				}
				
				if(e.changedTouches){
					e=e.changedTouches[e.changedTouches.length-1];
				}
				var eX=movePos.x=e.clientX || e.pageX;
				var eY=movePos.y=e.clientY || e.pageY;
				var left=parseFloat(slider.style[moveBy]);
				if(isNaN(left)){
					left=0;
				}
				//var parentHeight=that.slider.parentNode.offsetHeight;
				var scrollHeight=browserWidth+Math.abs(left);
				if(that.options.hScroll){
					left=left+(eX-startPos.x);					
				}else{
					left=left+(eY-startPos.y);					
				}
				if(left>0){
					left=0;
					
					if (that.options.onPullUp){that.options.onPullUp.call(that,e)};
				}else{
					if(Math.abs(left)+browserWidth>oHeight){
						if(browserWidth>oHeight){
							left=0;
						}else{
							left=browserWidth-oHeight;					
						}
					}
					if(that.dataLoading){						
						if (that.options.onPullDown){that.options.onPullDown.call(that,e)};
					}
				} 
				/*if(that.options.oneByOne&&that.options.hScroll){
					if(Math.abs(left%browserWidth/parseFloat(browserWidth))>=0.5){
						left=Math.floor(left/browserWidth)*browserWidth;
						if(that.options.debug){
							console.log("大于");
						}
					}else{
						left=Math.ceil(left/browserWidth)*browserWidth;
						if(that.options.debug){
							console.log("小于");
						}
					}
				}*/
				/*if(that.isLoaded&&that.isPrev&&that.options.hScroll){
					//left+=browserWidth;
				}else if(that.isLoaded&&that.isNext&&that.options.hScroll){
					left-=browserWidth;
					
				}*/
				/*if(that.isNext&&that.options.vScroll){
					left=left-slider.parentNode.offsetTop;
				}*/
				that.slider.style[transitionDuration] = that.options.animateTime/1000+"s";
				slider.style[moveBy]=(left-10)+"px";
				/*var unit=that.unit;
				var sliderList=that.sliderList=slider.children;
				var length=that.length=sliderList.length;
				var browserWidth=that.browserWidth;
				for(var i=0;i<length;i++){
					sliderList[i].style[unit]=browserWidth-2+"px";
				}
				slider.style[unit]=browserWidth*length-15+"px";*/
			}			
			that.isMouseDown=false;
			if (that.options.onPullEnd){that.options.onPullEnd.call(that,e)};
		},_bind: function (type,el,fn,bubble) {
			(el || this.slider).addEventListener(type, fn, !!bubble);
		},_unbind: function (type, el,fn, bubble) {
			(el || this.slider).removeEventListener(type, fn, !!bubble);
		}
	}
	
	module.exports  = Slider;
});