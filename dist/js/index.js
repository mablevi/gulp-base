!function(){$.msgBox={Alert:function(s,i,o){c("alert",s,i,o),t(),d()},Confirm:function(s,i,o,n,a){c("confirm",s,i,o,n),t(a),d()}};var c=function(s,i,o,n,a){var c="";c+='<div class="dialog">',c+='<div class="mask"></div>',c+='<div class="msgBox">',c+='<div class="msgBox-head"><div class="msgBox-title">'+i+"</div></div>",c+='<div class="msgBox-content"><div class="msgBox-message">'+o+"</div></div>","alert"===s&&(void 0!==a&&""!==a||(a="确定"),c+='<div class="msgbox-btns"><a class="msgBox-btn cancleBox">'+a+"</a></div>"),"confirm"===s&&(void 0!==a&&""!==a||(a="确定"),null!=n&&""!==n||(n="取消"),c+='<div class="msgbox-btns"><a class="msgBox-btn cancleBox">'+n+'</a><a class="msgBox-btn submitBox">'+a+"</a></div>"),c+="</div>",c+="</div>",$("body").append(c)},t=function(s){$(".submitBox").click(function(){$(this).parents(".dialog").remove(),"function"==typeof s&&s()})},d=function(){$(".cancleBox").click(function(){$(this).parents(".dialog").remove()})}}($);