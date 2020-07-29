<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭">
    
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
      
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="银行名称">
          <a-input placeholder="请输入银行名称" v-decorator="['name', {rules: [{ required: true, message: '银行名称不能为空' }]}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="图片上传">
          <a-upload
            accept="image/*"
            listType="picture-card"
            class="avatar-uploader"
            :showUploadList="false"
            :supportServerRender="true"
            :customRequest="customRequest"
            :disabled="disableSubmit"
            v-decorator="['logo',{}]"
          >
            <img v-if="coverimg" :src="coverimg" alt="avatar" style="max-width: 150px;" />
            <div v-else>
              <a-icon :type="loading ? 'loading' : 'plus'" />
              <div class="ant-upload-text" v-if="!loading">Upload</div>
              <div class="ant-upload-text" v-if="loading">{{ percent }}%</div>
            </div>
          </a-upload>

        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="微信银行ID">
          <a-input placeholder="请输入微信银行ID" v-decorator="['code', {}]" />
        </a-form-item>
		
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import Vue from 'vue'
  import { ACCESS_TOKEN } from "@/store/mutation-types";
  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import * as qiniu from 'qiniu-js'

  export default {
    name: "BankModal",
    data () {
      return {
        title:"操作",
        visible: false,
        model: {},
        headers: {},
        loading: false,
        disableSubmit: false,
        coverimg: '',
        canimg: '',
        percent: '',
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules:{
        },
        url: {
          add: "/system/bank/add",
          edit: "/system/bank/edit",
          fileUpload: window._CONFIG['domianQiNiu'],
          qiniuToken: '/qiniuUpToken'
        },
      }
    },
    created () {
      const token = Vue.ls.get(ACCESS_TOKEN);
      this.headers = {"X-Access-Token":token};
    },
    computed:{
      uploadAction:function () {
        return this.url.fileUpload;
      }
    },
    methods: {
      add () {
        this.edit({});
      },
      edit (record) {
        this.coverimg = record.logo;
        this.canimg = record.logo;
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'name','logo','code'))
        });

      },
      close () {
        this.$emit('close');
        this.visible = false;
        this.coverimg = '';
        this.disableSubmit = false;
      },
      handleOk () {
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true;
            let httpurl = '';
            let method = '';
            if(!this.model.id){
              httpurl+=this.url.add;
              method = 'post';
            }else{
              httpurl+=this.url.edit;
               method = 'put';
            }
            let formData = Object.assign(this.model, values);
            formData.logo = this.coverimg;
            
            console.log(formData)
            httpAction(httpurl,formData,method).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.$emit('ok');
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
              that.close();
            })



          }
        })
      },
      handleCancel () {
        this.close()
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
                this.coverimg = this.canimg
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

<style lang="less" scoped>

</style>