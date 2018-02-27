<template>
	<Row class="createVersion hmain">
		<Col span="18" class="createNewVersion">
		<p class="pageTitle"><router-link to="/"><Icon type="chevron-left"></Icon></router-link>新建用户模板</p>
			<Steps :current="current">
				<Step title="基本信息"></Step>
				<Step title="启用规则"></Step>
				<Step title="创建完成"></Step>
			</Steps>
			<div v-if="isShow?current==0:current!=0">
				<Form :label-width="240" ref="formValidate" :model="formValidate" :rules="ruleValidate">
					<FormItem label="模板名" prop="name">
						<Input type="text" placeholder="模板名不能超过12字符" v-model="formValidate.name" :maxlength="12"></Input>
					</FormItem>
					<FormItem label="所属模板" prop="version">
						<Select placeholder="所属模板" class="belongVerInput" v-model="formValidate.version" @on-change="changeBelong">
							<Option v-for="item in baseData" :value="item.id" :key="item.id">{{item.knowledgeName}}</Option>
							<!-- <Option value="1">基础版本一</Option>
							<Option value="2">基础版本二</Option> -->
						</Select><Tooltip content="提示内容">
							<Icon class="viewTpl" type="information-circled" color="#999" size="14" />
						</Tooltip>
						<!-- <i-button @click="viewTpl" type="info" >查看模板</i-button> -->
					</FormItem>
					<FormItem label="用户模板是否启用">
						<Switch size="large" v-model="isRun" :true-value="1" :false-value="2">
							<span slot="open">启用</span>
							<span slot="close">停用</span>
						</Switch>
					</FormItem>
					<FormItem label="模板描述">
						<Input type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="输入描述用句，检索关键词等（非必填）" v-model="versionDescribe" :maxlength="120"></Input>
					</FormItem>
					<FormItem class="formButtonItem">
						<Button type="ghost" class="cancelItem" @click="cancel">取消</Button><Button type="primary" class="saveItem" @click="next('formValidate')">下一步</Button>
					</FormItem>
				</Form>
			</div>
			<div v-if="isShow?current==1:current!=1" class="time">
			<Form :label-width="240" ref="formCustom" :model="formCustom" :rules="ruleCustom">
				<FormItem label="用户等级" prop="userLvl">
					<CheckboxGroup v-model="formCustom.userLvl">
						<Checkbox label="1">一星</Checkbox>
						<Checkbox label="2">二星</Checkbox>
						<Checkbox label="3">三星</Checkbox>
						<Checkbox label="4">四星</Checkbox>
						<Checkbox label="5">五星</Checkbox>
						<Checkbox label="6">六星</Checkbox>
						<Checkbox label="7">七星</Checkbox>
					</CheckboxGroup>
				</FormItem>
				<FormItem label="模板运行日期">
					<DatePicker type="daterange" :options="cantPick" placeholder="选择日期" format="yyyy-MM-dd" v-model="runDate" @on-change="getVersionRunDate"></DatePicker>
				</FormItem>
				<FormItem label="模板运行时段">
					<TimePicker type="timerange" placeholder="每天运行的时段" format="HH:mm:ss" v-model="runTime" @on-change="getVersionRunTime"></TimePicker>
				</FormItem>
				<FormItem class="formButtonItem">
					<Button type="ghost" class="cancelItem" @click="cancel">取消
						</Button><Button type="info" class="preItem" @click="pre">上一步
						</Button><Button type="primary" class="saveItem" @click="nextStep('formCustom')" :disabled="isClickCreate?true:false">确认创建</Button>
				</FormItem>
			</Form>
		</div>
		<div v-if="isShow?current==2:current!=2">
			<h2 class="createComplete">创建完成!</h2>
			<div class="formButtonItem complete">
				<i-button type="primary" class="turnVersion" @click="turnVersion">返回用户模板</i-button><i-button type="primary" class="globalNode" @click="globalNode">全局节点配置</i-button>
			</div>
		</div>
		</Col>
		<Col span="5" class="helpText">
			<p class="helpTitle">帮助</p>
			<p class="helpTxt">
				请按照步骤填写所需内容
			</p>
		</Col>
	</Row>
</template>
<script>
    export default {
        data () {
			const name = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('版本名不能为空'));
				}else if(value.replace(/\s/g,"") == ""){
					callback(new Error('版本名不能为空'));
				}else{
					callback()
				}
			};
            return {
				baseData: [],
				isShow: true,
				current: 0,
				isRun: 1,
				versionDescribe: '',
				runDate: '',//v-model绑定用
				runTime: '',
				runDate0: '',//起始日期
				runDate1: '',//结束日期
				runTime0: '',//起始时间
				runTime1: '',//结束时间
				cantPick: {
					disabledDate (date) {
                        return date && date.valueOf() < Date.now() - 86400000;
                    }
				},
				isClickCreate: false,
				versionStartDatetime: '',
				versionEndDatetime: '',
				formValidate: {
					version: null,
					name: ''
				},
				formCustom: {
					userLvl: [],
				},
				ruleValidate: {
					version: [
						{required: true, type: 'number', message: '请选择一个模板', trigger: 'change'}
					],
					name: [
						{required: true, validator:name, trigger: 'blur'}
					]
				},
				ruleCustom: {
					userLvl: [
						{required: true, type: 'array', min: 1, message: '请至少选择一种用户等级', trigger: 'change'}
					],
					// runDate: [
                    //     {required: true, message: '请选择运行日期', trigger: 'blur' }
                    // ],
                    // runTime: [
                    //     {required: true, message: '请选择运行时段', trigger: 'blur' }
                    // ],
				}
            }
        },
        methods: {
			//查询当前的基础版本
			getSpKnVerList(){
				this.$httpGet('knowledge/version/getSpKnVerList',{},(data) => {
					this.baseData = data.data.data;
				})
			},
			//改变所属版本
			changeBelong(value){
				this.formValidate.version = value;
				// console.log(value)
			},
			//拷贝基础版本 创建新用户版本
			addUsKnVer(){
				// let userLvl = '';
				// this.formCustom.userLvl.map(item=>{
				// 	userLvl+='"'+item.toString()+'",';
				// 	return userLvl;
				// })
				// userLvl = userLvl.split(',');
				// userLvl = userLvl.slice(0,userLvl.length-1);
				// userLvl = '['+userLvl+']';
				this.isClickCreate = true;
				this.$httpPost('knowledge/version/addUsKnVer',{
					sid:this.formValidate.version*1,
					vname:this.formValidate.name,
					knowledgeEnable:this.isRun,
					userKnowledgeDesc:this.versionDescribe,
					fromDateString: this.runDate0,
					toDateString: this.runDate1,
					fromTimeString: this.runTime0,
					toTimeString: this.runTime1,
					rule:this.formCustom.userLvl},(data)=>{
						this.$Message.success(data.data.msg);
						this.current += 1;
					})
			},
            next (name) {
				this.$refs[name].validate((valid) => {
					if (valid) {
						this.current += 1;
                    } else {
						console.log(typeof this.formValidate.version)
                        this.$Message.error('请将内容填写完整');
                    }
				})
			},
            nextStep (name) {
				console.log('start')
				let this_ = this;
				this.$refs[name].validate((valid) => {
					if (valid) {
						if(this_.runDate.length==0||this_.runTime[0]==''||this_.runDate[0]==''||this_.runDate[0]==null||this_.runTime==''){
							this.$Message.error('请填写相关内容');
							console.log('asdadasdasd')
						}else{
							this_.addUsKnVer()
							console.log('1312312')
						}
                    } else {
						this.$Message.error('请将内容填写完整');
						console.log('sda123123adsd')
                    }
				})
			},
			pre(){
				this.current -= 1;
			},
			cancel(){
				this.$router.push({name:"customVersion"})
			},
			getVersionRunDate(value){
				this.runDate0 = value[0];
				this.runDate1 = value[1];
				this.versionStartDatetime = this.runDate0 +' '+ this.runTime0;
				this.versionEndDatetime = this.runDate1 +' '+ this.runTime1;
				// console.log(value[0])
			},
			getVersionRunTime(value){
				this.runTime0 = value[0];
				this.runTime1 = value[1];
				this.versionStartDatetime = this.runDate0 +' '+ this.runTime0;
				this.versionEndDatetime = this.runDate1 +' '+ this.runTime1;
				// console.log(this.versionStartDatetime);
			},
			turnVersion(){
				this.$router.push({name:'customVersion'})
			},
			globalNode(){
				this.$router.push({name:'basicConfig'})
			}
		},
		mounted () {
			this.getSpKnVerList()
		}
    }
</script>
<style lang="less">
@import url("../../css/public.less");
.createVersion{
	background: #f0f0f0;
	border: none;
	.createNewVersion,.helpText{
		border: 1px solid #e1e1e1;
	}
	.createNewVersion{
		height: 100%;
		padding: 20px 20px 0 20px;
		background: #fff;
		.pageTitle{
			margin: 14px 0 0 0;
			padding-bottom: 14px;
			font-size: 16px;
			border-bottom: 1px solid #d7d7d7;
			.ivu-icon{
				margin-right: 12px;
			}
		}
		.belongVerInput{
			width: 120px;
		}
		.ivu-steps{
			margin: 58px 38% 110px 13%;
			.ivu-steps-title{
				margin-bottom: 0;
				margin-top: 4px;
			}
		}
		.viewTpl{
			margin-left: 10px;
		}
		.ivu-form{
			padding: 0 5%;
			.ivu-form-item-label{
				font-size: 14px;
				color: #333;
			}
		}
		.ivu-form-item{
			margin-bottom: 30px;
			.ivu-form-item-content{
				width: 420px;
				.ivu-date-picker{
					width: 420px;
				}
			}
		}
		.time{
			.ivu-form-item-label{
				&::before{
					content: '*';
					display: inline-block;
					margin-right: 4px;
					line-height: 1;
					font-family: SimSun;
					font-size: 12px;
					color: #ed3f14;
				}
			}
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
			.preItem{
				margin-right: 60px;
			}
			.turnVersion,.globalNode{
				width: 110px;
				margin: 0;
			}
			.turnVersion{
				margin-right: 80px;
			}
		}
		.createComplete{
			padding: 0 0 98px 0;
			text-align: center;
			color: #5c99f2;
		}
		.complete{
			text-align: center;
		}
	}
	.helpText{
		min-height: 400px;
		// height: 100%;
		background: #fff;
		// padding: 14px 10px 52px 36px;
		margin-left: 30px;
		.helpTitle{
			font-size: 14px;
			padding: 35px 10px 20px 26px;
			border-bottom: 1px dashed #d1d1d1;
		}
		.helpTxt{
			padding: 38px 36px 036px;
			// margin-top: 30px;
			font-size: 14px;
			color: #999;
		}
	}
}

</style>
