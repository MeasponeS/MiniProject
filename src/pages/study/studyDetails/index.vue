<template>
    <div class="container">
        <video controls
               v-if="detailData.videoUrl"
               autoplay="autoplay"
               style="width:100%;height:422rpx"
               :src="detailData.videoUrl"
               @play="videoPlay"
               @timeupdate="timeUpdate"
               @pause="videoPause"
        ></video>
        <audio v-if="detailData.audioUrl" :src="detailData.audioUrl" autoplay="autoplay" controls></audio>
        <div class="chapterContent" v-if="detailData.contentData">
            <div v-html="detailData.contentData"></div>
            <!--            <rich-text node="{{detailData.contentData}}" class="rich"></rich-text>-->
        </div>
        <TopicBottom
            type="course"
            :collectState="collectState"
            :directoryState="directoryState"
            @clickCollect="collectChapter"
            @clickDirectory="menuList"
            @clickNext='clickNext'
            @clickPrevioust='clickPrevioust'
        ></TopicBottom>
        <Directory
            :show="directoryState"
            :catalogMenu="chaptersChildList"
            @toDetail="toDetail"
            @closeMask='closeMask'
            :obj="chapterObj"
        ></Directory>
        <noLearningCard @clickClose="clickClose" :show='isLearning'></noLearningCard>
        <!--        :show="directoryState"-->
    </div>
</template>

<script>
    import Directory from './Directory'
    import {chapterContent, chapterChildList} from "../../../api/study/index.js"
    import {userfavor} from "../../../api/common/index"
    import report from './report.js'
    import noLearningCard from "../../../components/NoLearningCard/NoLearningCard.vue"

    export default {
        mixins: [report],
        data() {
            return {
                collectState: false,
                directoryState: false,
                //课程包id
                coursePackId: null,
                //课程id
                courseId: -1,
                //子章节id
                chapterId: null,
                //详情数据
                detailData: {},
                //当前主目录id
                chapterPid: null,
                //子目录的列表
                chaptersChildList: [],
                //标识章节目录信息
                currentCount: null,
                chapterObj: {},
                //判断子章节是否有权限
                isPermission: false,
                //是否有学习卡的变量
                isLearning: false
            };
        },
        components: {
            Directory,
            noLearningCard
        },

        methods: {
            //关闭没有学习卡弹窗
            clickClose() {
                this.isLearning = false
            },
            closeMask(val) {
                this.directoryState = val
            },
            //点击收藏按钮触发的事件
            collectChapter() {
                let isVideo = this.detailData.videoUrl ? '0' : '1',
                    params = {
                        type: '0',
                        chapterQuestionId: this.chapterId,
                        courseId: this.courseId,
                        isVedio: isVideo,
                        leveId: "0",
                        packageId: this.coursePackId
                    };
                userfavor(params).then((res) => {
                    this.collectState = res === 0 ? true : false
                })
            },
            //初始化页面数据
            init() {
                let params = {chapterId: this.chapterId, courseId: this.courseId, packId: this.coursePackId};
                chapterContent(params).then((res) => {
                    if (res.hasOwnProperty('videoUrl') && res.videoUrl) {
                        this.videoReport(this.coursePackId, this.courseId, this.chapterId)
                    } else {
                        this.richTextReport(this.coursePackId, this.courseId, this.chapterId)
                    }
                    res.contentData = res.contentData.replace(/\<img/g, '<img style="width:100%;height:auto;"')
                    if(res.isfavor === 0){
                      this.collectState = true
                    }else{
                      this.collectState = false
                    }
                    wx.setNavigationBarTitle({
                        title: res.name
                    });

                    this.detailData = res;
                    if (res.hasOwnProperty('videoUrl') && res.videoUrl) {
                        this.videoReport(this.coursePackId, this.courseId, this.chapterId)
                    } else {
                        this.richTextReport(this.coursePackId, this.courseId, this.chapterId)
                    }
                })
            },
            //点击下一节
            clickNext() {
                this.switchoverInit(true)
            },
            //点击上一节
            clickPrevioust() {
                this.switchoverInit(false)
            },
            //判断是否有权限
            hasPermission() {
                //if(this.isPermission || )
                this.chaptersChildList.map((item, index) => {
                    if (item.id === Number(this.chapterId)) {
                        // console.log(2222)
                        if (item.vipType === 0 || this.isPermission) {
                            this.init()
                        } else {
                            this.directoryState = false
                            this.isLearning = true
                        }
                    }
                })
            },
            //上一节和下一节的公共函数
            switchoverInit(val) {
                //val为true代表下一节 false 为上一节
                if (this.chaptersChildList.length !== 0) {
                    let temp = []
                    this.chaptersChildList.map((item, index) => {
                        if (temp.indexOf(item.id) === -1) {
                            temp.push(item.id)
                        }

                    })
                    this.currentCount = temp.indexOf(Number(this.chapterId))
                    if (val) {
                        if (this.currentCount === this.chaptersChildList.length - 1) {
                            wx.showToast({
                                title: "已经是最后一节",
                                icon: 'none',
                                duration: 1000,
                                mask: true
                            })
                        } else {
                            this.currentCount++
                            this.chapterId = temp[this.currentCount]
                            this.hasPermission()
                        }
                    } else {
                        if (this.currentCount === 0) {
                            wx.showToast({
                                title: "已经是第一节",
                                icon: 'none',
                                duration: 1000,
                                mask: true
                            })
                        } else {
                            this.currentCount--
                            this.chapterId = temp[this.currentCount]
                            this.hasPermission()
                        }
                    }
                }

            },
            //点击目录的每一项
            toDetail(item) {
                this.chapterId = item.id
                this.directoryState = false
                this.hasPermission()
            },
            //获取目录
            menuList() {
                // if (this.chaptersChildList.length !== 0) {
                if(this.directoryState ){
                    this.directoryState=false
                    return
                }
                    this.directoryState = true
                    this.chapterList()
                // } else {
                //     return
                // }
            },
            //获取子章节目录
            chapterList() {
                let params = {courseId: this.courseId, chapterPid: this.chapterPid, coursePackId: this.coursePackId}
                chapterChildList(params).then((res) => {
                    this.chaptersChildList = res.chapterList;
                    this.chapterObj = res.chapter;
                    this.isPermission = res.isPermission;
                })
            }
        },
        mounted() {
            // 调用应用实例的方法获取全局数据
            //this.getUserInfo()
        },
        onShow() {
            this.directoryState = false
            let query = this.$mp.query;
            this.coursePackId = query.coursePackId ? query.coursePackId : -1
            this.courseId = query.courseId ? query.courseId : -1
            this.chapterId = query.chapterId ? query.chapterId : -1
            this.chapterPid = query.chapterPid ? query.chapterPid : -1
            this.init();
            this.chapterList()
        }
    };
</script>

<style scoped>

</style>
