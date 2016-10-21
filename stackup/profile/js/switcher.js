/* ========================================================================
* Christina Arasmo Beymer : switcher.js
* ======================================================================== */

/* __________________ Cookie __________________*/
/*!jQuery Cookie Plugin v1.3.1 / https://github.com/carhartl/jquery-cookie
 * Copyright 2013 Klaus Hartl / Released under the MIT license */
(function(factory){if(typeof define==="function"&&define.amd){define(["jquery"],factory);}else{factory(jQuery);}}(function($){var pluses=/\+/g;function decode(s){if(config.raw){return s;}try{return decodeURIComponent(s.replace(pluses," "));}catch(e){}}function decodeAndParse(s){if(s.indexOf('"')===0){s=s.slice(1,-1).replace(/\\"/g,'"').replace(/\\\\/g,"\\");}s=decode(s);try{return config.json?JSON.parse(s):s;}catch(e){}}var config=$.cookie=function(key,value,options){if(value!==undefined){options=$.extend({},config.defaults,options);if(typeof options.expires==="number"){var days=options.expires,t=options.expires=new Date();t.setDate(t.getDate()+days);}value=config.json?JSON.stringify(value):String(value);return(document.cookie=[config.raw?key:encodeURIComponent(key),"=",config.raw?value:encodeURIComponent(value),options.expires?"; expires="+options.expires.toUTCString():"",options.path?"; path="+options.path:"",options.domain?"; domain="+options.domain:"",options.secure?"; secure":""].join(""));}var result=key?undefined:{};var cookies=document.cookie?document.cookie.split("; "):[];for(var i=0,l=cookies.length;i<l;i++){var parts=cookies[i].split("=");var name=decode(parts.shift());var cookie=parts.join("=");if(key&&key===name){result=decodeAndParse(cookie);break;}if(!key&&(cookie=decodeAndParse(cookie))!==undefined){result[name]=cookie;}}return result;};config.defaults={};$.removeCookie=function(key,options){if($.cookie(key)!==undefined){$.cookie(key,"",$.extend({},options,{expires:-1}));return true;}return false;};}));


// THIS SWITCHER ONLY WORKS ON NON-TOUCH DEVICES on purpose


if ($("html").hasClass("no-touch")) {


    $("head").append('<link rel="stylesheet" href="assets/switcher/switcher.css" type="text/css" />');


    function zapCookies() {
        $.removeCookie("stone");
        $.removeCookie("blue");
        $.removeCookie("teal");
        $.removeCookie("soft-gray");
        $.removeCookie("salmon-gray");
        $.removeCookie("mustard-gray");
        $.removeCookie("green-gray");
    }

    function removeClassifCookie() {
        $("#base").removeClass("active");
    }


    $("#switcher-wrapper").on("click", ".toggle", function (c) {
        $(".toggle i").toggleClass("fa-spin")
        $("html").toggleClass("open-switcher")
    });

    $(".colors a").click(function () {
        if ($(this).siblings().hasClass("active")) {
            $(this).siblings().removeClass("active");
            $(this).addClass("active")
        } else {
            $(this).addClass("active")
        }
        color = this.id.replace("#", "");
        zapCookies();
        $(".clr").remove();
        $(".base-color").detach();
        $.cookie(color, 1);

        // Load Style Sheet for Main Theme
        var b = document.createElement("link");
        b.setAttribute("rel", "stylesheet");
        b.setAttribute("type", "text/css");
        b.setAttribute("class", "clr");
        b.setAttribute("href", "assets/css/colors/" + color + ".css");
        document.getElementsByTagName("head")[0].appendChild(b);
        
        return false
    });

    // USER SAVED STYLES 

    function getStyle(d) {
        var c = document.createElement("link");
        c.setAttribute("rel", "stylesheet");
        c.setAttribute("type", "text/css");
        c.setAttribute("class", "clr");
        c.setAttribute("href", "assets/css/colors/" + d + ".css");
        document.getElementsByTagName("head")[0].appendChild(c)
    }

    $(window).load(function () {
        if ($.cookie("stone")) {
            getStyle("stone");
            removeClassifCookie();
            $("#stone").addClass("active")
        } else {

            if ($.cookie("soft-gray")) {
                getStyle("soft-gray");
                removeClassifCookie();
                $("#soft-gray").addClass("active")
            } else {

                if ($.cookie("mustard-gray")) {
                    getStyle("mustard-gray");
                    removeClassifCookie();
                    $("#mustard-gray").addClass("active")
                } else {

                    if ($.cookie("salmon-gray")) {
                        getStyle("salmon-gray");
                        removeClassifCookie();
                        $("#salmon-gray").addClass("active")
                    } else {


                        if ($.cookie("green-gray")) {
                            getStyle("green-gray");
                            removeClassifCookie();
                            $("#green-gray").addClass("active")
                        } else {

                            if ($.cookie("teal")) {
                                getStyle("teal");
                                removeClassifCookie();
                                $("#teal").addClass("active")
                            } else {


                                if ($.cookie("blue")) {
                                    getStyle("blue");
                                    removeClassifCookie();
                                    $("#blue").addClass("active")

                                } // if 7
                            } // if 6
                        } // if 5
                    } // if 4
                } // if 3
            } // if 2
        } //if 1
    });
    
    
    $(window).load(function () {
        $(".color-reset, #base").click(function () {
            zapCookies();
            $(".clr").remove();
            $('head').append($('<link rel="stylesheet" type="text/css" class="base-color" />').attr('href', 'assets/css/colors/sidewaze_base_color.css'));
            $(".colors a").removeClass("active");
            $("#base").addClass("active");
        });
    });



};