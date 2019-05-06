<template>
    <div class="container main">
        <h3>卡号</h3>
        <input type="number" class="card" placeholder="请输入健康产业学堂发送的卡号" v-model="cardInfo.cardNum">
        <h3>密码</h3>
        <input type="number" class="pass" placeholder="请输入健康产业学堂发送的密码" v-model="cardInfo.password">
        <van-button custom-class="main-bg" type="primary" @click="submit" :block="true" size="large">开通</van-button>
        <span>
            如需购买课程请拨打电话：
            <em class="phone" @click="callIt">{{phone}}</em>
        </span>
    </div>
</template>

<script>
    import {openStudyCard} from '../../../api/study/index'
    import {getOrgInfo} from '../../../utils/dataStorage'
    export default {
        data() {
            return {
                cardInfo:{
                    cardNum:'',
                    password:''
                },
                phone:''
            };
        },

        components: {
        },
        methods: {
            submit(){
                if(this.cardInfo.cardNum.length  < 4 || this.cardInfo.password.length < 4){

                    wx.showToast({
                        title: '请填写正确的卡号密码',
                        icon: 'none',
                        duration: 1800,
                        mask:true
                    });
                    return
                }

                openStudyCard({cardno:this.cardInfo.cardNum,password:this.cardInfo.password}).then(r=>{
                    wx.showModal({
                        title: '提示',
                        content: '开卡成功',
                        showCancel:false,
                        confirmColor:'#4D86F8',
                        success(res) {
                            wx.navigateBack({ delta: 1 })
                        }
                    })
                }).catch(_=>{})

            },
            callIt(){
                wx.makePhoneCall({
                    phoneNumber:this.phone
                })
            }
        },
        onShow(){
            //登陆之前和登陆之后的
            this.phone = getOrgInfo().phone
        }
    };
</script>

<style scoped >

</style>
