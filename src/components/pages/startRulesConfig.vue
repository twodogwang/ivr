<template>
<div class="startRules hmain">
	<tabNav></tabNav>
	<div class="startRulesConfig">
		<Form ref="formCustom" :model="formCustom" :rules="ruleCustom" :label-width="240">
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
			<FormItem label="版本运行时间">
				<DatePicker type="daterange" :options="cantPick" placeholder="选择时间" format="yyyy-MM-dd" v-model="runDate" @on-change="getVersionRunDate"></DatePicker>
			</FormItem>
			<FormItem label="版本运行时段">
				<TimePicker type="timerange" placeholder="每天运行的时段" format="HH:mm:ss" v-model="runTime" @on-change="getVersionRunTime"></TimePicker>
			</FormItem>
			<FormItem class="formButtonItem">
				<i-button class="cancelItem" type="ghost" @click="handleReset('formCustom')">重置</i-button><i-button class="saveItem" type="primary" @click="save('formCustom')">保存</i-button>
			</FormItem>
		</Form>
	</div>
</div>

</template>
<script>
    import tabNav from '@/components/common/tabNav'
	export default{
		components:{
		    tabNav
		},
        data () {
            return {
				ID: this.commonID,
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
				versionStartDatetime: '',
				versionEndDatetime: '',
                formCustom: {
					userLvl: [],
				},
				ruleCustom: {
                    userLvl: [
						{required: true, type: 'array', min: 1, message: '请至少选择一种用户', trigger: 'change'}
					],
					// versionStartDatetime: [
                    //     {required: true, message: '请选择运行日期', trigger: 'blur' }
                    // ],
                    // versionEndDatetime: [
                    //     {required: true, message: '请选择运行时段', trigger: 'blur' }
                    // ],
                }
            }
        },
        methods: {
			//查询用户模板启用规则
			queryRuleByVersionId(){
				this.$httpPost('knowledge/globalConfig/queryRuleByVersionId',{
					userVersionId:this.ID*1
				},(data)=>{
					let datas = data.data.data;
					this.formCustom.userLvl = datas.rule;
					// let startDateTemp = datas.createTime.split(' ');
					// let endDateTemp = datas.updateTime.split(' ');
					this.runDate = [datas.fromDate,datas.toDate];
					this.runTime = [datas.fromTime,datas.toTime];
					this.runDate0 = datas.fromDate;
					this.runDate1 = datas.toDate;
					this.runTime0 = datas.fromTime;
					this.runTime1 = datas.toTime;
					// console.log(dateTemp)
				})
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
				// console.log(this.formCustom.versionStartDatetime);
			},
			updateUserKnowledgeRule(){
				this.$httpPost('knowledge/globalConfig/updateUserKnowledgeRule',{
					vUserId: this.ID*1,
					rule: this.formCustom.userLvl,
					fromDateString: this.runDate0,
					toDateString: this.runDate1,
					fromTimeString: this.runTime0,
					toTimeString: this.runTime1,
				},(data)=>{
					console.log(data);
					this.$Message.success('保存成功')
				})
			},
			save (name) {
				let this_ = this;
				this.$refs[name].validate((valid) => {
					if (valid) {
						if(this_.runDate.length==0||this_.runTime[0]==''||this_.runDate[0]==''||this_.runDate[0]==null||this_.runTime==''){
							this.$Message.error('请填写相关内容');
						}else{
							this.updateUserKnowledgeRule();
						}
                    } else {
                        this.$Message.error('请将内容填写完整');
                    }
				})
			},
            handleReset (name) {
				this.runDate = '';
				this.runTime = '';
                this.$refs[name].resetFields();
			},
		},
		mounted () {
			this.queryRuleByVersionId();
		}
    }
</script>
<style lang="less">
@import url("../../css/public.less");
.startRules{
	border: 1px solid #e1e1e1;
}
.startRulesConfig{
	height: 100%;
	padding: 40px 1.6% 0 1.6%;
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
	.ivu-form{
		.ivu-form-item-label{
			font-size: 14px;
			color: #333;
		}
		.ivu-form-item{
			margin-bottom: 30px;
			.ivu-form-item-content{
				width: 440px;
				.ivu-date-picker{
					width: 400px;
				}
			}
		}
	}
	.inputSecond{
		padding-left: 8px;
	}
	.formButtonItem{
		margin-top: 40px;
		button{
			width: 80px;
			height: 34px;
		}
		.cancelItem{
			color: #333;
			margin-right: 60px;
			border: 1px solid #e1e1e1;
		}
		.cancelItem:hover{
			background: #f1f1f1;
		}
	}
	.ivu-radio-wrapper{
		margin-right: 28px;
			.ivu-radio{
			margin-right: 18px;
		}
	}
}
</style>
