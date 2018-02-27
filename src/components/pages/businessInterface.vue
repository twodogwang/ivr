<template>
	<div class="business hmain">
		<tabNav></tabNav>
    	<div class="layout-breadcrumb">
            <Breadcrumb>
                <BreadcrumbItem href="/">用户版本</BreadcrumbItem>
                <BreadcrumbItem>业务接口</BreadcrumbItem>
            </Breadcrumb>
        </div>
		<div class="businessInterface">
			<div class="tableAction">
				<Input v-model="interName" icon="ios-search" placeholder="请输入名称" class="searchInput" @on-enter="getLinkListByPage" @on-click="getLinkListByPage" :maxlength="12"></Input><router-link
				to="/business/create" class="createBusiness" tag="Button">新建业务</router-link>
			</div>
			<Table :height="isNeedScroll" ref="selection" :columns="columns1" :data="tableData" @on-selection-change="hasChooseItems"></Table>
			<p class="hasChoose" v-if="hasChooseNumLength">已选择{{hasChooseNumLength}}条</p>
			<div class="pageFooter">
				<Button type="ghost" @click="showModal2" :class="hasChooseNumLength?'batchDelete':''">批量删除</Button>
				<Page :placement="place" :total="totalNum" :current="curr" :page-size="pSize" show-total show-elevator show-sizer @on-change="changePage" @on-page-size-change="changePagesize"></Page>
			</div>
		</div>
		<div class="editBusinessInter" v-if="modal3">
			<Form ref="formValidate" :label-width="160" class="editBusinessItem" :model="formValidate" :rules="ruleValidate">
				<p class="modalTitle"><i @click="cancelEdit"></i><span>业务接口编辑</span></p>
				<FormItem label="业务链接名" prop="name">
					<Input v-model="formValidate.name" placeholder="标题不能超过N个字符"></Input>
				</FormItem>
				<FormItem label="调用链的地址" prop="url">
					<Input v-model="formValidate.url" placeholder="调用链网址链接(例：http://www.example.com)" :maxlength="64"></Input>
				</FormItem>
				<FormItem label="调用链的描述">
					<Input v-model="desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="输入描述用句，检索关键词（非必选）" :maxlength="120"></Input>
				</FormItem>
				<FormItem class="formButtonItem">
					<i-button type="ghost" @click="cancelEdit" class="cancelItem">取消</i-button><i-button type="primary" @click="updateLink('formValidate')">保存</i-button>
				</FormItem>
			</Form>
		</div>
		<!-- 确认删除单条数据 -->
		<Modal class-name="vertical-center-modal" v-model="modal1" @on-ok="deleteLink" @on-cancel="cancel()" :transfer="false" :closable="false">
			<p>确认删除这条数据吗？</p>
		</Modal>
		<!-- 确认删除多条数据 -->
		<Modal class-name="vertical-center-modal" v-model="modal2" @on-ok="batchDelectLink" @on-cancel="cancel()" :transfer="false" :closable="false">
			<p>确认删除这些数据吗？</p>
		</Modal>
	</div>
</template>
<script>
	import tabNav from '@/components/common/tabNav'
    export default {
		components: {
			tabNav
		},
        data () {
			const validateName = (rule,value,callback) => {
				if(value === ''){
					callback(new Error('业务链接名不能为空'))
				}else if(value.replace(/\s/g,"") == ""){
					callback(new Error('业务链接名不能为空'))
				}else if(this.checkLinkName()){
					callback(new Error(this.checkLinkName()))
				}else{
					callback()
				}
			};
			const url = (rule, value, callback) => {
				if (value === ''||value.replace(/\s/g,"") == "") {
					callback(new Error('调用链的地址不能为空'));
				}else if(!/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/.test(value)){
					callback(new Error('调用链的格式不正确'))
				}
				else{
					callback()
				}
			};
            return {
				ID:this.commonID,// 用户版本id
				interName: '',//查询框内容
				modal3: false,//编辑框的显隐
				isNeedScroll: '',
				hasChooseNumLength: 0,//已选择数据的条数
				hasChooseNumIdList: [],//已选择表格的数据的id
				tableData: [],//表格数据
				totalNum: 0,//总页数
				curr: 1,//当前页
				pSize: 10,//每页条数
				place: 'bottom',
				rowID: 0,//点击编辑传入的行数据的id 全局
				desc: '',//业务描述
				modal1: false,//单条
				modal2: false,//批量
				formValidate: {
                    name: '',
                    url: ''
                },
                ruleValidate: {
                    name: [
						{required: true,validator: validateName, trigger:'blur'}
                    ],
                    url: [
                        { required: true, type: 'url',validator: url, message: '地址格式不正确', trigger: 'blur' }
                    ]
                },
                columns1: [
					{
                        type: 'selection',
                        width: 60,
						align: 'center'
					},
					{
						title: '链接名',
						key: 'linkName',
						render:(h,params)=>{
							return h('Tooltip',{
								props: {
									content: params.row.linkName
								},
								style:{
									overflow: 'hidden',
									textOverflow:'ellipsis',
									whiteSpace: 'nowrap',
									fontSize: '14px'
								}
							},params.row.linkName)
						}
					},
					{
						title: '地址',
						key: 'callback',
						render:(h,params)=>{
							return h('Tooltip',{
								props: {
									content: params.row.callback
								},
								style:{
									overflow: 'hidden',
									textOverflow:'ellipsis',
									whiteSpace: 'nowrap',
									fontSize: '14px'
								}
							},params.row.callback)
						}
					},
					{
						title: '描述',
						key: 'linkDesc',
						render:(h,params)=>{
							return h('Tooltip',{
								props: {
									content: params.row.linkDesc,
									placement: 'bottom-start',
								},
								style:{
									overflow: 'hidden',
									textOverflow:'ellipsis',
									whiteSpace: 'nowrap',
									fontSize: '14px',
								}
							}
							,params.row.linkDesc)
						}
					},
					{
						title: '创建时间',
						key: 'createTime'
					},
					{
						title: '修改时间',
						key: 'updateTime'
					},
					{
                        title: '操作',
                        width: 200,
						render: (h, params) => {
                            return h('div', [
                                h('Icon', {
                                    props: {
                                        type: 'android-create',
										size: '14',
										itemHover: 'itemHover'
									},
									domProps: {
										innerHTML: '编辑'
									},
                                    style: {
										cursor: 'pointer',
										color: '#333333',
                                        marginRight: '25px'
									},
									class:{
										itemHover: true
									},
                                    nativeOn: {
                                        click: () => {
											this.queryLink(params.row.id);
											this.rowID = params.row.id;
											this.modal3 = true;
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
									domProps: {
										innerHTML: '删除'
									},
									class:{
										itemHover: true
									},
                                    nativeOn: {
                                        click: () => {
											// console.log(`该数据的ID:`+params.row.id)
											this.rowID = params.row.id;
											this.showModal1();
                                        }
                                    }
								})
                            ]);
                        }
                    }
                ]
            }
		},
		methods:{
			//获取当前业务接口列表
			getLinkListByPage(){
				if(this.interName.trim()){
					this.curr = 1;
				}
				this.$httpPost('knowledge/link/getLinkListByPage',{
					uid: this.ID*1,
					pageNum: this.curr,
					pageSize: this.pSize,
					linkName: this.interName.trim(),
					},(data) => {
					// console.log(data)
					this.tableData = data.data.data.list;
					this.totalNum = data.data.data.total;
					this.hasChooseNumLength = '';
					this.hasChooseNumIdList = [];
					this.$nextTick(()=>{
						if(this.pSize!=10){
							this.isNeedScroll = 600;
							this.place = 'top';
						}
						else{
							this.isNeedScroll = '';
							this.place = 'bottom';
						}
					})
				})
			},
			//查询单个业务接口
			queryLink(params){
				this.$httpPost('knowledge/link/queryLink',{
					id: params
				},(data) =>{
					// console.log(params)
					// console.log(data.data)
					this.formValidate.name = data.data.data.linkName;
					this.formValidate.url = data.data.data.callback;
					this.desc = data.data.data.linkDesc;
				})
			},
			//判断业务接口名是否合法
			checkLinkName(){
				this.$httpPost('knowledge/link/checkLinkName',{
					linkName: this.formValidate.name,
					userVersionId: this.rowID
				}, (data) => {
					console.log(data.data.msg)
					// console.log(data)
					if(data.data.status != 1000){
						let i = data.data.msg
					}
					else{}
				})
			},
			//显示批量删除对话框
			showModal2(){
				if(this.hasChooseNumLength == 0){

				}else{
					this.modal2 = true;
				}
			},
			//批量删除业务接口
			batchDelectLink(){
				this.$httpPost('knowledge/link/batchDeleteLink',{
					idList: this.hasChooseNumIdList
				},(data) => {
					this.$Message.success(data.data.msg);
				})
			},
			//显示删除单条对话框
			showModal1() {
				this.modal1 = true;
			},
			//删除单个业务接口
			deleteLink(){
				this.$httpPost('knowledge/link/deleteLink',{
					id: this.rowID
				},(data) => {
					this.$Message.success(data.data.msg);
					this.getLinkListByPage();
				})
			},
			//更新单个业务接口
			updateLink(name){
				let temp = {};
				temp.id = this.rowID;
				temp.callback = this.formValidate.url;
				temp.linkName = this.formValidate.name;
				temp.linkDesc = this.desc;
				// console.log(temp)
				this.$refs[name].validate((valid) => {
					if(valid){
						this.$httpPost('knowledge/link/updateLink',temp,(data) => {
							this.$Message.success(data.data.msg);
							this.getLinkListByPage();
						})
					}else{
						// this.$Message.error('更新失败')
					}
				})
			},
			changePage(page){
				this.curr = page;
				// let params = {};
				// params.pageNum = page;
				// params.pageSize = this.pSize;
				// params.linkName = this.interName;
				// console.log(params.pageNum)
				// console.log(params.pageSize)
				this.getLinkListByPage();
			},
			changePagesize(size){
				this.pSize = size;
				// let params = {};
				// params.pageNum = this.curr;
				// params.pageSize = size;
				// params.linkName = this.interName;
				// console.log(params.pageNum)
				// console.log(params.pageSize)
				this.getLinkListByPage();
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
			cancelEdit(){
				this.modal3 = false;
			}
		},
		mounted () {
			this.getLinkListByPage();
		},
    }
</script>
<style lang="less">
@import url("../../css/public.less");
.business{
	border: 1px solid #e1e1e1;
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
		border-bottom: none;
		color: #e62e29;
	}
	.ivu-modal-footer{
		border-top: none;
	}
	.ivu-table-wrapper{
		margin-bottom: 24px;
	}
}
.businessInterface{
	height: 100%;
	padding: 1.6% 1.6% 0 1.6%;
	.tableAction{
		margin: -76px 0 15px 0;
		text-align: right;
		.searchInput{
			width: 200px;
			.ivu-input{
				background: #fafafa;
			}
		}
		button{
			margin-left: 10px;
			height: 34px;
			width: 100px;
		}
		.createBusiness{
			background: #2d8cf0;
			color: #fff;
		}
	}
	.itemHover{
		&:before{
			margin-right: 10px;
		}
		&:hover{
			color: #2d8cf0!important;
		}
	}
	.ivu-table-wrapper{
		margin-top: 20px;
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
.editBusinessInter{
	position: fixed;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	background-color: rgba(55,55,55,0);
	height: 100%;
	z-index: 1000;
	.editBusinessItem{
		width: 40.6%;
		position: absolute;
		height: 80%;
		top: 124px;
		right: 20px;
		z-index: 999;
		border: 1px solid #e1e1e1;
		background: #fff;
		box-shadow: -2px 0 4px #eee;
		.modalTitle{
			height: 46px;
			text-align: center;
			position: relative;
			border-bottom: 1px solid #e1e1e1;
			margin-bottom: 40px;
			i{
				position: absolute;
				width: 38px;
				height: 38px;
				// float: left;
				left: -19px;
				top: 3px;
				background: url("../../img/closeIcon.png") no-repeat;
			}
			span{
				line-height: 46px;
			}
		}
		.ivu-form-item{
			padding-right: 100px;
			margin-bottom: 30px;
		}
		.formButtonItem{
			margin-top: 40px;
			button{
				width: 80px;
				height: 34px;
			}
			.cancelItem{
				color: #333;
				margin-right: 54px;
				border: 1px solid #e1e1e1;
			}
			.cancelItem:hover{
				background: #f1f1f1;
			}
		}
	}
}
</style>
