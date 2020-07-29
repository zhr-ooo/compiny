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
          label="大V团名">
          <a-input placeholder="请输入大V团名" v-decorator="['name', {rules: [{required: true, message: '请输入大V团名'}]}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="图片">
          <a-upload
            listType="picture-card"
            class="avatar-uploader"
            :showUploadList="false"
            :supportServerRender="true"
            :customRequest="customRequest"
            :disabled="disableSubmit"
            v-decorator="['image',{ rules: [{ required: true, message: '图片不能为空' }] }]"
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
          label="团长ID">
		  <a-input v-if="autoSubmit" placeholder="" :disabled="autoSubmit" :value="teamName" />
          <a-auto-complete
			v-else
            class="global-search"
            @select="onSelect"
            @search="handleSearch"
            optionLabelProp="text"
            v-decorator="['userName',{ rules: [{ required: true, message: '请输入团长id' }] }]"
            placeholder="请输入团长id"
			:disabled="autoSubmit"
          >
            <template slot="dataSource">
              <a-select-option v-for="item in dataSource" :key="item.nickName" :text="item.nickName" class="selece-option">
                <a-avatar :src="item.header" :srcSet="item.header" style="margin-right: 15px"></a-avatar>
                {{ item.nickName }}
              </a-select-option>
            </template>
            <a-input class="associate_input">
              <a-button slot="suffix" class="search-btn" type="primary" size="large" @click="beginSearch">
                <a-icon type="search"></a-icon>
              </a-button>
            </a-input>
          </a-auto-complete>
          
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="团队人数">
          <a-input-number v-decorator="[ 'teamNum', {rules: [{ required: true, message: '团队人数不能为空' }]}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="大V团权益">
          <a-input placeholder="请输入大V团权益" v-decorator="['descr', {}]" />
        </a-form-item>
		
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { httpAction, getAction} from '@/api/manage'
  import Vue from 'vue'
  import { ACCESS_TOKEN } from "@/store/mutation-types";
  import pick from 'lodash.pick'
  import * as qiniu from 'qiniu-js'

  export default {
    name: "BigTeamModal",
    data () {
      return {
        title:"操作",
        visible: false,
        headers: {},
        loading: false,
        coverimg: '',
        canimg: '',
        percent: '',
        disableSubmit: false,
		autoSubmit: false,
		teamName: '',
        model: {},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        searchParam: '',    // 搜索字段
        dataSource: [],     // 选择数据源
        userId: null,
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules:{
        },
        url: {
          add: "/system/bigteam/add",
          edit: "/system/bigteam/edit",
          fileUpload: window._CONFIG['domianQiNiu'],
          qiniuToken: '/qiniuUpToken',
          searchUrl: '/system/appuserinfo/getUserBYPhoneOrCodeOrNickName'
        },
      }
    },
    computed:{
      uploadAction:function () {
        return this.url.fileUpload;
      }
    },
    created () {
      const token = Vue.ls.get(ACCESS_TOKEN);
      this.headers = {"X-Access-Token":token};
    },
    methods: {
      add () {
        this.coverimg = '';
		this.teamName = '';
        this.edit({});
      },
      edit (record) {
        console.log(record.name)
		if(record && record.name && record.name !== '' && record.name !== undefined) {
			this.autoSubmit = true;
			console.log(this.autoSubmit)
		} else {
			this.autoSubmit = false;
			console.log(this.autoSubmit);
		}
		this.teamName = record.userName
        this.coverimg = record.image;
        this.canimg = record.image;
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'name','image','userId','userName','teamNum','descr'))
        });

      },
      close () {
        this.$emit('close');
        this.visible = false;
        this.coverimg = '';
        this.canimg = '';
        this.percent = '';
        this.dataSource = [];
        this.searchParam = '';
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
               console.log('formData')
          console.log(formData)
            formData.image = this.coverimg;
            formData.userId = this.userId;
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
      //  输入选择框
      onSelect (value) {
        this.dataSource.forEach(item => {
          if (item.nickName === value) {
            this.userId = item.userId
              console.log('this.userId')
          console.log(this.userId)
          }
        })
      },
      handleSearch(value) {
        console.log('search', value)
        this.searchParam = value
      },
      //  开始搜索
      beginSearch () {
        getAction(this.url.searchUrl, {searchParam: this.searchParam}).then(res => {
          console.log(res)
          if (res.success) {
            if (res.result.length === 0) {
              this.$message.warning('暂无数据')
            } else {
              this.dataSource = res.result
            }
          } else {
            this.$message.warning(res.message)
          }
        }).catch(err => {
          this.$message.warning(err.message)
        })
      }
    }
  }
</script>

<style lang="less">
  .global-search .associate_input .ant-input-suffix {
    right: 0 !important;
  }
  .global-search .ant-input-suffix .ant-btn-lg {
    height: 32px;
  }
  .global-search .ant-input-affix-wrapper .ant-input:not(:last-child) {
    padding: 0 50px 0 12px;
  }
  
  .global-search.ant-select-auto-complete .ant-input-affix-wrapper .ant-input-suffix button {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
  .selece-option {
    padding: 10px 10px;
    display: flex;
    align-items: center;
  }
</style>