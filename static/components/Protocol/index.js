import { VantComponent } from '../vant-weapp/common/component';
VantComponent({
    props: {
        value:Boolean
    },
    data: {

    },

    methods: {
        switchProtocol(){
            this.$emit('changeProtocol');
        },
        toAgreement(){
            wx.navigateTo({ url:"/pages/other/agreement/main" });
        }
    }
});
