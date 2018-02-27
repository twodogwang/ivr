<template>
	<div class="main-content">
    	<tabNav></tabNav>
    	<div class="layout-breadcrumb">
            <Breadcrumb>
                <BreadcrumbItem href="/">用户版本</BreadcrumbItem>
                <BreadcrumbItem href="/nodeConfig">节点配置</BreadcrumbItem>
                <BreadcrumbItem>语音交互节点<Icon type="ios-information" color="#999999" size="16"></Icon></BreadcrumbItem>
            </Breadcrumb>
        </div>
        <div class="module speedInterNode_div_1">
           <Select @on-change="screenTimeout" placeholder="超时上限动作" style="width: 160px;">
                <Option value="全部动作类型">全部动作类型</Option>
                <Option value="挂机">挂机</Option>
                <Option value="反转">反转</Option>
                <Option value="转人工">转人工</Option>
            </Select>
           <!--<Select @on-change="screenError" placeholder="错误上限动作" style="width: 160px;">
                <Option value="挂机">挂机</Option>
                <Option value="反转">反转</Option>
                <Option value="转人工">转人工</Option>
            </Select>-->
        	<Input @on-enter="getInteractivePredictNodeListByPage" @on-click="getInteractivePredictNodeListByPage" icon="search" v-model="name" placeholder="请输入名称" style="width: 200px"></Input>
        	<!--<Button type="primary" class="defaultButton" @click="addVoiceInterNode">添加节点</Button>-->
        </div>
        <div class="module speedInterNode_div_3">
        	<Table :height="height" @on-select="checkA" @on-select-cancel="uncheckA" @on-selection-change="cancelAllCheck" @on-select-all="checkAllList" border :columns="columnsV" :data="dataV"></Table>
        </div>
        <div class="module speedInterNode_div_2">
    		<span v-if="deletedList" class="remove">
    			<b>已选择</b><b class="count" v-text="checkedId.length"></b><b>条</b>
    			<Button @click="batchDeleteInteractivePredictNode">删除</Button>
    		</span>
    		<Page @on-page-size-change="thisEveryPageCount" @on-change="thisCurrentPage" :placement="place" :total="pagesV" show-total show-elevator show-sizer :page-size="pageCountV"></Page>
    	</div>
    	<div class="speedInterNode_div" v-if="editSpeedInterNode">
    		<div class="speedInterNode_div_4">
    			<Card dis-hover>
	    			<span class="speedInterNode_div_4_span">
	    				<Icon @click.native="closeSpeedInterNode" size="40" color="#e1e1e1" class="closeIcon"></Icon>
	    				<p class="speedInterNode_div_4_p">语音交互节点</p>
	    			</span>
					<Form label-position="right" ref="formDatas" :model="formDatas" :label-width="150" :rules="ruleValidate">
				        <FormItem label="语音交互名称" prop="name">
				            <Input v-model="formDatas.name"></Input>
				        </FormItem>
				        <FormItem label="引导语语音模板" prop="naviMediaId">
				            <Select placeholder="请选择" v-model="formDatas.naviMediaId">
				                <Option v-for="item in voiceList" :value="item.id" :key="item.id">{{item.templateName}}</Option>
				            </Select>
				        </FormItem>
				        <FormItem label="参数传递键值" prop="pLabel">
				        	<Input v-model="formDatas.pLabel"></Input>
				        </FormItem>
				        <FormItem label="参数默认值" prop="defaultValue">
				        	<Input v-model="formDatas.defaultValue"></Input>
				        </FormItem>
				        <FormItem label="交互超时时间间隔" prop="timeoutInterval">
				        	<Input v-model="formDatas.timeoutInterval"></Input>
				        </FormItem>
				        <FormItem label="超时上限动作" prop="maxTimeoutAction">
				            <RadioGroup v-model="formDatas.maxTimeoutAction">
						        <Radio :label="1">挂机</Radio>
						        <Radio :label="2">反转</Radio>
						        <Radio :label="3">转人工</Radio>
						    </RadioGroup>
				        </FormItem>
				        <FormItem label="超时语音列表" prop="timeoutMediaList">
				            <Select @on-change="outTime($event,val)" multiple placeholder="请选择" v-model="formDatas.timeoutMediaList">
				                <Option v-for="item in voiceList" :value="item.id" :key="item.id">{{item.templateName}}</Option>
				            </Select>
				        </FormItem>
				        <FormItem label="检查链的链头" prop="checkLinkHeaderName">
				            <Input v-model="formDatas.checkLinkHeaderName"></Input>
				        </FormItem>
				        <FormItem label="帮助语语音列表" prop="helpMediaId">
				            <Select placeholder="请选择" v-model="formDatas.helpMediaId">
				                <Option v-for="item in voiceList" :value="item.id" :key="item.id">{{item.templateName}}</Option>
				            </Select>
				        </FormItem>
				        <!--<FormItem label="错误上限动作" prop="maxErrorAction">
				            <RadioGroup v-model="formDatas.maxErrorAction">
						        <Radio :label="1">挂机</Radio>
						        <Radio :label="2">反转</Radio>
						        <Radio :label="3">转人工</Radio>
						    </RadioGroup>
				        </FormItem>
				        <FormItem label="错误语音列表" prop="errorMediaList">
				            <Select placeholder="请选择" v-model="formDatas.errorMediaList">
				                <Option v-for="item in errorMediaList" :value="item.value" :key="item.value">{{item.value}}</Option>
				            </Select>
				        </FormItem>-->
				        <FormItem label="语音交互版本描述" prop="nodeDesc">
				            <Input v-model="formDatas.nodeDesc" type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>
				        </FormItem>
				        <FormItem>
				            <Button @click="closeSpeedInterNode" type="ghost" style="margin-left: 8px">取消</Button>
				            <Button type="primary" @click="clickSubmit('formDatas')">确定</Button>
				        </FormItem>
				    </Form>
	    		</Card>
    		</div>
    	</div>
	</div>
</template>

<script>
	import tabNav from '@/components/common/tabNav'
	export default{
		components:{
		    tabNav
		},
		data(){
			const name = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('指令节点名称不能为空'));
                }else if(value.length > 12){
                	callback(new Error('指令节点名称不能超过12个字符'));
                }else{
                	callback();
                }
            };
            const timeoutInterval = (rule, value, callback) => {
				if (value === '') {
                    callback(new Error('交互超时时间间隔不能为空'));
                }else if(!/^[a-z0-9]+$/.test(value)){
                	callback(new Error('交互超时时间间隔必须为数字'));	
                }else if(value > 255){
                	callback(new Error('交互超时时间间隔必须不能超过255'));	
                }else{
                	callback();
                }
            };
            const checkLinkHeaderName = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('检查链的链头不能为空'));
                } else if(value.length > 20){
                	callback(new Error('检查链的链头不能超过20个字符'));
                }else{
                	callback();
                }
            };
			return{
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
                		title: '名称',
                		key: 'name'
                	},
                	{
                		title: '超时上限动作',
                		key: 'maxTimeoutAction'
                	},
//              	{
//              		title: '错误上限动作',
//              		key: 'error'
//              	},
                	{
                		title: '创建日期',
                		key: 'createTime',
                		"sortable": true,
                	},
                	{
                		title: '修改日期',
                		key: 'updateTime',
                		"sortable": true,
                	},
                	{
                		title: '操作',
                		key: 'operation',
                		align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Icon',{
                                    props: {
                                        type: 'android-create',
                                        size: '14',
                                        color: '#666666',
                                    	tableOperaHover: 'tableOperaHover'
                                    },
                                    class: {
                                    	tableOperaHover: true
                                    },
                                    domProps :{
                                    	innerHTML: '编辑'
                                    },
                                    style: {
                                        marginRight: '25px',
                                        cursor: 'pointer'
                                    },
                                    nativeOn: {
                                        click: () => {
                                            this.editSpeedInterNode = true;
                                            var rst = params.row;
                                            var action;
                                            if(rst.maxTimeoutAction == '挂机'){
                                            	action = 1;
                                            }else if(rst.maxTimeoutAction == '反转'){
                                            	action = 2;
                                            }else{
                                            	action = 3;
                                            };
                                            this.formDatas = {
                                            	id: rst.id,
                                            	name: rst.name,
                                            	nodeDesc: rst.nodeDesc,
                                            	timeoutInterval: rst.timeoutInterval,
                                            	timeoutMediaList: rst.timeoutMediaList,
                                            	maxTimeoutAction: action,
                                            	helpMediaId: rst.helpMediaId,
                                            	pType: rst.pType,
                                            	naviMediaId: rst.naviMediaId,
                                            	checkLinkHeaderName: rst.checkLinkHeaderName,
                                            	pLabel: rst.pLabel,
                                            	defaultValue: rst.defaultValue,
                                            };
											this.getMediaTemplateListByUserVersionId();
                                        }
                                    }
                                }),
//                              h('Icon', {
//                                  props: {
//                                      type: 'trash-b',
//                                      size: '14',
//                                      color: '#666666',
//                                  	tableOperaHover: 'tableOperaHover'
//                                  },
//                                  class: {
//                                  	tableOperaHover: true
//                                  },
//                                  domProps :{
//                                  	innerHTML: '删除'
//                                  },
//                                  style: {
//                                      marginRight: '5px',
//                                      cursor: 'pointer'
//                                  },
//                                  nativeOn: {
//                                      click: () => {
//                                          var this_ = this;
//                                          this.$Modal.confirm({
//							                    title: '提示',
//							                    content: '<p>你确定要删除该交互节点？</p>',
//							                    okText: '确定',
//                  							cancelText: '取消',
//							                    onOk: () => {
//							                    	var id = params.row.id;
//							                    	var index = params.index;
//							                    	this.deleteInteractivePredictNode(id,index);
//							                    },
//							                    onCancel: () => {
//
//							                    }
//							                });
//                                      }
//                                  }
//                              })
                            ]);
                        }
                	}
                ],
                dataV: [],
                ruleValidate: {
                    naviMediaId: [
                        { required: true, type: 'number', message: '请选择引导语语音模板', trigger: 'change' }
                    ],
                    plabel: [
                        { required: true, message: '参数传递键值不能为空', trigger: 'blur' }
                    ],
                    timeoutInterval: [
                        { required: true, validator: timeoutInterval, trigger: 'blur' }
                    ],
                    maxTimeoutAction: [
                        { required: true,type: 'number', message: '请选择超时上限动作', trigger: 'change' }
                    ],
                    timeoutMediaList: [
                        { required: true, type: 'array', message: '请选择超时语音', trigger: 'change' }
                    ],
                    helpMediaId: [
                        { required: true, type: 'number', message: '请选择帮助语语音模板', trigger: 'change' }
                    ],
                    checkLinkHeaderName: [
                        { required: true, validator: checkLinkHeaderName, trigger: 'blur' }
                    ],
                    nodeDesc: [
                        { required: false, message: '语音交互版本描述不能为空',trigger: 'blur' }
                    ],
                    defaultValue: [
                        { required: false, message: '参数默认值',trigger: 'blur' }
                    ],
                    name: [
                        { required: true, validator: name,trigger: 'blur' }
                    ],
                },
                formDatas: {},
                naviMediaId: [
                	{
                		value: 1,
                	},
                	{
                		value: 12,
                	}
                ],
                timeoutMediaList:[
                	{
                		value: 1,
                	},
                	{
                		value: 12,
                	}
                ],
//              errorMediaList: [
//              	{
//              		value: 1,
//              	},
//              	{
//              		value: 12,
//              	}
//              ],
                editSpeedInterNode: false,
                voiceList: [],
                actionList: [],
                height: null,
                place: null,
                name: null,
                pType: null,
                maxTimeoutAction: null,
			}
		},
		mounted: function(){
			this.getInteractivePredictNodeListByPage();
		},
		methods: {
			thisCurrentPage: function(page){//当前页
				this.currentPageV = page;
			},
			thisEveryPageCount: function(count){//每页的条数
				this.pageCountV = count;
			},
			checkAllList: function(val){//全选列表
//				console.log(val);
				this.deletedList = true;
				for(var i=0; i<val.length;i++){
					this.checkedId.push(val[i].id);
				};
			},
			cancelAllCheck: function(val){//选中项发生了变化
//				console.log(val+ '00000');
				if(val.length == 0){
					this.deletedList = false;
				}else{
					this.deletedList = true;
				};
				this.checkedId.length = 0;
				for(var i=0;i<val.length;i++){
					this.checkedId.push(val[i].id);
				}
			},
			uncheckA: function(val,row){//取消选择
				if(val.length == 0){
					this.deletedList = false;
				}
			},
			checkA: function(row){//选中某个项
				this.deletedList = true;
			},
			closeSpeedInterNode: function(){
				this.editSpeedInterNode = false;
			},
			addVoiceInterNode: function(){
				this.$router.push({name:'newVoiceInterNode',params: {name: '新建语音交互节点'}});
			},
			remove: function(index){//删除表格数据
                this.dataV.splice(index, 1);
            },
			getInteractivePredictNodeListByPage: function(){//查询所有语音交互节点
				if(this.name == ""){
					this.name = null;
				};
				var datas = {};
				datas.pageCurrent = this.pageCountV;
				datas.pageSize = this.pagesV;
				datas.orderBy = '';
				datas.descOrAsc = '';
				datas.vUserId = this.commonID;
				datas.name = this.name;
				datas.pType = this.pType;
				datas.maxTimeoutAction = this.maxTimeoutAction;
				var this_ = this;
				this.$httpPost('knowledge/node/getInteractivePredictNodeListByPage',datas,function(data){
					this_.dataV = data.data.data.list;
					for(var i=0;i<this_.dataV.length;i++){
						if(this_.dataV[i].maxTimeoutAction == 1){
							this_.dataV[i].maxTimeoutAction = "挂机";
						}else if(this_.dataV[i].maxTimeoutAction == 2){
							this_.dataV[i].maxTimeoutAction = "反转";
						}else{
							this_.dataV[i].maxTimeoutAction = "转人工";
						}
					};
					this_.pagesV = data.data.data.total;
                	this_.currentPageV = data.data.data.pageNum;
                	this_.pageCountV = data.data.data.pageSize;
                	this_.changeHeight();
				})
			},
			changeHeight: function(){
				this.$nextTick(function(){
					if(document.querySelector('.ivu-table-body').offsetHeight > 640){
						this.height = 640;
						this.place = 'top';
					}else if(document.querySelector('.ivu-table-body').offsetHeight < 640){
						if(document.querySelector('.ivu-table-body').offsetHeight == 550){
							this.height = 600;
							this.place = 'top';
						}else{
							this.height = null;
							this.place = 'bottom';
						}
					}
				})
			},
			deleteInteractivePredictNode: function(id,index){//删除某个语音交互节点
				var this_ = this;
				this.$httpGet('knowledge/node/deleteInteractivePredictNode?id=' + id,{},function(data){
					this_.remove(index);
				})
			},
			batchDeleteInteractivePredictNode: function(){//批量删除语音交互节点
				var this_ = this;
				this.$Modal.confirm({
                    title: '提示',
                    content: '<p>你确定要删除选中的所有语音交互节点？</p>',
                    okText: '确定',
					cancelText: '取消',
                    onOk: () => {
                    	this.$httpGet('knowledge/node/batchDeleteInteractivePredictNode?id=' + this.checkedId + '&userId=' + this_.commonID,{},function(data){
							this_.remove(index);
						})
                    },
                    onCancel: () => {

                    }
               });
			},
			clickSubmit: function(name){//更新一个指令节点
				this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.updateInteractivePredictNode();
                    } else {

                    }
                })
			},
			updateInteractivePredictNode: function(){
//				this.formDatas.userId = this.commonID;
				var this_ = this;
				this.$httpPost('knowledge/node/updateInteractivePredictNode',this.formDatas,function(data){
					this_.editSpeedInterNode = false;
					this_.getInteractivePredictNodeListByPage();
				})
			},
			screenTimeout: function(val){
				if(val == '挂机'){
					this.maxTimeoutAction = 1;
				}else if(val == '反转'){
					this.maxTimeoutAction = 2;
				}else if(val == '转人工'){
					this.maxTimeoutAction = 3;
				}else{
					this.maxTimeoutAction = null;
				}
				this.getInteractivePredictNodeListByPage();
			},
			getMediaTemplateListByUserVersionId: function(){
				var this_ = this;
				this.$httpPost('knowledge/mediaTemplate/getMediaTemplateListByUserVersionId',{userVersionId: parseInt(this.commonID)},function(data){
					this_.voiceList = data.data.data;
				})
			},
			outTime: function(event,val){
				var lists = document.querySelectorAll('.ivu-select-item-selected');
				for(var i=0;i<lists.length;i++){
					event.preventDefault();
				}
				console.log('111')
			}
		}
	}
</script>

<style lang="less">
	@import url("../../css/public.less");
	@import url("../../css/speedInterNode.less");
</style>
