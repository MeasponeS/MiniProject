<template>
    <div class="container main" style="height: 100vh;display: flex;flex-direction: column">
        <div>
            <div class="contentTop">
                <div @click="goSpecial" hover-class="hover-opacity" class="name">
                    <p>{{packageInfo.name}}</p>
                    <!--<a href="##">&gt;</a>-->
                </div>
                <div class="info">
                    <div class="info-val">
                        <span class="chapters">共（{{packageInfo.chapterSize}}）小节</span>
                        <span class="line"></span>
                        <span class="learner">（{{packageInfo.studySize}}）人学过</span>
                    </div>
                    <div class="select-sub" v-if="selectSubMajor.hasSubMajor" @click="selectSubMajor.show = true ">
                        切换亚专业
                    </div>
                </div>
            </div>
        </div>
        <ul class="chapter-a-list">
            <li @click="goChapterB(item)" hover-class="hover-opacity" v-for="item in courseList" :key="item.id">
                <h3>{{ item.index}}、{{ item.name }}</h3>
                <span>已学{{ item.progress ? item.progress : 0}}%</span>
                <van-progress
                    custom-class="vanPercentage"
                    :percentage="item.progress"
                    :show-pivot="false"
                    color="#9DBCF8"
                />
                <span class="percentage">
                    <em>100%</em>
                </span>
            </li>
        </ul>
        <select-major
            :show="selectSubMajor.show"
            :packId="selectSubMajor.packId"
            @onClose="closeSelectSubMajor"
        ></select-major>
    </div>
</template>

<script>
    import SelectMajor from "@/components/SelectSubMajor/SubMajor.vue";
    import {courseList} from '../../../api/study/index'
    import {toChinesNum} from '../../../utils/index'
    export default {
        data() {
            return {
                //课程包数组
                courseList:[],
                selectSubMajor:{
                    hasSubMajor:false,//
                    show:false,
                    packId:0
                },
                //课程包的信息
                packageInfo:{},
                //课程id
                coursePackId:null
            };
        },

        components: {
            SelectMajor
        },
        methods: {
            closeSelectSubMajor(packId){
                let query = this.$root.$mp.query;
                this.selectSubMajor.show = false;
                if(packId == query.subMajorId){
                    return;
                }
                wx.redirectTo({url:`/pages/study/chapterA/main?coursePackId=${query.coursePackId}&subMajorId=${packId}`});
                //不要采取下面这张方法，因为选择亚专业跳到章节b返回之后不能更新专业
                //  this.initList(packId);
                // this.selectSubMajor.show = false
            },

            goSpecial(){
                wx.navigateTo({ url:"/pages/study/special/main" });
            },
            //课程去往课程目录页面
            goChapterB(item){
                //当前点击的是courseId、从列表传输的是 coursePackId
                wx.navigateTo({ url:`/pages/study/chapterB/main?coursePackId=${this.coursePackId}&courseId=${item.id}` });
            },
            initList(packId){
                courseList({coursePackId:packId}).then(r=>{
                    this.packageInfo = r.packageInfo || {}
                    wx.setNavigationBarTitle({
                        title: this.packageInfo.name
                    })
                     
                    let list = r.courseList || [];
                    this.courseList = list.map((v,index)=>{
                         let finishProportion = Number(v.finishProportion)  || 0;
                             finishProportion =  finishProportion > 100 ? 100 : finishProportion;
                        return {
                            id:v.id,
                            name:v.name,
                            index:toChinesNum(index+1),
                            progress:finishProportion,
                        }
                    });
                }).catch(_=>{})
            }
        },
        onShow() {
          this.selectSubMajor.hasSubMajor = false
            let query = this.$root.$mp.query;
            let packId = query.coursePackId;//注意
            this.coursePackId = packId
            if(query.hasOwnProperty('subMajorId')){//有亚专业
                setTimeout(_=>{
                    this.selectSubMajor.packId = query.coursePackId;
                },800);
                this.selectSubMajor.hasSubMajor = true;
                packId = query.subMajorId;
            }else{
              this.selectSubMajor.hasSubMajor = false
            }
            if(query.hasOwnProperty('noSelect') && query.noSelect ==1){
                setTimeout(_=>{
                    this.selectSubMajor.show = true;
                },900);
            }
            this.initList(packId)
        }
    };
</script>

<style scoped >
    .main{
        background-repeat: no-repeat;
        background-size: 100% auto;;
        background-position: top;
        background-image: url("https://static.hulian120.com/learncenter/minipro/v201901/common/top_bg.png");
    }

</style>
