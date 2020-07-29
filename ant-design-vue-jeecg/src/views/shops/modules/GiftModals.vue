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
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="礼物名称">
            <a-input
              placeholder="请输入礼物名称"
              v-decorator="['name', {rules: [{ required: true,message: '请输入礼物名称' }, {validator: makeLength}]}]"
            />
          </a-form-item>
        </a-row>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="礼物图标">
          <!-- <a-input placeholder="请输入分类图标" v-decorator="['icon', {}]" /> -->
          <a-upload
            accept="image/*"
            listType="picture-card"
            class="avatar-uploader"
            :showUploadList="false"
            :supportServerRender="true"
            :customRequest="imgCustomRequest"
            v-decorator="['icon', {rules: [{ required: true,message: '请上传礼物图标' }]} ]"
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
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="动效地址">
          <a-upload
            listType="picture-card"
            class="avatar-uploader"
            :showUploadList="false"
            :supportServerRender="true"
            :customRequest="customRequest"
            v-decorator="['url',{}]"
          >
            <img v-if="coverimg" :src="coverimg" alt="avatar" style="max-width: 150px;" />
            <div v-else>
              <a-icon :type="loading ? 'loading' : 'plus'" />
              <div class="ant-upload-text" v-if="!loading">Upload</div>
              <div class="ant-upload-text" v-if="loading">{{ percent }}%</div>
            </div>
          </a-upload>
        </a-form-item>
        <a-row :lg="8">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="V币">
            <a-input
              placeholder="请输入V币数量"
              v-decorator="['money', {rules: [{ required: true,message: '请输入V币数量' }]}]"
            />
          </a-form-item>
        </a-row>
        <a-row :lg="8">
          <a-form-item v-if="!autoSubmit" :labelCol="labelCol" :wrapperCol="wrapperCol" label="等级">
            <a-select placeholder="请选择等级" v-model="level" :disabled="autoSubmit">
              <!--              v-decorator="['state', {rules: [{ required: true,message: '请选择类型' }]}]" -->
              <a-select-option :value="1">一级</a-select-option>
              <a-select-option :value="2">二级</a-select-option>
              <a-select-option :value="3">三级</a-select-option>
               <a-select-option :value="4">四级</a-select-option>
            </a-select>
          </a-form-item>
        </a-row>
        <a-row :lg="8">
          <a-form-item v-if="!autoSubmit" :labelCol="labelCol" :wrapperCol="wrapperCol" label="类型">
            <a-select placeholder="请选择类型" v-model="type" :disabled="autoSubmit">
              <!--              v-decorator="['state', {rules: [{ required: true,message: '请选择类型' }]}]" -->
              <a-select-option :value="1">普通场</a-select-option>
              <a-select-option :value="2">豪华场</a-select-option>
            </a-select>
          </a-form-item>
        </a-row>
        <a-row :lg="8">
          <a-form-item v-if="!autoSubmit" :labelCol="labelCol" :wrapperCol="wrapperCol" label="来源">
            <a-select placeholder="请选择来源" v-model="source" :disabled="autoSubmit">
              <!--              v-decorator="['state', {rules: [{ required: true,message: '请选择类型' }]}]" -->
              <a-select-option :value="1">直播</a-select-option>
              <a-select-option :value="2">游戏</a-select-option>
              <a-select-option :value="3">通用</a-select-option>
            </a-select>
          </a-form-item>
        </a-row>
        <a-row :lg="8">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="排序">
            <a-input
              placeholder="请输入排序"
              v-decorator="['sort', {rules: [{ required: true,message: '请输入排序' }]}]"
            />
          </a-form-item>
        </a-row>
        <a-row :lg="8">
          <a-form-item v-if="!autoSubmit" :labelCol="labelCol" :wrapperCol="wrapperCol" label="禁用">
            <a-select placeholder="请选择是否禁用" v-model="state" :disabled="autoSubmit">
              <!--              v-decorator="['state', {rules: [{ required: true,message: '请选择类型' }]}]" -->
              <a-select-option :value="0">是</a-select-option>
              <a-select-option :value="1">否</a-select-option>
            </a-select>
          </a-form-item>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { putAction, postAction, httpAction } from "@/api/manage";
import pick from "lodash.pick";
import Vue from "vue";
import { ACCESS_TOKEN } from "@/store/mutation-types";
import * as qiniu from "qiniu-js";
export default {
  name: "GiftModals",
  data() {
    return {
      enable: "",
      state: 0,
      source:1,
      type:1,
      level:1,
      coverimg: "",
      autoSubmit: false,
      visible: false,
      icon: "",
      model: {},
      percent: "", // 图片上传进度
      loading: false,
      title: "新增",
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
      form: this.$form.createForm(this),
      confirmLoading: false,
      form: this.$form.createForm(this),
      validatorRules: {},
      url: {
        add: "/system/live/gift/add",
        edit: "/system/live/gift/update", //修改问题分类
        fileUpload: window._CONFIG["domianQiNiu"], // 七牛云地址
        qiniuToken: "/qiniuUpToken", // 请求七牛云上传的token
      },
    };
  },
  created() {},
  computed: {
    uploadAction: function () {
      return this.url.fileUpload;
    },
  },
  methods: {
    add() {
      this.icon = "";
      this.percent = "";
      this.coverimg = "";
      this.confirmLoading = false;
      this.edit({});
    },
    edit(record) {
      console.log(record);
      this.icon = record.icon;
      this.canimg = record.icon;
      this.coverimg = record.url;
      this.form.resetFields();
      this.model = Object.assign({}, record);
      this.visible = true;
      if (record.parentId === 0) {
        this.model.parentId = "";
      }
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(
            this.model,
            "name",
            "icon",
            "money",
            "sort",
            "state",
            "url",
            "source",
            "type",
            "level",
            "enable"
          )
        );
      });
    },
    makeLength(rule, value, callback) {
      if (value.length > 10) {
        callback("输入字符限制，请重新输入");
      } else {
        callback();
      }
    },
    close() {
      this.$emit("close");
      this.percent = "";
      this.coverimg = "";
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
      httpAction(this.url.qiniuToken, {}, "post").then((res) => {
        if (res) {
          let token = res.data.token;
          const file = data.file;
          const key = new Date().getTime() + suffix;
          let domain = this.url.fileUpload;
          let config = {
            useCdnDomain: true, // 域名加速
            region: null, // 不指定具体区域，自动识别
          };
          let putExtra = {
            fname: "",
            params: {},
            mimeType: null,
          };

          let observable = qiniu.upload(file, key, token, putExtra, config);
          observable.subscribe({
            next: (res) => {
              this.percent = res.total.percent.toFixed(2);
              this.icon = "";
            },
            error: () => {
              this.$message.error("上传失败");
              this.loading = false;
              this.icon = this.canimg;
            },
            complete: (response) => {
              let allUrl = `${domain}/${response.key}`;
              // 开始转圈圈，上传中
              this.icon = allUrl;
              this.loading = false;
            },
          });
        }
      });
    },
    // 自定义上传
    customRequest(data) {
      const suffix = "." + data.file.name.replace(/^.+\./, "");
      //请求token
      httpAction(this.url.qiniuToken, {}, "post").then((res) => {
        if (res) {
          let token = res.data.token;
          const file = data.file;
          const key = new Date().getTime() + suffix;
          let domain = this.url.fileUpload;
          let config = {
            useCdnDomain: true,
            region: null,
          };
          let putExtra = {
            fname: "",
            params: {},
            mimeType: null,
          };
          let observable = qiniu.upload(file, key, token, putExtra, config);
          observable.subscribe({
            next: (res) => {
              this.loading = true;
              this.percent = res.total.percent.toFixed(2);
              this.coverimg = "";
            },
            error: () => {
              this.$message.error("上传失败");
              this.loading = false;
              this.coverimg = this.url;
            },
            complete: (response) => {
              this.coverimg = `${domain}/${response.key}`;
              console.log("this.coverimg");
              console.log(this.coverimg);
              this.loading = false;
            },
          });
        }
      });
    },
    handleOk() {
      console.log(this.state);
      const that = this;
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true;
          let httpurl = "";
          let formData = Object.assign(this.model, values);
          console.log("formData");
          console.log(formData);
          formData.icon = this.icon;
          formData.url = this.coverimg;
          if (!this.model.id) {
            httpurl += this.url.add;
            // let arr = `?name=${formData.name}&icon=${formData.icon}&phone=${formData.phone}`;
            postAction(httpurl, {
              name: formData.name,
              icon: formData.icon,
              phone: formData.phone,
              state: this.state,
              level:this.level,
              source:this.source,
              type:this.type,
              money: formData.money,
              sort: formData.sort,
              url: formData.url,
              enable: formData.enable,
            })
              .then((res) => {
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
          } else {
            httpurl += this.url.edit;
            // let arr = `?name=${formData.name}&icon=${formData.icon}&phone=${formData.phone}`;
            putAction(httpurl, {
              name: formData.name,
              icon: formData.icon,
              phone: formData.phone,
              state: this.state,
              level:this.level,
              source:this.source,
              type:this.type,
              money: formData.money,
              sort: formData.sort,
              id: this.model.id,
              url: formData.url,
              enable: formData.enable,
            })
              .then((res) => {
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
    },
  },
};
</script>

<style lang="less" scoped>
</style>
