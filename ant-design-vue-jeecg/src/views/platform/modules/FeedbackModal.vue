<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :footer="null"
    @cancel="handleCancel"
  >
    
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="手机号">
          <a-input placeholder="手机号" v-decorator="['phone', {}]" readonly />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="反馈者名称">
          <a-input placeholder="反馈者名称" v-decorator="['name', {}]" readonly />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="反馈内容">
          <a-textarea rows="4" v-decorator="['content',{}]" readonly />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="反馈时间">
          <a-date-picker showTime format='YYYY-MM-DD HH:mm:ss' v-decorator="[ 'createTime', {}]" disabled />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="图片"
          v-if="coverimg.length > 0">
          <img v-for="(item, index) in coverimg" :key="index" :src="item" @click="bigImg(item, 600)" alt="avatar" style="max-width: 150px;max-height: 150px;margin-right: 10px;" />
        </a-form-item>
		
      </a-form>
    </a-spin>
    <product-new-big-img ref="bigImg"></product-new-big-img>
  </a-modal>
</template>

<script>
  import pick from 'lodash.pick'
  import moment from "moment"
  import ProductNewBigImg from "../../product/modules/ProductNewBigImg";

  export default {
    name: "FeedbackModal",
    components: {
      ProductNewBigImg
    },
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
          sm: { span: 16 },
        },
        coverimg: [],
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules:{
        },
      }
    },
    created () {
    },
    methods: {
      //  图片点击放大
      bigImg (text, width) {
        if(text) {
          this.$refs.bigImg.make(text, width);
        }
      },
      edit (record) {
        let thiscover = record.bak ? record.bak.split(';') : [];
        if (thiscover.length>0 && thiscover[0].indexOf(',') > -1) {
          this.coverimg = thiscover[0].split(',');
        } else {
          this.coverimg = thiscover;
        }
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'phone','name','content','bak'))
          this.form.setFieldsValue({createTime:this.model.createTime?moment(this.model.createTime):null})
        });

      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleCancel () {
        this.close()
      },


    }
  }
</script>

<style lang="less" scoped>

</style>