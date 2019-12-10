$(function () {
    //滾動條
    $(".content_list").mCustomScrollbar();
    var $audio = $("audio");
    var player = new Player($audio);
    var progress;
    var voice;
    var lyric;
    initProgress();
    //初始化進度條
    function initProgress() {
        var $musicProgressBar = $(".music_progress_bar");
        var $musicProgressLine = $(".music_progress_line");
        var $musicProgressDot = $(".music_progress_dot");
        progress = Progress($musicProgressBar, $musicProgressLine, $musicProgressDot);
        progress.progressClick(function (value) {
            player.musicSeekTo(value);
        });
        progress.progressMove(function (value) {
            player.musicSeekTo(value);
        });

        var $musicVoiceBar = $(".music_voice_bar");
        var $musicVoiceLine = $(".music_voice_line");
        var $musicVoiceDot = $(".music_voice_dot");
        voice = Progress($musicVoiceBar, $musicVoiceLine, $musicVoiceDot);
        voice.progressClick(function (value) {
            player.musicVoiceSeekTo(value);
        });
        voice.progressMove(function (value) {
            player.musicVoiceSeekTo(value);
        });
    }

    //加載歌曲列表
    getPlayerList();

    function getPlayerList() {
        $.ajax({
            url: "./source/musiclist.json",
            dataType: "json",
            success: function (data) {
                player.musicList = data;
                // console.log(data);
                //    建立每一條音樂
                $.each(data, function (index, val) {
                    var $item = createMusicItem(index, val);
                    $(".content_list ul").append($item);
                });
                initMusicInfo(data[0]);
                initMusicLyric(data[0]);


            },
            error: function (e) {
                console.log(e);
            }
        })
    }

    //初始化歌曲訊息
    function initMusicInfo(music) {
        //得到對應元素
        var $musicImage = $(".song_info_pic img");
        var $musicName = $(".song_info_name a");
        var $musicSinger = $(".song_info_singer a");
        var $musicAlbum = $(".song_info_album a");
        var $musicProgressName = $(".music_progress_name");
        var $musicProgressTime = $(".music_progress_time");
        var $musicBg = $(".mask_bg");
        //    得到元素進行復值
        $musicImage.attr("src", music.cover);
        $musicName.text(music.name);
        $musicSinger.text(music.singer);
        $musicAlbum.text(music.album);
        $musicProgressName.text(music.name + " / " + music.singer);
        $musicProgressTime.text("00:00 /" + music.time);
        $musicBg.css("background", "url('" + music.cover + "')");
    }
    initEvents();

    //初始化歌詞

    function initMusicLyric(music) {
        lyric=new Lyric(music.link_lrc);
        var $lyricContent=$(".song_lyric");
        //清空上一首歌詞
        $lyricContent.html("");
        lyric.loadLyric(function () {
            $.each(lyric.lyrics,function (index,value) {
                var $item=$("<li>"+value+"</li>");
                $lyricContent.append($item);
            });
        });
    }



    //初始化事件監聽
    function initEvents() {
        $(".content_list").delegate(".list_music", "mouseenter", function () {
            //顯示子菜單
            $(this).find(".list_menu").stop().fadeIn(100);
            $(this).find(".list_time a").stop().fadeIn(100);
            //    隱藏時長
            $(this).find(".list_time span").stop().fadeOut(100);
        });
        $(".content_list").delegate(".list_music", "mouseleave", function () {
            $(this).find(".list_menu").stop().fadeOut(100);
            $(this).find(".list_time a").stop().fadeOut(100);
            $(this).find(".list_time span").stop().fadeIn(100);
        });


//    監聽複選框事件

        $(".content_list").delegate(".list_check", "click", function () {
            $(this).toggleClass("list_checked");
        });
        var $musicPlay = $(".music_play");

        $(".content_list").delegate(".list_menu_play", "click", function () {
            var $item = $(this).parents(".list_music");
            //3.1當前切換撥放音樂圖標
            $(this).toggleClass("list_menu_play2");
            //3.2 復原其他撥放圖標
            $item.siblings().find(".list_menu_play").removeClass("list_menu_play2");
            //同步底部撥放按鈕
            if ($(this).attr("class").indexOf("list_menu_play2") != -1) {
                //撥放狀態
                $musicPlay.addClass("music_play2");
                //文字變亮
                $item.find("div").css("color", "#fff");
                $item.siblings().find("div").css("color", "rgba(255,255,255,0.5)");
            } else {
                //未撥放狀態
                $musicPlay.removeClass("music_play2");
                //文字變暗
                $item.find("div").css("color", "rgba(255,255,255,0.5)");
            }
            //    切換序號狀態
            $item.find(".list_number").toggleClass("list_number2");
            $item.siblings().find(".list_number").removeClass("list_number2");

            player.playMusic($item.get(0).index, $item.get(0).music);

            //    切換歌曲訊息
            initMusicInfo($item.get(0).music);

        //    切換歌詞訊息
            initMusicLyric($item.get(0).music);

        });

        //    監聽底部按鈕撥放點擊

        $musicPlay.click(function () {
            //判斷有沒有撥放音樂
            if (player.currentIndex == -1) {
                //    沒有撥放過音樂
                $(".list_music").eq(0).find(".list_menu_play").trigger("click");
            } else {
                //    有撥放過音樂
                $(".list_music").eq(player.currentIndex).find(".list_menu_play").trigger("click");
            }
        });
        $(".music_pre").click(function () {
            $(".list_music").eq(player.preIndex()).find(".list_menu_play").trigger("click");
        });
        $(".music_next").click(function () {
            $(".list_music").eq(player.nextIndex()).find(".list_menu_play").trigger("click");
        });

        //    刪除監聽事件

        $(".content_list").delegate(".list_menu_del", "click", function () {

            var $item = $(this).parents(".list_music");

            if ($item.get(0).index === player.currentIndex) {
                $(".music_next").trigger("click");
            }

            $item.remove();
            player.changeMusic($item.get(0).index);
            console.log($item.get(0).index);

            // 重新排序
            $(".list_music").each(function (index, ele) {
                ele.index = index;
                $(ele).find(".list_number").text(index + 1);
                // console.log($(ele).find(".list_number").text(index + 1));
            });
        });


        //    監聽撥放速度
        player.musicTimeUpdate(function (currentTime, duration, timeStr) {
            //同步時間
            $(".music_progress_time").text(timeStr);
            //    同步進度條
            //    計算撥放比例

            var value = currentTime / duration * 100;
            progress.setProgress(value);
        //    歌詞同步
            var index = lyric.currentIndex(currentTime);
            var $item = $(".song_lyric li").eq(index);
            $item.addClass("cur");
            $item.siblings().removeClass("cur");

            if (index<2) return;

            $(".song_lyric").css({
                marginTop: (-index+2)*30
            })

        });

        $(".music_voice_icon").click(function () {
            //圖標切換
            $(this).toggleClass("music_voice_icon2");
            //    聲音切換
            if ($(this).hasClass("music_voice_icon2")) {
            //    沒有聲音
                player.musicVoiceSeekTo(0);
            }else {
            //    有聲音
                player.musicVoiceSeekTo(1);
            }
        });

    }


    //定義方法建立音樂
    function createMusicItem(index, music) {

        var $item = $("<li class=\"list_music\">\n" +
            "                        <div class=\"list_check\"><i></i></div>\n" +
            "                        <div class=\"list_number\">" + (index + 1) + "</div>\n" +
            "                        <div class=\"list_name\">" + music.name + "\n" +
            "                            <div class=\"list_menu\">\n" +
            "                                <a href=\"javascript:;\" title=\"播放\" class='list_menu_play'></a>\n" +
            "                                <a href=\"javascript:;\" title=\"添加\"></a>\n" +
            "                                <a href=\"javascript:;\" title=\"下載\"></a>\n" +
            "                                <a href=\"javascript:;\" title=\"分享\"></a>\n" +
            "                            </div>\n" +
            "                        </div>\n" +
            "                        <div class=\"list_singer\">" + music.singer + "\n" +
            "\n" +
            "                        </div>\n" +
            "                        <div class=\"list_time\">\n" +
            "                            <span>" + music.time + "</span>\n" +
            "                            <a href=\"javascript:;\" title=\"刪除\" class='list_menu_del'></a>\n" +
            "                        </div>\n" +
            "                    </li>");
        $item.get(0).index = index;
        $item.get(0).music = music;

        return $item;
    }

});