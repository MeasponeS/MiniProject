import { VantComponent } from '../vant-weapp/common/component';
VantComponent({
    props: {
        progress: Number,
        info:{
            type:Object,
            value:{
                start:{text:'未答',bg:'#969FA9'},
                end:{text:'已答',bg:'#31B68F'},
            }
        }
    },
    data: {

    },
    methods: {

    }
});
