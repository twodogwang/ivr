<template>
    <div class="main-content">
    	<tabNav></tabNav>
    	<div class="layout-breadcrumb">
            <Breadcrumb>
                <BreadcrumbItem href="/">用户版本</BreadcrumbItem>
                <BreadcrumbItem>语音模板</BreadcrumbItem>
            </Breadcrumb>
        </div>
    	<div class="module div1">
    		<span class="span1">
    			<Input icon="search" placeholder="输入语音模板名称" style="width: 200px" @on-enter="searchName($event)" @on-click="searchClickName($event)"></Input>
    			<Button class="defaultButton" @click="addVioceModule">添加语音</Button>
    			<ul v-if="chooseComType" @click="clickCompositing($event)">
    				<li>文字合成</li>
    				<li>语音合成</li>
    			</ul>
    		</span>
    	</div>
    	<div class="div2 module">
    		<DatePicker @on-change="chooseTimeRange" type="daterange" format="yyyy-MM-dd" placeholder="选择修改日期" style="width: 200px"></DatePicker>
    		<Select @on-change="receptionChange" label-in-value placeholder="合成类型" style="width:140px">
		        <Option v-for="item in comType" :value="item.value" :key="item.value">{{ item.label }}</Option>
		    </Select>
		    <Select @on-change="receptionChange" label-in-value placeholder="接收方式" style="width:140px">
		        <Option v-for="item in receptionList" :value="item.value" :key="item.value">{{ item.label }}</Option>
		    </Select>
		    <Select @on-change="receptionChange" label-in-value placeholder="打断方式" style="width:140px">
		        <Option v-for="item in interruptList" :value="item.value" :key="item.value">{{ item.label }}</Option>
		    </Select>
    	</div>
    	<div class="module">
    		<Table ref="selectTable" :height="height" @on-select="checkA" @on-select-cancel="uncheckA" @on-selection-change="cancelAllCheck" @on-select-all="checkAllList" border :columns="columnsV" :data="dataV"></Table>
    	</div> 
    	<div class="module div3">
    		<span v-if="checkedIdLength!==0" class="remove">
    			<b>已选择</b><b class="count" v-text="checkedIdLength"></b><b>条</b>
    			<Button @click="batchDeleted">删除</Button>
    		</span>
    		<Page @on-page-size-change="thisEveryPageCount" @on-change="thisCurrentPage" placement="top" :current="currentPageV" :total="pagesV" show-total show-elevator show-sizer :page-size="pageCountV"></Page>
    	</div>
    	<div class="phonetics_div4" v-if="add_voice_template">
    		<div class="div4">
    			<Card dis-hover>
	    			<span class="div4-span">
	    				<Icon @click.native="closeTheAddVoiceModule" size="40" color="#e1e1e1" class="closeIcon"></Icon>
	    				<p class="div4-p-1">语音文字编辑</p>
	    			</span>
	    			<span class="div4-span-1">
	    				<Form label-position="right" :label-width="130" ref="items" :model="items" :rules="ruleItemValidate">
					        <FormItem label="语音模板名称" prop="templateName">
					            <Input v-model="items.templateName"></Input>
					        </FormItem>
					        <FormItem label="接收输入方式" prop="inputType">
					        	<RadioGroup v-model="items.inputType">
					                <Radio :label="1">语音输入</Radio>
					                <Radio :label="2">按键输入</Radio>
					            </RadioGroup>
					        </FormItem>
					        <FormItem label="打断方式" prop="breakWay">
					            <Select placeholder="打断方式" v-model="items.breakWay">
					                <Option :value="1">不能打断</Option>
					                <Option :value="4">语音</Option>
					                <Option :value="2">按键</Option>
					                <Option :value="6">语音和按键</Option>
					            </Select>
					        </FormItem>
					        <FormItem label="文字语音" prop="template">
					            <Input v-model="items.template" type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>
					        </FormItem>
					        <FormItem>
					            <Button @click="textToAudio" type="primary" class="defaultButton">合成</Button>
					        </FormItem>
					        <FormItem class="media" v-for="rst in items.mediaList" :key="index">
					            <Icon type="document-text" size="22"></Icon>
					            <b>{{rst}}.wav</b>
					            <Icon size="22" type="ios-checkmark-outline" color="#91d372"></Icon>
					            <Button class="noButton blue" type="primary" @click="playPauseClick($event)">试听语音</Button>
					            <Button class="noButton" @click="removeMedia($event,rst)" type="primary">删除</Button>
					            <div class="hidden" v-if="displayOrHidden">
						            <div class="displayOrHidden">
						            	<span class="play"></span>
						            </div>
						            <audio id="audioTag" src="../../../static/video/11.wav"></audio>
					            </div>
					        </FormItem>
					        <FormItem>
					            <Button @click="closeTheAddVoiceModule" type="ghost" style="margin-left: 8px">取消</Button>
					            <Button class="defaultButton" type="primary" @click="updateMediaTemplate('items')">确定</Button>
					        </FormItem>
					    </Form>
	    			</span>
	    			<span class="div4-span-2">
	    				<div>
	    					<p>帮助</p>
	    					<p>文字语音格式：尊敬的用户您好，您订购的套餐消费情况如下：从{beginDay<b>_DATE</b>}至{endDay<b>_DATE</b>}{currentMinute<b>_MINUTE</b>}，您订购的套餐情况如下：手机上网流量{flow<b>_FLOW</b>}，已使用{flowUsed<b>_FLOW</b>}；含上月剩余转结流量{flowLastMonthRe-main<b>_FLOW</b>}，已使用{flowLastMonthUsed<b>_FLOW</b>}；通话分钟{callTotleMinute<b>_NUMBER</b>}，已使用{callUsedMinute<b>_NUMBER</b>}分钟。套餐超出部分使用量将按相应套餐或标准资费收费。
	    					</p>
	    				</div>
	    			</span>
	    		</Card>
    		</div>
    	</div>
    	<div class="phonetics_div5" v-if="voiceEdit">
    		<div class="div4">
    			<Card dis-hover>
	    			<span class="div4-span">
	    				<Icon @click.native="closeTheAddVoiceModule" size="40" color="#e1e1e1" class="closeIcon"></Icon>
	    				<p class="div4-p-1">语音编辑</p>
	    			</span>
	    			<span class="div4-span-1">
	    				<Form label-position="right" ref="formDatas" :model="formDatas" :label-width="150" :rules="ruleValidate">
							<FormItem label="语音模板名称" prop="templateName">
					        	<Input placeholder="请输入语音模板名称" v-model="formDatas.templateName"></Input>
					        </FormItem>
					        <FormItem label="接收输入方式" prop="inputType">
							    <RadioGroup v-model="formDatas.inputType">
					                <Radio :label="1">语音输入</Radio>
					                <Radio :label="2">按键输入</Radio>
					            </RadioGroup>
					        </FormItem>
					        <FormItem label="打断方式" prop="breakWay">
					            <Select placeholder="打断方式" v-model="formDatas.breakWay">
					                <Option :value="1">不能打断</Option>
					                <Option :value="4">语音</Option>
					                <Option :value="2">按键</Option>
					                <Option :value="6">语音和按键</Option>
					            </Select>
					        </FormItem>
					        <FormItem label="语音设置" prop="template">
					            <!--<Button class="uploadFile">上传语音</Button>-->
					            <Upload accept="audio/*" :format="['wav']" action="//jsonplaceholder.typicode.com/posts/">
							        <Button type="ghost">上传</Button>
							    </Upload>
					            <Button class="uploadFile" @click="paramSetClick">设置参数</Button>
					        </FormItem>
					        <FormItem label="参数" prop="param" class="paramInput" v-if="paramSet">
					            <Input />
					            <Button type="primary">完成</Button>
					        </FormItem>
					        <FormItem>
					            <Button class="defaultButton" type="primary">点击合成</Button>
					        </FormItem>
					        <FormItem v-if="voiceModule">
					            <Icon type="document-text" size="18" color="#999999"></Icon>
					            <b></b>
					            <Icon type="ios-checkmark-outline" size="18" color="#67c23a"></Icon>
					            <b class="formItemB">试听语音</b>
					        </FormItem>
					        <FormItem>
					            <Button @click="closeTheAddVoiceModule" type="ghost" style="margin-left: 8px">取消</Button>
					            <Button class="defaultButton" type="primary" @click="updateMediaTemplate('formDatas')">保存</Button>
					        </FormItem>
						</Form>
	    			</span>
	    			<span class="div4-span-2">
	    				<div class="div5">
							<p>上传语音列表  + 参数</p>
							<div>
								<ul id="todoList">
									<li v-for="(key,index,item) in formDatas.mediaList" :key="index">
										<span>
											<Icon type="document-text" size="18" color="#999999"></Icon>
								            <b class="key">{{key}}</b>
								            <Icon type="ios-checkmark-outline" size="18" color="#67c23a"></Icon>
								            <b class="formItemB" @click="playPauseClick($event)">试听语音</b>
								            <b>删除</b>
								            <div class="displayOrHidden">
								            	<span class="play"></span>
								            </div>
								            <audio id="audioTag" src="../../../static/video/11.wav"></audio>
										</span>
									</li>
								</ul>
							</div>
						</div>
	    			</span>
	    		</Card>
    		</div>
    	</div>
    </div>
</template>
<script>
import Sortable from "sortablejs";
import tabNav from "@/components/common/tabNav";
export default {
  components: {
    tabNav
  },
  data() {
    const templateName = (rule, value, callback) => {
      console.log(value);
      if (value === "" || value.replace(/\s/g, "") == "") {
        callback(new Error("语音模板名称不能为空"));
      } else if (value.length > 12) {
        callback(new Error("语音模板名称不能超过12个字符"));
      } else {
        callback();
      }
    };
    const template = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("语音文字不能为空"));
      } else {
        callback();
      }
    };
    return {
      content: {},
      checkedIdLength: 0,
      height: null,
      modalVoice: false,
      paramSet: false,
      voiceModule: false,
      add_voice_template: false,
      voiceEdit: false,
      gender: "",
      deletedList: false,
      chooseComType: false,
      displayOrHidden: false,
      receptionList: [
        {
          value: "接收方式1",
          label: "所有接收方式"
        },
        {
          value: "接收方式2",
          label: "语音输入"
        },
        {
          value: "接收方式3",
          label: "按键输入"
        }
      ],
      interruptList: [
        {
          value: "打断方式1",
          label: "所有打断方式"
        },
        {
          value: "打断方式2",
          label: "不能打断"
        },
        {
          value: "打断方式3",
          label: "按键"
        },
        {
          value: "打断方式4",
          label: "语音"
        },
        {
          value: "打断方式5",
          label: "按键和语音"
        }
      ],
      comType: [
        {
          value: "合成类型1",
          label: "所有合成类型"
        },
        {
          value: "合成类型2",
          label: "文字合成"
        },
        {
          value: "合成类型3",
          label: "语音合成"
        }
      ],
      columnsV: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "语音名称",
          key: "templateName"
        },
        {
          title: "合成类型",
          key: "synthesisMethod"
        },
        {
          title: "接收方式",
          key: "inputType"
        },
        {
          title: "打断方式",
          key: "breakWay"
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
                  color: "#666",
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
                    if (params.row.synthesisMethod == "文字合成") {
                      this.add_voice_template = true;
                    } else {
                      this.voiceEdit = true;
                    }
                    var id = params.row.id;
                    var methods = params.row.synthesisMethod;
                    this.queryMediaTemplate(id, methods);
                    this.$nextTick(function() {
                      this.mounted();
                    });
                  }
                }
              }),
              h("Icon", {
                props: {
                  type: "trash-b",
                  size: "14",
                  color: "#666",
                  tableOperaHover: "tableOperaHover"
                },
                class: {
                  tableOperaHover: true
                },
                domProps: {
                  innerHTML: "删除"
                },
                style: {
                  marginRight: "5px",
                  cursor: "pointer"
                },
                nativeOn: {
                  click: () => {
                    var this_ = this;
                    this.$Modal.confirm({
                      title: "提示",
                      content: "<p>你确定要删除该语音模板？</p>",
                      okText: "确定",
                      cancelText: "取消",
                      onOk: () => {
                        var id = params.row.id;
                        var index = params.index;
                        this.deleteMediaTemplate(id, index);
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
      dataV: [],
      formDatas: {},
      items: {},
      pagesV: 0,
      currentPageV: 1,
      pageCountV: 10,
      orderBy: "",
      descOrAsc: "",
      templateName: "",
      createTimeToString: "",
      createTimeFromString: "",
      updateTimeFromString: "",
      updateTimeToString: "",
      synthesisMethod: "",
      inputType: "",
      checkedId: {},
      selected: [], //被选择的行
      reception: "",
      ruleValidate: {
        templateName: [
          { required: true, validator: templateName, trigger: "blur" }
        ],
        inputType: [
          {
            required: true,
            type: "number",
            message: "请选择接收方式",
            trigger: "change"
          }
        ],
        breakWay: [
          {
            required: true,
            type: "number",
            message: "请选择打断方式",
            trigger: "change"
          }
        ],
        template: [{ required: true, validator: template, trigger: "blur" }]
      },
      ruleItemValidate: {
        templateName: [
          { required: true, validator: templateName, trigger: "blur" }
        ],
        inputType: [
          {
            required: true,
            type: "number",
            message: "请选择接收方式",
            trigger: "change"
          }
        ],
        breakWay: [
          {
            required: true,
            type: "number",
            message: "请选择打断方式",
            trigger: "change"
          }
        ],
        template: [{ required: true, validator: template, trigger: "blur" }]
      },
      doArray: [],
      elementSpan: null,
      elementText: null
    };
  },
  filters: {},
  created: function() {
    this.queryViocePhoneticsList();
  },
  methods: {
    queryViocePhoneticsList: function(curr, pageSize) {
      //查询语音列表
      var this_ = this;
      var dat = {};
      dat.pageNum = curr || this.currentPageV; //当前页
      dat.pageSize = pageSize || this.pageCountV; //条数
      dat.orderBy = this.orderBy; //排序字段
      dat.descOrAsc = this.descOrAsc; //升序（desc）或降序（asc）
      dat.templateName = this.templateName; //语音模板名字
      dat.createTimeFromString = this.createTimeFromString; //创建开始时间
      dat.createTimeToString = this.createTimeToString; //创建时间结束
      dat.updateTimeFromString = this.updateTimeFromString; //更新开始时间
      dat.updateTimeToString = this.updateTimeToString; //更新结束时间
      dat.synthesisMethod = this.synthesisMethod; //合成方式
      dat.breakWay = this.breakWay; //打断方式
      dat.inputType = this.inputType; //输入方式
      dat.uid = parseInt(this.commonID);
      this.$httpPost(
        "knowledge/mediaTemplate/getMediaTemplateListByPage",
        dat,
        function(data) {
          // debugger
          var events = data.data.data.list;
          this_.content[data.data.data.pageNum] = events;
          this_.currentPageV = data.data.data.pageNum;
          for (var i = 0; i < events.length; i++) {
            if (events[i].templateName == "") {
              events[i].templateName = "--";
            }
            if (events[i].synthesisMethod == 1) {
              events[i].synthesisMethod = "文字合成";
            } else {
              events[i].synthesisMethod = "语音合成";
            }
            if (events[i].breakWay == 1) {
              events[i].breakWay = "不能打断";
            } else if (events[i].breakWay == 2) {
              events[i].breakWay = "按键";
            } else if (events[i].breakWay == 4) {
              events[i].breakWay = "语音";
            } else {
              events[i].breakWay = "按键和语音";
            }
            if (events[i].inputType == 1) {
              events[i].inputType = "语音输入";
            } else {
              events[i].inputType = "按键输入";
            }
          }
          this_.dataV = events;
          this_.pagesV = data.data.data.total;
          this_.changeHeight();
        }
      );
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
    thisCurrentPage: function(page) {
      //当前页
      this.currentPageV = page;
      // this.queryViocePhoneticsList();
      if (this.content[page] && this.content[page]) {
        this.dataV = this.content[page];
      } else {
        this.queryViocePhoneticsList();
      }
    },
    thisEveryPageCount: function(count) {
      //每页的条数
      this.content = {};
      this.checkedId = {};
      this.checkedIdLength = 0;
      this.deletedList = false;
      this.pageCountV = count;
      this.queryViocePhoneticsList(1);
      /* if (this.content[page] && this.content[page]) {
        this.dataV = this.content[page];
      } else {
        this.queryViocePhoneticsList();
      } */
    },
    checkAllList: function(val) {
      console.log("val", val);
      //全选/全不选列表
      if (this.checkedIdLength == 0) {
        this.deletedList = false;
      } else {
        this.deletedList = true;
      }
      // this.checkedId[this.currentPageV] = val;
    },
    cancelAllCheck: function(val) {
      //改变了所选项
      if (this.checkedIdLength == 0) {
        this.deletedList = false;
      } else {
        this.deletedList = true;
      }
      if (val.length !== 0) {
      }
      this.checkedId[this.currentPageV] = val;
      let ids = [];
      for (let i in this.checkedId) {
        for (let j of this.checkedId[i]) {
          ids.push(j.id);
        }
      }
      this.checkedIdLength = ids.length;
      /* for (var i = 0; i < val.length; i++) {
        this.checkedId.push(val[i].id);
      } */
    },
    uncheckA: function(val, row) {
      //取消选择
      if (val.length == 0) {
        this.deletedList = false;
      }
      for (let i = 0; i < this.content[this.currentPageV].length; i++) {
        if (this.content[this.currentPageV][i].id === row.id) {
          this.content[this.currentPageV][i]._checked = false;
          break;
        }
      }
      /* this.checkedId[this.currentPageV].splice(
        this.checkedId[this.currentPageV].indexOf(row.id),
        1
      ); */
      this.checkedId[this.currentPageV] = val;
    },
    getIndex(row, index) {
      console.log(row, index);
    },
    checkA: function(selection, row) {
      //选中某个项
      this.deletedList = true;
      for (let i = 0; i < this.content[this.currentPageV].length; i++) {
        if (this.content[this.currentPageV][i].id === row.id) {
          this.content[this.currentPageV][i]._checked = true;
          break;
        }
      }
      /* if (this.checkedId.hasOwnProperty(this.currentPageV)) {
        console.log(this.checkedId[this.currentPageV])
        this.checkedId[this.currentPageV].push(row.id);
      } else {
        this.checkedId[this.currentPageV] = [];
        this.checkedId[this.currentPageV].push(row.id)
      } */
      this.checkedId[this.currentPageV] = selection;
    },
    receptionChange: function(val) {
      this.content = {};
      this.checkedId = {};
      this.checkedIdLength = 0;
      this.deletedList = false;
      //接收方式、打断方式和合成方式查询
      this.currentPageV = 1; //当前页
      this.pageCountV = 10; //条数
      var va = val.value;
      va = va.replace(/[0-9]/g, "");
      if (va == "合成类型") {
        if (val.label == "所有合成类型") {
          val.label = "";
        } else if (val.label == "语音合成") {
          val.label = 2;
        } else {
          val.label = 1;
        }
        this.synthesisMethod = val.label;
      } else if (va == "打断方式") {
        if (val.label == "所有打断方式") {
          val.label = "";
        } else if (val.label == "不能打断") {
          val.label = 1;
        } else if (val.label == "按键") {
          val.label = 2;
        } else if (val.label == "语音") {
          val.label = 4;
        } else {
          val.label = 6;
        }
        this.breakWay = val.label;
      } else {
        if (val.label == "所有接收方式") {
          val.label = "";
        } else if (val.label == "语音输入") {
          val.label = 1;
        } else {
          val.label = 2;
        }
        this.inputType = val.label;
      }
      this.queryViocePhoneticsList();
    },
    addVioceModule: function() {
      //添加语音模板
      this.$Modal.info({
        title: "提示",
        content: "<p>暂未开放此功能！</p>"
      });
      return false;
      if (this.chooseComType == false) {
        this.chooseComType = true;
      } else {
        this.chooseComType = false;
      }
    },
    closeTheAddVoiceModule: function() {
      //取消添加语音模板
      this.add_voice_template = false;
      this.voiceEdit = false;
    },
    addViocePhoneticsList: function() {
      //添加语音模板通讯
      var dat = {};
      //				dat.templateName =
      dat.userId = this.commonID;
      this.$httpPost("knowledge/mediaTemplate/addMediaTemplate", dat, function(
        data
      ) {
        this.dataV = data.list;
        this.pagesV = data.total;
      });
    },
    clickCompositing: function(e) {
      //选择语音合成类型
      if (e.target.innerHTML == "文字合成") {
        this.$router.push({ name: "newTextVoiceCom" });
      } else {
        this.$router.push({ name: "newVoiceCom" });
      }
    },
    remove: function(index) {
      //删除表格数据
      this.dataV.splice(index, 1);
      this.queryViocePhoneticsList();
    },
    deleteMediaTemplate: function(id, index) {
      var this_ = this;
      var datas = {
        id: id,
        userId: this_.commonID
      };
      this.$httpPost(
        "knowledge/mediaTemplate/deleteMediaTemplate",
        datas,
        function(data) {
          console.log(data);
          this_.remove(index);
        }
      );
    },
    chooseTimeRange: function(date) {
      this.content = {};
      this.checkedId = {};
      this.checkedIdLength = 0;
      this.deletedList = false;
      //日期选择（修改日期）
      if ((date[0] == "") & (date[1] == undefined)) {
        this.updateTimeFromString = null;
        this.updateTimeToString = null;
      } else {
        this.updateTimeFromString = date[0] + " " + "00:00:00";
        this.updateTimeToString = date[1] + " " + "00:00:00";
      }

      this.queryViocePhoneticsList(1);
    },
    searchName: function(e) {
      this.content = {};
      this.checkedId = {};
      this.checkedIdLength = 0;
      this.deletedList = false;
      //名称查询回车键
      console.log(e.target);
      this.templateName = e.target.value;
      this.queryViocePhoneticsList(1);
    },
    searchClickName: function(e) {
      this.content = {};
      this.checkedId = {};
      this.checkedIdLength = 0;
      this.deletedList = false;
      //名称查询icon点击
      this.templateName = e.target.nextSibling.nextElementSibling.value;
      this.queryViocePhoneticsList(1);
    },
    paramSetClick: function() {
      this.paramSet = true;
    },
    updateMediaTemplate: function(name) {
      //更新语音模板
      if (this.add_voice_template == true) {
        var datas = this.items;
      } else {
        var datas = this.formDatas;
      }
      datas.createTime = undefined;
      datas.updateTime = undefined;
      //				delete(datas(uid))
      var list = document.querySelectorAll(".key");
      this.formDatas.mediaList = [];
      var lists = [];
      for (var i = 0; i < list.length; i++) {
        lists.push(list[i].innerHTML);
      }
      this.formDatas.mediaList = lists;
      var this_ = this;
      this.$refs[name].validate(valid => {
        if (valid) {
          this.$httpPost(
            "knowledge/mediaTemplate/updateMediaTemplate",
            datas,
            function(data) {
              this_.voiceEdit = false;
              this_.add_voice_template = false;
              this_.queryViocePhoneticsList();
            }
          );
        } else {
        }
      });
    },
    queryMediaTemplate: function(id, methods) {
      //查询一个语音模板的内容
      var this_ = this;
      var datas = {
        id: id,
        userId: this_.commonID
      };
      this.$httpPost(
        "knowledge/mediaTemplate/queryMediaTemplate",
        datas,
        function(data) {
          if (methods == "语音合成") {
            this_.formDatas = data.data.data;
            this_.formDatas.mediaList = JSON.parse(this_.formDatas.mediaList); //去掉数组外层的引号
          } else {
            this_.items = data.data.data;
          }
        }
      );
    },
    textToAudio: function() {
      //文本合成语音
      var text = this.items.template;
      var this_ = this;
      this.$httpPost(
        "knowledge/mediaTemplate/textToAudio",
        { template: text, userId: this_.commonID },
        function(data) {
          if (data.data.status == 1000) {
            this_.$Message.success("合成成功");
          }
        }
      );
    },
    batchDeleted: function() {
      //批量删除
      var ids = [];
      for (let i in this.checkedId) {
        for (let j of this.checkedId[i]) {
          ids.push(j.id);
        }
      }
      // debugger;
      var this_ = this;
      var datas = {
        idList: ids
        //					userId: this_.commonID
      };
      this.$Modal.confirm({
        title: "提示",
        content: "<p>你确定要删除选中的所有语音模板吗？</p>",
        okText: "确定",
        cancelText: "取消",
        onOk: () => {
          this.$httpPost(
            "knowledge/mediaTemplate/batchDeleteMediaTemplate",
            datas,
            function(data) {
              if (data.data.status == 1000) {
                //						this_.$Message.success('删除成功');
                // location.reload();
                this_.queryViocePhoneticsList();
                this_.deletedList = false;
                this_.checkedIdLength = 0;
                this_.checkedId = {};
              }
            }
          );
        },
        onCancel: () => {}
      });
    },
    mounted: function() {
      //拖拽
      document.body.ondrop = function(event) {
        event.preventDefault();
        event.stopPropagation();
      };
      let vm = this;
      let todoList = document.getElementById("todoList");
      Sortable.create(todoList, {
        group: {
          name: "list",
          pull: true
        },
        animation: 120,
        ghostClass: "placeholder-style",
        fallbackClass: "iview-admin-cloned-item",
        onRemove(event) {
          vm.doArray.splice(
            event.newIndex,
            0,
            vm.formDatas.mediaList[event.item.getAttribute("data-index")]
          );
        }
      });
    },
    playPauseClick: function(e) {
      this.elementText = e.target;
      if (document.getElementsByClassName("blue")) {
        this.displayOrHidden = true;
        this.$nextTick(function() {
          this.elementSpan =
            e.target.parentElement.nextElementSibling.nextElementSibling.children[0].firstChild;
          this.elementSpan.style.display = "block";
        });
      } else {
        this.elementSpan =
          e.target.nextElementSibling.nextElementSibling.firstChild;
        e.target.nextElementSibling.nextElementSibling.style.display = "block";
      }
      var audio = document.getElementById("audioTag");
      //监听音频播放时间并更新进度条
      audio.addEventListener("timeupdate", this.updateProgress, false);
      //监听播放完成事件
      audio.addEventListener("ended", this.audioEnded, false);
      //监听滚轮事件
      //				audio.addEventListener('DOMMouseScroll',this.audioScroll,false);
      //
      //				window.onmousewheel = document.onmousewheel = this.audioScroll;
      //改变暂停/播放icon
      if (audio.paused) {
        audio.play();
        e.target.innerHTML = "取消试听";
      } else {
        audio.pause();
        e.target.innerHTML = "试听语音";
      }
    },
    //			pgsImgClick: function(e){
    //				var audio = document.getElementById('audioTag');
    //				var rate = (e.offsetX - ($(e.target).width() - this.pgsWidth) / 2) / this.pgsWidth;
    //		        audio.currentTime = audio.duration * rate;
    //		        this.updateProgress();
    //			},
    //转换音频时长显示
    transTime: function(time) {
      var duration = parseInt(time);
      var minute = parseInt(duration / 60);
      var sec = duration % 60 + "";
      var isM0 = ":";
      if (minute == 0) {
        minute = "00";
      } else if (minute < 10) {
        minute = "0" + minute;
      }
      if (sec.length == 1) {
        sec = "0" + sec;
      }
      return minute + isM0 + sec;
    },

    //更新进度条
    updateProgress: function() {
      var audio = document.getElementsByTagName("audio")[0];
      var value = Math.round(
        Math.floor(audio.currentTime) / Math.floor(audio.duration) * 100,
        0
      );
      this.elementSpan.style.width = value * 1 + "%";
    },
    //播放完成
    audioEnded: function() {
      //			    var audio =document.getElementsByTagName('audio')[0];
      //			    audio.currentTime = 0;
      //			    audio.pause();
      //			    $('.play-pause>span').removeClass('icon-pause').addClass('icon-play');
      this.elementText.innerHTML = "重新试听";
    },
    removeMedia: function(e, id) {
      var this_ = this;
      var datas = {
        id: parseInt(id),
        userId: this_.commonID
      };
      this.$httpPost(
        "knowledge/mediaTemplate/deleteMediaTemplate",
        datas,
        function(data) {
          e.target.parentNode.parentNode.parentNode.remove();
        }
      );
    }
  }
};
</script>
<style lang="less">
@import url("../../css/public.less");
@import url("../../css/phonetics.less");
</style>
<style>
.ivu-modal {
  top: 35% !important;
}
</style>
