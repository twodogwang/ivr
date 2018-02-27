<template>
	<div class="customVersion hmain">
		<div class="tableAction"><div><span class="pageTitle">用户模板</span>
			<Tooltip content="提示内容">
				<Icon type="information-circled" color="#999" size="14" />
			</Tooltip></div><!-- Iview组件 事件绑定需加上@ --><div><Input
			  icon="ios-search" placeholder="请输入模板名" class="searchInput" @on-enter="getUsKnVerListByPage('condition')" @on-click="getUsKnVerListByPage('condition')" v-model="versionName" :maxlength="12"></Input><i-button
			   type="primary" class="create" @click="createNewVer">创建模板</i-button><i-button type="primary" @click="viewTpl">查看模板</i-button></div>
		</div>
		<div class="sortAction">
			<Select placeholder="所属模板" class="selectInput" v-model="belongVersion" @on-change="getUsKnVerListByPage('condition')">
				<Option value="0">所有模板</Option>
				<Option v-for='item in belongVersionOptions' :value="item.id" :key="item.id">{{item.knowledgeName}}</Option>
			</Select>
			<Select placeholder="启用状态" class="selectInput" v-model="isRun" @on-change="getUsKnVerListByPage('condition')">
				<Option value="0">所有状态</Option>
				<Option value="1">启用</Option>
				<Option value="2">禁用</Option>
			</Select>
			<Select placeholder="同步状态" class="selectInput" v-model="isSync" @on-change="getUsKnVerListByPage('condition')">
				<Option value="0">所有状态</Option>
				<Option value="1">需要同步</Option>
				<Option value="2">正在同步</Option>
				<Option value="3">已同步</Option>
				<Option value="4">同步失败</Option>
			</Select>
			<DatePicker class="cvDatePicker" type="date" placeholder="选择更新日期" @on-change="getModifyDate"></DatePicker>
		</div>
		<Table :height="isNeedScroll" ref="selection" :columns="columns1" :data="tableData" @on-selection-change="hasChooseItems"></Table>
		<p class="hasChoose" v-if="hasChooseNumLength">已选择 {{hasChooseNumLength}} 条</p>
		<div class="pageFooter">
			<Button type="ghost" @click="showModal2" :class="hasChooseNumLength?'batchDelete':''">批量删除</Button>
			<Page :placement="place" :total="totalNum" :current="curr" :page-size="pSize" show-total show-elevator show-sizer @on-change="changePage" @on-page-size-change="changePagesize"></Page>
		</div>
		<!-- 确认删除单条数据 -->
		<Modal class-name="vertical-center-modal" v-model="modal1" @on-ok="deleteUsKnVer" @on-cancel="cancel" :transfer="false" :closable="false">
			<p>确认删除这条数据吗？</p>
		</Modal>
		<!-- 确认删除多条数据 -->
		<Modal class-name="vertical-center-modal" v-model="modal2" @on-ok="batchDeleteUsKnVer" @on-cancel="cancel" :transfer="false" :closable="false">
			<p>确认删除这些数据吗？</p>
		</Modal>
	</div>
</template>
<script>
    export default {
        data () {
            return {
				rowID: 0,//全局单条数据的id
				isNeedScroll: '',//如果分页数不足10条 分页跟随表格移动
				versionName: '',//模板名
				hasChooseNumLength: 0,//已选条数
				hasChooseNumIdList: [],//已选条数的id组
				belongVersion: '',//所属模板
				belongVersionOptions: '',//所属模板options
				isRun: '',//是否启用
				isSync: '',//是否同步
				modifyDate: '',//修改日期
				modal1: false,//单条框
				modal2: false,//批量框
				totalNum: 0,//总条数
				curr: 1,//当前页数
				pSize: 10,//每页条数
				place: 'bottom',
                columns1: [//实现id列的隐藏:params.row.id可以直接获取
					{
                        type: 'selection',
                        width: 60,
						align: 'center'
					},
                    {
                        title: '模板名称',
                        key: 'vname',
						width: '20%',
						render:(h,params)=>{
							return h('Tooltip',{
								props: {
									content: params.row.vname
								},
								style:{
									overflow: 'hidden',
									textOverflow:'ellipsis',
									whiteSpace: 'nowrap',
									fontSize: '14px'
								}
							},params.row.vname)
						}
                    },
                    {
                        title: '所属模板',
						key: 'knowledgeName',
						ellipsis: true
					},
					{
						title: '创建时间',
						key: 'createTime',
						sortable: true
					},
					{
						title: '更新时间',
						key: 'updateTime',
						sortable: true
					},
					{//渲染switch开关
						title: '启用状态',
						key: 'knowledgeEnable',
						// width: 150,
						// align: 'center',
						render: (h,params) => {
							let st = params.row.knowledgeEnable;
							// let temp = 1;
							// if(st == 1){
							// 	temp = 2;
							// }else{}
							return h('div',[
								h('i-switch',{
									props: {
										size: 'large',
										value: st,
										trueValue: 1,
										falseValue: 2
									},
									on: {
										'on-change': (value) => {//改变switch的状态方法
											this.enableOrDisableUsKnVer(params.row.rid,value)
											console.log(value)
										}
									}
								},[
									h('span',{
										slot: 'close'
									}, '禁用'),
									h('span',{
										slot: 'open'
									}, '启用')
								])
							])
						}
					},
					{
						title: '同步状态',
						key: 'sync',
						// render: (h,params) => {
						// 	let sync = '';
						// 	if(params.row.userKnowledgeStatus==0){
						// 		sync = '未同步'
						// 	}else if(params.row.userKnowledgeStatus==1){}
						// 	else if(params.row.userKnowledgeStatus==2){
						// 		sync = '同步中'
						// 	}else{
						// 		sync = '已同步'
						// 	}
						// 	return h('div',{
						// 		domProps: {
						// 			innerHTML: sync
						// 		}
						// 	})
						// }
					},
					{
						title: '同步',
						// key: 'sync'
						width: '5%',
						render: (h, params) => {
                            return h('div', [
                                h('Icon', {
                                    props: {
                                        type: 'ios-loop-strong',
										size: '14',
									},
									// domProps: {
									// 	innerHTML: '同步'
									// },
									style: {
										cursor: 'pointer',
									},
                                    nativeOn: {
                                        click: () => {
											// console.log(params.row.sync)
											this.rowID = params.row.id;
											if(params.row.sync=="同步中"){
												// this.$Message.info('该模板正在同步中请稍后再试')
											}else{
												this.syncUsKnVer()
											}
                                        }
                                    }
                                })
                            ]);
                        }
					},
					{
                        title: '操作',
                        key: 'action',
                        width: 200,
                        // align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Icon', {
                                    props: {
                                        type: 'android-create',
										size: '14',
										itemHover: 'itemHover'
									},
                                    style: {
										cursor: 'pointer',
										color: '#333333',
                                        marginRight: '25px'
									},
									domProps:{
										innerHTML: '编辑'
									},
									class:{
										itemHover: true
									},
                                    nativeOn: {
                                        click: () => {
											this.rowID = params.row.id;
											let id = params.row.id;
											this.postID(id);
											this.$router.push({name:'basicConfig'});
                                        }
                                    }
                                }),
                                h('Icon', {
                                    props: {
                                        type: 'trash-b',
                                        size: '14',
										itemHover: 'itemHover'
									},
									style: {
										cursor: 'pointer',
										color: '#333333'
									},
									domProps:{
										innerHTML: '删除'
									},
									class:{
										itemHover: true
									},
                                    nativeOn: {
                                        click: () => {
											this.rowID = params.row.id
											this.showModal1();
											console.log(`该数据的ID:`+params.row.id)
                                        }
                                    }
								})
                            ]);
                        }
                    }
                ],
                tableData: []
            }
		},
		methods:{
			//创建新模板按钮
			createNewVer(){
				this.$router.push({name:'createVersion'})
			},
			//查看模板按钮
			viewTpl(){
				this.$router.push({name:'mainVersion'})
			},
			//查询当前的基础模板
			getSpKnVerList(){
				this.$httpGet('knowledge/version/getSpKnVerList',{},(data) => {
					this.belongVersionOptions = data.data.data;
					// console.log(data.data.data)
				})
			},
			//查询当前表格中的数据
			getUsKnVerListByPage(val){
				//如果选择了全部xx则置空
				let belong = '',run='',sync='',name='',timeFrom='',timeTo='';
				if(this.belongVersion=='0'||this.belongVersion==''){
					belong = null;
				}else{
					belong = this.belongVersion;
				}
				if(this.isRun=='0'||this.isRun==''){
					run = null;
				}else{
					run = parseInt(this.isRun)
				}
				if(this.isSync=='0'||this.isSync==''){
					sync = null;
				}else{
					sync = parseInt(this.isSync);
				}
				if(this.versionName==''||this.versionName.trim()==''){
					name = null;
				}else{
					name = this.versionName;
				}
				if(this.modifyDate==''){
					timeFrom=null;
					timeTo=null;
				}else{
					timeFrom = this.modifyDate;
					timeTo=this.modifyDate;
				}
				if(val == 'condition'){
					this.curr = 1;
				}
				this.$httpPost('knowledge/version/getUsKnVerListByPage',{
					sid:belong,
					vname: name,
					pageNum: this.curr,
					pageSize: this.pSize,
					knowledgeEnable: run,
					userKnowledgeStatus: sync,
					updateTimeFromString: timeFrom,
					updateTimeToString: timeTo
					},(data) => {
						this.tableData = data.data.data.list;
						this.tableData.forEach(i=>{
							if(i.userKnowledgeStatus==1){
								i.sync = '需要同步';
							}else if(i.userKnowledgeStatus==2){
								i.sync = '正在同步';
							}
							else if(i.userKnowledgeStatus==3){
								i.sync = '已同步';
							}else{
								i.sync = '同步失败';
							}
						})
						this.curr = data.data.data.pageNum;
						this.pSize = data.data.data.pageSize;
						this.totalNum = data.data.data.total;
						this.hasChooseNumLength = '';
						this.hasChooseNumIdList = [];
						this.$nextTick(()=>{
							if(this.pSize!=10){
								this.isNeedScroll = 650;
								this.place = 'top';
							}
							else{
								this.isNeedScroll = '';
								this.place = 'bottom';
							}
						})
						// console.log(this.modifyDate)
				})
			},
			//用户模板是否启用
			enableOrDisableUsKnVer(params,enable){
				this.$httpPost('knowledge/version/enableOrDisableUsKnVer',{
					userVersionId: params,
					knowledgeEnable: enable
				},(data) => {
					console.log(params,enable)
					this.$Message.success(data.data.msg)
				})
			},
			//同步当前用户模板
			syncUsKnVer(){
				// this.$httpPost('knowledge/version/syncUsKnVer',{
				// 	id: this.rowID
				// },(data)=>{
				// 	this.$Message.success(data.data.msg)
				// })
				this.$Message.info('该功能还在维护中...')
			},
			changePage(page){
				this.curr = page;
				this.getUsKnVerListByPage();
				// console.log(page)
			},
			changePagesize(size){
				this.pSize = size;
				this.getUsKnVerListByPage();
				// console.log(size)
			},
			hasChooseItems(value){
				this.hasChooseNumLength = value.length;
				let array = value;
				let temp = [];
				array.forEach(element => {
					// console.log(element)
					temp.push(element.id);
				});
				// console.log(temp)
				this.hasChooseNumIdList = temp;
			},
			getModifyDate(value){
				this.modifyDate = value;
				// console.log(value)
				this.getUsKnVerListByPage('condition');
			},
			//显示删除单条数据框
			showModal1() {
				this.modal1 = true;
                // this.tableData.splice(index, 1);
			},
			//删除单条数据接口
			deleteUsKnVer(){
				this.$httpPost('knowledge/version/deleteUsKnVer',{
					id: this.rowID
				},(data)=>{
					this.$Message.success(data.data.msg);
					this.getUsKnVerListByPage();
				})
			},
			//显示批量删除框
			showModal2(){
				if(this.hasChooseNumLength == 0){

				}else{
					this.modal2 = true;
				}
			},
			//批量删除接口
			batchDeleteUsKnVer(){
				this.$httpPost('knowledge/version/batchDeleteUsKnVer',{
					idList: this.hasChooseNumIdList
				},(data)=>{
					this.$Message.success(data.data.msg);
					this.getUsKnVerListByPage();
				})
			},
			//隐藏对话框
			cancel(){
				this.modal1 = false;
				this.modal2 = false;
			}
		},
		created () {
			this.tableData.forEach(element => {
				if(element.status == 1){
					element.status == true
				}
			});
			this.getUsKnVerListByPage();
			this.getSpKnVerList();
		}
    }
</script>
<style lang="less">
@import url("../../css/public.less");
.customVersion{
	height: 100%;
	padding: 1.6% 1.6% 0 1.6%;
	border: 1px solid #e1e1e1;
	.tableAction{
		display: flex;
		justify-content: space-between;
		.pageTitle{
			font-size: 18px;
			line-height: 34px;
		}
		.searchInput{
			width: 200px;
		}
		.ivu-input-wrapper{
			margin-right: 10px;
			.ivu-input{
				background: #fafafa;
			}
		}
		button{
			width: 100px;
			height: 34px;
		}
		.create{
			margin-right: 10px;
		}
	}
	.sortAction{
		display: flex;
		justify-content: flex-end;
		margin: 15px 0 15px 0;
		.ivu-select{
			margin-right: 10px;
			.ivu-select-selection{
				background: #fafafa;
			}
		}
		.selectInput{
			width: 140px;
		}
		.cvDatePicker{
			width: 210px;
			margin-right: 0;
			.ivu-input{
				background: #fafafa;
			}
		}
	}
	.ivu-table-wrapper{
		margin-bottom: 24px;
	}
	.ivu-select-selection:focus {
		border-color: #57a3f3;
	}
	.vertical-center-modal{
        display: flex;
        align-items: center;
        justify-content: center;

        .ivu-modal{
            top: 0;
        }
    }
	.ivu-modal-body{
		font-size: 14px;
		padding-top: 26px!important;
		text-align: center;
		color: #e62e29;
	}
	.ivu-modal-footer{
		border-top: none;
	}
	.itemHover{
		&:before{
			margin-right: 10px;
		}
		&:hover{
			color: #2d8cf0!important;
		}
	}
	.batchDelete{
		color: #fff!important;
		background: #e62e29;
		&:hover{
			background: #e62e29!important;
		}
	}
	.ivu-btn-ghost{
		border-color: #e1e1e1;
		color: #333;
		&:hover{
			background: #f1f1f1;
		}
	}
}
</style>
