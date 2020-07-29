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
        <!-- <a-row :lg="8"> -->
          <!-- <a-form-item v-if="!autoSubmit" :labelCol="labelCol" :wrapperCol="wrapperCol" label="收货人姓名">
            <a-input
              placeholder="请输入收货人姓名"
              v-decorator="['consigneeName', {rules: [{ required: true,message: '请输入收货人姓名' },{validator: makeLength}]}]"
              :disabled="autoSubmit"
            />
           
          </a-form-item> -->
        <!-- </a-row> -->
        <a-row :lg="8">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="快递公司">
            <!-- <a-input
              placeholder="请输入快递公司"
              v-decorator="['courierCompany', {rules: [{ required: true,message: '请输入快递公司' }]}]"
           :disabled="autoSubmit"
            /> -->
             <!-- <a-select placeholder="请输入快递公司" v-model="queryParam.courierCompany" :disabled="autoSubmit"> -->
               <a-select placeholder="请输入快递公司"  :disabled="autoSubmit"  @select="cateoryHandle1"
               v-decorator="['courierCompany', {rules: [{ required: true,message: '请输入快递公司' }]}]"
               >
                <a-select-option v-for="(item, index) in selectList" :key="index" :value="item.name">{{ item.name }}</a-select-option>
              </a-select>
          </a-form-item>
        </a-row>
       <a-row :lg="8">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="快递单号">
            <a-input
              placeholder="请输入快递单号"
              v-decorator="['courierNo', {rules: [{ required: true,message: '请输入快递单号' }]}]"
           :disabled="autoSubmit"
            />
          </a-form-item>
        </a-row>
        <a-row :lg="8">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="备注">
            <a-input
              placeholder="请输入备注"
              v-decorator="['remark', {rules: [{ required: true,message: '请输入备注' }]}]"
            />
          </a-form-item>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { putAction, postAction, httpAction, getAction } from "@/api/manage";
import pick from "lodash.pick";
import * as qiniu from "qiniu-js";
export default {
  name: "OrderModals",
  data() {
    return {
      courierCompany:'',
      enable: 0,
      autoSubmit: false,
      visible: false,
      icon: "",
      state:'',
      model: {},
      selectList:[],
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
        edit: "/system/mall/order/update", //修改问题分类
        findCompanyName:"/system/mall/company/findCompanyName"
      }
    };
  },
    created() {
       getAction(this.url.findCompanyName).then((res) => {
         console.log(res)
        if (res.success) {         
          this.selectList = res.result;
        } else {
          this.$message.warning(res.message);
        }
      })
  },
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
      this.state = record.state
      	if(record.state == 4) {
			this.autoSubmit = true;
			console.log(this.autoSubmit)
		} else {
			this.autoSubmit = false;
			console.log(this.autoSubmit);
		}
      this.icon = record.icon;
      this.canimg = record.icon;
      this.courierCompany = record.courierCompany;
      this.form.resetFields();
      this.model = Object.assign({}, record);
      this.parentid = record.parentId == 0 ? record.parentId : undefined;
      this.visible = true;
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(this.model, "courierCompany", "courierNo", "remark")
        );
      });
    },
        cateoryHandle1(value) {
      this.selectList.forEach(item => {
        if (item.name === value) {
          // this.groupName1 = item.name
          this.courierCompany = item.name;
          console.log("this.courierCompany");
          console.log(this.courierCompany);
        }
      });
    },
    close() {
      this.$emit("close");
      this.percent = "";
      this.icon = "";
      this.visible = false;
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
           formData.courierCompany = this.courierCompany;
            httpurl += this.url.edit;
            // let arr = `?name=${formData.name}&icon=${formData.icon}&phone=${formData.phone}`;
            putAction(httpurl, {
              courierCompany: formData.courierCompany,
              courierNo: formData.courierNo,
              remark: formData.remark,
              id: this.model.id,
              state:this.state
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
