/**
 * Created by Administrator on 2018/1/8.
 */

$(document).ready(function () {
    var first=0,second=0,third=0,fouth=0,fifth=0;
    var code = localStorage.zq_accessCode;//邀请码
    var workerName;//姓名
    var empType;//员工还是领导
    $.fn.raty.defaults.path = 'lib/img';
    $("#name").focus();
    //登录查询
    firstLogin();
    function firstLogin() {
        $.ajax({
            url: URL+'/login/list.do',
            type: "post",
            dataType: "json",
            cache: false,
            //async: false, // 同步加载
            data: {
                accessCode:code
            },
            error:function (data) {
                console.log(data);
            },
            success:function (data) {
                if(data.success){
                    var obj = data.obj;
                    $.each(obj,function (i, ele) {
                        var commentList = {
                            workerName : ele.name,
                            score1: ele.topic1,
                            score2: ele.topic2,
                            score3: ele.topic3,
                            score4: ele.topic4,
                            score5: ele.topic5
                        };
                        empType = ele.empType;
                        var chatHtml;
                        if (empType==1){
                            chatHtml = $("#commentTpl").render(commentList);
                        }else  if(empType==2){
                            chatHtml = $("#commentList").render(commentList);
                        };
                        $('.showBox').prepend(chatHtml);
                        $(".showBox .star") .raty({
                            readOnly: true,
                            score: function() {
                                return $(this).attr('data-score');
                            }
                        });

                    })
                }else {
                   window.location.href = 'index.html';
                }
            }
        });
    };
    //查询姓名
    $("#startGrade").click(function () {
        search();
    });

    //enter快捷发送
    $(document).keypress(function(event) {
        if((event.keyCode == 13 || event.keyCode == 10))  {
            search();
        }
    })

    function search() {
        workerName = $.trim($("#name").val());
        $("#name").val("");
        $('.nameList').empty();
        $('.nameList').css({'height':"auto","overflow-y":"auto"});
        if(workerName==''||workerName==null||workerName==undefined){
            $(".nothing").text("您输入的员工姓名为空，请重新输入");
            showTip("nothing");
            return;
        }
        lookFor();
    }

    //点错重新开始评价
    $(".restart").click(function () {
        $(".gradeBox").hide();
        $(".findBox").show();
        first = 0;
        second = 0;
        third = 0;
        fouth = 0;
        fifth = 0;
        workerName = '';
        $("#name").val("");
        $('.nameList').empty();
        $('.nameList').css({'height':"auto","overflow-y":"auto"});
    });
    //完成点击
   /* $(".finish").click(function () {
        next();
    });*/
    //评价写一个
    $(".next").click(function () {
        $("#name").val("");
        $('.nameList').empty();
        $('.nameList').css({'height':"auto","overflow-y":"auto"});
        next();

    });
    $(".workerBox .option").hover(function () {
        var index=$(this).index()-2;
        $(".workerBox .option .detail").hide();
        $(".workerBox .option .detail").eq(index).show();
    },function () {
        $(".workerBox .option .detail").hide();
    });
    $(".leaderBox .option").hover(function () {
        var index=$(this).index()-2;
        $(".leaderBox .option .detail").hide();
        $(".leaderBox .option .detail").eq(index).show();
    },function () {
        $(".leaderBox .option .detail").hide();
    })

   /* function submit() {
        if (first==0||second==0||third==0||fouth==0||fifth==0){
            showTip("unfinish");
            return;
        }else {
            $(".gradeBox").hide();
            $(".findBox").show();
        }
    };*/
    function next() {
        if (first==0||second==0||third==0||fouth==0||fifth==0){
            showTip("unfinish");
            return;
        }else {
            var commentList = {
                workerName : workerName,
                score1: first,
                score2: second,
                score3: third,
                score4: fouth,
                score5: fifth
            };
            var chatHtml;
            if (empType==1){
                 chatHtml = $("#commentTpl").render(commentList);
            }else  if(empType==2){
                 chatHtml = $("#commentList").render(commentList);
            };
            $('.showBox').prepend(chatHtml);
            $(".showBox .star") .raty({
                readOnly: true,
                score: function() {
                    return $(this).attr('data-score');
                }
            });
            insetScore();
            $(".gradeBox").hide();
            $(".findBox").show();
        }
    };

    function insetScore() {
        $.ajax({
            url: URL+'/empGrade/insert.do',
            type: "post",
            dataType: "json",
            cache: false,
            data: {
                accessCode:code,
                name:workerName,
                empType:empType,
                topic1:first,
                topic2:second,
                topic3:third,
                topic4:fouth,
                topic5:fifth
            },
            error:function (data) {
                console.log(data);
                alert("服务器出错，请刷新重试")
                first = 0;
                second = 0;
                third = 0;
                fouth = 0;
                fifth = 0;
                workerName = '';
            },
            success:function (data) {
                if(data.success){
                    first = 0;
                    second = 0;
                    third = 0;
                    fouth = 0;
                    fifth = 0;
                    workerName = '';
                }else {
                    alert(data.msg);
                    first = 0;
                    second = 0;
                    third = 0;
                    fouth = 0;
                    fifth = 0;
                    workerName = '';
                }
            }
        });
    };
    //普通员工的评价
    function worker() {
        $(".workerBox .star") .raty({
            click: function (score, evt) {
                var target=$(this).attr('id');
                var score = score;
                switch (target)
                {
                    case "first":
                        first=score;
                        break;
                    case "second":
                        second = score;
                        break;
                    case "third":
                        third = score;
                        break;
                    case "fouth":
                        fouth = score;
                        break;
                    case "fifth":
                        fifth = score;
                        break;
                };
            }
        });
    };
    //领导的评价
    function leader() {
        $(".leaderBox .star") .raty({
            click: function (score, evt) {
                var target=$(this).attr('id');
                var score = score;
                switch (target)
                {
                    case "one":
                        first=score;
                        break;
                    case "two":
                        second = score;
                        break;
                    case "three":
                        third = score;
                        break;
                    case "four":
                        fouth = score;
                        break;
                    case "five":
                        fifth = score;
                        break;
                };
            }
        });
    };

    $("#name").keyup(function(){
        $('.nameList').empty();
        $('.nameList').css({'height':"auto","overflow-y":"auto"});
        $(".zqSearch").removeClass("hidden");
        workerName = $.trim($("#name").val());
        $.ajax({
             url: URL + '/empGrade/checkName.do',
             type: "post",
             dataType: "json",
             cache: false,
             data: {
                 accessCode: code,
                 name: workerName
             },
             error: function (data) {
                console.log(data);
                alert("服务器出错，请刷新重试")
             },
             success: function (data) {
                 if (data.success) {
                    var obj = data.obj;
                     if (obj.length>12){
                         $('.nameList').css({'height':"250px","overflow-y":"scroll"});
                     }
                     $.each(obj,function (i, ele) {
                         var commentList = {
                             nameSearch : ele
                         };
                         var chatHtml;
                         chatHtml = $("#nameList").render(commentList);
                         $('.nameList').append(chatHtml);
                     })
                 } else {

                 }
             }
         });
    });
    $(".nameList").on('click','li',function () {
        workerName = $(this).text();
        $("#name").val(workerName);
        $('.nameList').empty();
        $('.nameList').css({'height':"auto","overflow-y":"auto"});
    })
    function lookFor () {
        $.ajax({
            url: URL+'/empGrade/empType.do',
            type: "post",
            dataType: "json",
            cache: false,
            data: {
                accessCode:code,
                name:workerName
            },
            error:function (data) {
                console.log(data);
                alert("服务器出错，请刷新重试")
            },
            success:function (data) {
                if(data.success){
                    empType = data.obj[0];
                    if(empType==1){
                        $(".gradeBox").hide();
                        $(".leaderBox").show();
                        $(".findBox").hide();
                        $(".leadName").text(workerName);
                        leader();
                    }else if(empType==2){
                        $(".gradeBox").hide();
                        $(".workerBox").show();
                        $(".findBox").hide();
                        $(".workName").text(workerName);
                        worker();
                    }
                }else {
                    $(".nothing").text(data.msg);
                    showTip("nothing");
                }
            }
        });
        $(".leaderBox .star") .raty();
        $(".workerBox .star") .raty();
    }
});













