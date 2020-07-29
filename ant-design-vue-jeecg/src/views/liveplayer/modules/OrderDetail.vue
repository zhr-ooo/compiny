<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
    :okButtonProps="{ props: {disabled: disableSubmit} }"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-row :lg="8">
          <a-form-item  :labelCol="labelCol" :wrapperCol="wrapperCol" label="收货人姓名">
            <a-input
              placeholder="请输入收货人姓名"
              v-decorator="['consigneeName', {},{validator: makeLength}]"
              
            />
           
          </a-form-item>
        </a-row>
         <a-row :lg="8">
          <a-form-item v-if="!autoSubmit" :labelCol="labelCol" :wrapperCol="wrapperCol" label="收货人手机号">
            <a-input
              placeholder="请输入收货人手机号"
              v-decorator="['consigneePhone', {},{validator: makeLength}]"
              
            />
           
          </a-form-item>
        </a-row>
         <a-row :lg="8">
          <a-form-item v-if="!autoSubmit" :labelCol="labelCol" :wrapperCol="wrapperCol" label="收货人地址">
            <a-input
              placeholder="请输入收货人地址"
              v-decorator="['consigneeAddress', {},{validator: makeLength}]"
              
            />
           
          </a-form-item>
        </a-row>
         <a-row :lg="8">
          <a-form-item  :labelCol="labelCol" :wrapperCol="wrapperCol" label="订单编号">
            <a-input
              placeholder="请输入订单编号"
              v-decorator="['orderNo', {},{validator: makeLength}]"
              
            />
           
          </a-form-item>
        </a-row>
        <a-row :lg="8">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="快递公司">
            <a-input
              placeholder="请输入快递公司"
              v-decorator="['courierCompany', {}]"
           
            />
          </a-form-item>
        </a-row>
       <a-row :lg="8">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="快递单号">
            <a-input
              placeholder="请输入快递单号"
              v-decorator="['courierNo', {}]"
           
            />
          </a-form-item>
        </a-row>
         <a-row :lg="8">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="商品名称">
            <a-input
              placeholder="请输入商品名称"
              v-decorator="['goodsName', {}]"
           
            />
          </a-form-item>
        </a-row>
         <a-row :lg="8">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="购买商品数量">
            <a-input
              placeholder="请输入购买商品数量"
              v-decorator="['goodsNum', {}]"
           
            />
          </a-form-item>
        </a-row>
         <a-row :lg="8">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="购买商品总价">
            <a-input
              placeholder="购买商品总价"
              v-decorator="['totalMoney', {}]"
           
            />
          </a-form-item>
        </a-row>
         <a-row :lg="8">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="购买时真实支付金额">
            <a-input
              placeholder="请输入购买时真实支付金额"
              v-decorator="['payMoney', {}]"
           
            />
          </a-form-item>
        </a-row>
         <!-- <a-row :lg="8">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="商品来源">
            <a-input
              placeholder="请输入商品来源"
              v-decorator="['source', {}]"
           
            />
          </a-form-item>
        </a-row> -->
         <!-- <a-row :lg="8">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="订单状态">
            <a-input
              placeholder="请输入订单状态"
              v-decorator="['state', {}]"
          
            />
          </a-form-item>
        </a-row>
         <a-row :lg="8">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="支付方式">
            <a-input
              placeholder="请输入支付方式"
              v-decorator="['payMode', {}]"
           
            />
          </a-form-item>
        </a-row> -->
         <a-row :lg="8">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="交易编号">
            <a-input
              placeholder="请输入交易编号"
              v-decorator="['tradeNo', {}]"
           
            />
          </a-form-item>
        </a-row>
        <a-row :lg="8">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="备注">
            <a-input
              placeholder="请输入备注"
              v-decorator="['remark', {}]"         
             />
          </a-form-item>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { putAction, postAction, httpAction,getAction } from "@/api/manage";
import pick from "lodash.pick";
import * as qiniu from "qiniu-js";
export default {
  name: "OrderDetail",
  data() {
    return {
      enable: 0,
      autoSubmit: false,
      visible: false,
      icon: "",
      orderId:'',
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
        edit: "/system/mall/order/detail", //修改问题分类
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
    edit(record) {
      this.orderId = record.id
      	if(this.orderId) {
			this.autoSubmit = true;
		} else {
			this.autoSubmit = false;
		}
      this.icon = record.icon;
      this.canimg = record.icon;
      this.form.resetFields();
      this.model = Object.assign({}, record);
      this.parentid = record.parentId == 0 ? record.parentId : undefined;
      this.visible = true;
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(this.model, "consigneeName","consigneePhone", "consigneeAddress", "orderNo","courierCompany","courierNo","goodsName","goodsNum","totalMoney","payMoney","source", "state", "tradeNo","payMode","remark")
        );
      });
    },
    close() {
      this.$emit("close");
      this.percent = "";
      this.icon = "";
      this.visible = false;
    },
    handleOk() {
 this.close();
    },
    handleCancel() {
      this.close();
    }
  }
};
</script>

<style lang="less" scoped>
</style>
