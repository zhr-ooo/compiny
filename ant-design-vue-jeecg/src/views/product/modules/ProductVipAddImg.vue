<template>
  <a-modal
    title="添加视频"
    :width="600"
    :visible="visible"
    @cancel="handleCancel"
    @ok="handleOk"
    cancelText="关闭"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="视频" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-upload
            v-if="!isVideo"
            accept="video/*"
            :showUploadList="false"
            :supportServerRender="true"
            :before-upload="beforeUpload"
            :customRequest="imgCustomRequest"
            v-decorator="['url', valUrl]"
          >
            <video v-if="videoUrl" id="videoPlayer" controls="controls" width="300" height="150">
              <source :src="videoUrl" />
            </video>
            <a-button v-else>
              <a-icon type="upload" />点击上传视频
            </a-button>
          </a-upload>
          <a-progress v-if="isVideo" :percent="Number(videoPercent)" status="active" />
        </a-form-item>
        <a-form-item label="视频第一帧" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-upload
            accept="image/*"
            listType="picture-card"
            class="avatar-uploader"
            :showUploadList="false"
            :supportServerRender="true"
            :customRequest="imgCustomRequest"
            v-decorator="['timeurl', {rules: [{ required: true,message: '请上传视频第一帧' }]} ]"
          >
            <img v-if="coverimg" :src="coverimg" alt="avatar" style="max-width: 150px;" />
            <div v-else>
              <a-icon :type="loading ? 'loading' : 'plus'" />
              <div class="ant-upload-text" v-if="!loading">Upload</div>
              <div class="ant-upload-text" v-if="loading">{{ percent }}%</div>
            </div>
          </a-upload>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import Vue from "vue";
import { ACCESS_TOKEN } from "@/store/mutation-types";
import { httpAction, getAction } from "@/api/manage";
import * as qiniu from "qiniu-js";
export default {
  name: "ProductVipAddImg",
  data() {
    return {
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      model: {},
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 17 }
      },
      headers: {}, // 文件上传的请求头
      videoUrl: "", // 视频地址
      coverimg: "", // 第一帧图片
      canimg: "",
      percent: "", // 图片上传进度
      videoPercent: 0, // 视频上传进度
      isVideo: false, // 进度条是否显示
      loading: false,
      thisDuration: "",
      valUrl: {
        rules: [
          {
            validator: this.validateVideo
          }
        ]
      },
      url: {
        fileUpload: window._CONFIG["domianQiNiu"], // 七牛云地址
        qiniuToken: "/qiniuUpToken"
      }
    };
  },
  created() {
    const token = Vue.ls.get(ACCESS_TOKEN);
    this.headers = { "X-Access-Token": token };
  },
  computed: {
    uploadAction: function() {
      return this.url.fileUpload;
    }
  },
  methods: {
    validateVideo(rule, value, callback) {
      if (!this.videoUrl || this.videoUrl === "") {
        callback("请上传时长不超过10分钟的视频");
      } else {
        callback();
      }
    },
    show() {
      this.visible = true;
      this.form.resetFields();
      this.videoUrl = "";
      this.coverimg = "";
      this.confirmLoading = false;
      this.videoPercent = 0;
      this.loading = false;
      this.thisDuration = "";
      this.percent = "";
      this.isVideo = false;
    },
    // 关闭、取消
    handleCancel() {
      this.visible = false;
    },
    handleOk() {
      const that = this;
      this.form.validateFields(
        ["url", "timeurl"],
        { force: true },
        (err, values) => {
          if (!err) {        
            let formData = Object.assign(this.model, values);
            formData.url = this.videoUrl;
            formData.timeurl = this.coverimg + "###" + this.thisDuration;
            formData.type = "video";
            formData.title = "";
             console.log('formData');
             console.log(formData)
            that.$emit("ok", formData);

            this.handleCancel();
          }
        }
      );
    },
    // 上传之前的钩子函数
    beforeUpload(file) {
      const that = this;
      let url = URL.createObjectURL(file);
      var audioElement = new Audio(url);
      return new Promise((resolve, reject) => {
        audioElement.addEventListener("loadedmetadata", function() {
          let playTime = audioElement.duration; //playTime就是当前视频长度
          if (playTime > 600) {
            that.$message.warning("视频时长不能超过10分钟!");
            reject(false);
          } else {
            resolve(true);
          }
        });
      });
    },
    // 文件自定义上传
    imgCustomRequest(data) {
      // 上传文件的类型
      const fileType = data.file.type;
      // 上传的图片类型
      if (fileType.indexOf("image") > -1) {
        // 开始转圈圈，上传中
        this.loading = true;
      } else {
        //  否则为视频资源
        this.isVideo = true;
      }
      // 获取文件的后缀名
      const suffix = "." + data.file.name.replace(/^.+\./, "");
      //请求token
      httpAction(this.url.qiniuToken, {}, "post").then(res => {
        if (res) {
          let token = res.data.token;
          const file = data.file;
          const key = new Date().getTime() + suffix;
          let domain = this.url.fileUpload;
          let config = {
            useCdnDomain: true, // 域名加速
            region: null // 不指定具体区域，自动识别
          };
          let putExtra = {
            fname: "",
            params: {},
            mimeType: null
          };
          let observable = qiniu.upload(file, key, token, putExtra, config);
          observable.subscribe({
            next: res => {
              if (fileType.indexOf("image") > -1) {
                this.percent = res.total.percent.toFixed(2);
                this.coverimg = "";
              } else {
                this.videoPercent = res.total.percent.toFixed(2);
              }
            },
            error: () => {
              this.$message.error("上传失败");
              if (fileType.indexOf("image") > -1) {
                // 开始转圈圈，上传中
                this.loading = false;
                this.coverimg = this.canimg;
              } else {
                //  否则为视频资源
                this.isVideo = false;
              }
            },
            // success ： 当请求成功时调用的函数。
            // complete ：当请求成功时，整个请求都已经完成后调用的函数。
            // 解析 ：一般情况下，用success做请求就可以，但是如果我们用了异步请求，又想按顺序执行代码，那就要用到complete。当然ajax也有同步属性：
            complete: response => {
              let allUrl = `${domain}/${response.key}`;
              if (fileType.indexOf("image") > -1) {
                // 开始转圈圈，上传中
                this.coverimg = allUrl;
                this.loading = false;
              } else {
                //  否则为视频资源
                this.isVideo = false;
                this.videoUrl = allUrl;
                //  视频资源时需要请求接口获取时长
                getAction(allUrl + "?avinfo").then(res => {
                  // 时长
                  let makeDuration = res.format.duration;
                  this.thisDuration = this.setDuration(makeDuration);
                });
              }
            }
          });
        }
      });
    },
    setDuration(dur) {
      // 秒数取整
      let intTime = parseInt(dur);
      let fen = "0";
      let miao = "0";
      // 小于10秒， 格式  00:0_
      if (intTime < 10) {
        return `00:0${intTime}`;
      }
      // 大于10秒小于60秒， 格式   00:_
      if (intTime < 60) {
        return `00:${intTime}`;
      }
      // 大于1分钟小于60分钟  格式  _:_
      if (intTime < 3600) {
        const mins = parseInt(intTime / 60);
        const sec = intTime % 60;
        if (mins < 10) {
          fen = `0${mins}`;
        } else {
          fen = `${mins}`;
        }
        if (sec < 10) {
          miao = `0${sec}`;
        } else {
          miao = `${sec}`;
        }
        return `${fen}:${miao}`;
      }
      // 大于60分钟   格式  _:_:_
      if (intTime >= 3600) {
        let hour = parseInt(intTime / 3600);
        const mins = parseInt((intTime % 3600) / 60);
        const sec = ((intTime % 3600) % 60) % 60;
        if (mins < 10) {
          fen = `0${mins}`;
        } else {
          fen = `${mins}`;
        }
        if (sec < 10) {
          miao = `0${sec}`;
        } else {
          miao = `${sec}`;
        }
        return `${hour}:${fen}:${miao}`;
      }
    }
  }
};
</script>

<style scoped>
</style>