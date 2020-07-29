<template>
  <a-modal
    :title="title"
    :width="1100"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    :footer="null"
    cancelText="关闭"
  >
    
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-row class="form-row" :gutter="10">
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
              <a-select placeholder="请选择课程分类" v-decorator="['fistcategory', {}]" :disabled="disableSubmit">
                <a-select-option v-for="(item, index) in selectList" :key="index" :value="item.id">{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :lg="8">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="课程专辑">
              <a-input placeholder="" v-model="albumName" :readOnly="disableSubmit" />
            </a-form-item>
          </a-col>
          <a-col :lg="8">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="课程作者">
              <a-input placeholder="" v-model="authorName" :readOnly="disableSubmit" />
            </a-form-item>
          </a-col>
          <a-col :lg="8">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="课程价格">
              <a-input placeholder="" v-decorator="['price', {}]" :readOnly="disableSubmit" />
            </a-form-item>
          </a-col>
          <a-col :lg="24">
            <a-form-item
              :labelCol="labelColk"
              :wrapperCol="wrapperColk"
              label="课程简介">
              <a-input placeholder="请输入课程简介" v-decorator="['introduction', {} ]" :readOnly="disableSubmit" />
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
        <a-form-item
          :labelCol="labelColk"
          :wrapperCol="wrapperColk"
          label="课程详情"
          v-show="!disableSubmit">
          <j-editor v-model="content" :disabled="disableSubmit"></j-editor>
        </a-form-item>
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
        
        
        <!-- <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="点击次数">
            <a-input-number v-decorator="[ 'clickcount', {}]" />
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="点赞次数">
            <a-input-number v-decorator="[ 'topcount', {}]" />
          </a-form-item> -->
      
      </a-form>
    </a-spin>
    <avatar-modal ref="modal"></avatar-modal>
    <product-add-album-modal ref="addAblumModal" @ok="modalFormOk"></product-add-album-modal>
  </a-modal>
</template>

<script>
  import Vue from 'vue'
  import { httpAction, getAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import { ACCESS_TOKEN } from "@/store/mutation-types"
  import JCodeEditor from "@/components/jeecg/JCodeEditor"
  import JEditor from "@/components/jeecg/JEditor"
  import AvatarModal from "@/views/account/settings/AvatarModal";
  import ProductAddAlbumModal from "./ProductAddAlbumModal";
  import * as qiniu from 'qiniu-js'

  export default {
    name: "ProductNewModal",
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
        albumList: [],
        content: '',
        headers: {},
        selectList: [],
        albumName: '',    //专辑名称
        authorName: '',   //作者名称
        validatorRules:{
        },
        url: {
          add: "/product/productNew/add",
          edit: "/product/productNew/edit",
          getbyId: '/product/productNew/queryById',
          selectNewList: '/product/productCategory/queryFirstSelect',   //分类选择
          albumlist: '/user/album/findAlbumSelect',    // 专辑
          findList: '/product/productsource/findListByProductId',    // 课程资源详情
          fileUpload: window._CONFIG['domianQiNiu'],
          qiniuToken: '/qiniuUpToken'
        },
      }
    },
    components: {
      JCodeEditor,
      JEditor,
      AvatarModal,
      ProductAddAlbumModal
    },
    created () {
      const token = Vue.ls.get(ACCESS_TOKEN);
      this.headers = {"X-Access-Token":token};
      // this.getAblum()
      getAction(this.url.selectNewList).then((res) => {
        if (res.success) {
          this.selectList = res.result;
        } else {
          this.$message.warning(res.message);
        }
      })
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
        console.log(record.id)
        this.coverimg = record.coverimg;
        this.canimg = record.coverimg;
        this.form.resetFields();
        // this.getAblum()
        if(record.id) {
          this.getNewModel (record.id, record.type);
          if (record.type === '1' || record.type === '3') {
            this.getContentModel (record.id)
          }
        } else {
          this.model = Object.assign({}, record);
          this.visible = true;
          this.$nextTick(() => {
            this.form.setFieldsValue(pick(this.model,'title','introduction','fistcategory', 'coverimg', 'price'))
          });
        }
      },
      //获取课程专辑
      getAblum() {
        httpAction(this.url.albumlist, {}, 'POST').then(res => {
          if (res.success) {
            this.albumList = res.result
          } else {
            this.$message.warning(res.message)
          }
        })
      },
      // 根据id获取具体数据
      getNewModel (id, type) {
        const that = this;
        getAction(this.url.getbyId,{id: id}).then((res) => {
          if(res.success){
            let record = res.result.product;
            this.refusereason = record.refusereason;
            this.albumName = res.result.albumName;
            this.authorName = res.result.authorName;
            if (type !== '1' && type !== '3') {
              this.content = record.content;
            }
            this.model = Object.assign({}, record);
            this.visible = true;
            this.$nextTick(() => {
              this.form.setFieldsValue(pick(this.model,'title','introduction','fistcategory','coverimg', 'price'))
            });
          }else{
            that.$message.warning(res.message);
          }
        })
      },
      //获取课程详情
      getContentModel (id) {
        let html = '';
        const that = this;
        getAction(this.url.findList,{productId: id}).then((res) => {
          if(res.success){
            let record = res.result;
            html += '<div>';
            record.forEach(item => {
              if (item.title && item.title !== '') {
                html += `<strong style="margin-left: 100px;">${item.title}</strong>`
              }
              switch (item.type) {
                case 'img':
                  html += `<p><img src="${item.url}" style="width:300px;" /></p>`;
                  break;
                case 'text':
                  html += `<p style="text-indent: 2em;">${item.url}</p>`;
                  break;
                case 'video':

                  if(item.timeurl && item.timeurl !== '') {
                    html += `<a href="${item.url}" target="_blank" style="display:block;width:300px;height:150px;background-image:url(${item.timeurl});background-size: 100% auto;object-fit:cover;position:relative;"><img src="${require('@assets/play.png')}" alt="" style="position: absolute;width: 50px;height: 50px;top: 50%;left: 50%;transform: translate(-50%,-50%);"></a>`
                  } else {
                    html += `<p><video controls="controls" width="300" height="150"><source src="${item.url}" /></video></p>`;
                  }
                  
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
            console.log(record)
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
            formData.coverimg = this.coverimg;
            formData.content = this.content;
            //时间格式化

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
      addAlbum () {
        this.$refs.addAblumModal.add()
        this.$refs.addAblumModal.visible = true
      },
      modalFormOk () {
        httpAction(this.url.albumList, {}, 'POST').then(res => {
          if (res.success) {
            this.albumList = res.result
          } else {
            this.$message.warning(res.message)
          }
        })
      }
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
