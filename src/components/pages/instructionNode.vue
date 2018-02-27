<template>
	<div class="main-content">
		<tabNav></tabNav>
    	<div class="layout-breadcrumb">
            <Breadcrumb>
                <BreadcrumbItem href="/">用户版本</BreadcrumbItem>
                <BreadcrumbItem href="/nodeConfig">节点配置</BreadcrumbItem>
                <BreadcrumbItem>指令节点<Icon type="ios-information" color="#999999" size="16"></Icon></BreadcrumbItem>
            </Breadcrumb>
        </div>
        <!--<div class="module instructionNode_div_1">
        	<Input icon="search" placeholder="请输入名称" style="width: 200px"></Input>
        </div>-->
        <div class="module">
        	<Table :height="height" border :columns="columnsV" :data="dataV"></Table>
        </div>
        <!--<div class="module instructionNode_div_2">
    		<span v-if="deletedList" class="remove">
    			<b>已选择</b><b class="count" v-text="checkedId.length"></b><b>条</b>
    			<Button>删除</Button>
    		</span>
    		<Page @on-page-size-change="thisEveryPageCount" @on-selection-change="cancelAllCheck" @on-change="thisCurrentPage" :total="pagesV" :placement="place" show-total show-elevator show-sizer :page-size="pageCountV"></Page>
    	</div>-->
    	<div class="instructionNode_div" v-if="instructionNode">
    		<div class="instructionNode_div_3">
    			<Card dis-hover>
	    			<span class="instructionNode_div_3_span">
	    				<Icon @click.native="closeinstructionNode" size="40" color="#e1e1e1" class="closeIcon"></Icon>
	    				<p class="instructionNode_div_3_p">指令节点</p>
	    			</span>
					<Form label-position="right" ref="formDatas" :model="formDatas" :rules="ruleValidate" :label-width="150">
						<FormItem label="指令方法名称" prop="name">
		    				<Input v-model="formDatas.name" placeholder="请输入"></Input>
		    			</FormItem>
		    			<FormItem label="调用方法名" prop="orderName">
		    				<Input v-model="formDatas.orderName" placeholder="请输入"></Input>
		    			</FormItem>
		    			<FormItem label="全局语音提示" prop="globalMediaId">
		    				<Select placeholder="请选择" v-model="formDatas.globalMediaId">
				                <Option v-for="item in voiceList" :value="item.id" :key="item.id">{{item.templateName||'未定义templateName'}}</Option>
				            </Select>
		    			</FormItem>
		    			<FormItem label="用户版本是否启动" prop="nodeEnable">
		    				 <i-switch  :true-value="1" :false-value="2" v-model="formDatas.nodeEnable" size="large">
				                <span slot="open">启用</span>
				                <span slot="close">禁用</span>
				            </i-switch>
		    			</FormItem>
		    			<FormItem label="版本描述" prop="nodeDesc">
		    				<Input v-model="formDatas.nodeDesc" type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>
		    			</FormItem>
		    			<FormItem>
				            <Button @click="closeinstructionNode" type="ghost" style="margin-left: 8px">取消</Button>
				            <Button type="primary" @click="clickInstructionSubmit('formDatas')">确定</Button>
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
      if (value === "" || value == null) {
        callback(new Error("指令方法名称不能为空"));
      } else if (value !== null && value.length > 12) {
        callback(new Error("指令方法名称不能超过12个字符"));
      } else {
        callback();
      }
    };
    const orderName = (rule, value, callback) => {
      if (value === "" || value == null) {
        callback(new Error("调用的方法名不能为空"));
      } else if (value !== null && value.length > 12) {
        callback(new Error("调用的方法名不能超过20个字符"));
      } else {
        callback();
      }
    };
    const nodeDesc = (rule, value, callback) => {
      if (value === "" || value == null) {
        callback(new Error("描述不能为空"));
      } else if (value !== null && value.length > 120) {
        callback(new Error("描述不能超过120个字符"));
      } else {
        callback();
      }
    };
    return {
      formItem: {
        switch: true
      },
      deletedList: false,
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
          title: "全局提示语音",
          key: "globalMediaName"
        },
        {
          title: "指令方法名称",
          key: "orderName"
        },
        {
          title: "启用/禁用",
          key: "openClose",
          render: (h, params) => {
            const Gswitch = params.row.nodeEnable;
            return h(
              "i-switch",
              {
                props: {
                  size: "large",
                  value: Gswitch,
                  "true-value": 1,
                  "false-value": 2
                },
                on: {
                  "on-change": val => {
                    var datas = {
                      userNodeId: params.row.id,
                      nodeEnable: val
                      //		                            			userId: this.commonID
                    };
                    this.enableOrDisableGlobalNode(datas);
                  }
                }
              },
              [
                h(
                  "span",
                  {
                    slot: "open"
                  },
                  "启用"
                ),
                h(
                  "span",
                  {
                    slot: "close"
                  },
                  "禁用"
                )
              ]
            );
          }
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
                style: {
                  cursor: "pointer",
                  marginRight: "25px"
                },
                class: {
                  tableOperaHover: true
                },
                domProps: {
                  innerHTML: "编辑"
                },
                nativeOn: {
                  click: () => {
                    this.instructionNode = true;
                    console.log(params.row);
                    this.formDatas = {
                      name: params.row.name,
                      orderName: params.row.orderName,
                      globalMediaId: params.row.globalMediaId,
                      nodeEnable: params.row.nodeEnable,
                      nodeDesc: params.row.nodeDesc,
                      id: params.row.id
                    };
                  }
                }
              })
              //                              h('Icon',{
              //                                  props: {
              //                                      type: 'trash-b',
              //                                      size: '14',
              //                                      color: '#666666',
              //                                      tableOperaHover: 'tableOperaHover'
              //                                  },
              //                                  style:{
              //                                  	cursor: 'pointer'
              //                                  },
              //                                  class: {
              //                                  	tableOperaHover: true
              //                                  },
              //                                  domProps :{
              //                                  	innerHTML: '删除'
              //                                  },
              //                                  nativeOn: {
              //                                      click: () => {
              //
              //                                      }
              //                                  }
              //                              })
            ]);
          }
        }
      ],
      dataV: [],
      Gswitch: true,
      ruleValidate: {
        nodeEnable: [
          {
            required: true,
            type: "number",
            trigger: "change",
            message: "请选择是否启动"
          }
        ],
        globalMediaId: [
          {
            required: true,
            type: "number",
            message: "请选择全局语音提示",
            trigger: "change"
          }
        ],
        name: [{ required: true, validator: nodeName, trigger: "blur" }],
        orderName: [{ required: true, validator: orderName, trigger: "blur" }],
        nodeDesc: [{ required: false, validator: nodeDesc, trigger: "blur" }]
      },
      formDatas: {},
      instructionNode: false,
      voiceList: [],
      height: null,
      place: null
    };
  },
  mounted: function() {
    this.getGlobalNodeListByPage();
    this.getMediaTemplateListByUserVersionId();
  },
  methods: {
    thisCurrentPage: function(page) {
      //当前页
      this.currentPageV = page;
    },
    thisEveryPageCount: function(count) {
      //每页的条数
      this.pageCountV = count;
      this.getGlobalNodeListByPage();
    },
    //			checkAllList: function(val){//全选列表
    ////				console.log(val);
    //				this.deletedList = true;
    //				for(var i=0; i<val.length;i++){
    //					this.checkedId.push(val[i].id);
    //				};
    //			},
    //			cancelAllCheck: function(val){//选中项发生了变化
    ////				console.log(val+ '00000');
    //				if(val.length == 0){
    //					this.deletedList = false;
    //				}else{
    //					this.deletedList = true;
    //				};
    //				this.checkedId.length = 0;
    //				for(var i=0;i<val.length;i++){
    //					this.checkedId.push(val[i].id);
    //				}
    //			},
    //			uncheckA: function(val,row){//取消选择
    //				if(val.length == 0){
    //					this.deletedList = false;
    //				}
    //			},
    //			checkA: function(row){//选中某个项
    //				this.deletedList = true;
    //			},
    closeinstructionNode: function() {
      this.instructionNode = false;
    },
    getGlobalNodeListByPage: function() {
      //查询指令节点列表
      var data = {};
      data.pageCurrent = this.currentPageV;
      data.pageSize = this.pageCountV;
      data.orderBy = "";
      data.descOrAsc = "";
      data.vUserId = this.commonID;
      var this_ = this;
      this.$httpPost("knowledge/node/getGlobalNodeListByPage", data, function(
        data
      ) {
        this_.dataV = data.data.data.list;
        for (var i = 0; i < this_.dataV.length; i++) {
          if (this_.dataV[i].type == 1) {
            this_.dataV[i].type = "root";
          } else if (this_.dataV[i].type == 2) {
            this_.dataV[i].type = "全局";
          } else if (this_.dataV[i].type == 3) {
            this_.dataV[i].type = "业务";
          } else if (this_.dataV[i].type == 4) {
            this_.dataV[i].type = "参数";
          } else if (this_.dataV[i].type == 5) {
            this_.dataV[i].type = "交互（预测器）";
          } else if (this_.dataV[i].type == 6) {
            this_.dataV[i].type = "交互（无预测器）";
          }
        }
        this_.pagesV = data.data.data.total;
        this_.pageCountV = data.data.data.pageSize;
        this_.changeHeight();
      });
    },
    changeHeight: function() {
      this.$nextTick(function() {
        if (document.querySelector(".ivu-table-body").offsetHeight > 640) {
          this.height = 640;
          this.place = "top";
        } else if (
          document.querySelector(".ivu-table-body").offsetHeight < 640
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
    clickInstructionSubmit: function(name) {
      //更新一个指令节点
      delete this.formDatas.updateTime;
      //              this.formDatas.userId = this.commonID;
      this.$refs[name].validate(valid => {
        if (valid) {
          this.updateGlobalNode(this.formDatas);
        } else {
        }
      });
    },
    updateGlobalNode: function(datas) {
      //更新一个指令节点的通讯
      var this_ = this;
      this.$httpPost("knowledge/node/updateGlobalNode", datas, function(data) {
        this_.instructionNode = false;
        this_.getGlobalNodeListByPage();
      });
    },
    enableOrDisableGlobalNode: function(datas) {
      //启用或禁用指令节点
      this.$httpPost(
        "knowledge/node/enableOrDisableGlobalNode",
        datas,
        function(data) {
          console.log(data);
        }
      );
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
@import url("../../css/instructionNode.less");
</style>