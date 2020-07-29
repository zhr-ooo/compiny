<template>
  <a-card :bordered="false">
    <!-- table区域-begin -->
    <div>
      <a-table
        ref="table"
        bordered
        size="middle"
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange">
        
        <template slot="avatarslot" slot-scope="text">
          <a-avatar shape="square" :src="text" icon="user" @click.stop="bigImg(text)"/>
        </template>
        
        <span slot="action" slot-scope="text, record">
          <a @click="handleAssociate(record.id)">关联app用户</a>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->
    <associated-modal ref="modalForm" @ok="modalFormOk"></associated-modal>
    <product-new-big-img ref="bigImg"></product-new-big-img>
  </a-card>
</template>

<script>
  import AssociatedModal from "./modules/AssociatedModal";
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'
  import ProductNewBigImg from "../product/modules/ProductNewBigImg";

  export default {
    name: "AssociatedApp",
    mixins: [JeecgListMixin],
    components: {
      AssociatedModal,
      ProductNewBigImg
    },
    data() {
      return {
        description: '系统账号关联APP',
        queryParam: {},
        columns: [
          {
            title: '用户账号',
            align: "center",
            dataIndex: 'username'
          },
          {
            title: '姓名',
            align: "center",
            dataIndex: 'realname'
          },
          {
            title: '手机号码',
            align: "center",
            dataIndex: 'phone'
          },
          {
            title: 'app昵称',
            align: "center",
            dataIndex: 'nickName'
          },
          {
            title: '头像',
            align: "center",
            dataIndex: 'header',
            scopedSlots: {customRender: "avatarslot"}
          },
          {
            title: 'vyunID',
            align: "center",
            dataIndex: 'code'
          },
          {
            title: '手机号',
            align: "center",
            dataIndex: 'appphone'
          },
          {
            title: '操作',
            dataIndex: 'action',
            scopedSlots: {customRender: 'action'},
            align: "center",
            width: 170
          }

        ],
        url: {
          imgerver: window._CONFIG['domianURL'] + "/sys/common/view",
          list: "/sys/user/getUserList"
        },
      }
    },
    methods: {
      //  图片点击放大
      bigImg (text) {
        if(text) {
          this.$refs.bigImg.make(text);
        }
      },
      getAvatarView: function (avatar) {
        return this.url.imgerver + "/" + avatar;
      },
    //  关联账号
      handleAssociate (id) {
        this.$refs.modalForm.show(id)
      }
    }

  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>
