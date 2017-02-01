//util
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length,c.length);
        }
    }
    return "";
}
function setCookie(name,value) {
    /*
    if (days) {
        var date = new Date();
        //date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();
    }

    else var expires = "";
    */
    //document.cookie = name+"="+value+expires+"; path=/";
    document.cookie = name+"="+value+"; path=/";
}
function readCookieJson(cookie) {
    var s = cookie.replace(/\\054/g,",")
    s = s.replace("\\173","{")
    s = s.replace("\\175","}")
    s = s.replace(/\\"/g,'"')

    /*var s  = cookie.split("\\054")
    var dic = {}
    for (var i = s.length - 1; i >= 0; i--) {
        var ss = s[i].split(":")
        //clean key
        ss[0].substring()
        dic[ss[0]] = ss[1]
    };

   // var ss = s.split(":")
    console.log(dic)*/
    //console.log(s)
    return s.substring(1,s.length-1)
}