<template>
    <div class="container main">
        <NavBar title="个人资料" :hasReturn="true"></NavBar>
        <ul>
            <li>
                <div>手机号</div>
                <div class='difference'>{{ userInfo.phone }}</div>
            </li>
            <li>
                <div>真实姓名</div>
                <div class="realname">
                    <input placeholder="请输入"
                           type="text"
                           class='difference'
                           :disabled="userInfo.canChange == 0"
                           v-model="userInfo.realname"

                    />
                </div>
            </li>
        </ul>
        <ul>
            <li>
                <div class="l">性别</div>
                <div class="val" @click="selectSex">{{ userInfo.gender == "M" ? '男' : '女'  }}</div>
                <img class="r" src="/static/images/common/right.png" alt="">
            </li>
            <li>
                <div class="l">电子邮箱</div>
                <div class="val">
                    <input placeholder="请输入"
                           type="text"
                           v-model="userInfo.email"
                    />
                </div>
                <div class="r"></div>

            </li>
            <li>
                <div class="l">所在地</div>
                <div class="val" @click="vanPopup = true">
                    {{ address  }}
                </div>
                <img class="r" src="/static/images/common/right.png" alt="">
            </li>
            <li>
                <div class="l">学历</div>
                <div class="val">
                    <picker mode="selector" class="picker" @change="setEducation" :range="eduType" range-key="name">
                        {{ educationName }}
                    </picker>
                </div>
                <img class="r" src="/static/images/common/right.png" alt="">
            </li>
            <li>
                <div class="l">单位</div>
                <div class="val">
                    <input placeholder="请输入"
                           type="text"
                           v-model="userInfo.orgname"
                    />
                </div>
                <div class="r"></div>
            </li>
            <li>
                <div class="l">部门</div>
                <div class="val">

                    <input placeholder="请输入"
                           type="text"
                           v-model="userInfo.depname"
                    />
                </div>
                <div class="r"></div>
            </li>
            <li>
                <div class="l">参加工作时间</div>
                <picker mode="date" fields="month" @change="setDate" class="val">
                    {{ userInfo.workstart ? userInfo.workstart :''}}
                </picker>
                <img class="r" src="/static/images/common/right.png" alt="">
            </li>
        </ul>

        <van-button  custom-class="main-bg" type="primary" :block="true" @click="saveInfo" size="large">保存</van-button>
        <van-popup
            :show="vanPopup"
            position="bottom"
            :overlay="true"
            :close-on-click-overlay="true"
        >
            <van-picker
                id="vanPicker"
                show-toolbar
                active-class="pickerActive"
                toolbar-class="pickerToolbar"
                :columns="columns"
                @confirm="vanPickerConfirm"
                @change="vanPickerOnChange"
                @cancel="vanPopup = false"
            ></van-picker>
        </van-popup>

    </div>
</template>

<script>

    import {getUserInfo,getDictionaryList,updateUserInfo} from '../../../api/mine/info.js'
    export default {
        data() {
            return {
                userInfo:{},
                eduType:[],
                options:[],
                vanPopup:false,
                address:'',
                columns: [
                    {
                        values: [],
                        className: 'column1',
                        defaultIndex: 0
                    },
                    {
                        values: [],
                        className: 'column2',
                        defaultIndex: 0
                    }
                ]
            };
        },

        components: {

        },

        methods: {
            checkEmail(){
                let myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
                if(!myreg.test(this.userInfo.email)){
                    return false
                }
                return true
            },
            saveInfo(){
                if(this.checkEmail()){
                    this.userInfo.location = this.userInfo.code;
                    updateUserInfo(this.userInfo).then(function(res){
                        wx.showToast({
                            title: '信息修改成功',
                            icon: 'none',
                            duration: 2000
                        })
                    }).catch(_=>{})
                } else {
                    wx.showToast({
                        title: '请输入有效的邮箱地址',
                        icon: 'none',
                        duration: 2000
                    })
                }
            },
            initUserAddress(code = "0-100020"){
                let addressCode = code.split('-');
                let addressStr = ["",""];

                this.address = "";
                this.userInfo.code = code;


                let vanPicker = this.$mp.page.selectComponent('#vanPicker');
                this.options.map((r,i)=>{
                    (this.columns[0].values).push(r.label);
                    if(r.value == addressCode[0]){
                        addressStr[0] = r.label
                        this.columns[1].values = [];
                        r.children.map((c,ci)=>{

                            this.columns[1].values.push(c.label);

                            if(c.code == addressCode[1]){

                                addressStr[1] = c.label
                            }
                        })
                    }
                });
                this.address = addressStr.join('/');
                setTimeout(_=>{
                    vanPicker.setValues(addressStr);
                },500)

            },
            initUserAddressByString(city = ["北京市","朝阳区"]){
                this.address = city.join('/')

                this.options.map(r=>{
                    if(r.label == city[0]){

                        r.children.map(c=>{
                            if(c.label == city[1]){
                                this.userInfo.code = c.value;
                            }
                        });
                    }
                });
            },
            vanPickerOnChange(event) {

                const { value } = event.target;

                this.options.map(r=>{
                    if(r.label == value[0]){
                        this.columns[1].values =[]
                        r.children.map(c=>{
                            this.columns[1].values.push(c.label);
                        });
                    }
                });
            },
            vanPickerConfirm(e){
                const {value} = e.target;
                this.initUserAddressByString(value);
                this.vanPopup = false;
            },

            setDate(e) {
                this.userInfo.workstart =  e.target.value.replace(/-/g,'/');
            },
            setEducation(e){
                this.userInfo.education = this.eduType[e.target.value].code
            },
            selectSex(){
                let self = this;
                wx.showActionSheet({
                    itemList: ['男', '女'],
                    success(res) {

                        if(res.tapIndex == 0){
                            self.userInfo.gender = 'M'
                        }else {
                            self.userInfo.gender = 'F'
                        }
                    },
                    fail(res) {

                    }
                })
            }
        },
        computed: {
            educationName(){
                for (let i =0;i<this.eduType.length;i++){
                    if(this.eduType[i].code == this.userInfo.education){
                        return this.eduType[i].name
                    }
                }
                return "";
            }
        },
        onShow() {
            let self = this;

            getUserInfo().then(r=>{
                this.userInfo = r;

                getDictionaryList().then(res=>{
                    self.eduType = res.eduType;
                    self.eduType.push({code:"0",name:"无"});
                    self.options = [];
                    res.provinceCityList.map(function(item,index){
                        self.options.push({'value': item.parent.code,'label': item.parent.name,'children': [] });
                        item.childList.map(function(list,i){
                            self.options[index].children.push({'value' : list.code,'label' : list.name,code:list.code.split('-')[1]});
                        })
                    })
                    self.initUserAddress(self.userInfo.code);
                }).catch(_=>{})
            })
        }
    };
</script>

<style lang="less">
    .pickerActive{
        color:#4D86F8!important;
    }
    .pickerToolbar{
        .van-picker__confirm,.van-picker__cancel{
            color:#4D86F8
        }
    }
    .main{
        background-repeat: no-repeat;
        background-size: 100% auto;
        background-position: top;
        padding: 20rpx;
        background-image: url("https://static.hulian120.com/learncenter/minipro/v201901/common/top_bg.png");
    }

    .realname{
        text-align: right;
    }
    ul{
        background: #fff;
        border-radius: 5rpx;
        overflow: hidden;
        margin-bottom: 20rpx;
    }
    ul li{
        width: 100%;
        height: 106rpx;
        padding: 0 32rpx;
        display: flex;
        color: #222;
        font-size: 30rpx;
        border-bottom: 1px solid #F5F4F7;
        align-items: center;
        position: relative;
        justify-content: space-between;
    }
    ul .l{
        flex: 1;
    }
    ul .val{
        padding-right: 20rpx;
        text-align: right;
        flex: 1;
        color: #969FA9;
        font-size: 26rpx;
    }
    ul .r{
        width: 16rpx;
        height: 27rpx;
    }
    .main .difference{
      font-size:32rpx;
      font-weight: bold;
    }

</style>
