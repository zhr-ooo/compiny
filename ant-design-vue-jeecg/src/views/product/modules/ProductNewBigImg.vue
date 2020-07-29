<template>
  <a-modal
    title=" "
    :width="width"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    :bodyStyle="bodyStyle"
    :footer="null"
    class="big-model"
  >

    <a-spin :spinning="confirmLoading">
      <img :src="src" alt="" class="bigimg">
    </a-spin>

  </a-modal>
</template>

<script>
  export default {
    name: "ProductNewBigImg",
    data () {
      return {
        src: '',
        width: 800,
        visible: false,
        confirmLoading: false,
        bodyStyle: {
          'padding': '0'
        }
      }
    },
    methods: {
      make (text, width) {
        this.visible = true;
        this.src = text;
        this.width = width || 800
      },
      close () {
        this.visible = false;
      },
      handleCancel () {
        this.close()
      }
    }
  }
</script>

<style>
  .big-model .ant-modal-header {
    border-width: 0 !important;
    padding: 0;
  }
  .big-model .ant-modal-close-x {
    font-size: 20px;
  }
  .big-model .ant-modal-close {
    color: #000c17;
  }
  .bigimg {
    width: 100%;
  }
</style>
