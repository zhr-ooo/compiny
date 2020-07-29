<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" style="height:95px">
        <a-row :gutter="26" style="height:40px">
          <a-col :md="3" :sm="3">
            <a-form-item label="昵称">
              <a-input placeholder="请输入昵称" v-model="queryParam.name"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="3" :sm="3">
            <a-form-item label="V云号">
              <a-input placeholder="请输入V云号" v-model="queryParam.code"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="3" :sm="3">
            <a-form-item label="角色">
              <a-select placeholder="请选择角色" v-model="queryParam.role">
                <a-select-option value="0">普通会员</a-select-option>
                <a-select-option value="1">VIP会员</a-select-option>
                <a-select-option value="2">大V会员</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="3" :sm="3">
            <a-form-item label="手机号">
              <a-input placeholder="请输入手机号" v-model="queryParam.phone"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="3" :sm="3">
            <a-form-item label="V云大使">
              <a-select placeholder="是否为v云大使" v-model="queryParam.ambassador">
                <a-select-option :value="0">否</a-select-option>
                <a-select-option :value="1">是</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="3" :sm="3">
            <a-form-item label="创客达人">
              <a-select placeholder="是否为创客达人" v-model="queryParam.isCreator">
                <a-select-option :value="0">否</a-select-option>
                <a-select-option :value="1">是</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :md="3" :sm="3">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button
                type="primary"
                @click="searchReset"
                icon="reload"
                style="margin-left: 8px"
              >重置</a-button>

              <a-button
                type="primary"
                icon="to-top"
                @click="exportExcel"
                style="margin-left: 8px"
              >导出</a-button>
            </span>
          </a-col>
        </a-row>
        <a-row :gutter="26">
         
            <a-col :md="3" :sm="3">
              <a-form-item label="是否推荐">
                <a-select placeholder="是否推荐" v-model="queryParam.isRecommend">
                  <a-select-option :value="0">否</a-select-option>
                  <a-select-option :value="1">是</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

                 <a-col :md="3" :sm="3">
            <a-form-item label="用户标识">
              <a-select placeholder="请选择用户标识" v-model="queryParam.marker">
                <a-select-option value="0">测试</a-select-option>
                <a-select-option value="1">正式</a-select-option>
                <a-select-option value="2">官方</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

        </a-row>
      </a-form>
    </div>
    <!-- <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
    </div>-->

    <!-- table区域-begin -->
    <div>
      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="ind"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <span slot="header" slot-scope="text">
          <a-avatar
            shape="square"
            size="large"
            :src="text"
            :srcSet="text"
            @click.stop="bigImg(text)"
          ></a-avatar>
        </span>

        <span slot="action1" slot-scope="text, record" @click.stop>
          <!-- <a @click="handleEdit(record)">编辑</a> -->
          <a-dropdown>
            <a class="ant-dropdown-link">
              修改
              <a-icon type="down" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a @click="handelRole(record)">修改角色</a>
              </a-menu-item>
              <a-menu-item>
                <a @click="handleAppChange(record, 'setMoney')">修改V币</a>
              </a-menu-item>
              <a-menu-item>
                <a @click="handleAppChange(record, 'setBalance')">修改V钻</a>
              </a-menu-item>
              <a-menu-item>
                <a @click="handleAppChange(record, 'setCredits')">修改大V值</a>
              </a-menu-item>
              <a-menu-item>
                <a @click="handleAppChange(record, 'setMarker')">修改标识</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>

          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">
              设置
              <a-icon type="down" />
            </a>

            <a-menu slot="overlay">
              <a-menu-item>
                <a @click="handleAppChange1(record)">设置会员</a>
              </a-menu-item>
              <a-menu-item>
                <a @click="handleAppChange2(record)">设置创客达人</a>
              </a-menu-item>
              <a-menu-item>
                <a @click="handleAppChange3(record)">设置v云大使</a>
              </a-menu-item>
              <!-- <a-menu-item>
                <a-popconfirm title="确定升级为创客达人吗?" @confirm="() => handleChuanKe(record.userid)">
                  <a>设置创客达人</a>
                </a-popconfirm>
              </a-menu-item>-->
              <!-- <a-menu-item>
                <a-popconfirm title="确定设置为V云大使吗?" @confirm="() => handleAmbassador(record.userid)">
                  <a>设置V云大使</a>
                </a-popconfirm>
              </a-menu-item>-->
              <a-menu-item>
                <a-popconfirm title="确定取消创客达人吗?" @confirm="() => excelChuanKe(record.userid)">
                  <a>取消创客达人</a>
                </a-popconfirm>
              </a-menu-item>
              <a-menu-item>
                <a-popconfirm title="确定取消V云大使吗?" @confirm="() => excelAmbassador(record.userid)">
                  <a>取消V云大使</a>
                </a-popconfirm>
              </a-menu-item>
              <a-menu-item>
                <a @click="handleShareId(record, 'setVip')">设置V云靓号</a>
              </a-menu-item>

              <!-- <a-menu-item v-show="record.isVip>1">
                <a @click="handleAgent(record)">设置市代理</a>
              </a-menu-item>-->
            </a-menu>
          </a-dropdown>
          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">
              推荐
              <a-icon type="down" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item v-if="record.firstpage && record.firstpage == 's'">
                <a-popconfirm title="确定取消一级推荐吗?" @confirm="() => handleCommen(record.userid, 1, 0)">
                  <a>取消一级推荐</a>
                </a-popconfirm>
              </a-menu-item>
              <a-menu-item v-else>
                <a-popconfirm title="确定设置一级推荐吗?" @confirm="() => handleCommen(record.userid, 1, 1)">
                  <a>设置一级推荐</a>
                </a-popconfirm>
              </a-menu-item>
              <a-menu-item v-if="record.secondpage && record.secondpage == 's'">
                <a-popconfirm title="确定取消二级推荐吗?" @confirm="() => handleCommen(record.userid, 2, 0)">
                  <a>取消二级推荐</a>
                </a-popconfirm>
              </a-menu-item>
              <a-menu-item v-else>
                <a-popconfirm title="确定设置二级推荐吗?" @confirm="() => handleCommen(record.userid, 2, 1)">
                  <a>设置二级推荐</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <appUserInfo-modal ref="modalForm" @ok="modalFormOk"></appUserInfo-modal>
    <share-id ref="shareId" @ok="modalFormOk"></share-id>
    <!--  图片点击放大  -->
    <product-new-big-img ref="bigImg"></product-new-big-img>
    <!-- 修改V币，V钻，大V值 -->
    <app-user-info-change-model ref="changeModel" @ok="modalFormOk"></app-user-info-change-model>
    <!--  设置会员 -->
    <AppSetVip ref="changeModel1" @ok="modalFormOk"></AppSetVip>
    <!--  设置创客达人 -->
    <AppSetCreator ref="changeModel2" @ok="modalFormOk"></AppSetCreator>
    <!--  设置v云大使 -->
    <AppSetAmbassador ref="changeModel3" @ok="modalFormOk"></AppSetAmbassador>
    <!--  修改角色  -->
    <app-user-info-role-model ref="roleModel" @ok="modalFormOk"></app-user-info-role-model>
    <!--  设置市代理  -->
    <app-user-info-agent-modal ref="agentModel" @ok="modalFormOk"></app-user-info-agent-modal>
    <!-- 设置v云大使 -->
    <!-- <Vyun-bransh ref="dashi" @ok="modalFormOk"></Vyun-bransh> -->
    <export-excel-model ref="modalForm" @ok="modalFormOk"></export-excel-model>
  </a-card>
</template>

<script>
import AppUserInfoModal from "./modules/AppUserInfoModal";
import ProductNewBigImg from "../product/modules/ProductNewBigImg";
import AppUserInfoChangeModel from "./modules/AppUserInfoChangeModel";
import AppSetVip from "./modules/AppSetVip";
import AppSetCreator from "./modules/AppSetCreator";
import AppSetAmbassador from "./modules/AppSetAmbassador";
import AppUserInfoRoleModel from "./modules/AppUserInfoRoleModel";
import AppUserInfoAgentModal from "./modules/AppUserInfoAgentModal";
import exportExcelModel from "./modules/exportExcelModel";
import ShareId from "./modules/ShareId";
import { JeecgListMixin } from "@/mixins/JeecgListMixin";
import { getAction, postAction } from "@/api/manage";

export default {
  name: "AppUserInfoList",
  mixins: [JeecgListMixin],
  components: {
    AppUserInfoModal,
    ProductNewBigImg,
    AppUserInfoChangeModel,
    AppSetVip,
    AppSetCreator,
    AppSetAmbassador,
    AppUserInfoRoleModel,
    AppUserInfoAgentModal,
    exportExcelModel,
    ShareId
  },
  data() {
    return {
      description: "用户详情管理页面",
      queryParam: {
        isShareProfit: 0,
        code: null,
        name: null,
        // role: null,
        // ambassador: null,
        // marker: null
      },
      param: {
        isShareProfit: 0,
        code: null,
        name: null,
        // role: null,
        // ambassador: null,
        // marker: null
      },
      // 表头
      columns: [
        {
          title: "手机号",
          align: "center",
          dataIndex: "phone"
        },
        {
          title: "V云号",
          align: "center",
          dataIndex: "code"
        },
        {
          title: "昵称",
          align: "center",
          dataIndex: "nickName"
        },
        {
          title: "头像",
          align: "center",
          dataIndex: "header",
          scopedSlots: { customRender: "header" }
        },
        {
          title: "角色",
          align: "center",
          dataIndex: "role",
          customRender: function(text) {
            if (text == "0") {
              return "普通会员";
            } else if (text == "1") {
              return "VIP会员";
            } else if (text == "2") {
              return "大V会员";
            }
          }
        },
        {
          title: "创客达人",
          align: "center",
          dataIndex: "isCreator",
          customRender: function(text) {
            if (text == 1) {
              return "是";
            } else {
              return "否";
            }
          }
        },
        {
          title: "V云大使",
          align: "center",
          dataIndex: "ambassador",
          customRender: function(text) {
            if (text == 1) {
              return "是";
            } else {
              return "否";
            }
          }
        },
           {
          title: "大使星级",
          align: "center",
          dataIndex: "ambassadorLevel"
        },
        {
          title: "V币",
          align: "center",
          dataIndex: "money"
        },
        {
          title: "V钻",
          align: "center",
          dataIndex: "balance"
        },
          {
          title: "提现冻结金额",
          align: "center",
          dataIndex: "frozenBalance"
        },
          {
          title: "订单冻结金额",
          align: "center",
          dataIndex: "draw"
        },
        {
          title: "大V值",
          align: "center",
          dataIndex: "credits"
        },
        {
          title: "用户标识",
          align: "center",
          dataIndex: "marker",
          customRender: function(text) {
            if (text == 0) {
              return "测试";
            } else if (text == 1) {
              return "正式";
            } else if (text == 2) {
              return "官方";
            }
          }
        },
        {
          title: "创建时间",
          align: "center",
          dataIndex: "createTime"
        },
        {
          title: "VIP开始时间",
          align: "center",
          dataIndex: "startTime"
        },
        {
          title: "VIP结束时间",
          align: "center",
          dataIndex: "endTime"
        },
        {
          title: "操作",
          dataIndex: "action1",
          align: "center",
          scopedSlots: { customRender: "action1" }
        }
      ],
      url: {
        list: "/system/appuserinfo/list",
        delete: "/user/appUserInfo/delete",
        deleteBatch: "/user/appUserInfo/deleteBatch",
        exportXlsUrl: "user/appUserInfo/exportXls",
        importExcelUrl: "user/appUserInfo/importExcel",
        setCreator: "/system/appuserinfo/setCreator",
        commoned: "/system/appuserinfo/recommended",
        setAmbassador: "/system/appuserinfo/setAmbassador",
        cancelCreator: "/system/appuserinfo/cancel-creator", //取消创客达人
        cancelAambassador: "/system/appuserinfo/cancel-ambassador", //取消v云大使
        exportExcel: "/user/excel/exportExcel"
      }
    };
  },
  created() {
    this.loadData(); 
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG["domianURL"]}/${this.url.importExcelUrl}`;
    }
  },
  methods: {
    //  图片点击放大
    bigImg(text) {
      if (text) {
        this.$refs.bigImg.make(text);
      }
    },
    //  修改角色
    handelRole(record) {
      this.$refs.roleModel.open(record);
    },
    //  设置V云大使
    handleAmbassador(userid) {
      let arr = `?userid=${userid}`;
      const that = this;
      postAction(this.url.setAmbassador + arr).then(res => {
        if (res.success) {
          that.$message.success(res.message);
          that.loadData();
        } else {
          that.$message.warning(res.message);
          that.loadData();
        }
      });
    },
    //  修改
    handleAppChange(record, type) {
      this.$refs.changeModel.open(record);
      this.$refs.changeModel.type = type;
      // 修改V币
      if (type === "setMoney") {
        this.$refs.changeModel.title = "V币";
        this.$refs.changeModel.typevulue = record.money;
        this.$refs.changeModel.defaultIsVip = false;
      } else if (type === "setBalance") {
        // 修改V钻
        this.$refs.changeModel.title = "V钻";
        this.$refs.changeModel.typevulue = record.balance;
        this.$refs.changeModel.defaultIsVip = false;
      } else if (type === "setCredits") {
        // 修改大V值
        this.$refs.changeModel.title = "大V值";
        this.$refs.changeModel.typevulue = record.credits;
        this.$refs.changeModel.defaultIsVip = false;
      } else if (type === "setMarker") {
        // 修改大V值
        this.$refs.changeModel.title = "标识";
        this.$refs.changeModel.typevulue = record.marker;
        this.$refs.changeModel.defaultIsVip = true;
      }
      // else if (type === "setVip") {
      //   //  设置会员
      //   this.$refs.changeModel1.title = "会员";
      //   this.$refs.changeModel1.typevulue = null;
      //   this.$refs.changeModel1.defaultIsVip = true;
      // }
    },
    // 设置会员
    handleAppChange1(record) {
      this.$refs.changeModel1.title = "会员";
      this.$refs.changeModel1.open(record);
      this.$refs.changeModel1.defaultIsVip = true;
    },
    // 设置创客达人
    handleAppChange2(record) {
      this.$refs.changeModel2.title = "创客达人";
      this.$refs.changeModel2.open(record);
      this.$refs.changeModel2.defaultIsVip = true;
    },
    // 设置v云大使
    handleAppChange3(record) {
      this.$refs.changeModel3.title = "v云大使";
      this.$refs.changeModel3.open(record);
      this.$refs.changeModel3.defaultIsVip = true;
    },
    // 设置靓号
    handleShareId(record) {
      this.$refs.shareId.open(record);
    },
    //  设置推荐
    handleCommen(userid, level, set) {
      let arr = `?id=${userid}&level=${level}&set=${set}`;
      const that = this;
      postAction(this.url.commoned + arr).then(res => {
        if (res.success) {
          that.$message.success(res.message);
        } else {
          that.$message.warning(res.message);
        }
        that.loadData();
      });
    },
    // 设置创客达人
    handleChuanKe(userid) {
      let arr = `?userid=${userid}`;
      const that = this;
      postAction(this.url.setCreator + arr).then(res => {
        if (res.success) {
          that.$message.success(res.message);
          that.loadData();
        } else {
          that.$message.warning(res.message);
          that.loadData();
        }
      });
    },
    // 取消创客达人
    excelChuanKe(userid) {
      let arr = `?userid=${userid}`;
      const that = this;
      postAction(this.url.cancelCreator + arr).then(res => {
        if (res.success) {
          that.$message.success(res.message);
          that.loadData();
        } else {
          that.$message.warning(res.message);
          that.loadData();
        }
      });
    },
    // 取消v云大使
    excelAmbassador(userid) {
      let arr = `?userid=${userid}`;
      const that = this;
      postAction(this.url.cancelAambassador + arr).then(res => {
        if (res.success) {
          that.$message.success(res.message);
          that.loadData();
        } else {
          that.$message.warning(res.message);
          that.loadData();
        }
      });
    },
    //导出按钮
    exportExcel: function() {
      this.$refs.modalForm.add();
      this.$refs.modalForm.title = "导出";
      this.$refs.modalForm.disableSubmit = false;
    }
    // 导出点击确定按钮
    // const that = this;
    //    getAction(this.url.exportExcel)
    // .then(res => {
    //   if (res.success) {
    //     that.$message.success(res.message);
    //     that.loadData();
    //   }
    // })
    // .catch(err => {
    //   this.$message.warning(err.message);
    //   that.loadData();
    // });

    //  设置市代理
    // handleAgent(record) {
    //   this.$refs.agentModel.open(record);
    // }
  }
};
</script>
<style scoped>
@import "~@assets/less/common.less";
</style>
