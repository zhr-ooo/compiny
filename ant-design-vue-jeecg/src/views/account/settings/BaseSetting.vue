<template>
  <div class="account-settings-info-view">
    <a-row :gutter="16">
      <a-col :md="24" :lg="16">

        <a-form layout="vertical">
          <a-form-item
            label="姓名"
          >
            <a-input placeholder="您自己的名字" v-model="user.realname" :readOnly="true" />
          </a-form-item>
          <a-form-item
            label="账号"
          >
            <a-input placeholder="您的账号" v-model="user.username" :readOnly="true" />
          </a-form-item>
          <a-form-item
              label="性别"
          >
            <a-select v-model="user.sex">
              <a-select-option :value="1">男</a-select-option>
              <a-select-option :value="2">女</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item
              label="手机号码"
          >
            <a-input placeholder="手机号" v-model="user.phone" />
          </a-form-item>
          <a-form-item
              label="座机号"
          >
            <a-input placeholder="座机号" v-model="user.orgCode" />
          </a-form-item>

          <a-form-item
            label="电子邮件"
            :required="false"
          >
            <a-input placeholder="eg:exp@admin.com" v-model="user.email"/>
          </a-form-item>
<!--          <a-form-item-->
<!--            label="加密方式"-->
<!--            :required="false"-->
<!--          >-->
<!--            <a-select defaultValue="aes-256-cfb">-->
<!--              <a-select-option value="aes-256-cfb">aes-256-cfb</a-select-option>-->
<!--              <a-select-option value="aes-128-cfb">aes-128-cfb</a-select-option>-->
<!--              <a-select-option value="chacha20">chacha20</a-select-option>-->
<!--            </a-select>-->
<!--          </a-form-item>-->
<!--          <a-form-item-->
<!--            label="连接密码"-->
<!--            :required="false"-->
<!--          >-->
<!--            <a-input placeholder="h3gSbecd"/>-->
<!--          </a-form-item>-->
          <a-form-item
            label="职位"
            :required="false"
          >
            <a-input placeholder="您的职位" v-model="user.avatar"/>
          </a-form-item>

          <a-form-item>
            <a-button type="primary" @click="changeUser">提交</a-button>
<!--            <a-button style="margin-left: 8px">保存</a-button>-->
          </a-form-item>
        </a-form>

      </a-col>
<!--      <a-col :md="24" :lg="8" :style="{ minHeight: '180px' }">-->
<!--        <div class="ant-upload-preview" @click="$refs.modal.edit(1)" >-->
<!--          <a-icon type="cloud-upload-o" class="upload-icon"/>-->
<!--          <div class="mask">-->
<!--            <a-icon type="plus" />-->
<!--          </div>-->
<!--          <img :src="option.img"/>-->
<!--        </div>-->
<!--      </a-col>-->

    </a-row>

    <avatar-modal ref="modal">

    </avatar-modal>
  </div>
</template>

<script>
  import AvatarModal from './AvatarModal'
  import { getUserId, editUser } from '@/api/api'

  export default {
    components: {
      AvatarModal
    },
    data () {
      return {
        // cropper
        preview: {},
        option: {
          img: '/avatar2.jpg',
          info: true,
          size: 1,
          outputType: 'jpeg',
          canScale: false,
          autoCrop: true,
          // 只有自动截图开启 宽度高度才生效
          autoCropWidth: 180,
          autoCropHeight: 180,
          fixedBox: true,
          // 开启宽度和高度比例
          fixed: true,
          fixedNumber: [1, 1]
        },
        user: {}
      }
    },
    created () {
      let userinfo = this.$store.getters.userInfo;
      this.user = userinfo;
      this.getUser(userinfo.id);
    },
    methods: {
      changeUser () {
        const that = this;
        editUser(this.user).then((res)=>{
          if(res.success){
            that.$message.success(res.message);
          }else{
            that.$message.warning(res.message);
          }
        })
      },
      // 根据id获取用户信息
      getUser (id) {
        let userId = id;
        const that = this;
        getUserId({id:userId}).then((res)=>{
          if(res.success){
            that.user = res.result;
          }else{
            console.log(res.message);
          }
        });
      }
    }
  }
</script>

<style lang="scss" scoped>

  .avatar-upload-wrapper {
    height: 200px;
    width: 100%;
  }

  .ant-upload-preview {
    position: relative;
    margin: 0 auto;
    width: 100%;
    max-width: 180px;
    border-radius: 50%;
    box-shadow: 0 0 4px #ccc;

    .upload-icon {
      position: absolute;
      top: 0;
      right: 10px;
      font-size: 1.4rem;
      padding: 0.5rem;
      background: rgba(222, 221, 221, 0.7);
      border-radius: 50%;
      border: 1px solid rgba(0, 0, 0, 0.2);
    }
    .mask {
      opacity: 0;
      position: absolute;
      background: rgba(0,0,0,0.4);
      cursor: pointer;
      transition: opacity 0.4s;

      &:hover {
        opacity: 1;
      }

      i {
        font-size: 2rem;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -1rem;
        margin-top: -1rem;
        color: #d6d6d6;
      }
    }

    img, .mask {
      width: 100%;
      max-width: 180px;
      height: 100%;
      border-radius: 50%;
      overflow: hidden;
    }
  }
</style>
