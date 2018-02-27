<template>
	<div class="main-content">
		<tabNav></tabNav>
    	<div class="layout-breadcrumb">
            <Breadcrumb>
                <BreadcrumbItem href="/">用户版本</BreadcrumbItem>
                <BreadcrumbItem href="/nodeConfig">节点配置</BreadcrumbItem>
                <BreadcrumbItem href="/businessNode">业务节点</BreadcrumbItem>
                <BreadcrumbItem>参数节点</BreadcrumbItem>
            </Breadcrumb>
        </div>
        <div class="module nodeConfig_div_1">
        	<!--<Select @on-change="getGlobalNodeListByPage" v-model="pType" placeholder="参数类型" style="width: 140px;">
                <Option :value="0">全部节点类型</Option>
                <Option :value="2">指令节点</Option>
                <Option :value="3">业务节点</Option>
                <Option :value="5">语音交互节点</Option>
                <Option :value="6">按键交互节点</Option>
          </Select>-->
          <Select @on-change="getGlobalNodeListByPage" v-model="pType" placeholder="参数类型" style="width: 140px;">
                <Option v-for="item in pTypeList" :value="item.value" :key="item.value">{{item.label}}</Option>
           </Select>
           <Select @on-change="getGlobalNodeListByPage" v-model="maxTimeoutAction" placeholder="超时上限动作" style="width: 160px;">
                <Option :value="null">全部超时动作</Option>
                <Option :value="1">挂机</Option>
                <Option :value="2">反转</Option>
                <Option :value="3">转人工</Option>
            </Select>
           <!--<Select @on-change="screenError" placeholder="错误上限动作" style="width: 160px;">
                <Option value="挂机">挂机</Option>
                <Option value="反转">反转</Option>
                <Option value="转人工">转人工</Option>
            </Select>-->
        	<Input @on-enter="getGlobalNodeListByPage" @on-click="getGlobalNodeListByPage" icon="search" v-model="name" placeholder="请输入名称" style="width: 200px"></Input>
        	<Button type="primary" class="defaultButton" @click="clickNewParamNode">新增节点</Button>
        </div>
        <div class="module">
        	<Table :height="height" @on-select="checkA" @on-select-cancel="uncheckA" @on-selection-change="cancelAllCheck" @on-select-all="checkAllList" border :columns="columnsV" :data="dataV"></Table>
        </div>
        <div class="module nodeConfig_div_2">
    		<span v-if="deletedList" class="remove">
    			<b>已选择</b><b class="count" v-text="checkedId.length"></b><b>条</b>
    			<Button @click="batchDeleted">删除</Button>
    		</span>
    		<Page @on-page-size-change="thisEveryPageCount" @on-change="thisCurrentPage" :placement="place" :total="pagesV" show-total show-elevator show-sizer :page-size="pageCountV"></Page>
    	</div>
    	<div class="speedInterNode_div" v-if="editSpeedInterNode">
    		<div class="speedInterNode_div_4">
    			<Card dis-hover>
	    			<span class="speedInterNode_div_4_span">
	    				<Icon @click.native="closeSpeedInterNode" size="40" color="#e1e1e1" class="closeIcon"></Icon>
	    				<p class="speedInterNode_div_4_p">参数节点编辑</p>
	    			</span>
					<Form label-position="right" :label-width="150" :rules="ruleValidate" ref="formDatas" :model="formDatas">
						<FormItem label="参数节点名称" prop="name">
				        	<Input v-model="formDatas.name"></Input>
				        </FormItem>
						<FormItem label="参数类型" prop="pType">
						    <!--<RadioGroup :true-value="1" :false-value="2" v-model="formDatas.pType">
				                <Radio :label="1">时间</Radio>
				                <Radio :label="2">数字</Radio>
				            </RadioGroup>-->
				            <Select v-model="formDatas.pType" placeholder="请选择">
				                <Option v-for="item in pTypeList" :value="item.value" :key="item.value">{{item.label}}</Option>
				            </Select>
				        </FormItem>
				        <FormItem label="引导语语音模板" prop="naviMediaId">
				            <Select v-model="formDatas.naviMediaId" placeholder="请选择">
				                <Option v-for="item in voiceList" :value="item.id" :key="item.id">{{item.templateName}}</Option>
				            </Select>
				        </FormItem>
				        <FormItem label="参数传递键值" prop="pLabel">
				        	<Input v-model="formDatas.pLabel"></Input>
				        </FormItem>
				        <FormItem label="参数默认值" prop="defaultValue">
				        	<Input v-model="formDatas.defaultValue"></Input>
				        </FormItem>
				        <FormItem label="参数超时时间间隔" prop="timeoutInterval">
				        	<Input v-model="formDatas.timeoutInterval"></Input>
				        </FormItem>
				        <FormItem label="超时上限动作" prop="maxTimeoutAction">
						    <RadioGroup :true-value="1" :false-value="2" v-model="formDatas.maxTimeoutAction">
				                <Radio :label="1">挂机</Radio>
				                <Radio :label="2">反转</Radio>
				                <Radio :label="3">转人工</Radio>
				            </RadioGroup>
				        </FormItem>
				        <FormItem label="超时语音列表" prop="timeoutMediaList">
				            <Select multiple="multiple" placeholder="请选择" v-model="formDatas.timeoutMediaList">
				                <Option v-for="item in voiceList" :value="item.id" :key="item.id">{{item.templateName}}</Option>
				            </Select>
				        </FormItem>
				        <FormItem label="检查链的链头" prop="checkLinkHeaderName">
				            <Input v-model="formDatas.checkLinkHeaderName"></Input>
				        </FormItem>
				        <FormItem label="帮助语语音列表" prop="helpMediaId">
				            <Select placeholder="请选择" v-model="formDatas.helpMediaId">
				                <Option v-for="item in voiceList" :value="Number(item.id)" :key="item.id">{{item.templateName}}</Option>
				            </Select>
				        </FormItem>
				        <FormItem label="语音交互版本描述" prop="nodeDesc">
				            <Input v-model="formDatas.nodeDesc" type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>
				        </FormItem>
				        <FormItem>
				            <Button @click="closeSpeedInterNode" type="ghost" style="margin-left: 8px">取消</Button>
				            <Button type="primary" @click="updateParamNode('formDatas')">确定</Button>
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
    const name = (rule, value, callback) => {
      if (value === ""||value==null) {
        callback(new Error("参数节点名称不能为空"));
      } else {
        callback();
      }
    };
    const timeoutInterval = (rule, value, callback) => {
      if (value === ""||value==null) {
        callback(new Error("超时时间间隔不能为空"));
      } else if (!/^[a-z0-9]+$/.test(value)) {
        callback(new Error("超时时间间隔必须为数字"));
      } else {
        callback();
      }
    };
    const checkLinkHeaderName = (rule, value, callback) => {
      if (value === ""||value==null) {
        callback(new Error("检查链的链头不能为空"));
      } else {
        callback();
      }
    };
    return {
      height: null,
      place: null,
      deletedList: false,
      editSpeedInterNode: false,
      pagesV: 0,
      currentPageV: 1,
      pageCountV: 10,
      checkedId: [],
      columnsV: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "名称",
          key: "name"
        },
        {
          title: "参数类型",
          key: "pType"
        },
        {
          title: "超时上限动作",
          key: "maxTimeoutAction"
        },
        //              	{
        //              		title: '错误上限动作',
        //              		key: 'maxErrorAction'
        //              	},
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
                style: {
                  marginRight: "25px",
                  cursor: "pointer"
                },
                domProps: {
                  innerHTML: "编辑"
                },
                nativeOn: {
                  click: () => {
                    this.editSpeedInterNode = true;
                    var type;
                    if (params.row.pType == "时间") {
                      type = 1;
                    } else if (params.row.pType == "数字") {
                      type = 2;
                    } else if (params.row.pType == "服务类型") {
                      type = 3;
                    } else if (params.row.pType == "操作类型") {
                      type = 4;
                    } else {
                      type = 5;
                    }
                    var action;
                    if (params.row.maxTimeoutAction == "挂机") {
                      action = 1;
                    } else if (params.row.maxTimeoutAction == "反转") {
                      action = 2;
                    } else {
                      action = 3;
                    }
                    this.formDatas = {
                      id: params.row.id,
                      naviMediaId: params.row.naviMediaId,
                      pLabel: params.row.pLabel,
                      defaultValue: params.row.defaultValue,
                      pType: type,
                      name: params.row.name,
                      nodeDesc: params.row.nodeDesc,
                      timeoutInterval: params.row.timeoutInterval,
                      timeoutMediaList: params.row.timeoutMediaList,
                      maxTimeoutAction: action,
                      helpMediaId: params.row.helpMediaId,
                      checkLinkHeaderName: params.row.checkLinkHeaderName
                    };
                    this.getMediaTemplateListByUserVersionId();
                    console.log(this.formDatas);
                  }
                }
              }),
              h("Icon", {
                props: {
                  type: "trash-b",
                  size: "14",
                  color: "#666666",
                  tableOperaHover: "tableOperaHover"
                },
                class: {
                  tableOperaHover: true
                },
                style: {
                  cursor: "pointer"
                },
                domProps: {
                  innerHTML: "删除"
                },
                nativeOn: {
                  click: () => {
                    this.$Modal.confirm({
                      title: "提示",
                      content: "<p>你确定要删除该语音模板？</p>",
                      okText: "确定",
                      cancelText: "取消",
                      onOk: () => {
                        var id = params.row.id;
                        var index = params.index;
                        this.deleteParamNode(id, index);
                      },
                      onCancel: () => {}
                    });
                  }
                }
              })
            ]);
          }
        }
      ],
      pTypeList: [
        {
          label: "全部参数类型",
          value: null
        },
        {
          label: "时间",
          value: 1
        },
        {
          label: "数字",
          value: 2
        },
        {
          label: "服务类型",
          value: 3
        },
        {
          label: "操作类型",
          value: 4
        },
        {
          label: "语音数字",
          value: 5
        }
      ],
      dataV: [],
      ruleValidate: {
        name: [{ required: true, validator: name, trigger: "blur" }],
        pType: [
          {
            required: true,
            type: "number",
            message: "请选择参数类型",
            trigger: "change"
          }
        ],
        naviMediaId: [
          {
            required: true,
            type: "number",
            message: "请选择引导语语音列表",
            trigger: "change"
          }
        ],
        pLabel: [
          { required: true, message: "自定义参数不能为空", trigger: "blur" }
        ],
        defaultValue: [
          { required: true, message: "参数默认值不能为空", trigger: "blur" }
        ],
        timeoutInterval: [
          { required: true, validator: timeoutInterval, trigger: "blur" }
        ],
        maxTimeoutAction: [
          {
            required: true,
            type: "number",
            message: "请选择超时上限动作",
            trigger: "change"
          }
        ],
        timeoutMediaList: [
          {
            required: true,
            type: "array",
            message: "请选择超时语音列表",
            trigger: "change"
          }
        ],
        nodeDesc: [
          {
            required: true,
            message: "语音交互版本描述不能为空",
            trigger: "blur"
          }
        ],
        helpMediaId: [
          {
            required: true,
            type: "number",
            message: "请选择帮助语语音模板",
            trigger: "change"
          }
        ],
        checkLinkHeaderName: [
          { required: true, validator: checkLinkHeaderName, trigger: "blur" }
        ]
      },
      formDatas: {},
      voiceList: [],
      tipsVoiceList: [
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
        }
      ],
      maxTimeoutAction: null,
      name: null,
      pType: null
    };
  },
  created: function() {
    this.getGlobalNodeListByPage();
  },
  methods: {
    thisCurrentPage: function(page) {
      //当前页
      this.currentPageV = page;
      this.getGlobalNodeListByPage();
    },
    thisEveryPageCount: function(count) {
      //每页的条数
      this.pageCountV = count;
      this.getGlobalNodeListByPage();
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
      //改变了所选项
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
    closeSpeedInterNode: function() {
      this.editSpeedInterNode = false;
    },
    clickNewParamNode: function() {
      //新增节点
      var this_ = this;
      var id = this.$route.query.id;
      this.$router.push({ name: "newParamNode", query: { id: id } });
    },
    getGlobalNodeListByPage: function() {
      //查询参数列表
      if (this.name == "") {
        this.name = null;
      }
      var datas = {
        pageNum: this.currentPageV,
        pageSize: this.pageCountV,
        orderBy: "",
        descOrAsc: "",
        vUserId: this.commonID,
        bid: this.$route.query.id,
        name: this.name,
        pType: this.pType,
        maxTimeoutAction: this.maxTimeoutAction
      };
      var this_ = this;
      this.$httpPost("knowledge/node/getParamNodeListByPage", datas, function(
        data
      ) {
        this_.dataV = data.data.data.list;
        for (var i = 0; i < this_.dataV.length; i++) {
          if (this_.dataV[i].pType == 1) {
            this_.dataV[i].pType = "时间";
          } else if (this_.dataV[i].pType == 2) {
            this_.dataV[i].pType = "数字";
          } else if (this_.dataV[i].pType == 3) {
            this_.dataV[i].pType = "服务类型";
          } else if (this_.dataV[i].pType == 4) {
            this_.dataV[i].pType = "操作类型";
          } else if (this_.dataV[i].pType == 5) {
            this_.dataV[i].pType = "语音数字";
          }
          if (
            this_.dataV[i].maxTimeoutAction == 1 ||
            this_.dataV[i].maxErrorAction == 1
          ) {
            this_.dataV[i].maxTimeoutAction = "挂机";
          } else if (
            this_.dataV[i].maxTimeoutAction == 2 ||
            this_.dataV[i].maxErrorAction == 2
          ) {
            this_.dataV[i].maxTimeoutAction = "反转";
          } else {
            this_.dataV[i].maxTimeoutAction = "转人工";
          }
        }
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
    deleteParamNode: function(id, index) {
      var this_ = this;
      var datas = {
        id: id
        //          		userId: this_.commonID
      };
      this.$httpPost("knowledge/node/deleteParamNode", datas, function(data) {
        console.log(data);
        this_.remove(index);
      });
    },
    remove: function(index) {
      //删除表格数据
      this.dataV.splice(index, 1);
    },
    batchDeleted: function() {
      //批量删除
      var ids = this.checkedId;
      var this_ = this;
      var datas = {
        idList: ids
        //					userId: this_.commonID
      };
      this.$Modal.confirm({
        title: "提示",
        content: "<p>你确定要删除所有参数节点？</p>",
        okText: "确定",
        cancelText: "取消",
        onOk: () => {
          this.$httpPost("knowledge/node/batchDeleteParamNode", datas, function(
            data
          ) {
            if (data.data.status == 1000) {
              this_.getGlobalNodeListByPage();
            }
          });
        },
        onCancel: () => {}
      });
    },
    updateParamNode: function(name) {
      var this_ = this;
      this.$refs[name].validate(valid => {
        if (valid) {
          this.$httpPost(
            "knowledge/node/updateParamNode",
            this_.formDatas,
            function(data) {
              this_.editSpeedInterNode = false;
              this_.getGlobalNodeListByPage();
            }
          );
        } else {
        }
      });
    },
    getMediaTemplateListByUserVersionId: function() {
      var this_ = this;
      this.$httpPost(
        "knowledge/mediaTemplate/getMediaTemplateListByUserVersionId",
        { userVersionId: parseInt(this.commonID) },
        function(data) {
          this_.voiceList = data.data.data;
        }
      );
    }
  }
};
</script>

<style lang="less">
@import url("../../css/public.less");
@import url("../../css/paramNode.less");
</style>