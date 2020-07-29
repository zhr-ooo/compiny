<template>
  <a-card :bordered="false">
    <!-- table区域-begin -->
    <div>
      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :loading="loading"
        @change="handleTableChange"
        :customRow="clickThenCheck"
      ></a-table>
    </div>
    <!-- table区域-end -->
  </a-card>
</template>

<script>
import { getAction } from "@/api/manage";
import { JeecgListMixin } from "@/mixins/JeecgListMixin";

export default {
  name: "ConstantList",
  mixins: [JeecgListMixin],
  data() {
    return {
      description: "常量配置页面",
      // 表头
      columns: [
        {
          title: "标题",
          align: "center",
          dataIndex: "name"
        },
        {
          title: "描述",
          align: "center",
          dataIndex: "descr"
        }
      ],
      url: {
        list: "/system/sysparam/list"
      }
    };
  },
  methods: {
    clickThenCheck(record) {
      return {
        on: {
          click: () => {
            switch (record.name) {
              case "提现设置":
                this.$router.push({ path: "/platform/WithdrawSettingList" });
                break;
              case "会员设置":
                this.$router.push({ path: "/platform/VipSettingList" });
                break;
              case "客服设置":
                this.$router.push({ path: "/platform/KefuSettingList" });
                break;
              case "在线课程":
                this.$router.push({ path: "/platform/ProductSettingList" });
                break;
              case "充值须知":
                this.$router.push({ path: "/platform/ChongZhiSettingList" });
                break;
              case "V值说明":
                this.$router.push({ path: "/platform/VvalueSettingList" });
                break;
              case "分红设置":
                this.$router.push({ path: "/platform/ShareRed" });
                break;
              default:
                break;
            }
          }
        }
      };
    },
    loadData(arg) {
      if (!this.url.list) {
        this.$message.error("请设置url.list属性!");
        return;
      }
      //加载数据 若传入参数1则加载第一页的内容
      if (arg === 1) {
        this.ipagination.current = 1;
      }
      var params = this.getQueryParams(); //查询条件
      this.loading = true;
      getAction(this.url.list, params).then(res => {
        if (res.success) {
          this.dataSource = res.result;
        }
        if (res.code === 510) {
          this.$message.warning(res.message);
        }
        this.loading = false;
      });
    }
  }
};
</script>
<style scoped>
@import "~@assets/less/common.less";
</style>