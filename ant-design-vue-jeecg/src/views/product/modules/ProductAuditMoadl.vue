<template>
  <a-modal
    :title="title"
    :width="1200"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    :footer="null"
    cancelText="关闭"
  >
    
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-row class="form-row" :gutter="16">
          <a-col :lg="8">
            
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="课程标题">
              <a-input placeholder="请输入课程标题" v-decorator="['title', {}]" :readOnly="disableSubmit"/>
            </a-form-item>
          </a-col>
          <a-col :lg="8">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="课程分类">
              <a-input placeholder="请输入课程分类" v-decorator="['catename', {}]" :readOnly="disableSubmit"/>
            </a-form-item>
          </a-col>
          <a-col :lg="8">
    
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="课程作者">
              <a-input placeholder="请输入课程作者" v-decorator="['nickname', {}]" :readOnly="disableSubmit"/>
            </a-form-item>
          </a-col>
          <a-col :lg="8">
    
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="课程专辑">
              <a-input placeholder="请输入课程专辑" v-decorator="['albumname', {}]" :readOnly="disableSubmit"/>
            </a-form-item>
          </a-col>
          <a-col :lg="8">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="审核状态">
              <a-select placeholder="请选择审核状态" v-decorator="['auditstate', {}]" disabled>
                <a-select-option :value="1">审核中</a-select-option>
                <a-select-option :value="2">审核不通过</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :lg="8">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="是否收费">
              <a-select placeholder="请选择是否收费" v-decorator="['type', {}]" disabled>
                <a-select-option :value="3">收费</a-select-option>
                <a-select-option :value="1">免费</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :lg="8" v-if="thisType === 3">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="课程价格">
              <a-input placeholder="请输入课程价格" v-decorator="['price', {}]" :readOnly="disableSubmit"/>
            </a-form-item>
          </a-col>
          <a-col :lg="14" v-show="thisType === 3">
            <a-form-item
              :labelCol="labelColc"
              :wrapperCol="wrapperColc"
              label="课程简介">
              <a-input placeholder="请输入课程简介" v-decorator="['introduction', {}]" :readOnly="disableSubmit"/>
            </a-form-item>
          </a-col>
          <a-col :lg="24" v-show="thisType === 1">
            <a-form-item
              :labelCol="labelColk"
              :wrapperCol="wrapperColk"
              label="课程简介">
              <a-input placeholder="请输入课程简介" v-decorator="['introduction', {}]" :readOnly="disableSubmit"/>
            </a-form-item>
          </a-col>
          <a-col :lg="24" v-show="disableSubmit">
            <a-form-item
              :labelCol="labelColk"
              :wrapperCol="wrapperColk"
              label="课程详情">
              <div v-html="content" style="border: 1px solid #ccc;padding: 20px;border-radius: 5px;"></div>
            </a-form-item>
          </a-col>
          
        
        </a-row>
        <a-form-item label="课程封面" :labelCol="labelColk" :wrapperCol="wrapperColk">
          <a-upload
            listType="picture-card"
            class="avatar-uploader"
            :showUploadList="false"
            :supportServerRender="true"
            :customRequest="customRequest"
            :disabled="disableSubmit"
          >
            <img v-if="coverimg" :src="coverimg" alt="avatar" style="max-width: 150px;" />
            <div v-else>
              <a-icon :type="loading ? 'loading' : 'plus'" />
              <div class="ant-upload-text" v-if="!loading">Upload</div>
              <div class="ant-upload-text" v-if="loading">{{ percent }}%</div>
            </div>
          </a-upload>
        
        </a-form-item>
        
        <a-form-item label="拒绝理由" :labelCol="labelColk" :wrapperCol="wrapperColk" v-if="refusereason">
          <a-textarea v-model="refusereason" :autosize="{ minRows: 3, maxRows: 8 }" :readOnly="true"/>
        </a-form-item>
      
      </a-form>
    </a-spin>
    <avatar-modal ref="modal"></avatar-modal>
  </a-modal>
</template>

<script>
  import { getAction, httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import JCodeEditor from "@/components/jeecg/JCodeEditor"
  import JEditor from "@/components/jeecg/JEditor"
  import AvatarModal from "@/views/account/settings/AvatarModal";
  import * as qiniu from 'qiniu-js'

  export default {
    name: "ProductAuditMoadl",
    data () {
      return {
        title:"操作",
        visible: false,
        model: {},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 17 },
        },
        labelColc: {
          xs: { span: 24 },
          sm: { span: 3 },
        },
        wrapperColc: {
          xs: { span: 24 },
          sm: { span: 20 },
        },
        labelColk: {
          xs: { span: 24 },
          sm: { span: 2 },
        },
        wrapperColk: {
          xs: { span: 24 },
          sm: { span: 21 },
        },
        loading: false,
        confirmLoading: false,
        form: this.$form.createForm(this),
        coverimg: '',
        canimg: '',
        percent: '',
        refusereason: '',
        disableSubmit: false,
        content: '',
        thisType: null,
        headers: {},
        selectList: [],
        validatorRules:{
        },
        url: {
          getbyId: '/product/productsource/findListByProductId',
          fileUpload: window._CONFIG['domianQiNiu'],
          qiniuToken: '/qiniuUpToken'
        },
      }
    },
    components: {
      JCodeEditor,
      JEditor,
      AvatarModal
    },
    computed:{
      uploadAction:function () {
        return this.url.fileUpload;
      }
    },
    methods: {
      add () {
        this.coverimg = '';
        this.refusereason = '';
        this.content = '';
        this.edit({});
      },
      edit (record) {
        console.log(record)
        this.coverimg = record.coverimg;
        this.form.resetFields();
        this.getNewModel (record.id);
        if (record.id) {
          this.thisType = record.type;
        }
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'id','title','introduction','albumname','nickname','coverimg', 'auditstate','catename', 'type', 'price'))
        });
      },
      // 根据id获取具体数据
      getNewModel (id) {
        let html = '';
        const that = this;
        getAction(this.url.getbyId,{productId: id, ischeck:1}).then((res) => {
          if(res.success){
            let record = res.result;
            html += '<div style="max-height: 350px;overflow-y: scroll;">';
            record.forEach(item => {
              switch (item.type) {
                case 'img':
                  html += `<p><img src="${item.url}" style="width:300px;" /><br/><span style="color: #ccc;">${item.title}</span></p>`;
                  break;
                case 'text':
                  html += `<p style="text-indent: 2em;"><h3 style="text-align: center;">${item.title}</h3>${item.url}</p>`;
                  break;
                case 'video':
                  html += `<p><video controls="controls" width="300" height="150"><source src="${item.url}" /></video></p>`;
                  break;
                case 'audio':
                  html += `<p><audio src="${item.url}" controls="controls"></audio></p>`;
                  break;
                default:
                  break
              }
            });
            html += '</div>';
            this.content = html;
             console.log('this.content')
            console.log(this.content)
          }else{
            that.$message.warning(res.message);
          }
        })
      },
      close () {
        this.$emit('close');
        this.visible = false;
        this.coverimg = '';
        this.disableSubmit = false;
        this.content = '';
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

<style lang="scss" scoped>
  
  .avatar-uploader > .ant-upload {
    width: 128px;
    height: 128px;
  }
  .ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
  }
  
  .ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }

</style>
