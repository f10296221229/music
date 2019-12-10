(function (window) {

    function Progress($musicProgressBar, $musicProgressLine, $musicProgressDot) {
        return new Progress.prototype.init($musicProgressBar, $musicProgressLine, $musicProgressDot);
    }

    Progress.prototype = {
        constructor: Progress,
        isMove: false,
        init: function ($musicProgressBar, $musicProgressLine, $musicProgressDot) {
            this.$musicProgressBar = $musicProgressBar;
            this.$musicProgressLine = $musicProgressLine;
            this.$musicProgressDot = $musicProgressDot;
        },
        progressClick: function (callback) {
            var $this = this;//progress not $musicProgressBar
            this.$musicProgressBar.click(function (event) {
                //        背景距離窗口位置
                var normalLeft = $(this).offset().left;
                //    點即時距離窗口位置
                var eventLeft = event.pageX;

                $this.$musicProgressLine.css("width", eventLeft - normalLeft);
                $this.$musicProgressDot.css("left", eventLeft - normalLeft);
                //    計算進度條比例
                var value = (eventLeft - normalLeft) / $(this).width();
                callback(value);
            });
        },
        progressMove: function (callback) {
            var $this = this;
            //        背景距離窗口位置
            var normalLeft = this.$musicProgressBar.offset().left;
            var barWidth = this.$musicProgressBar.width();
            var eventLeft;
            //    按下事件
            this.$musicProgressBar.mousedown(function () {
                $this.isMove = true;

                //    移動事件
                $(document).mousemove(function (event) {
                    //    點即時距離窗口位置
                    var eventLeft = event.pageX;

                    var offest = eventLeft - normalLeft;
                    if (offest > 0 && offest <= barWidth) {
                        $this.$musicProgressLine.css("width", offest);
                        $this.$musicProgressDot.css("left", offest);
                    }


                });
            });

            //    抬起事件
            $(document).mouseup(function () {
                $(document).off("mousemove");
                $this.isMove = false;
                var value = (eventLeft - normalLeft) / barWidth;
                callback(value);
            });
        },
        setProgress: function (value) {
            if (this.isMove) return;
            if (value < 0 || value > 100) {
                return;
            }
            this.$musicProgressLine.css({
                width: value + "%"
            });
            this.$musicProgressDot.css({
                left: value + "%"
            });
        }


    };
    Progress.prototype.init.prototype = Progress.prototype;
    window.Progress = Progress;
})(window);