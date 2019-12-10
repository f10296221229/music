(function (window) {

    function Lyric(path) {
        return new Lyric.prototype.init(path);
    }

    Lyric.prototype = {
        constructor: Lyric,
        init: function (path) {
            this.path=path;
        },
        times:[],
        lyrics:[],
        index:-1,
        loadLyric:function (callback) {
            var $this=this;
            $.ajax({
                url:$this.path,
                dataType: "text",
                success: function (data) {
                    // console.log(data);
                    $this.parseLyric(data);
                    callback();
                },
                error: function (e) {
                    console.log(e);
                }
            })
        },
        parseLyric:function (data) {
            var $this=this;
            //一定要清空上一首歌詞和時間
            $this.times=[];
            $this.lyrics=[];
            var array=data.split("\n");
            //[00:00.92]
            var timeReg=/\[(\d*:\d*\.\d*)\]/
            $.each(array,function (index,value) {
                //處理歌詞
                var lyc=value.split("]")[1];
                //空字符串 沒有歌詞
                if (lyc.length===1) return true;

                $this.lyrics.push(lyc);

                // console.log(value);
                var res=timeReg.exec(value);
                // console.log(res);
                if (res==null) return true;
                var timeStr=res[1];//  00:00.92

                var res2=timeStr.split(":");
                var min=parseInt(res2[0])*60;
                var sec=parseFloat(res2[1]);
                var time=parseFloat(Number(min+sec).toFixed(2));
                // console.log(time);
                $this.times.push(time);

            });
            console.log(this.lyrics);
            console.log(this.times);
        },
        currentIndex:function (currentTime) {
            if (currentTime>=this.times[0]){
                this.index++;
                this.times.shift();//刪除最前面的原素
            }
            return this.index;
        }

    };
    Lyric.prototype.init.prototype = Lyric.prototype;
    window.Lyric = Lyric;
})(window);