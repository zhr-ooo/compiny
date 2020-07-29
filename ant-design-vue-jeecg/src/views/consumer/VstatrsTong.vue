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
            <a-form-item label="用户标识">
              <a-select placeholder="请选择用户标识" v-model="queryParam.marker">
                <a-select-option value="0">测试</a-select-option>
                <a-select-option value="1">正式</a-select-option>
                <a-select-option value="2">官方</a-select-option>
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
            </span>
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
    <!--  图片点击放大  -->
    <product-new-big-img ref="bigImg"></product-new-big-img>
  </a-card>
</template>

<script>
import ProductNewBigImg from "../product/modules/ProductNewBigImg";
import { JeecgListMixin } from "@/mixins/JeecgListMixin";
import { getAction, postAction } from "@/api/manage";

export default {
  name: "VstatrsTong",
  mixins: [JeecgListMixin],
  components: {
    ProductNewBigImg
  },
  data() {
    return {
      description: "V值统计列表",
    //   queryParam: {
    //       marker:this.$route.query.marker   
    //   },
    //   param: {
    //        marker:this.$route.query.marker       
    //   },
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
        }
      ],
      url: {
        list: "/system/appuserinfo/list"
      }
    };
  },
  //   beforeRouteEnter (to, from, next) {
  // 　　console.log(from);
  // 　　next();
  // },
  created() {
    console.log(this.$route.query.marker);
    console.log(this.marker);
  },
  methods: {}
};
</script>
<style scoped>
@import "~@assets/less/common.less";
</style>
