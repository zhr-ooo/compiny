<template>
  <a-modal
    :title="'修改' + title"
    :width="600"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
  >
    <a-spin :spinning="confirmLoading">
      <a-row :gutter="16" v-show="!defaultIsVip">
        <a-col :lg="3">
          {{ title }}:
        </a-col>
        <a-col :lg="19">
          <a-input-number :placeholder="`请输入${title}`" v-model="typevulue"></a-input-number>
        </a-col>
      </a-row>

      <a-row :gutter="16" v-show="defaultIsVip">
        <a-col :lg="4">
          修改标识:
        </a-col>
        <a-col :lg="19">
          <a-select v-model="typevulue">
            <a-select-option :value="0">测试</a-select-option>
            <a-select-option :value="1">正式</a-select-option>
            <a-select-option :value="2">官方</a-select-option>
          </a-select>
        </a-col>
      </a-row>
    </a-spin>

  </a-modal>
</template>

<script>
  import { postAction } from "@/api/manage";

  export default {
    name: "AppUserInfoChangeModel",
    data() {
      return {
        title: '修改',
        id: '',
        visible: false,
        type: '',
        typevulue: '',
        isShareProfit: 0,    //是否分润
        confirmLoading: false,
        defaultIsVip: false,
        url: {
          setMoney: '/system/appuserinfo/setMoney',    //修改V币
          setBalance: '/system/appuserinfo/setBalance',   //修改V钻
          setCredits: '/system/appuserinfo/setCredits',    //修改大V值
          setVip: '/system/appuserinfo/setVip',
          setMarker:"/system/appuserinfo//set-marker"//修改标识
        }
      }
    },
    methods: {
      open (record) {
        this.visible = true;
        this.id = record.userid;
      },

      close () {
        this.$emit('close');
        this.visible = false;
        this.id = '';
        this.type = '';
        this.typevulue = null;
      },
      handleOk () {
        const that = this;
        console.log(this.typevulue);
        if ((this.typevulue == undefined || this.typevulue == '') && this.typevulue !== 0) {
          this.$message.warning('数值不能为空！');
          return
        }
        let arr = '';
        let thisurl = '';
        that.confirmLoading = true;
        if (this.type === 'setMoney') {
          arr = `?userid=${this.id}&money=${this.typevulue}`;
          thisurl = this.url.setMoney
        } else if (this.type === 'setBalance') {
          arr = `?userid=${this.id}&balance=${this.typevulue}`;
          thisurl = this.url.setBalance
        } else if (this.type === 'setCredits') {
          arr = `?userid=${this.id}&credits=${this.typevulue}`;
          thisurl = this.url.setCredits
        } else if (this.type === 'setMarker') {
          arr = `?userId=${this.id}&marker=${this.typevulue}`;
          thisurl = this.url.setMarker
        }
        console.log(arr);
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
      }
    }
  }
</script>

<style scoped>
  .ant-input-number, .ant-select{
    width: 80%;
  }
</style>
