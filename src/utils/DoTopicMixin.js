


//目前使用的地方 考试详情、考试结果详情、习题详情（习题结果详情）
export default {
    data: function () {
        return {
            topicList: [],
            activeIndex:0,
            clientX:0,
        }
    },
    computed: {
        currentIndex(){
            let index = this.activeIndex;
            let topic = this.topicList[index] || {};
            if(topic.hasOwnProperty('index')){
                return topic.index
            }
            if(topic.hasOwnProperty('indexs')){
                return topic.indexs[0]+'~'+topic.indexs[topic.indexs.length -1]
            }
            return parseInt(index) + 1;
        },
        topicTotal(){
            let topic = this.topicList[(this.topicList.length) -1] || {};
            if(topic.hasOwnProperty('index')){
                return topic.index
            }
            if(topic.hasOwnProperty('indexs')){
                return topic.indexs[topic.indexs.length -1]
            }
            return this.topicList.length;
        },
        childrenTopic(){
            let arrDone = [];
            let topic = this.topicList[this.activeIndex];
            if(!topic)return [];


            if(1 == topic.newType){
                return []
            }
            let allTopic = []
            if(3 == topic.newType){
                allTopic = topic.a3a4Questions;
            }
            if(5 == topic.newType){
                allTopic = topic.questionArr;
            }

            allTopic.forEach(r=>{
                arrDone.push(r.index);
            });
            return arrDone
        },
        childrenTopicDo: function () {
            let arrDone = [];
            //已经完成的题目
            let topic = this.topicList[this.activeIndex];
            if(!topic)return [];
            if(1 == topic.newType){
                return []
            }
            let allTopic = []
            if(3 == topic.newType){
                allTopic = topic.a3a4Questions;
            }
            if(5 == topic.newType){
                allTopic = topic.questionArr;
            }

            allTopic.forEach(r=>{
                if(r.historyAnswer.length != 0){
                    arrDone.push(r.index);
                }
            });
            return arrDone

        }
    },
    methods: {
        clearAllAnswer(topics){
            topics.forEach((r,i)=>{
                if(1 == r.newType){
                    topics[i].historyAnswer = [];
                }
                if(3 == r.newType){
                    topics[i].a3a4Questions.forEach((q,a)=>{
                        topics[i].a3a4Questions[a].historyAnswer = [];
                    })
                }
                if(5 == r.newType){
                    topics[i].questionArr.forEach((q,a)=>{
                        topics[i].questionArr[a].historyAnswer = [];
                    })
                }
            });
            return topics;
        },
        clickOption(optionName,index){
            let topic = this.topicList[this.activeIndex];
            if(1 == topic.newType){
                this.topicList[this.activeIndex].historyAnswer = optionName;
            }
            if(3 == topic.newType){
                topic = topic.a3a4Questions[index].historyAnswer = optionName;;
            }
            if(5 == topic.newType){
                topic = topic.questionArr[index].historyAnswer = optionName;;
            }
        },
        clickPrevioust(){
            if(this.activeIndex <= 0){
                this.activeIndex = 0;
                wx.showToast({
                    title: '已经是第一题了！',
                    icon: 'none',
                    duration: 2000
                })
                return;
            }
            wx.showLoading({
                title: '加载中',
                mask:true,
            })
            this.activeIndex --;
            setTimeout(function () {
                wx.hideLoading()
            }, 320)
        },
        clickNext(){

            let topicLength = this.topicList.length

            if(this.activeIndex >= topicLength -1){
                this.activeIndex = topicLength -1;
                wx.showToast({
                    title: '已经是最后一题了！',
                    icon: 'none',
                    duration: 2000
                })
                return;
            }
            wx.showLoading({
                title: '加载中',
                mask:true,
            })
            this.activeIndex ++;
            setTimeout(function () {
                wx.hideLoading()
            }, 320)
        },
        touchStart(e){
            this.clientX = e.mp.changedTouches[0].clientX
        },
        touchEnd(e){
            let x = e.mp.changedTouches[0].clientX;
            let val = x - this.clientX;
            if(val > 66){
                this.clickPrevioust()
            }
            if(val < - 66){
                this.clickNext()
            }
        },

    },

}
