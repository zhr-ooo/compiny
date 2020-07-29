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
        <a-form-item style="width:115.33333%" :labelCol="labelCol" :wrapperCol="wrapperCol"  label="主播获得打赏比例">
          <a-input
          placeholder="请输入主播获得打赏比例"
            style="width:83%"
            v-decorator="[ 'ratio', {rules: [{ required: true,message: '请输入主播获得打赏比例' }, { validator: makeNumber}]}]"      
          />
          <span>(%)</span>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="达标金额">
           <a-input
          placeholder="请输入达标金额"
            style="width:100%"
            v-decorator="[ 'qualifiedMoney', {rules: [{ required: true,message: '请输入达标金额' }, { validator: makeNumber}]}]"
          
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
  name: "ProfitRateModals",
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
        add: "/system/service/profit/add",
        edit: "/system/service/profit/update"
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
            "ratio",
            "qualifiedMoney",
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
