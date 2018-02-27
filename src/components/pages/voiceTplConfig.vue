<template>
<div class="voiceTpl hmain">
	<tabNav></tabNav>
	<div class="voiceTplConfig">
		<Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="240">
			<FormItem label="导航语语音模板" prop="navVoice">
				<Select
					placeholder="支持远程搜索"
					v-model.number="formValidate.navVoice"
					filterable
					remote
					:label="navLabel"
					:remote-method="remoteMethodNav"
					:loading="loading">
					<Option v-for="(option, index) in navOptions" :value="option.value" :key="index" :label="option.label">{{option.label}}</Option>
				</Select>
			</FormItem>
			<FormItem label="业务节点结束语语音模板" prop="endVoice">
				<Select
					placeholder="支持远程搜索"
					v-model="formValidate.endVoice"
					filterable
					remote
					:label="endLabel"
					:remote-method="remoteMethodEnd"
					:loading="loading">
					<Option v-for="(option, index) in endOptions" :value="option.value" :key="index" :label="option.label">{{option.label}}</Option>
				</Select>
			</FormItem>
			<FormItem label="欢迎语语音模板" prop="welcVoice">
				<Select
					placeholder="支持远程搜索"
					v-model="formValidate.welcVoice"
					filterable
					remote
					:label="welcLabel"
					:remote-method="remoteMethodWelc"
					:loading="loading">
					<Option v-for="(option, index) in welcOptions" :value="option.value" :key="index" :label="option.label">{{option.label}}</Option>
				</Select>
			</FormItem>
			<FormItem label="帮助语语音模板" prop="helpVoice">
				<Select
					placeholder="支持远程搜索"
					v-model="formValidate.helpVoice"
					filterable
					remote
					:label="helpLabel"
					:remote-method="remoteMethodHelp"
					:loading="loading">
					<Option v-for="(option, index) in helpOptions" :value="option.value" :key="index" :label="option.label">{{option.label}}</Option>
				</Select>
			</FormItem>
			<FormItem label="系统错误提示语模板" prop="sysErrVoice">
				<Select
					placeholder="支持远程搜索"
					v-model="formValidate.sysErrVoice"
					filterable
					remote
					:label="sysLabel"
					:remote-method="remoteMethodSys"
					:loading="loading">
					<Option v-for="(option, index) in sysOptions" :value="option.value" :key="index" :label="option.label">{{option.label}}</Option>
				</Select>
			</FormItem>
			<FormItem label="超时提示语列表">
				<remoteSearch @bindModel="outtime" :renderLabel="outLabel" :renderOptions="outOptions" :isLoading="loading" @remoteMethod="rMOut"></remoteSearch>
			</FormItem>
			<FormItem label="输入错误提示语列表">
				<remoteSearch @bindModel="enterErr" :renderLabel="enterLabel" :renderOptions="enterOptions" :isLoading="loading" @remoteMethod="iEOut"></remoteSearch>
			</FormItem>
			<!-- <FormItem label="系统错误提示语列表">
				<remoteSearch @bindModel="sysErr" :renderLabel="sysLabel" :renderOptions="sysOptions" :isLoading="loading" @remoteMethod="sEOut"></remoteSearch>
			</FormItem> -->
			<FormItem class="formButtonItem">
				<i-button class="cancelItem" type="ghost" @click="handleReset('formValidate')">重置</i-button><i-button class="saveItem" type="primary" @click="save('formValidate')">保存</i-button>
			</FormItem>
		</Form>
	</div>
</div>

</template>
<script>
    import tabNav from '@/components/common/tabNav'
	import remoteSearch from '@/components/common/remoteSearch'
    export default {
		components: {
			tabNav,
			remoteSearch
		},
        data () {
			const out = {};
            return {
				navLabel: '',
				endLabel: '',
				welcLabel: '',
				helpLabel: '',
				outLabel:[],
				enterLabel:[],
				sysLabel:'',
				ID: this.commonID,
				query: '',
                formValidate: {
					navVoice: '',// 导航
					endVoice: '',// 业务节点
					welcVoice: '',// 欢迎语
					helpVoice: '',//帮助语
					sysErrVoice: [],//系统错误
				},
				outtimeVoice: [],//超时
				enterErrVoice: [],//输入错误
				loading: false,
				navOptions: [],
				endOptions: [],
				welcOptions: [],
				helpOptions: [],
				outOptions: [],
				enterOptions: [],
				sysOptions: [],
				voiceTplArr: [],
                ruleValidate: {
                    navVoice: [
                        { required: true,type: 'number', message: '请选择导航语语音模板', trigger: 'change' }
					],
                    endVoice: [
                        { required: true,type: 'number', message: '请选择业务节点结束语语音模板', trigger: 'change' }
					],
                    welcVoice: [
                        { required: true,type: 'number', message: '请选择欢迎语语音模板', trigger: 'change' }
					],
                    helpVoice: [
                        { required: true,type: 'number', message: '请选择帮助语语音模板', trigger: 'change' }
					],
                    outtimeVoice: [
                        { required: true,type: 'array', message: '请选择超时提示语列表', trigger: 'change' }
					],
					enterErrVoice:[
						{required: true,type: 'array', message: '请选择输入错误提示语列表', trigger: 'change'}
					],
					sysErrVoice:[
						{required: true,type: 'number', message: '请选择系统错误提示语模板', trigger: 'change'}
					],
                    // sysVoiceList: [
                    //     { required: true, message: '请选择列表', trigger: 'change' }
					// ],
                    // identErrList: [
                    //     { required: true, message: '请选择列表', trigger: 'change' }
					// ],
                }
            }
        },
        methods: {
			rMOut(value) {
				this.remoteOut(value)
				// console.log(value);
			},
			iEOut(value) {
				this.remoteEnter(value)
				// console.log(value);
			},
			outtime(value){
				// console.log(value);
				this.outLabel = value;
			},
			enterErr(value){
				// console.log(value)
				this.enterLabel = value;
			},
			//查询一个用户版本的详细信息
			queryUsKnVer(){
				this.$httpPost('knowledge/globalConfig/queryUserKnowledgeVersion',{
					id: this.ID*1
				},(data)=>{
					let datas = data.data.data;
					this.$nextTick(()=>{
						this.formValidate.navVoice = datas.naviMediaIdWebResp.value;
						this.navLabel = datas.naviMediaIdWebResp.label;
						this.formValidate.endVoice = datas.businessFinishedMediaIdWebResp.value;
						this.endLabel = datas.businessFinishedMediaIdWebResp.label;
						this.formValidate.welcVoice = datas.welcomeMediaIdWebResp.value;
						this.welcLabel = datas.welcomeMediaIdWebResp.label;
						this.formValidate.helpVoice = datas.helpMediaIdWebResp.value;
						this.helpLabel = datas.helpMediaIdWebResp.label;
						this.formValidate.sysErrVoice = datas.systemErrorMediaIdWebResp.value;
						this.sysLabel = datas.systemErrorMediaIdWebResp.label;

						this.outtimeVoice = datas.timeoutMediaList;

						this.outLabel = datas.timeoutMediaListWebResp;

						this.enterErrVoice = datas.errorMediaList;

						this.enterLabel = datas.errorMediaListWebResp;
					})
				})
			},
			//查询语音模板列表
			getMediaTemplateListByPage(){
				this.$httpPost('knowledge/mediaTemplate/getMediaTemplateListByPage',{uid:this.ID*1},(data)=>{
					this.voiceTplArr = data.data.data.list;
				})
			},
			//更新用户版本的信息
			updateUserKnowledgeVersion(){
				console.log(this.formValidate.navVoice)
				let out = [];
				this.outLabel.forEach(i=>{
					out.push(i.value);
				})
				let enter = [];
				this.enterLabel.forEach(i=>{
					enter.push(i.value);
				})

				this.$httpPost('knowledge/globalConfig/updateUserKnowledgeVersion',{
					id:this.ID*1,
					naviMediaId: this.formValidate.navVoice,
					businessFinishedMediaId: this.formValidate.endVoice,
					welcomeMediaId: this.formValidate.welcVoice,
					helpMediaId: this.formValidate.helpVoice,
					systemErrorMediaId: this.formValidate.sysErrVoice,
					timeoutMediaList: out,
					errorMediaList: enter,
				},(data)=>{
					this.$Message.success(data.data.msg)
				})
			},
            save (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
						if(!this.outLabel||!this.enterLabel){
							console.log(this.outLabel,this.enterLabel)
                        	this.$Message.error('请将内容填写完整');
						}else{
							this.updateUserKnowledgeVersion();
						}
                    } else {
                        this.$Message.error('请检查填写的内容');
                    }
                })
            },
            handleReset (name) {
                this.$refs[name].resetFields();
				this.formValidate.sysErrVoice = '';
				this.outLabel = [];
				this.enterLabel = [];
			},
			remoteMethodNav (query) {
                if (query !== '') {
                    this.loading = true;
                    setTimeout(() => {
						this.loading = false;
                        let voiceTplArr = this.voiceTplArr.map(item => {
                            return {
                                value: item.id,
                                label: item.templateName,
                            };
                        });
                        this.navOptions = voiceTplArr.filter(item => item.label.indexOf(query.toLowerCase()) > -1);
                    }, 200);
                } else {
                    this.navOptions = [];
                }
            },
			remoteMethodEnd (query) {
                if (query !== '') {
                    this.loading = true;
                    setTimeout(() => {
                        this.loading = false;
                        let voiceTplArr = this.voiceTplArr.map(item => {
                            return {
                                value: item.id,
                                label: item.templateName,
                            };
                        });
                        this.endOptions = voiceTplArr.filter(item => item.label.indexOf(query.toLowerCase()) > -1);
                    }, 200);
                } else {
                    this.endOptions = [];
                }
            },
			remoteMethodWelc (query) {
                if (query !== '') {
                    this.loading = true;
                    setTimeout(() => {
                        this.loading = false;
                        let voiceTplArr = this.voiceTplArr.map(item => {
                            return {
                                value: item.id,
                                label: item.templateName,
                            };
						});
                        this.welcOptions = voiceTplArr.filter(item => item.label.indexOf(query.toLowerCase()) > -1);
                    }, 200);
                } else {
                    this.welcOptions = [];
                }
            },
			remoteMethodHelp (query) {
                if (query !== '') {
                    this.loading = true;
                    setTimeout(() => {
                        this.loading = false;
                        let voiceTplArr = this.voiceTplArr.map(item => {
                            return {
                                value: item.id,
                                label: item.templateName,
                            };
                        });
                        this.helpOptions = voiceTplArr.filter(item => item.label.indexOf(query.toLowerCase()) > -1);
                    }, 200);
                } else {
                    this.helpOptions = [];
                }
            },
			remoteMethodSys (query) {
                if (query !== '') {
                    this.loading = true;
                    setTimeout(() => {
                        this.loading = false;
                        let voiceTplArr = this.voiceTplArr.map(item => {
                            return {
                                value: item.id,
                                label: item.templateName,
                            };
                        });
                        this.sysOptions = voiceTplArr.filter(item => item.label.indexOf(query.toLowerCase()) > -1);
                    }, 200);
                } else {
                    this.sysOptions = [];
                }
            },
			remoteOut (query) {
                if (query !== '') {
                    this.loading = true;
                    setTimeout(() => {
                        this.loading = false;
                        let voiceTplArr = this.voiceTplArr.map(item => {
							return {
								value: item.id,
                                label: item.templateName,
                            };
                        });
						this.outOptions = voiceTplArr.filter(item => item.label.indexOf(query.toLowerCase()) > -1);
                    }, 200);
                } else {
                    this.outOptions = [];
				}
            },
			remoteEnter (query) {
                if (query !== '') {
                    this.loading = true;
                    setTimeout(() => {
                        this.loading = false;
                        let voiceTplArr = this.voiceTplArr.map(item => {
							return {
								value: item.id,
                                label: item.templateName,
                            };
                        });
						this.enterOptions = voiceTplArr.filter(item => item.label.indexOf(query.toLowerCase()) > -1);
                    }, 200);
                } else {
                    this.inputOptions = [];
				}
            },
			// remoteSys (query) {
            //     if (query !== '') {
            //         this.loading = true;
            //         setTimeout(() => {
            //             this.loading = false;
            //             let voiceTplArr = this.voiceTplArr.map(item => {
			// 				return {
			// 					value: item.id,
            //                     label: item.templateName,
            //                 };
            //             });
			// 			this.sysOptions = voiceTplArr.filter(item => item.label.indexOf(query.toLowerCase()) > -1);
            //         }, 200);
            //     } else {
            //         this.sysOptions = [];
			// 	}
            // },
        },
		created () {
			this.queryUsKnVer();
			// this.navOptions = [{
			// 	id:1949,
			// 	templateName: '的点点滴滴'
			// }]
			this.getMediaTemplateListByPage();
			// this.aaaa = '的点点滴滴';
		},
    }
</script>
<style lang="less">
@import url("../../css/public.less");
.voiceTpl{
	border: 1px solid #e1e1e1;
}
.voiceTplConfig{
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
				width: 420px;
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
	.ivu-select-multiple .ivu-select-input{
		color: #999;
	}
	.ivu-tag {
		color: #666;
		a {
			color: #666;
			&:hover {
				color: #666;
			}
		}
	}
}
</style>
