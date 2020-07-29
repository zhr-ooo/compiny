<template>
  <div>
    <div v-for="(item,i) in listData" :key="i" >
      <div style="position:relative;width:430px;height:500px;float:left">
      <video
        :id="'myVideo'+item.id"
        class="video-js vjs-default-skin vjs-big-play-centered"
        x-webkit-airplay="allow"
        poster
        webkit-playsinline
        playsinline
        x5-video-player-type="h5"
        x5-video-player-fullscreen="true"
        preload="auto"
        style="float:left;"
      >
        <source :src="item.streamAddrUrl" type="application/x-mpegURL" />          
      </video>
   <div style="width:400px;position:absolute;bottom:70px;text-align:center;color:#333333;font-size:16px" :id="'videoTitle'+item.id">{{item.nickName}}</div>
     <div style="width:400px;position:absolute;bottom:45px;text-align:center;color:#333333;font-size:15px" :id="'videoTitle'+item.id">房间号：{{item.code}}</div>
     <div style="width:400px;position:absolute;bottom:15px;text-align:center;color:#333333;font-size:15px" :id="'videoTitle'+item.id">{{item.merchant === 0?'未开通商户':'已开通商户'}}</div>
     <!-- {{userInfo.gender == 1? '../../images/nan.png': '../../images/nv.png'}}" -->
    </div>
    </div>
  </div>
</template>

<script>
// import flv from "flv.js"
import videojs from "video.js";
import "videojs-flash";
import { postAction, putAction, getAction } from "@/api/manage";
export default {
  name: "screenMonitoring",

  data() {
    return {
      jie: "/system/live/room/list",
      list: [],
      listData:[],
      playlist:[]
    };
  },
  beforeDestroy() {
    //  this.myPlayer.dispose()
  for(let i=0;i<this.playlist.length;i++){
     this.playlist[i].dispose(); //（第四步）dispose()是官方的销毁函数
    }
    
  },
  // created() {
  //   console.log("初始化")
  //   this.getViewList();
  // },
  async mounted() {
    await this.getViewList();
    await this.initVideo();
  },
  methods: {
    getViewList() {
      return getAction(this.jie).then((res) => {
          if (res.success) {
            console.log(res)
            this.list = res.result.records;
            console.log(this.list)
            for(let i of this.list){
              if(i.state === 1){
              let arrStr = {
                coverImg:i.coverImg,
                streamAddrUrl:i.streamAddrUrl,
                id:i.id,
                nickName:i.nickName,
                code:i.code,
                merchant:i.merchant
              }
              this.listData.push(arrStr)
              console.log(this.listData)
              if(this.listData.length === 0){
                alert("当前没有人在直播哦~")
              }else{
                return;
              }
              }
            }
          } else {
            this.$message.success(res.message);
          }
        })
        .catch((err) => {
          this.$message.success(err.message);
        });
    },

    initVideo() {
      this.listData.map((item, i) => {
        var myPlayer = this.$video("myVideo" + item.id, {
          controls: true,
          preload: "auto",
          width: "400px",
          height: "400px",
          //封面图
          poster: item.coverImg,
        });
        this.playlist.push(myPlayer)
        console.log(this.playlist)
      });
    },
    
  },
};
</script>

<style scoped>
</style>