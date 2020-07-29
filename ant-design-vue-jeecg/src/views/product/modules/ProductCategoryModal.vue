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
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="分类名称">
          <a-input
            placeholder="请输入分类名称"
            v-decorator="['name', {rules: [{ required: true,message: '请输入分类名称' }]}]"
          />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="导航">
          <a-select
            placeholder="请选择是否导航"
            v-decorator="['icon', {rules: [{ required: true,message: '请选择是否导航' }]}]"
          >
            <a-select-option value="y">显示</a-select-option>
            <a-select-option value="n">不显示</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="封面图片">
          <a-upload
            accept="image/*"
            listType="picture-card"
            class="avatar-uploader"
            :showUploadList="false"
            :supportServerRender="true"
            :customRequest="imgCustomRequest"
            v-decorator="['imageUrl', {} ]"
          >
            <img v-if="imageUrl" :src="imageUrl" alt="avatar" style="max-width: 150px;" />
            <div v-else>
              <a-icon :type="loading ? 'loading' : 'plus'" />
              <div class="ant-upload-text" v-if="!loading">Upload</div>
              <div class="ant-upload-text" v-if="loading">{{ percent }}%</div>
            </div>
            <!-- <img  :src="icon" alt="avatar" style="max-width: 150px;" /> -->
          </a-upload>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="父类节点">
          <a-select
            placeholder="请选择父级节点"
            @select="typeSelectHandle"
            v-decorator="[ 'fatherId', {}]"
            style="width: 82%"
          >
            <a-select-option :value="10000">VIP</a-select-option>
            <a-select-option :value="1000">赋能课程</a-select-option>
            <a-select-option :value="2000">热点项目</a-select-option>
              <a-select-option :value="3000">社区内容</a-select-option>
          </a-select>
          <a-button type="primary" @click="fatherIdReset" icon="reload" style="margin-left: 8px">重置</a-button>
        </a-form-item>
        <!-- <a-form-item v-if="this.show" :labelCol="labelCol" :wrapperCol="wrapperCol" label="赋能空间">
          <a-col :lg="19">
            <a-radio-group name="radioGroup" v-model="upFatherId">
              <a-radio :value="1000">赋能空间</a-radio>
            </a-radio-group>
          </a-col>
        </a-form-item>-->
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="排序">
          <a-input-number
            :min="1"
            v-decorator="[ 'sorts', {rules: [{ required: true,message: '请输入排序' }]}]"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { putAction, postAction, httpAction, getAction } from "@/api/manage";
import pick from "lodash.pick";
import * as qiniu from "qiniu-js";
export default {
  name: "ProductCategoryModal",
  data() {
    return {
      imageUrl: "",
      // canimg:"",
      // upFatherId:1000,
      title: "操作",
      visible: false,
      show: false,
      model: {},
      percent: "",
      loading: false,
      fatherid: undefined,
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
        add: "/product/productCategory/add",
        edit: "/product/productCategory/edit",
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
    //父级节点选项重置
    fatherIdReset() {
      this.model.fatherId = this.fatherid;
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.model, "fatherId"));
      });
    },
    add() {
      this.imageUrl = "";
      this.percent = "";
      this.confirmLoading = false;
      this.edit({});
    },
    typeSelectHandle(value) {
      if (value) {
        this.show = true;
      } else {
        this.show = false;
      }
    },

    edit(record) {
      this.show = false;
      this.imageUrl = record.imageUrl;
      // this.canimg = record.imageUrl;
      this.form.resetFields();
      this.model = Object.assign({}, record);
      this.fatherid = record.fatherId == 0 ? record.fatherId : undefined;
      this.visible = true;
      if (record.fatherId === 0) {
        this.model.fatherId = "";
      }
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(
            this.model,
            "name",
            "icon",
            "fatherId",
            "level",
            "sorts",
            "imageUrl"
          )
        );
      });
    },
    close() {
      this.$emit("close");
      this.imageUrl = "";
      this.percent = "";
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
              this.imageUrl = "";
            },
            error: () => {
              this.$message.error("上传失败");
              this.loading = false;
              // this.imageUrl = this.canimg;
            },
            complete: response => {
              let allUrl = `${domain}/${response.key}`;
              // 开始转圈圈，上传中
              this.imageUrl = allUrl;
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
          let method = "";
          if (!this.model.id) {
            httpurl += this.url.add;
            method = "post";
          } else {
            httpurl += this.url.edit;
            method = "put";
          }
          let formData = Object.assign(this.model, values);
          formData.imageUrl = this.imageUrl;
          formData.fatherId =
            formData.fatherId != 0 ? formData.fatherId : undefined;
          formData.level = !formData.fatherId ? 1 : 2;
          //时间格式化

          console.log(formData);
          httpAction(httpurl, formData, method)
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
