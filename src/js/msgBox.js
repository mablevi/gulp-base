;(function(){
	$.msgBox = {
		Alert: function (title, msg, btnName){
			GenerateHtml('alert', title, msg, btnName);
			btnOk();
			btnNo();
		},
		Confirm: function (title, msg, cancle, btnName, callback){
			GenerateHtml('confirm', title, msg, cancle, btnName);
			btnOk(callback);
			btnNo();
		}
	};
	var GenerateHtml = function(type, title, msg, cancle, btnName){
		var _html = "";
		_html += '<div class="dialog">';
		_html += '<div class="mask"></div>';
		_html += '<div class="msgBox">';
		_html += '<div class="msgBox-head"><div class="msgBox-title">'+ title +'</div></div>';
		_html += '<div class="msgBox-content"><div class="msgBox-message">'+ msg +'</div></div>';
		if(type === 'alert'){
            if(btnName === undefined || btnName === ''){
                btnName = '确定';
            }
			_html += '<div class="msgbox-btns"><a class="msgBox-btn cancleBox">'+ btnName +'</a></div>';
		}
		if(type === 'confirm'){
            if(btnName === undefined || btnName === ''){
                btnName = '确定';
            }
            if(cancle == undefined || cancle === ''){
                cancle = '取消';
            }
			_html += '<div class="msgbox-btns"><a class="msgBox-btn cancleBox">'+ cancle +'</a><a class="msgBox-btn submitBox">'+ btnName +'</a></div>';
		}
		_html += '</div>';
		_html += '</div>';
		$('body').append(_html);
	};
	var btnOk = function(callback){
		$('.submitBox').click(function() {
            $(this).parents('.dialog').remove();
			if(typeof(callback) === 'function'){
				callback();
			}
        });
	};
	var btnNo = function(){
		$('.cancleBox').click(function(){
			$(this).parents('.dialog').remove();
		});
	};
})($)