<template>
  <a-modal
    :title="title"
    :width="600"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="角色">
          <a-select
            placeholder="请选择角色"
              :disabled="autoSubmit"
            v-decorator="['role', {rules: [{ required: true,message: '请选择角色' }]}]"
          >
            <a-select-option :value="1">VIP</a-select-option>
            <a-select-option :value="2">创客达人</a-select-option>
            <a-select-option :value="3">大使服务商</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="星级">
          <a-input
          placeholder="请输入星级"
            style="width:90%"
            v-decorator="[ 'level', {rules: [{ required: true,message: '请输入星级' }, { validator: makeNumber}]}]"
           
          />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="VIP分销">
          <a-input
          placeholder="请输入VIP分销"
            style="width:90%"
            v-decorator="[ 'vipRatio', {rules: [{ required: true,message: '请输入VIP分销' }, { validator: makeNumber}]}]"        
          />
          <span style="margin-left:5px">(%)</span>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="创客达人分销">
           <a-input
          placeholder="请输入创客达人分销"
            style="width:90%"
            v-decorator="[ 'creatorRatio', {rules: [{ required: true,message: '请输入创客达人分销' }, { validator: makeNumber}]}]"           
          />
          <span style="margin-left:5px">(%)</span>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="大使服务商分销">
          <a-input
          placeholder="请输入大使服务商分销"
            style="width:90%"
            v-decorator="[ 'ambassadorRatio', {rules: [{ required: true,message: '请输入大使服务商分销' }, { validator: makeNumber}]}]"          
          />
          <span style="margin-left:5px">(%)</span>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="升级数量">
          <a-input
          placeholder="请输入升级数量"
            style="width:90%"
            v-decorator="[ 'upgradeNum', {rules: [{ required: true,message: '请输入升级数量' }, { validator: makeNumber}]}]"
           
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { httpAction } from "@/api/manage";
import pick from "lodash.pick";

export default {
  name: "ProviderModals",
  data() {
    return {
      title: "操作",
      visible: false,
      model: {},
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },

      confirmLoading: false,
      autoSubmit: false,
      form: this.$form.createForm(this),
      validatorRules: {},
      url: {
        add: "/system/service/distribution/add",
        edit: "/system/service/distribution/update"
      }
    };
  },
  created() {},
  methods: {
    makeNumber(rule, value, callback) {
      var re = /^([1-9]\d*|[0]{1,1})$/;
      if (!re.test(value)) {
        callback("请输入正整数");
      } else {
        callback();
      }
    },
    add() {
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
      this.form.resetFields();
      this.model = Object.assign({}, record);
      this.visible = true;
      this.$nextTick(() => {
        // this.$nextTick：等你页面刷新完之后，再执行回调函数中的方法
        this.form.setFieldsValue(
          pick(
            this.model,
            "role",
            "level",
            "vipRatio",
            "creatorRatio",
            "ambassadorRatio",
            "upgradeNum"
          )
        );
        // pick：返回一个只有列入挑选key属性的对象。其中，参数object为JSON格式的对象，*keys表示多个需要挑选出来的key属性。
      });
    },
    close() {
      this.$emit("close");
      this.visible = false;
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
