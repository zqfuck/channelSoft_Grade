/**
 * Created by Administrator on 2018/1/5.
 */

var URL='http://60.205.136.57:8888/grade';

function showTip(className) {
    $("."+className+"").css({"visibility":"visible"});
    setTimeout(
        function() {
            $("."+className+"").css({"visibility":"hidden"});
        },2000);
};

function focusId(id){
    if(id.length >0){
        var input = document.getElementById(id);
        var val = input.value;
        input.value = "";
        input.value = val;
        document.getElementById(id).focus();
    }
};
