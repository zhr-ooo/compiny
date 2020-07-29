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
      <a-row :gutter="16">
        <a-col :lg="2">
          省市:
        </a-col>
        <a-col :lg="8">
          <a-select placeholder="请选择省份" v-model="provinceid" @change="handelPro">
            <a-select-option v-for="(item) in provinceList" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
          </a-select>
        </a-col>
        <a-col :lg="3">
          会员充值:
        </a-col>
        <a-col :lg="8">
          <a-select v-model="cityid" placeholder="请选则市级">
            <a-select-option v-for="(item) in cityList" :key="item.cityid" :value="item.cityid">{{ item.name }}</a-select-option>
          </a-select>
        </a-col>
      </a-row>
    </a-spin>

  </a-modal>
</template>

<script>
  import { postAction } from "@/api/manage";

  export default {
    name: "AppUserInfoAgentModal",
    data () {
      return {
        title:"设置市代理",
        visible: false,
        loading: false,
        id: '',
        provinceid: null,     // 省级id
        cityid: null,      //市级id
        confirmLoading: false,
        disSubmit: false,
        provinceList: [],
        cityList: [],
        url: {
          setAgent: "/system/appuserinfo/setToAgent",
          provinceSelect: '/other/select/provinceSelect',    // 省级下拉选
          citySelect: '/other/select/citySelect'    //市级下拉选
        },
      }
    },
    methods: {
      open (record) {
        this.visible = true;
        this.id = record.userid;
        this.getPro();
      },
      close () {
        this.$emit('close');
        this.visible = false;
        this.id = '';
        this.provinceid = '';
        this.cityid = '';
      },
      handleOk () {
        const that = this;
        that.confirmLoading = true;
        let arr = `?userid=${this.id}&cityid=${this.cityid}`;
        let thisurl = this.url.setAgent;
        console.log(thisurl + arr);
        postAction(thisurl + arr).then((res) => {
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
      },
      handleCancel () {
        this.close()
      },
      // 获取省级数据
      getPro () {
        const that = this;
        postAction(this.url.provinceSelect).then((res) => {
          if(res.success){
            that.provinceList = res.result;
          }else{
            that.$message.warning(res.message);
          }
        })
      },
    //  选择的时候获取市级数据
      handelPro (value) {
        const that = this;
        that.cityList = [];
        let arr = `?fatherid=${value}`;
        postAction(this.url.citySelect + arr).then((res) => {
          if(res.success){
            that.cityList = res.result;
          }else{
            that.$message.warning(res.message);
          }
        })
      }
    }
  }
</script>

<style scoped>
  .ant-select {
    width: 80%;
  }
</style>
