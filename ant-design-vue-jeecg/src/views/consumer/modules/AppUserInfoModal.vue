<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
    :footer="null"
  >

    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="手机号">
          <a-input placeholder="请输入手机号" v-decorator="['phone', {}]" :readOnly="disableSubmit"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="V云号">
          <a-input-number v-decorator="[ 'code', {} ]" :disabled="disableSubmit" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="昵称">
          <a-input placeholder="请输入昵称" v-decorator="['nickName', {}]" :readOnly="disableSubmit" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="头像">
          <a-upload
            accept="image/*"
            listType="picture-card"
            class="avatar-uploader"
            :showUploadList="false"
            :supportServerRender="true"
            :customRequest="customRequest"
            :disabled="disableSubmit"
          >
            <img v-if="coverimg" :src="coverimg" alt="avatar" style="max-width: 150px;" />
            <div v-else>
              <a-icon :type="loading ? 'loading' : 'plus'" />
              <div class="ant-upload-text" v-if="!loading">Upload</div>
              <div class="ant-upload-text" v-if="loading">{{ percent }}%</div>
            </div>
          </a-upload>
          <!-- <a-input placeholder="请输入头像" v-decorator="['header', {}]" :readOnly="disableSubmit" />-->
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="角色">
          <a-select placeholder="清选择角色" v-decorator="[ 'role', {}]" :disabled="disableSubmit">
            <a-select-option value="0">普通会员</a-select-option>
            <a-select-option value="1">VIP会员</a-select-option>
            <a-select-option value="2">大V会员</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="v云大使">
          <a-select placeholder="清选择是否为v云大使" v-decorator="[ 'ambassador', {}]" :disabled="disableSubmit">
            <a-select-option :value="0">否</a-select-option>
            <a-select-option :value="1">是</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="V币">
          <a-input-number v-decorator="[ 'money', {}]" :disabled="disableSubmit" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="V钻">
          <a-input-number v-decorator="[ 'balance', {}]" :disabled="disableSubmit" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="大V值">
          <a-input placeholder="请输入大V值" v-decorator="['credits', {}]" :readOnly="disableSubmit" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="创建时间">
          <a-date-picker showTime format="YYYY-MM-DD HH:mm:ss" v-decorator="[ 'createTime', {}]" :disabled="disableSubmit" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="收费会员开始时间">
          <a-date-picker v-decorator="[ 'startTime', {}]" :disabled="disableSubmit" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="收费会员结束时间">
          <a-date-picker v-decorator="[ 'endTime', {}]" :disabled="disableSubmit" />
        </a-form-item>
        <!-- <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="真实姓名">
          <a-input placeholder="请输入真实姓名" v-decorator="['realname', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="身份证号">
          <a-input placeholder="请输入身份证号" v-decorator="['idcard', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="手持身份证照片">
          <a-input placeholder="请输入手持身份证照片" v-decorator="['idcardimage', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="支付密码">
          <a-input placeholder="请输入支付密码" v-decorator="['paypassword', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="生日">
          <a-input placeholder="请输入生日" v-decorator="['birthday', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="个性签名">
          <a-input placeholder="请输入个性签名" v-decorator="['personsign', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否是主播（0否1是）">
          <a-input-number v-decorator="[ 'isanchor', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="冻结金额">
          <a-input-number v-decorator="[ 'frozenbalance', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否自动充值会员">
          <a-input placeholder="请输入是否自动充值会员" v-decorator="['isauto', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="自动充值金额">
          <a-input-number v-decorator="[ 'automoney', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="收藏课程数量">
          <a-input-number v-decorator="[ 'collectcount', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="粉丝数量">
          <a-input-number v-decorator="[ 'funscount', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="关注数量">
          <a-input-number v-decorator="[ 'attentioncount', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="主播描述">
          <a-input placeholder="请输入主播描述" v-decorator="['anchordescr', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="腾讯Im唯一标示(环信账号)">
          <a-input placeholder="请输入腾讯Im唯一标示(环信账号)" v-decorator="['imidentifier', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="独家号">
          <a-input placeholder="请输入独家号" v-decorator="['code', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="0：不是vip 1：7天vip 2：月度vip 3：季度vip 4：年费vip">
          <a-input-number v-decorator="[ 'isvip', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="邀请人id">
          <a-input-number v-decorator="[ 'inviteid', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="自身邀请码">
          <a-input placeholder="请输入自身邀请码" v-decorator="['invitecode', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="邀请二维码">
          <a-input placeholder="请输入邀请二维码" v-decorator="['inviteimage', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="该用户所属团队ID">
          <a-input-number v-decorator="[ 'teamid', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="邀请人数">
          <a-input-number v-decorator="[ 'invitenumber', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否是团队创始人（0否1是）">
          <a-input-number v-decorator="[ 'isteamcreate', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="积分（申请大V）">
          <a-input-number v-decorator="[ 'credits', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="腾讯用户签名">
          <a-input placeholder="请输入腾讯用户签名" v-decorator="['imusersig', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="签名到期时间">
          <a-date-picker showTime format='YYYY-MM-DD HH:mm:ss' v-decorator="[ 'sigendtime', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否登陆（是否激活）">
          <a-input-number v-decorator="[ 'islogin', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否存在分销关系（0否1是）">
          <a-input-number v-decorator="[ 'isparent', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="临时级别id">
          <a-input placeholder="请输入临时级别id" v-decorator="['fatherid', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="电话区号">
          <a-input placeholder="请输入电话区号" v-decorator="['prefix', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="身份证正面照片">
          <a-input placeholder="请输入身份证正面照片" v-decorator="['idcardfrontimage', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="身份证反面照片">
          <a-input placeholder="请输入身份证反面照片" v-decorator="['idcardbackimage', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="自动续费天数">
          <a-input-number v-decorator="[ 'autodays', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否大v  0否1是">
          <a-input-number v-decorator="[ 'bigvip', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="背景图">
          <a-input placeholder="请输入背景图" v-decorator="['bgimage', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="昵称拼音">
          <a-input placeholder="请输入昵称拼音" v-decorator="['nicknamespell', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="现居地址">
          <a-input placeholder="请输入现居地址" v-decorator="['address', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="房间号">
          <a-input placeholder="请输入房间号" v-decorator="['roomid', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="阿里账号">
          <a-input placeholder="请输入阿里账号" v-decorator="['aliid', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="阿里名字">
          <a-input placeholder="请输入阿里名字" v-decorator="['aliname', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="v云大使 0否1是">
          <a-input-number v-decorator="[ 'ambassador', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="ambassadorcredits">
          <a-input-number v-decorator="[ 'ambassadorcredits', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="V云大使二维码">
          <a-input placeholder="请输入V云大使二维码" v-decorator="['ambassadorqrcode', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="所属城市id">
          <a-input-number v-decorator="[ 'cityid', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否城市搭理">
          <a-input-number v-decorator="[ 'cityagent', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="代理城市的id">
          <a-input-number v-decorator="[ 'agentcityid', {}]" />
        </a-form-item> -->

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import Vue from 'vue'
  import { httpAction } from '@/api/manage'
  import { ACCESS_TOKEN } from "@/store/mutation-types"
  import pick from 'lodash.pick'
  import moment from "moment"
  import * as qiniu from 'qiniu-js'

  export default {
    name: "AppUserInfoModal",
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
        loading: false,
        confirmLoading: false,
        disableSubmit: false,
        coverimg: '',
        canimg: '',
        percent: '',
        headers: {},
        form: this.$form.createForm(this),
        validatorRules:{
        userid:{rules: [{ required: true, message: '请输入用户ID!' }]},
        },
        url: {
          add: "/user/appUserInfo/add",
          edit: "/user/appUserInfo/edit",
          fileUpload: window._CONFIG['domianQiNiu'],
          qiniuToken: '/qiniuUpToken'
        },
      }
    },
    created () {
      const token = Vue.ls.get(ACCESS_TOKEN);
      this.headers = {"X-Access-Token":token};
    },
    computed:{
      uploadAction:function () {
        return this.url.fileUpload;
      }
    },
    methods: {
      add () {
        this.edit({});
      },
      edit (record) {
        this.coverimg = record.header;
        this.canimg = record.header;
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'code','nickName','header','credits','phone','role','money','balance','createTime','startTime','ambassador','endTime'))
          this.form.setFieldsValue({endTime:this.model.endTime?moment(this.model.endTime):null})
          this.form.setFieldsValue({startTime:this.model.startTime?moment(this.model.startTime):null})
          this.form.setFieldsValue({createTime:this.model.createTime?moment(this.model.createTime):null})
        });

      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleOk () {
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true;
            let httpurl = '';
            let method = '';
            if(!this.model.id){
              httpurl+=this.url.add;
              method = 'post';
            }else{
              httpurl+=this.url.edit;
               method = 'put';
            }
            let formData = Object.assign(this.model, values);
            //时间格式化
            formData.endtime = formData.endtime?formData.endtime.format('YYYY-MM-DD'):null;
            formData.sigendtime = formData.sigendtime?formData.sigendtime.format('YYYY-MM-DD'):null;

            console.log(formData)
            httpAction(httpurl,formData,method).then((res)=>{
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



          }
        })
      },
      handleCancel () {
        this.close()
      },
      // 自定义上传
      customRequest (data) {
        const suffix = "." + data.file.name.replace(/^.+\./, '')
        //请求token
        httpAction(this.url.qiniuToken, {}, 'post').then((res) => {
          if (res) {
            let token = res.data.token
            const file = data.file
            const key = new Date().getTime() + suffix;
            let domain = this.url.fileUpload
            let config = {
              useCdnDomain: true,
              region: null
            }
            let putExtra = {
              fname: '',
              params: {},
              mimeType: null
            }
            let observable = qiniu.upload(file, key, token, putExtra, config);
            observable.subscribe({
              next: (res) => {
                this.loading = true;
                this.percent = res.total.percent.toFixed(2)
                this.coverimg = '';
              },
              error: () => {
                this.$message.error('上传失败')
                this.loading = false;
                this.coverimg = this.canimg
              },
              complete: (response) => {
                this.coverimg = `${domain}/${response.key}`;
                this.loading = false;
              }
            })
          }
        })
      },

    }
  }
</script>

<style lang="less" scoped>

</style>
