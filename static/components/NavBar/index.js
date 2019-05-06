import { VantComponent } from '../vant-weapp/common/component';
VantComponent({
    props: {
        title: {
            type:String,
            value:'',
        },
        hasReturn:{
            type:Boolean,
            value:false,
        },
        hasReturnEvent:{//如果为真，returnUrl参数无效
            type:Boolean,
            value:false,
        },
        returnUrl:{
            type:String,
            value:'',
        },
        bgColor:{
            type:String,
            value:'none',//none
        },
        textType:{
            type:String,
            value:'#fff'
        }
    },
    data: {
        top: 20,
        height:48
    },
    created(){
        const self = this;
        wx.getSystemInfoSync({
            success(system) {
                let custom = wx.getMenuButtonBoundingClientRect();
                self.setData({
                    top: system.statusBarHeight,
                    height: (custom.top - system.statusBarHeight) * 2 + custom.height
                });
            }
        });
    },
    methods: {
        returnBtn(){
            if(this.data.hasReturnEvent){
                this.$emit('clickReturnBtn');
                return;
            }
            if(this.data.returnUrl){
                wx.navigateTo({ url:this.data.returnUrl });
            }else {
                wx.navigateBack({ delta: 1 })
            }
        }
    }
});
