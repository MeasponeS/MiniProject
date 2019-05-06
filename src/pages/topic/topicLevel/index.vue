<template>
    <div class="container">
        <div class="topic-level">
            <div class="top">
                <div class="top-l">
                    <div class="tip">总关卡</div>
                    <div class="level-num">{{ levelInfo.levelNum || 0 }}</div>
                </div>
                <div class="line"></div>
                <div class="top-r">
                    <div class="tip">您已通过</div>
                    <div class="level-num">{{ levels.finished.length || 0 }}</div>
                </div>
            </div>
        </div>
        <div>
            <div class="tab">
                <ul>
                    <li @click="toggleTab('all')" :class="{active:status == 'all'}">全部</li>
                    <li @click="toggleTab('notStart')" :class="{active:status == 'notStart'}">未开始</li>
                    <li @click="toggleTab('unPass')" :class="{active:status == 'unPass'}">未通过</li>
                    <li @click="toggleTab('pass')" :class="{active:status == 'pass'}">已通过</li>
                </ul>
                <div class="to-error" @click="toError">
                    错题集
                    <img src="/static/images/common/right.png" alt="">
                </div>
            </div>
            <ul class="level-list">
                <li v-for="(item,index) in levelList" :key="item.id" @click="topicDetails(item)">
                    <span :class="'status-'+item.isFinish">{{ item.isFinish == 0 ? '未通过' : ( item.isFinish == 1 ? '已通过' : '未开始') }}</span>
                    <h3>第{{ item.sort }}关</h3>
                </li>
            </ul>
        </div>

    </div>
</template>

<script>
    import {objSort} from '../../../utils/index'
    import {getLevelList} from '../../../api/topic/index'
    export default {
        data() {
            return {
                status:'all',
                statusVal:{
                    all:'全部',
                    notStart:'未开始',
                    unPass:'未通过',
                    pass:'已通过'
                },
                levels:{
                    finished: [],
                    prefinish: [],
                    prestudy: []
                },
                levelInfo:{}
            };
        },

        components: {

        },

        methods: {
            toError(){
                let query = this.$root.$mp.query;
                wx.navigateTo({url:`/pages/topic/errorList/main?packageId=${query.packageId}&courseId=${query.courseId}`});
            },
            toggleTab(status){
                this.status = status;
            },
            topicDetails(item) {
                let query = this.$root.$mp.query;
                if(0 == item.isFinish || 1 == item.isFinish){
                    //结果页面
                    wx.navigateTo({url:`/pages/topic/topicResults/main?packageId=${query.packageId}&courseId=${query.courseId}&levelId=${item.id}`});
                }else {
                    wx.navigateTo({url:`/pages/topic/topicDetails/main?packageId=${query.packageId}&courseId=${query.courseId}&levelId=${item.id}&displayUserAnswer=0`});
                }
            },
        },
        computed: {

           levelList: function () {
                let levels = this.levels;
                if("all" == this.status){
                    return [...levels.finished,...levels.prefinish,...levels.prestudy].sort(objSort('sort',false));
                }
                if("notStart" == this.status){
                    return levels.prestudy;
                }
               if("unPass" == this.status){
                   return levels.prefinish;
               }
               if("pass" == this.status){
                   return levels.finished;
               }
                return []
            }
        },
        onShow() {
            let query = this.$root.$mp.query;

            getLevelList({
                packageId: query.packageId,
                courseId: query.courseId,
            }).then(r => {
                this.levelInfo = r.course;
                this.levels = r.levels;
            }).catch(_ => {})
        }
    };
</script>
<style lang="less">
    @import "./css/index.less";
</style>
