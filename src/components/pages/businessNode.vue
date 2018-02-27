<template>
	<div class="main-content">
    	<tabNav></tabNav>
    	<div class="layout-breadcrumb">
            <Breadcrumb>
                <BreadcrumbItem href="/">用户版本</BreadcrumbItem>
                <BreadcrumbItem href="/nodeConfig">节点配置</BreadcrumbItem>
                <BreadcrumbItem>业务节点<Icon type="ios-information" color="#999999" size="16"></Icon></BreadcrumbItem>
            </Breadcrumb>
        </div>
        <!--<div class="module businessNode_div_1">
        	<Input icon="search" placeholder="输入语音名称" style="width: 200px"></Input>
        </div>-->
        <div class="module businessNode_div_3">
        	<Table :height="height" @on-select="checkA" @on-select-cancel="uncheckA" @on-selection-change="cancelAllCheck" @on-select-all="checkAllList" border :columns="columnsV" :data="dataV"></Table>
        </div>
        <div class="module businessNode_div_2">
    		<span v-if="deletedList" class="remove">
    			<b>已选择</b><b class="count" v-text="checkedId.length"></b><b>条</b>
    			<Button>删除</Button>
    		</span>
    		<Page @on-page-size-change="thisEveryPageCount" @on-change="thisCurrentPage" :total="pagesV" :placement="place" show-total show-elevator show-sizer :page-size="pageCountV"></Page>
    	</div>
    	<div class="businessNode_div" v-if="editBusinessNode">
    		<div class="businessNode_div_4">
    			<Card dis-hover>
	    			<span class="businessNode_div_4_span">
	    				<Icon @click.native="closeEditBusinessNode" size="40" color="#e1e1e1" class="closeIcon"></Icon>
	    				<p class="businessNode_div_4_p">业务节点编辑</p>
	    			</span>
					<Form label-position="right" ref="formDatas" :model="formDatas" :label-width="160" :rules="ruleValidate">
						<FormItem label="业务节点名称" prop="name">
		    				<Input v-model="formDatas.name" placeholder="请输入"></Input>
		    			</FormItem>
						<FormItem label="是否支持他机模板" prop="supportOtherPhone">
				            <Select @on-change="supportSelect" v-model="formDatas.supportOtherPhone" placeholder="请选择">
				                <Option :value="1">支持</Option>
				                <Option :value="2">不支持</Option>
				            </Select>
				        </FormItem>
				        <FormItem label="不支持他机语音模板" prop="nonSupportMediaPhoneId" v-if="formDatas.supportOtherPhone == 2">
				            <Select v-model="formDatas.nonSupportMediaPhoneId" placeholder="请选择">
				                <Option v-for="item in navVoiceList" :value="item.id" :key="item.id">{{item.templateName}}</Option>
				            </Select>
				        </FormItem>
				        <FormItem label="播报方式" prop="announceWay">
				        	<RadioGroup :true-value="1" :false-value="2" v-model="formDatas.announceWay">
				                <Radio :label="1">短信</Radio>
				                <Radio :label="2">语音</Radio>
				                <Radio :label="3">短信和语音</Radio>
				            </RadioGroup>
				        </FormItem>
				        <FormItem label="导航语音模板" prop="naviMediaId">
				            <Select v-model="formDatas.naviMediaId" placeholder="请选择">
				                <Option v-for="item in navVoiceList" :value="item.id" :key="item.id">{{item.templateName}}</Option>
				            </Select>
				        </FormItem>
				        <FormItem label="前置判断调用接口" prop="preLinkHeaderName">
				            <Select v-model="formDatas.preLinkHeaderName" placeholder="请选择">
				                <Option v-for="item in callInterfaces" :value="item.id" :key="item.id">{{item.linkName}}</Option>
				            </Select>
				        </FormItem>
				        <FormItem label="业务查询链接名" prop="businessUrlName">
				            <!--<Select v-model="formDatas.businessUrlName" placeholder="请选择">
				                <Option v-for="item in linkName" :value="item.value" :key="item.value">{{item.label}}</Option>
				            </Select>-->
				            <Input v-model="formDatas.businessUrlName" placeholder="请输入"></Input>
				        </FormItem>
				        <FormItem label="全程按键支持" prop="dtmfTag">
				            <RadioGroup :true-value="1" :false-value="2" v-model="formDatas.dtmfTag">
				                <Radio :label="1">支持</Radio>
				                <Radio :label="2">不支持</Radio>
				            </RadioGroup>
				        </FormItem>
				        <FormItem label="业务节点描述" prop="nodeDesc">
				            <Input v-model="formDatas.nodeDesc" type="textarea"></Input>
				        </FormItem>
				        <FormItem>
				            <Button @click="closeTheAddVoiceModule" type="ghost" style="margin-left: 8px">取消</Button>
				            <Button type="primary" @click="clcikSubmit('formDatas')">确定</Button>
				        </FormItem>
				    </Form>
	    		</Card>
    		</div>
    	</div>
	</div>
</template>

<script>
import tabNav from "@/components/common/tabNav";
export default {
  components: {
    tabNav
  },
  data() {
    const nodeName = (rule, value, callback) => {
      if (value === "" || value.replace(/\s/g, "") == "") {
        callback(new Error("业务节点名称不能为空"));
      } else if (value.length > 12) {
        callback(new Error("业务节点名称不能超过12个字符"));
      } else {
        callback();
      }
    };
    const nodeDesc = (rule, value, callback) => {
      if (value === "" || value.replace(/\s/g, "") == "") {
        callback(new Error("业务节点描述不能为空"));
      } else if (value.length > 120) {
        callback(new Error("业务节点描述不能查过120个字符"));
      } else {
        callback();
      }
    };
    const preLinkHeaderName = (rule, value, callback) => {
      if (value === "" || value.replace(/\s/g, "") == "") {
        callback(new Error("业务查询链接名不能为空"));
      } else if (value.length > 20) {
        callback(new Error("业务查询链接名不能超过20个字符"));
      } else {
        callback();
      }
    };
    return {
      editBusinessNode: false,
      deletedList: false,
      doesNotSupport: false,
      pagesV: 0,
      currentPageV: 1,
      pageCountV: 10,
      checkedId: [],
      columnsV: [
        //              	{
        //                      type: 'selection',
        //                      width: 60,
        //                      align: 'center'
        //                  },
        {
          title: "名称",
          key: "name"
        },
        {
          title: "支持他机",
          key: "supportOtherPhone"
        },
        {
          title: "播放方式",
          key: "announceWay"
        },
        {
          title: "全程按键支持",
          key: "dtmfTag"
        },
        {
          title: "创建日期",
          key: "createTime",
          sortable: true
        },
        {
          title: "修改日期",
          key: "updateTime",
          sortable: true
        },
        {
          title: "操作",
          key: "operation",
          render: (h, params) => {
            return h("div", [
              h("Icon", {
                props: {
                  type: "android-create",
                  size: "14",
                  color: "#666666",
                  tableOperaHover: "tableOperaHover"
                },
                class: {
                  tableOperaHover: true
                },
                domProps: {
                  innerHTML: "编辑"
                },
                style: {
                  marginRight: "25px",
                  cursor: "pointer"
                },
                nativeOn: {
                  click: () => {
                    this.editBusinessNode = true;
                    var phone;
                    if (params.row.supportOtherPhone == "支持") {
                      phone = 1;
                    } else {
                      phone = 2;
                    }
                    var way;
                    if (params.row.announceWay == "短信") {
                      way = 1;
                    } else if (params.row.announceWay == "语音") {
                      way = 2;
                    } else {
                      way = 3;
                    }
                    var tag;
                    if (params.row.dtmfTag == "支持") {
                      tag = 1;
                    } else {
                      tag = 2;
                    }
                    this.formDatas = {
                      name: params.row.name,
                      supportOtherPhone: phone,
                      announceWay: way,
                      naviMediaId: params.row.naviMediaId,
                      preLinkHeaderName: params.row.preLinkHeaderName,
                      businessUrlName: params.row.businessUrlName,
                      dtmfTag: tag,
                      nodeDesc: params.row.nodeDesc,
                      id: params.row.id,
                      nonSupportMediaPhoneId: params.row.nonSupportMediaPhoneId
                    };
                    this.getMediaTemplateListByUserVersionId();
                    this.getLinkListByPage();
                  }
                }
              }),
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    background: "none"
                  },
                  on: {
                    click: () => {
                      this.$router.push({
                        name: "paramNode",
                        query: { id: params.row.id }
                      });
                    }
                  }
                },
                "参数节点配置"
              )
            ]);
          }
        }
      ],
      dataV: [],
      voiceList: [
        {
          value: "语音1",
          label: "语音1"
        },
        {
          value: "语音2",
          label: "语音2"
        },
        {
          value: "语音3",
          label: "语音3"
        },
        {
          value: "语音4",
          label: "语音4"
        },
        {
          value: "语音5",
          label: "语音5"
        },
        {
          value: "语音6",
          label: "语音6"
        }
      ],
      navVoiceList: [],
      callInterfaces: [],
      linkName: [
        {
          value: "名字1",
          label: "名字1"
        },
        {
          value: "名字2",
          label: "名字2"
        },
        {
          value: "名字3",
          label: "名字3"
        }
      ],
      formDatas: {},
      ruleValidate: {
        name: [{ required: true, validator: nodeName, trigger: "blur" }],
        supportOtherPhone: [
          {
            required: true,
            type: "number",
            message: "是否支持他机不能为空",
            trigger: "change"
          }
        ],
        nonsupportMediaPhoneId: [
          {
            required: true,
            type: "number",
            message: "不支持他机不能为空",
            trigger: "change"
          }
        ],
        announceWay: [
          {
            required: true,
            type: "number",
            message: "播报方式不能为空",
            trigger: "change"
          }
        ],
        naviMediaId: [
          {
            required: true,
            type: "number",
            message: "导航语音模板不能为空",
            trigger: "change"
          }
        ],
        preLinkHeaderName: [
          { required: true, validator: preLinkHeaderName, trigger: "blur" }
        ],
        businessUrlName: [
          {
            required: true,
            type: "number",
            message: "前置判断调用接口不能为空",
            trigger: "change"
          }
        ],
        dtmfTag: [
          {
            required: true,
            type: "number",
            message: "全程按键支持不能为空",
            trigger: "change"
          }
        ],
        nodeDesc: [{ required: true, validator: nodeDesc, trigger: "blur" }]
      },
      height: null,
      place: null
    };
  },
  mounted: function() {
    this.getBusinessNodeListByPage();
  },
  methods: {
    thisCurrentPage: function(page) {
      //当前页
      this.currentPageV = page;
      this.getBusinessNodeListByPage();
    },
    thisEveryPageCount: function(count) {
      //每页的条数
      this.pageCountV = count;
      this.getBusinessNodeListByPage();
    },
    checkAllList: function(val) {
      //全选列表
      //				console.log(val);
      this.deletedList = true;
      for (var i = 0; i < val.length; i++) {
        this.checkedId.push(val[i].id);
      }
    },
    cancelAllCheck: function(val) {
      //选中项发生了变化
      //				console.log(val+ '00000');
      if (val.length == 0) {
        this.deletedList = false;
      } else {
        this.deletedList = true;
      }
      this.checkedId.length = 0;
      for (var i = 0; i < val.length; i++) {
        this.checkedId.push(val[i].id);
      }
    },
    uncheckA: function(val, row) {
      //取消选择
      if (val.length == 0) {
        this.deletedList = false;
      }
    },
    checkA: function(row) {
      //选中某个项
      this.deletedList = true;
    },
    closeEditBusinessNode: function() {
      this.editBusinessNode = false;
    },
    getBusinessNodeListByPage: function() {
      //查询所有业务节点
      var data = {};
      data.pageNum = this.currentPageV;
      data.pageSize = this.pageCountV;
      data.orderBy = "";
      data.descOrAsc = "";
      data.vUserId = this.commonID;
      var this_ = this;
      this.$httpPost("knowledge/node/getBusinessNodeListByPage", data, function(
        data
      ) {
        var lists = data.data.data.list;
        for (var i = 0; i < lists.length; i++) {
          if (lists[i].supportOtherPhone == 1) {
            lists[i].supportOtherPhone = "支持";
          } else {
            lists[i].supportOtherPhone = "不支持";
          }
          if (lists[i].announceWay == 1) {
            lists[i].announceWay = "短信";
          } else if (lists[i].announceWay == 2) {
            lists[i].announceWay = "语音";
          } else {
            lists[i].announceWay = "短信和语音";
          }
          if (lists[i].dtmfTag == 1) {
            lists[i].dtmfTag = "支持";
          } else {
            lists[i].dtmfTag = "不支持";
          }
        }
        this_.dataV = lists;
        this_.pagesV = data.data.data.total;
        this_.currentPageV = data.data.data.pageNum;
        this_.pageCountV = data.data.data.pageSize;
        this_.changeHeight();
      });
    },
    changeHeight: function() {
      this.$nextTick(function() {
        if (document.querySelector(".ivu-table-body").offsetHeight > 600) {
          this.height = 600;
          this.place = "top";
        } else if (
          document.querySelector(".ivu-table-body").offsetHeight < 600
        ) {
          if (document.querySelector(".ivu-table-body").offsetHeight == 550) {
            this.height = 600;
            this.place = "top";
          } else {
            this.height = null;
            this.place = "bottom";
          }
        }
      });
    },
    supportSelect: function(value) {
      if (value == 2) {
        this.doesNotSupport = true;
      } else {
        this.doesNotSupport = false;
      }
    },
    clcikSubmit: function(name) {
      //				this.formDatas.userId = this.commonID;
      this.$refs[name].validate(valid => {
        if (valid) {
          this.updateBusinessNode(this.formDatas);
        } else {
        }
      });
    },
    updateBusinessNode: function(datas) {
      //更新一个业务节点
      var this_ = this;
      this.$httpPost("knowledge/node/updateBusinessNode", datas, function(
        data
      ) {
        this_.editBusinessNode = false;
        this_.getBusinessNodeListByPage();
      });
    },
    getMediaTemplateListByUserVersionId: function() {
      var this_ = this;
      this.$httpPost(
        "knowledge/mediaTemplate/getMediaTemplateListByUserVersionId",
        { userVersionId: parseInt(this.commonID) },
        function(data) {
          this_.navVoiceList = data.data.data;
        }
      );
    },
    getLinkListByPage: function() {
      var this_ = this;
      var dat = {
        pageNum: "",
        pageSize: "",
        orderBy: "",
        descOrAsc: "",
        linkName: "",
        createTimeFromString: "",
        createTimeToString: "",
        updateTimeFromString: "",
        updateTimeToString: "",
        uid: parseInt(this.commonID)
      };
      this.$httpPost("knowledge/link/getLinkListByPage", dat, function(data) {
        this_.callInterfaces = data.data.data.list;
      });
    },
    closeTheAddVoiceModule: function() {
      this.editBusinessNode = false;
    }
  }
};
</script>

<style lang="less">
@import url("../../css/public.less");
@import url("../../css/businessNode.less");
</style>
