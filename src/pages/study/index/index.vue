<template>
    <div class="container">
        <div class="header">
            <p>—— {{ orgName }} ——</p>
        </div>
        <EmptyDisplay v-if="list.length == 0" type="msg" text="当前学堂没有安排任何课程"></EmptyDisplay>
        <ul v-else class="list">
            <li class="courseList" v-for="item in list" :key="item.packageType.id" @click="startLearning(item)">
                <view class="entrance">
                    <img :src="item.packageType.coverPicUrl" alt="">
                    <p>进入课程 ></p>
                </view>
            </li>
        </ul>
        <noLearningCard :show="isLearning" @clickClose="clickClose"></noLearningCard>
    </div>
</template>

<script>
    import {courses,subMajor} from '../../../api/study/index'
    import TabBarPageMixin from '../../../utils/TabBarPageMixin'
    import {getOrgInfo} from '../../../utils/dataStorage'
    import noLearningCard from "../../../components/NoLearningCard/NoLearningCard.vue"
    export default {
        mixins: [TabBarPageMixin],
        data() {
            return {
                list:[],
                orgName:'',
                isLearning:false
            };
        },

        components: {

        },
        methods: {
            startLearning(item){
                let packId = item.packageType.id
                if(item.jumpPageStatus === 'A'){
                    if(item.hasSubmajor == 1){
                        subMajor({coursePackId:packId}).then(r=>{
                            let subMajor = r.subMajorList.filter((item1)=>{
                                return item1.selected == 1
                            })
                            if(subMajor.length != 0){
                                //this.subMajor.isSelect = subMajor[0].packId
                                //已经选择亚专业 跳章节
                                wx.navigateTo({url:`/pages/study/chapterA/main?coursePackId=${packId}&subMajorId=${subMajor[0].packId}`});
                            }else {
                                //没有选择亚专业。默认第一个亚专业
                                wx.navigateTo({url:`/pages/study/chapterA/main?coursePackId=${packId}&subMajorId=${r.subMajorList[0].packId}&noSelect=1`});
                            }
                        }).catch(_=>{})

                    }else {
                        //没有亚专业
                        wx.navigateTo({url:`/pages/study/chapterA/main?coursePackId=${packId}`})
                    }
                }else if(item.jumpPageStatus === 'B'){
                    wx.navigateTo({url:`/pages/study/chapterB/main?coursePackId=${packId}`})
                }else if(item.jumpPageStatus==='C'){
                  if(item.isPermission === 1){
                    wx.navigateTo({url:`/pages/study/studyDetails/main?coursePackId=${packId}`})
                  }else{
                    this.isLearning = true
                  }
                    
                }else {
                    return
                }

            },
            //关闭无学习卡的弹窗
            clickClose(){
              this.isLearning = false
            }
        },
        // watch : {
        //     list (val) {
        //         val.map((item,index)=>{
        //             //console.log(item.hasSubmajor)
        //             console.log(item.packageType.id+'亚专业='+item.hasSubmajor+'跳转'+item.jumpPageStatus)
        //         })
        //     }
        // },
        mounted() {
            courses().then(r=>{
                let orgList = r.orgCourseInformationList || [];
                let userList = r.userCourseInformationList || [];
                this.list = [...userList,...orgList];
            }).catch(_=>{})
        },
        components:{
          noLearningCard
        },
        onShow(){//机构登录之前和登录之后会不一样，每次打开更新
            this.orgName = getOrgInfo().orgName;
        },
        onPullDownRefresh: function () {
            // 显示顶部刷新图标
            wx.showNavigationBarLoading();

            courses().then(r=>{
                let orgList = r.orgCourseInformationList || [];
                let userList = r.userCourseInformationList || [];
                this.list = [...userList,...orgList];

                setTimeout(_=>{
                    wx.hideNavigationBarLoading();
                    wx.stopPullDownRefresh();
                },400)
            }).catch(_=>{
                wx.hideNavigationBarLoading();
                wx.stopPullDownRefresh();
            })
        },
    };
</script>

<style scoped >
    .container .header{
        text-align: center;
        color:#C3C3C3;
        font-size: 30rpx;
        line-height: 30rpx;
        padding-top: 30rpx;
    }
    .container .list{
        overflow: hidden;
    }
    .container .list .courseList{
        margin: 30rpx;
        width: 690rpx;
        height: 338rpx;
        box-shadow: 0 0 0.16rpx rgba(174, 174, 174, 0.8);
        border-radius: 13rpx;
        overflow: hidden;
        position: relative;
    }
    .container .list .courseList .entrance{
        display: block;
        width: 100%;
        height: 338rpx;
    }
    .container .list .courseList .entrance img{
        width: 100%;
        height: 100%;
    }
    .container .list .courseList .entrance p{
        position: absolute;
        bottom: 17rpx;
        right: 17rpx;
        font-size: 18rpx;
        color:#fff;
        text-shadow: 0 0 0.16rem rgba(0, 0, 0, 0.8);
    }
</style>
