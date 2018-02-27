<template>
	<div class="main-content">
		<tabNav></tabNav>
    	<div class="layout-breadcrumb">
            <Breadcrumb>
                <BreadcrumbItem href="/">用户版本</BreadcrumbItem>
                <BreadcrumbItem>节点配置</BreadcrumbItem>
            </Breadcrumb>
        </div>
        <div class="module nodeConfig_div_1">
        	<Select @on-change="typeChange" placeholder="参数类型" style="width:200px">
		        <Option value="null">全部节点类型</Option>
		        <Option value="1">指令节点</Option>
		        <Option value="3">业务节点</Option>
		        <Option value="5">语音交互节点</Option>
		        <Option value="6">按键交互节点</Option>
		    </Select>
        	<DatePicker @on-change="dateChange" type="daterange" placeholder="选择修改日期" format="yyyy-MM-dd" style="width: 200px"></DatePicker>
        	<Input @on-enter="getAllNodeListByPage" @on-click="getAllNodeListByPage" v-model="datas.name" icon="search" placeholder="请输入名称" style="width: 200px"></Input>
        </div>
        <div class="module nodeConfig_div_3">
        	<Table :height="height" border :columns="columnsV" :data="dataV"></Table>
        </div>
        <div class="module nodeConfig_div_2">
    		<span v-if="deletedList" class="remove">
    			<b>已选择</b><b class="count">5</b><b>条</b>
    			<Button>删除</Button>
    		</span>
    		<Page @on-page-size-change="thisEveryPageCount" @on-change="thisCurrentPage" :placement="place" :total="pagesV" show-total show-elevator show-sizer :page-size="pageCountV"></Page>
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
			return{
				datas: {
					name: null,
					createTimeFromString: null,
					createTimeToString: null,
//					updateTimeFromString: null,
//					updateTimeToString: null,
//					orderBy: null,
//					descOrAsc: null,
					type: null,
				},
				deletedList: false,
				pagesV: null,
                currentPageV: 1,
                pageCountV: 10,
                checkedId: [],
                columnsV: [
                	{
                		title: '名称',
                		key: 'name'
                	},
                	{
                		title: '类型',
                		key: 'type'
                	},
                	{
                		title: '创建日期',
                		key: 'createTime',
                		"sortable": true,
                	},
                	{
                		title: '修改日期',
                		key: 'updateTime',
                		"sortable": true,
                	}
                ],
                dataV: [],
                height: '',
                place: 'top',
			}
		},
		mounted: function(){
			this.getAllNodeListByPage();
		},
		methods: {
			thisCurrentPage: function(page){//当前页
				this.currentPageV = page;
				this.getAllNodeListByPage();
			},
			thisEveryPageCount: function(count){//每页的条数
				this.pageCountV = count;
				this.getAllNodeListByPage();
			},
			getAllNodeListByPage: function(){//总览
				this.datas.pageNum = this.currentPageV;
				this.datas.pageSize = this.pageCountV;
				this.datas.vUserId = this.commonID;
				if(this.datas.name == ""){
					this.datas.name = null;
				}
				var this_ = this;
				this.$httpPost('knowledge/node/getAllNodeListByPage',this.datas,function(data){
					this_.dataV = data.data.data.list;
					for(var i=0;i<this_.dataV.length;i++){
						if(this_.dataV[i].type == 1){
							this_.dataV[i].type = "root";
						}else if(this_.dataV[i].type == 2){
							this_.dataV[i].type = "全局";
						}else if(this_.dataV[i].type == 3){
							this_.dataV[i].type = "业务";
						}else if(this_.dataV[i].type == 4){
							this_.dataV[i].type = "参数";
						}else if(this_.dataV[i].type == 5){
							this_.dataV[i].type = "交互（预测器）";
						}else if(this_.dataV[i].type == 6){
							this_.dataV[i].type = "交互（无预测器）";
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
					// if(document.querySelector('.ivu-table-body').offsetHeight > 600){
					// 	this.height = 600;
					// 	this.place = 'top';
					// }else if(document.querySelector('.ivu-table-body').offsetHeight < 600 ){
					// 	if(document.querySelector('.ivu-table-body').offsetHeight == 550){
					// 		this.height = 600;
					// 		this.place = 'top';
					// 	}else{
					// 		this.height = null;
					// 		this.place = 'bottom';
					// 	}
					// }
					if(this.pageCountV!=10){
						this.height = 550;
						this.place = 'top';
					}
					else{
						this.height = '';
						this.place = 'top';
					}
				})
			},
			dateChange: function(val){
				if(val[0] == "" & val[1] == undefined){
					this.datas.updateTimeFromString = null;
					this.datas.updateTimeToString = null;
				}else{
	            	this.datas.updateTimeFromString = val[0] + " " + "00:00:00";
	            	this.datas.updateTimeToString = val[1] + " " + "00:00:00";
				}
				this.getAllNodeListByPage();
			},
			typeChange: function(val){
				this.datas.type = val;
                this.currentPageV = 1;
				this.getAllNodeListByPage();
			}
		}
	}
</script>

<style lang="less">
@import url("../../css/public.less");
@import url("../../css/nodeConfig.less");
</style>
