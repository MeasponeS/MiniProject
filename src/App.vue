<script>

    export default {
        created() {

            // if(r.unReadCount>0){
            //     wx.showTabBarRedDot({
            //         index:4,
            //         success:function() {}
            //     });
            // }
        },
        mounted() {



        }
    };
</script>

<style>
    view,scroll-view,swiper,swiper-item,movable-area,movable-view,cover-view,cover-image,icon,text,rich-text,progress,button,checkbox-group,checkbox,form,input,label,picker,picker-view,radio-group,radio,slider,switch,textarea,navigator,functional-page-navigator,image,video,camera,live-player,live-pusher,map,canvas,open-data,web-view,ad{
        box-sizing: border-box;
    }
    .container {
        width: 100%;
        min-height: 100vh;
        background-color: #F3F5F7;

    }
    /*其他页面使用 vant_btn组件覆盖 */
    .main-bg{
        background: #4D86F8!important;
        border-color:  #4D86F8!important;
    }

    .main-popup{
        width: 80%;
        border-radius:10rpx;
        box-shadow:0 10rpx 30rpx 0 rgba(0, 0, 0, 0.47);
    }
    .main-popup .main-popup-content{
        width: 100%;
        display: flex;
        align-items: center;
        flex-direction: column;
    }
    .hover-opacity{
        opacity: 0.6;
    }
</style>
