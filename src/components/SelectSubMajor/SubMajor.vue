<template>
    <van-popup
        :show="show"
        position="bottom"
        @close="onClose"
        :overlay="false"
        custom-class="sub-major"
        custom-style="width:100%;height:100%;padding:40rpx"
    >
        <h3>
            选择您报考的亚专业（点击选择）
        </h3>
        <em @click="onClose">×</em>
        <ul>
            <li @click="selectMajor(item.packId,item.selected)" :class="{active:item.selected == 1}" v-for="item in list" :key="item.id">{{ item.name }}</li>
        </ul>
        <h3>亚专业介绍</h3>
        <span>
            主管护师共设置护理学、内科护理、外科护理、妇产科护理、儿科护理、社区护理六个亚专业的考试。护理学专业（中级）基础知识和相关专业知识考核内容相同；专业知识和专业实践能力根据报考亚专业的不同，所考核的内容不同（详见《职称考试那些事儿（中级）》）。
        </span>
    </van-popup>
</template>

<script>
    import {subMajor,submajor as selectSubMajor} from '../../api/study/index'
    export default {
        name: "subMajor",
        props: {
            show: {
                type: Boolean,
                default: false
            },
            packId: {
                type: [Number, String],
                default: 0
            }
        },
        data() {
            return {
                list:[]
            };
        },
        watch: {
            "packId": {
                handler: function() {
                    if(this.packId == 0 || this.packId.length == 0){
                        return;
                    }
                    this.initList();
                },
                // 深度观察
                deep: true
            }
        },
        methods: {
            selectMajor(packId,selected){
                if(selected == 1){
                    return;
                }
                selectSubMajor({
                    parentPackId:this.packId,
                    coursePackId:packId
                }).then(r=>{
                    this.initList();
                    this.$emit("onClose",packId);
                }).catch(_=>{})
            },
            onClose() {
                for (let i = 0;i < this.list.length;i++) {
                    if(this.list[i].selected ==1){
                        this.$emit("onClose",this.list[i].packId);
                        return;
                    }
                }
                this.$emit("onClose",0);//没选择
            },
            initList(){
                subMajor({coursePackId:this.packId}).then(item=>{
                    this.list = item.subMajorList;
                }).catch(_=>{})
            }
        }
    };
</script>

<style lang="less">
    .sub-major {
        position: relative;
        em {
            font-size: 40rpx;
            position: absolute;
            right: 40rpx;
            top: 36rpx;
        }
        h3 {
            font-size: 32rpx;
            color: #222;
            font-weight: 600;
        }
        ul {
            width: 100%;
            margin-top: 34rpx;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            li {
                width: 48%;
                padding:0 10rpx;
                height: 100rpx;
                overflow: hidden;
                text-overflow: ellipsis;
                text-align: center;
                line-height: 100rpx;
                white-space: nowrap;
                font-size: 32rpx;
                color: #333;
                border: 1rpx solid #969FA9;
                border-radius: 5rpx;
                margin-bottom: 40rpx;
                &.active {
                    background: #4D86F8;
                    color: #FFF;
                    border: 1rpx solid #4D86F8;
                }
            }
        }
        span {
            display: block;
            font-size: 30rpx;
            color: #333;
            line-height: 60rpx;
            margin-top: 60rpx;
        }

    }

</style>
