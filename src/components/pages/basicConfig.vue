<template>
 <div class="basic hmain">
	<tabNav></tabNav>
	<div class="basicConfig">
		<Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="240">
			<FormItem label="用户版本名" prop="name">
				<Input v-model="formValidate.name" placeholder="请输入版本名称" :maxlength="12"></Input>
			</FormItem>
			<FormItem label="所属模板名称">
				<Select placeholder="请选择模板类型" :disabled="true" v-model="belongTplID">
					<Option v-for='item in belongTplOptions' :value="item.id" :key="item.id">{{item.knowledgeName}}</Option>
				</Select>
			</FormItem>
			<FormItem label="用户版本描述">
				<Input type="textarea" :autosize="{minRows: 2,maxRows: 5}" v-model="versionDesc" :maxlength="120"></Input>
			</FormItem>
			<FormItem label="超时时间间隔" prop="time">
				<InputNumber v-model="formValidate.time" placeholder="0-255s(默认10s)" value="formValidate.time" class="outtimeInput" :min="0" :max="255"></InputNumber><span class="inputSecond">秒</span>
			</FormItem>
			<FormItem label="错误上限动作" prop="mistake">
				<RadioGroup v-model="formValidate.mistake">
					<Radio label="1" value="1">挂机</Radio><Radio label="2">反转</Radio><Radio label="3">转人工</Radio>
				</RadioGroup>
			</FormItem>
			<FormItem label="超时上限动作" prop="outtime">
				<RadioGroup v-model="formValidate.outtime">
					<Radio label="1">挂机</Radio><Radio label="2">反转</Radio><Radio label="3">转人工</Radio>
				</RadioGroup>
			</FormItem>
			<FormItem label="前置判断调用接口" prop="interface">
				<!-- <Select v-model="formValidate.interface" placeholder="请选择调用接口">
					<Option value="beijing">接口1</Option>
					<Option value="shanghai">模板2</Option>
					<Option value="shenzhen">模板3</Option>
				</Select> -->
				<!-- <Select
					placeholder="请选择调用接口"
					v-model="formValidate.interface"
					filterable
					remote
					:remote-method="remoteMethod3"
					:loading="bILoading">
					<Option v-for="(option, index) in businessInterfaceOptions" :value="option.value" :key="index">{{option.label}}</Option>
				</Select> -->
				<Input v-model="formValidate.interface" placeholder="请填写调用接口" :disabled="true" class="preLink"></Input>
			</FormItem>
			<FormItem class="formButtonItem">
				<i-button class="cancelItem" type="ghost" @click="handleReset('formValidate')">重置</i-button><i-button class="saveItem" type="primary" @click="save('formValidate')">保存</i-button>
			</FormItem>
		</Form>
	</div>
</div>

</template>
<script>
	import tabNav from '@/components/common/tabNav'
    export default {
		components: {
			tabNav
		},
        data () {
			const name = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('用户版本名不能为空'));
				}else if(value.replace(/\s/g,"") == ""){
					callback(new Error('用户版本名不能为空'));
				}else{
					callback()
				}
			};
			const preinterface = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请填写调用接口'));
				}else if(value.replace(/\s/g,"") == ""){
					callback(new Error('请填写调用接口'));
				}else{
					callback()
				}
			};
            return {
				ID: this.commonID,
				belongTplID: '',//所属模板ID
				belongTplOptions: '',//所属模板options
				versionDesc: '',
                formValidate: {
					name: '',
					time: 10,
					mistake: '',
					outtime: '',
					interface: ''
				},
				ruleValidate: {
                    name: [
                        { required: true, validator:name , trigger: 'blur' }
					],
                    type: [
                        { required: true, message: '请选择模板类型', trigger: 'change' }
                    ],
                    mistake: [
                        { required: true, message: '请选择错误上限动作', trigger: 'change' }
                    ],
                    outtime: [
                        { required: true, message: '请选择超时上限动作', trigger: 'change' }
                    ],
                    interface: [
                        { required: true, validator: preinterface, trigger: 'blur' }
                    ]
                },
				bILoading: false,
				businessInterfaceOptions: [],
				businessInterfaceArr: [],
            }
        },
        methods: {
			//查询当前的基础模板
			getSpKnVerList(){
				this.$httpGet('knowledge/version/getSpKnVerList',{},(data) => {
					this.belongTplOptions = data.data.data;
					// console.log(data.data.data)
				})
			},
			//获取当前业务接口列表
			getLinkListByPage(){
				this.$httpPost('knowledge/link/getLinkListByPage',{
					uid: this.ID*1
					},(data) => {
					data.data.data.list.forEach(e=>{
						this.businessInterfaceArr.push(e.linkName);
					});
				})
			},
			//查询一个用户版本的详细信息
			queryUsKnVer(){
				this.$httpPost('knowledge/globalConfig/queryUserKnowledgeVersion',{
					id: this.ID*1
				},(data)=>{
					// this.$Message.info(data.data.msg)
					let datas = data.data.data;
					this.belongTplID = datas.sid;
					this.formValidate.name = datas.vname;
					this.formValidate.time = datas.timeoutInterval;
					this.versionDesc = datas.userKnowledgeDesc;
					this.formValidate.interface = datas.preLinkHeaderName;
					this.formValidate.mistake = datas.maxErrorAction.toString();
					this.formValidate.outtime = datas.maxTimeoutAction.toString();
				})
			},
			//更新用户版本的信息
			updateUserKnowledgeVersion(){
				this.$httpPost('knowledge/globalConfig/updateUserKnowledgeVersion',{
					id:this.ID*1,
					vname: this.formValidate.name,
					userKnowledgeDesc: this.versionDesc,
					timeoutInterval: this.formValidate.time,
					maxErrorAction: this.formValidate.mistake*1,
					maxTimeoutAction: this.formValidate.outtime*1,
					preLinkHeaderName: this.formValidate.interface},(data)=>{
						this.$Message.success(data.data.msg)
					})
			},
            save (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
						// this.$Message.success('Success!');
						this.updateUserKnowledgeVersion();
                    } else {
						this.$Message.error('请检查输入的内容');
                    }
                })
            },
            handleReset (name) {
				this.$refs[name].resetFields();
				this.formValidate.time = this.formValidate.time;
				this.versionDesc = '';
			},
			remoteMethod3 (query) {
                if (query !== '') {
                    this.bILoading = true;
                    setTimeout(() => {
                        this.bILoading = false;
                        let businessInterfaceArr = this.businessInterfaceArr.map(item => {
                            return {
                                value: item,//可能需要改成业务接口id 用来双向绑定
                                label: item,
                            };
                        });
                        this.businessInterfaceOptions = businessInterfaceArr.filter(item => item.label.toLowerCase().indexOf(query.toLowerCase()) > -1);
                    }, 200);
                } else {
                    this.businessInterfaceOptions = [];
                }
            }
        },
		created () {
			this.queryUsKnVer();
			this.getSpKnVerList();
			this.getLinkListByPage();
		}
    }
</script>
<style lang="less">
@import url("../../css/public.less");
.basic{
	border: 1px solid #e1e1e1;
}
.basicConfig{
	height: 100%;
	padding: 40px 1.6% 0 1.6%;
	.ivu-form {
		.ivu-form-item-label{
			font-size: 14px;
			color: #333;
		}
		.ivu-form-item{
			margin-bottom: 30px;
			.ivu-form-item-content{
				width: 400px;
			}
		}
	}
	.outtimeInput{
		border-radius: 2px;
		width: 150px;
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
	.preLink{
		input{
			color: #333!important;
		}
	}
}
</style>
