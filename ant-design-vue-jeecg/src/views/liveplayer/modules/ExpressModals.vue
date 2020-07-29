<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-row :lg="8">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="公司名称">
            <a-input
              placeholder="请输入公司名称"
              v-decorator="['name', {rules: [{ required: true,message: '请输入公司名称' },{validator: makeLength}]}]"
              :disabled="autoSubmit"
            />
           
          </a-form-item>
        </a-row>
        <a-row :lg="8">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="手机号">
            <a-input
              placeholder="请输入手机号"
              v-decorator="['phone', {rules: [{ required: true,message: '请输入手机号' },{validator: makephone}]}]"
            />
          </a-form-item>
        </a-row>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="公司标识">
          <!-- <a-input placeholder="请输入分类图标" v-decorator="['icon', {}]" /> -->
          <a-upload
            accept="image/*"
            listType="picture-card"
            class="avatar-uploader"
            :showUploadList="false"
            :supportServerRender="true"
            :customRequest="imgCustomRequest"
            v-decorator="['icon', {rules: [{ required: true,message: '请上传公司标识' }]} ]"
          >
            <img v-if="icon" :src="icon" alt="avatar" style="max-width: 150px;" />
            <div v-else>
              <a-icon :type="loading ? 'loading' : 'plus'" />
              <div class="ant-upload-text" v-if="!loading">Upload</div>
              <div class="ant-upload-text" v-if="loading">{{ percent }}%</div>
            </div>
            <!-- <img  :src="icon" alt="avatar" style="max-width: 150px;" /> -->
          </a-upload>
        </a-form-item>
        <a-form-item v-if="!autoSubmit" :labelCol="labelCol" :wrapperCol="wrapperCol" label="禁用">
          <a-select placeholder="请选择是否禁用" v-model="enable" :disabled="autoSubmit">
            <!--  v-decorator="['enable', {rules: [{ required: true,message: '请选择类型' }]}]" -->
            <a-select-option :value="0">是</a-select-option>
            <a-select-option :value="1">否</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { putAction, postAction, httpAction } from "@/api/manage";
import pick from "lodash.pick";
import * as qiniu from "qiniu-js";
export default {
  name: "ExpressModals",
  data() {
    return {
      enable: 0,
      autoSubmit: false,
      visible: false,
      icon: "",
      model: {},
      percent: "", // 图片上传进度
      loading: false,
      title: "新增",
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },

      confirmLoading: false,
      form: this.$form.createForm(this),
      validatorRules: {},
      url: {
        add: "/system/mall/company/add",
        edit: "/system/mall/company/update", //修改问题分类
        fileUpload: window._CONFIG["domianQiNiu"], // 七牛云地址
        qiniuToken: "/qiniuUpToken" // 请求七牛云上传的token
      }
    };
  },
  created() {},
  computed: {
    uploadAction: function() {
      return this.url.fileUpload;
    }
  },
  methods: {
    makeLength(rule, value, callback) {
      if(value.length > 10){
        callback("输入字符限制，请重新输入")
      }else{
        callback()
      }   
    },
    
      makephone(rule, value, callback) {
      if(value.length > 11){
        callback("请输入正确得手机号")
      }else{
        callback()
      }   
    },
    add() {
      this.icon = "";
      this.percent = "";
      this.confirmLoading = false;
      this.edit({});
    },
    edit(record) {
      	if(record && record.id && record.id !== '' && record.id !== undefined) {
			this.autoSubmit = true;
			console.log(this.autoSubmit)
		} else {
			this.autoSubmit = false;
			console.log(this.autoSubmit);
		}
      this.icon = record.icon;
      this.canimg = record.icon;
      this.form.resetFields();
      this.model = Object.assign({}, record);
      this.parentid = record.parentId == 0 ? record.parentId : undefined;
      this.visible = true;
      if (record.parentId === 0) {
        this.model.parentId = "";
      }
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(this.model, "name", "icon", "phone", "enable")
        );
      });
    },
    close() {
      this.$emit("close");
      this.percent = "";
      this.icon = "";
      this.visible = false;
    },
    // 图片自定义上传
    imgCustomRequest(data) {
      // 开始转圈圈，上传中
      this.loading = true;
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
              this.percent = res.total.percent.toFixed(2);
              this.icon = "";
            },
            error: () => {
              this.$message.error("上传失败");
              this.loading = false;
              this.icon = this.canimg;
            },
            complete: response => {
              let allUrl = `${domain}/${response.key}`;
              // 开始转圈圈，上传中
              this.icon = allUrl;
              this.loading = false;
            }
          });
        }
      });
    },
    handleOk() {
      const that = this;
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true;
          let httpurl = "";
          let formData = Object.assign(this.model, values);
          formData.icon = this.icon;

          if (!this.model.id) {
            httpurl += this.url.add;
            // let arr = `?name=${formData.name}&icon=${formData.icon}&phone=${formData.phone}`;
            postAction(httpurl, {
              name: formData.name,
              icon: formData.icon,
              phone: formData.phone,
              enable: this.enable
            })
              .then(res => {
                if (res.success) {
                  that.$message.success(res.message);
                  that.$emit("ok");
                   that.confirmLoading = false;
                that.close();
                } else {
                  that.$message.warning(res.message);
                  that.confirmLoading = false;
                }
              })
              .finally(() => {
               
              });
          } else {
            httpurl += this.url.edit;
            // let arr = `?name=${formData.name}&icon=${formData.icon}&phone=${formData.phone}`;
            putAction(httpurl, {
              name: formData.name,
              icon: formData.icon,
              phone: formData.phone,
              enable: this.enable,
              id: this.model.id
            })
              .then(res => {
                if (res.success) {
                  that.$message.success(res.message);
                  that.$emit("ok");
                } else {
                  that.$message.warning(res.message);
                }
              })
              .finally(() => {
                that.confirmLoading = false;
                that.close();
              });
          }
        }
      });
    },
    handleCancel() {
      this.close();
    }
  }
};
</script>

<style lang="less" scoped>
</style>
