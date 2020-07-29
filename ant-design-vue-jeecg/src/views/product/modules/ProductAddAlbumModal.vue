<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirm-loading="confirmLoading"
    @ok="handleOK"
    @cancel="handleCancel"
    cancelText="关闭"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="专辑名称"
        >
          <a-input placeholder="请输入专辑名称" v-decorator="['albumname', {rules: [{required: true, message: '请输入专辑名称'}]}]"></a-input>
        </a-form-item>
      </a-form>
      <a-form :form="form">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="专辑封面"
        >
          <a-upload
            listType="picture-card"
            class="avatar-uploader"
            :showUploadList="false"
            :supportServerRender="true"
            :customRequest="customRequest"
            v-decorator="['albumimg', {}]"
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
  import Vue from 'vue'
  import { httpAction } from '@/api/manage'
  import { ACCESS_TOKEN } from "@/store/mutation-types"
  import * as qiniu from 'qiniu-js'
  export default {
    name: "ProductAddAlbumModal",
    data () {
      return {
        title: '新增专辑',
        visible: false,
        confirmLoading: false,
        form: this.$form.createForm(this),
        headers: {},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 17 },
        },
        model: {},
        coverimg: '',
        canimg: '',
        percent: '',
        loading: false,
        url: {
          add: '/user/album/add',
          fileUpload: window._CONFIG['domianQiNiu'],
          qiniuToken: '/qiniuUpToken'
        }
      }
    },
    created () {
      const token = Vue.ls.get(ACCESS_TOKEN);
      this.headers = {"X-Access-Token":token};
    },
    methods: {
      add () {
        this.form.resetFields()
        this.confirmLoading = false
      },
      handleOK () {
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true;
            let formData = Object.assign(this.model, values);
            formData.albumimg = this.coverimg;
            //时间格式化

            console.log(formData)
            httpAction(this.url.add,formData,'POST').then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.$emit('ok');
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
              that.handleCancel();
            })
          }
        })
      },
      handleCancel () {
        this.$emit('close')
        this.visible = false
      },
      // 自定义上传
      customRequest (data) {
        const suffix = "." + data.file.name.replace(/^.+\./, '')
        //请求token
        httpAction(this.url.qiniuToken, {}, 'post').then((res) => {
          if (res) {
            let token = res.data.token
            const file = data.file
            const key = new Date().getTime() + suffix;
            let domain = this.url.fileUpload
            let config = {
              useCdnDomain: true,
              region: null
            }
            let putExtra = {
              fname: '',
              params: {},
              mimeType: null
            }
            let observable = qiniu.upload(file, key, token, putExtra, config);
            observable.subscribe({
              next: (res) => {
                this.loading = true;
                this.percent = res.total.percent.toFixed(2)
                this.coverimg = '';
              },
              error: () => {
                this.$message.error('上传失败')
                this.loading = false;
                this.coverimg = ''
              },
              complete: (response) => {
                this.coverimg = `${domain}/${response.key}`;
                this.loading = false;
              }
            })
          }
        })
      },
    }
  }
</script>

<style scoped>

</style>