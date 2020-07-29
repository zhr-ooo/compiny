<template>
  <a-modal
    title="成员列表"
    :width="1200"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :footer="null"
    @cancel="handleCancel"
  >
    <!-- <a-spin :spinning="confirmLoading"> -->
      <!-- <div> -->
        <video  class="videoElement cover" controls="controls"></video>
      <!-- </div> -->
    <!-- </a-spin> -->
  </a-modal>
</template>

<script>
import { filterObj } from "@/utils/util";
// import { JeecgListMixin } from "@/mixins/JeecgListMixin";
import { getAction } from "@/api/manage";
import flvjs from 'flv.js/dist/flv.min.js';
export default {
  name: "lxModal",
  // mixins: [JeecgListMixin],

  data() {
    return {
      visible: false,
      confirmLoading: false,
      loading: false,
      id: null,
      url: {
        UrlById: "/system/live/record/findLivePlayUrlById"
      }
    };
  },
  created() {

  },
    mounted() {
              if(flvjs.isSupported()){
      this.player = flvjs.createPlayer({
        type: 'flv',
        isLive: 'true',
        // url: 'http://play.dujialive.com/vlive/35200870.flv?txSecret=4fee6b96d17904c26c49a0b2d3792833&txTime=5ED615A8' //flv文件地址
        url:this.contentList,
      });
    }
      var videoElement = document.getElementsByClassName('videoElement');
      this.player.attachMediaElement(videoElement);
      this.player.load()
  },
  methods: {
    open(record) {
      this.id = record.id;
      this.getContentModel(record.id);
      this.visible = true;
    },
    handleCancel() {
      this.$emit("close");
      this.contentList = "";
      this.visible = false;
      this.dataSource = [];
    },
    getContentModel(id) {
      const that = this;
     getAction(this.url.UrlById, { id: this.id }).then(res => {
      if (res.success) {
        console.log(res);
        let record = res.result;

        this.contentList = res.result.streamAddrUrl;
        this.$forceUpdate();

        console.log(this.contentList);
      } else {
        that.$message.warning(res.message);
      }
    });
    }
  }
};
</script>

<style scoped>
</style>