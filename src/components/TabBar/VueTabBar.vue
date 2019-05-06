<template>
    <div>
        <ul class="my-tab">
            <li :class="{active:activeIndex == index}" v-for="(item,index) in list" :key="item.id" @click="clickTab(index)" >
                <span class="line">
                    {{ item.name }}
                </span>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        props: {
            list: {
                type:Array,
                default:[
                    {id:1,name:'课程'},
                    {id:2,name:'习题'},
                ],
            },
        },
        data() {
            return {
                activeIndex : 0,
            };
        },
        methods: {
            clickTab(index){
                this.$emit('clickTab',index,_=>{
                    this.activeIndex = index;
                })
            }
        },
        mounted() {
        }
    };
</script>

<style  lang="less">
    .my-tab{
        display: flex;
        align-items: center;
        background: #fff;
        height: 100rpx;
        >li{
            flex: 1;
            font-size: 30rpx;
            color: #222;
            text-align: center;
            height: 41rpx;
            border-right: 1rpx solid #969FA9;
            &.active{
                font-size: 36rpx;
                color: #2B60FF;
                position: relative;
                >.line{
                    display: block;
                    width: 86rpx;
                    margin: 0 auto;
                    height: 36rpx;
                    border-bottom:14rpx solid #FDE5BF;
                }
                /*&:after{*/
                    /*content: '';*/

                    /*opacity: .8;*/
                /*}*/
            }
            &:last-child{
                border-right:none;
            }
        }
    }

</style>
