<template>
    <div class="container main" :style="isRight ? 'overflow:hidden;height:100vh;position:fixed;' : ''">
        <EmptyDisplay v-if="isEmpty && chaptersList.length===0" type="msg" text="暂无数据"></EmptyDisplay>
        <div class="contentTop" v-else>
            <div class="contentMid">
                <p>健康管理师资格考试课程</p>
                <span  @click="showIntroduce=true" hover-class="hover-opacity">
                    <img src="./img/1.png" alt="">
                    <em>简介</em>
                </span>
            </div>
            <div class="contentBot">
                <span >共 {{catalogueInfo.chapterSize}} 小节</span>
                <span class="line"></span>
                <span >  {{catalogueInfo.studySize}} 人已学</span>
                <span class="per">已学{{catalogueInfo.percentage}}%</span>
                <van-progress
                    custom-class="vanPercentage"
                    :percentage="catalogueInfo.percentage"
                    :show-pivot="false"
                    color="#4D86F8"
                />
                <span class="percentage">
                    <em>100%</em>
                </span>
            </div>
        </div>
      <noLearningCard @clickClose="clickClose" :show='isLearning'></noLearningCard>
        <!--简介弹窗-->
        <van-popup
            :show="showIntroduce"
            @close="showIntroduce = false"
            custom-class="main-popup"
            overlay-style="opacity:0.6"
            :close-on-click-overlay="false"
        >
            <div class="main-popup-content">
                <h3>课程简介</h3>
                <div v-html="catalogueInfo.description">
                </div>
                <van-button
                    custom-class="main-bg introduceBtn"
                    round
                    type="primary"
                    @click="showIntroduce=false"
                    :block="true"
                    size="large"
                >返回</van-button>
            </div>
        </van-popup>
        <ul>
            <li @click="sectionsList(item)"  hover-class="hover-opacity" v-for="(item,index) in chaptersList" :key="index">
                <span>第{{item.index}}章</span>
                <span class="line"></span>
                <span>{{item.name}}</span>
            </li>
        </ul>
        <Directory :show="isRight" @toDetail="toDetail" :obj="chaptersChildobj" @closeMask="closeMask" :catalogMenu="chaptersChildList"></Directory>
    </div>
</template>

<script>
    import Directory from '../studyDetails/Directory.vue'
    import { chapterList , chapterChildList  } from "../../../api/study/index"
    import { toChinesNum } from "../../../utils/index"
    import noLearningCard from "../../../components/NoLearningCard/NoLearningCard.vue"
    export default {
        data() {
            return {
                //是否显示简介
                showIntroduce:false,
                //没有学习卡
                 isLearning:false,
                //是否显示右侧的子章节目录
                isRight:false,
                //课程包id
                coursePackId:null,
                //章节id
                chapterPid:null,
                //课程id
                courseId:null,
                //判断是否有数据
                isEmpty:false,
                //无数据时触发的事件
                //课程详情
                catalogueInfo:{},
                //目录列表
                chaptersList:[],
                //子目录列表
                chaptersChildList:[],
                chaptersChildobj:{},
                //判断是否有学习权限
                isStudyCard:false,
                //判断子章节是否有学习权限
                isPermission:false
            };
        },
        components: {
            Directory,
            noLearningCard
        },
        methods: {
            //获取课程章节目录列表
            getList (courseId,coursePackId) {
                chapterList({'courseId':courseId ? courseId : '','coursePackId':coursePackId}).then((res)=>{
                  //  console.log(res)
                   if(res.resultCode !== 200){
                       this.isEmpty = true
                   }else {
                       this.isEmpty  = false
                       wx.setNavigationBarTitle({
                        title: res.data.course.name
                    })
                    this.isStudyCard = res.data.studyCard
                    // this.isStudyCard = false
                   
                    let percentage = parseInt((res.data.course.finishChapterSize/res.data.course.chapterSize)*100)
                        percentage = percentage ? percentage : 0
                        percentage = percentage>100 ? 100 : percentage
                        res.data.course['percentage'] = percentage
                       this.courseId = res.data.course.id
                       this.catalogueInfo = res.data.course
                       res.data.chapters.map((item,index)=>{
                           item['index']=toChinesNum(index+1)
                       })
                       this.chaptersList = res.data.chapters
                   }
                })
            },
            //获取子章节目录
            sectionsList (item) {
                this.chapterPid = item.id
                let params = {courseId:this.courseId,chapterPid:item.id,coursePackId:this.coursePackId}
                  chapterChildList(params).then((res)=>{
                    this.chaptersChildList = res.chapterList
                    this.chaptersChildobj = res.chapter
                    this.isPermission = res.isPermission
                    if(res.chapterList.length === 0){
                      if(this.isStudyCard || item.vipType === 0){
                        wx.navigateTo({url:`/pages/study/studyDetails/main?coursePackId=${this.coursePackId}&courseId=${this.courseId}&chapterPid=${this.chapterPid}`})
                      }else{
                        this.isRight = false
                        this.isLearning = true
                        
                      }
                    }else{
                       this.isRight = true
                    }
                 })  
            },
            //去往详情页面
            toDetail (item) {
              if(item.vipType === 0 || this.isPermission){
                wx.navigateTo({url:`/pages/study/studyDetails/main?coursePackId=${this.coursePackId}&courseId=${this.courseId}&chapterId=${item.id}&chapterPid=${this.chapterPid}`})
                this.isRight = false
              }else{
                this.isRight = false
                this.isLearning = true
              }
            },
            //关闭没有学习卡弹窗
            clickClose() {
              this.isLearning = false
            },
            //关闭
            closeMask(val){
               this.isRight=val
            }

        },
        mounted() {
            // 调用应用实例的方法获取全局数据
            //this.getUserInfo()
        },
        onShow () {
            //课程包id
            this.coursePackId=this.$mp.query.coursePackId ? this.$mp.query.coursePackId : -1
            //课程id A列表
            this.courseId = this.$mp.query.courseId ?  this.$mp.query.courseId : -1
            this.isRight = false
            this.getList(this.courseId,this.coursePackId)
        }
    };
</script>

<style scoped >
    .main{
        background-repeat: no-repeat;
        background-size: 100% auto;;
        background-position: top;
        background-image: url("https://static.hulian120.com/learncenter/minipro/v201901/common/top_bg.png");
        background-color: #76A1F8;
    }
</style>
