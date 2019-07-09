(()=>{
    document.addEventListener('DOMContentLoaded',function(){
        //业务
        //视频对象
        let video = document.querySelector('#video');
        //开始结束按钮
        let startbtn = document.querySelector('.btns .start-btn');
        let endbtn = document.querySelector('.btns .end-btn');
        //播放状态标志位
        let playstatu = false;
        //视频进度条
        let progress = document.querySelector('.progress');
        let videoPinkProgress = document.querySelector('.progress .progress-pink');
        let videoGrayProgress = document.querySelector('.progress .progress-gray');
        let videoSlider = document.querySelector('.progress .progress-slider');
        //粉色进度条可达长度
        let progressMaxLength = videoGrayProgress.clientWidth - videoSlider.offsetWidth;
        //音量进度条
        let volumeGrayProgress = document.querySelector('.volumn-progress .progress-gray');
        let volumePinkProgress = document.querySelector('.volumn-progress .progress-pink');
        let volumeSlider = document.querySelector('.volumn-progress .progress-slider');
        //时间块~当前播放到的时间，视频总时长
        let timeSpan = document.querySelectorAll('#controllBar .tools .time span');
        let currentTime = timeSpan[0];
        let totalTime = timeSpan[1];

        //音量按钮
        let volume = document.querySelector('.volume .volumn-btn span');

        //全屏
        let fullscreen = document.querySelector('.fullscreen span');

        /*
         * 初始化，音量，时间
         */
        video.addEventListener('loadedmetadata',function () {
            init();
        });

        //播放,暂停
        startbtn.addEventListener('click',function () {
            if(playstatu){
                video.pause();
                startbtn.classList.remove('active');
            }else {
                video.play();
                startbtn.classList.add('active');
            }
            playstatu = !playstatu;
        });

        //停止
        endbtn.addEventListener('click',function () {
            videoPinkProgress.style.width = 0+'px';
            videoSlider.style.left = 0+'px';
            video.currentTime = 0;
            video.pause();
            startbtn.classList.remove('active');
        });

        /**
         * 视频进度条华东
         */
        videoSlider.addEventListener('mousedown',function (e) {
            e.stopPropagation();
            huadong(e,videoSlider,videoGrayProgress,videoPinkProgress,videomove);
            // console.log(1);
        });

        /**
         * 音量滑动
         */
        volumeSlider.addEventListener('mousedown',function (e) {
            huadong(e,volumeSlider,volumeGrayProgress,volumePinkProgress,volumemove);
        });

        // 播放注册事件
        video.addEventListener('timeupdate',vedioProgressChange);

        /**
         * 点击进度条,改变播放进度
         */
        progress.addEventListener('mousedown',function (e) {
            let clickX = e.offsetX;
            //进度条显示
            videoSlider.style.left = clickX+'px';
            videoPinkProgress.style.width = clickX+'px';
            // console.log(clickX);
            //播放时间改动
            progressMaxLength = videoGrayProgress.clientWidth - videoSlider.offsetWidth;
            video.currentTime = video.duration*(clickX/progressMaxLength);

            // console.log(2);
        });

        /**
         * 音量按钮注册时间
         */
        volume.addEventListener('click',function (e) {

            if (volume.classList.contains('active')) {
                video.muted = false;
            }else {
                video.muted = true;
            }
            // console.log(video.muted);
            volume.classList.toggle('active');
        });

        /**
         * 全屏按钮注册事件
         */
        let isFullScreen = false;
        fullscreen.addEventListener('click',function (e) {

            if(isFullScreen) {
                isFullScreen = false
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                }
                else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                }
                else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                }
                else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            } else {
                isFullScreen = true
                var docElm = document.documentElement;
                //W3C
                if (docElm.requestFullscreen) {
                    docElm.requestFullscreen();
                }
                //FireFox
                else if (docElm.mozRequestFullScreen) {
                    docElm.mozRequestFullScreen();
                }
                //Chrome等
                else if (docElm.webkitRequestFullScreen) {
                    docElm.webkitRequestFullScreen();
                }
                //IE11
                else if (docElm.msRequestFullscreen) {
                    docElm.msRequestFullscreen();
                }
            }
            fullscreen.classList.toggle('active');
            isFullScreen = !isFullScreen;

        });

        /**
         * 监听全屏状态变化
         */
        document.addEventListener('fullscreenchange', fullScreenChangeFn);
        document.addEventListener('webkitfullscreenchange', fullScreenChangeFn);
        document.addEventListener('mozfullscreenchange', fullScreenChangeFn);
        document.addEventListener('msfullscreenchange', fullScreenChangeFn);  // IE下无效果然

        /**
         * 监听屏幕变化的函数
         */
        function fullScreenChangeFn(){
            /*
            * 获取被全屏的元素，没有返回null
            * document.fullscreenElement
            * document.webkitFullscreenElement
            * document.mozFullScreenElement
            *
            * 返回是否全屏·布尔值
            * document.webkitIsFullScreen
            * document.mozFullScreen
            * */

            // 判断是否是全屏
            var  isFull = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.webkitIsFullScreen || document.mozFullScreen;
            if (isFull) {
                // 全屏状态
                fullscreen.classList.add('active');
                isFullScreen = true;
            } else {
                // 非全屏状态
                fullscreen.classList.remove('active');
                isFullScreen = false;
            }
        }


        /**
         * 视频进度条，和当前已播放时间显示
         * @param e
         */
        function vedioProgressChange(e) {
            //改变显示当前时间
            currentTime.innerHTML = timeFormate(video.currentTime);
            //改变进度条和滑块
            //应移动的距离
            progressMaxLength = videoGrayProgress.clientWidth - videoSlider.offsetWidth;
            let rundis = progressMaxLength*(video.currentTime/video.duration);
            //进度条长度
            videoPinkProgress.style.width = rundis+'px';
            //滑块
            videoSlider.style.left = rundis+'px';

        }

        /**
         *
         * @param e mousedown事件对象
         * @param slider 滑块
         * @param grayProgress 灰进度条
         * @param pinkProgress 粉色进度条
         * @param fn 回掉函数，通过比例参数执行业务
         */
        function huadong(e,slider,grayProgress,pinkProgress,fn){
            // video.removeEventListener('timeupdate',vedioProgressChange);
            //初始css位置
            let style = window.getComputedStyle(slider);
            let beginLeft = parseInt(style.left);

            //初始鼠标位置
            let beginClientX = e.clientX;

            document.addEventListener('mousemove',movemouse);

            document.addEventListener('mouseup',function () {
                document.removeEventListener('mousemove',movemouse);
            });

            /**
             * 移动滑块，增长进度条
             * @param e
             */
            function movemouse(e) {
                //获取鼠标实时移动位置
                let currentClientX = e.clientX;

                //获取
                let deltaX = currentClientX - beginClientX;
                let sliderLeft = beginLeft+deltaX;

                //范围设置
                let maxX = grayProgress.clientWidth - slider.offsetWidth;
                sliderLeft = sliderLeft<0 ? 0:sliderLeft;
                sliderLeft = sliderLeft > maxX?maxX:sliderLeft;
                // console.log(sliderLeft);
                //设置滑块元素位置
                slider.style.left = sliderLeft+'px';
                //设置粉色进度条长度
                pinkProgress.style.width = sliderLeft+'px';
                //返回比例
                fn(sliderLeft/maxX);

            }
        }

        /**
         * 控制视频的进度
         * @param scale 比例
         */
        function videomove(scale) {
            video.currentTime = video.duration*scale;
            // console.log(video.duration*scale);
        }

        /**
         * 控制音量的大小
         * @param scale 比例
         */
        function volumemove(scale) {
            video.volume = scale;
            // console.log(scale);
        }

        /**
         * 初始化
         */
        function init() {

            //音量
            volumeSlider.style.left = volumeGrayProgress.clientWidth - volumeSlider.offsetWidth+'px';
            volumePinkProgress.style.width = volumeGrayProgress.clientWidth + 'px';

            //时间初始化
            console.log(video.duration);
            totalTime.innerHTML = timeFormate(video.duration);

        }

        /**
         * 格式化时间为HH:mm:ss
         * @param second 秒钟数
         */
        function timeFormate(second) {
            let h,m,s;
            h = Math.floor(second/3600);
            second -= h*3600;

            m = Math.floor(second/60);
            second -= m*60;

            s = Math.floor(second);

            let time = h<10?'0'+h:h;
            time +=':';
            time += m<10?'0'+m:m;
            time +=':';
            time += s<10?'0'+s:s;

            return time;
        }



    });
})();