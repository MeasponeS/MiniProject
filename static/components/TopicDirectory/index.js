import { VantComponent } from '../vant-weapp/common/component';
VantComponent({
    props: {
        topics:{
            type:Array,
            value:[],
        },
        activeIndex:{
            type:Number,
            value:0,
        }
    },
    data: {

    },

    methods: {
        clickClose(){
            this.$emit('clickClose')
        },
        clickItem(e){
            this.$emit('clickItem',e.currentTarget.id)
        }
    }
});
