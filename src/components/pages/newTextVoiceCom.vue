<template>
	<div class="main-content">
		<div class="newTextVoiceCom-div-1">
			<Icon type="chevron-left" color="#4a8df1" size="16" @click.native="returnBack"></Icon>
			<span>新建语音模板-文字合成</span>
			<Icon type="ios-information" color="#999999" size="16"></Icon>
		</div>
		<div class="newTextVoiceCom-div-2">
			<span class="formWork newTextVoiceCom-div-span-1">
				<Form label-position="right" ref="formCustom" :model="formCustom" :label-width="150" :rules="ruleValidate">
					<FormItem label="语音模板名称" prop="templateName">
			        	<Input v-model="formCustom.templateName" placeholder="请输入语音模板名称"></Input>
			        </FormItem>
			        <FormItem label="接收输入方式" prop="inputType">
			            <CheckboxGroup v-model="formCustom.inputType">
					        <Checkbox label="1">
					        	<span>语音输入</span>
					        </Checkbox>
					        <Checkbox label="2">
					        	<span>按键输入</span>
					        </Checkbox>
					    </CheckboxGroup>
			        </FormItem>
			        <FormItem label="打断方式" prop="breakWay">
			            <Select placeholder="请选择" v-model="formCustom.breakWay">
			                <Option value="1">不能打断</Option>
			                <Option value="4">语音打断</Option>
			                <Option value="2">按键打断</Option>
			                <Option value="6">语音和按键打断</Option>
			            </Select>
			        </FormItem>
			        <FormItem label="语音文字" prop="template">
			            <Input type="textarea" v-model="formCustom.template" :autosize="{minRows: 2,maxRows: 5}"></Input>
			        </FormItem>
			        <FormItem>
			            <Button @click="clickCompose()" class="defaultButton" type="primary">点击合成</Button>
			        </FormItem>
			        <FormItem v-if="voiceModule">
			            <Icon type="document-text" size="22" color="#999999"></Icon>
			            <b class="name">{{formCustom.templateName}}.wav</b>
			            <Icon type="ios-checkmark-outline" size="22" color="#67c23a"></Icon>
			            <b class="formItemB" @click="clickAudition" >试听语音</b>
			            <b>删除</b>
			        </FormItem>
			        <FormItem v-if="theAudio">
			        	<audio @ended="nextVoice" controls="controls" ref="audio"></audio>
			        </FormItem>
			        <FormItem>
			            <Button @click="returnBack" type="ghost" style="margin-left: 8px">取消</Button>
			            <Button class="defaultButton" type="primary" @click="addModuleTextCom('formCustom')">保存</Button>
			        </FormItem>
				</Form>
			</span>
			<span class="formWork newTextVoiceCom-div-span-2">
				<div>
					<p>帮助</p>
					<p>
						文字语音格式：尊敬的用户您好，您订购的套餐消费情况如下：从{beginDay<b>_DATE</b>}至{endDay<b>_DATE</b>}{currentMinute<b>_MINUTE</b>}，您订购的套餐情况如下：手机上网流量{flow<b>_FLOW</b>}，已使用{flowUsed<b>_FLOW</b>}；含上月剩余转结流量{flowLastMonthRe-main<b>_FLOW</b>}，已使用{flowLastMonthUsed<b>_FLOW</b>}；通话分钟{callTotleMinute<b>_NUMBER</b>}，已使用{callUsedMinute<b>_NUMBER</b>}分钟。套餐超出部分使用量将按相应套餐或标准资费收费。
					</p>
				</div>
			</span>
		</div>
	</div>
</template>

<script>
	export default{
		data(){
			const templateName = (rule, value, callback) => {
				console.log(value);
                if (value === '') {
                    callback(new Error('语音模板名称不能为空'));
                }else if(value.length > 12){
                	callback(new Error('语音模板名称不能超过12个字符'));	
                }else{
                	callback();
                }
            };
            const template = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('语音文字不能为空'));
                }else{
                	callback();	
                }
            };
			return{
				receptionType: '',
				voiceModule: false,
                ruleValidate: {
                	templateName: [
                        { required: true,validator: templateName, trigger: 'blur' }
                    ],
                    inputType: [
                        { required: true,type: 'array',message: '请选择接收方式', trigger: 'change' }
                    ],
                    breakWay: [
                        { required: true, message: '请选择打断方式', trigger: 'change' }
                    ],
                    template: [
                        { required: true,validator: template, trigger: 'blur' }
                    ],
                },
                formCustom: {
                    templateName: '',
                    inputType: [],
                    breakWay: '',
                    template: '',
                    mediaList: []
                },
                voiceList: [
                	{
                        value: '语音1',
                        label: '语音1'
                    },
                    {
                        value: '语音2',
                        label: '语音2'
                    },
                    {
                        value: '语音3',
                        label: '语音3'
                    }
                ],
                actionList: ['挂机','反转','转人工'],
                theAudio: false,
                returnVoiceList: []
			}
		},
		methods: {
			returnBack: function(){//返回上一页
				this.$router.back(-1);
			},
			addModuleTextCom: function(name){//保存添加的语音模板
				this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.addMediaTemplate(this.formCustom);
                    } else {
                        
                    }
                })
			},
			clickCompose: function(){//文本合成
				if(this.formCustom.template == ''){
					this.$refs.formCustom.validateField('template');
					return false;
				};
				var datas = {};
				datas.template = this.formCustom.template;
				var this_ = this;
				this.$httpPost('knowledge/mediaTemplate/textToAudio',datas,function(data){
					var events = data.data.data;
					console.log(events);
					for(i in events){
						this_.mediaList.push(i);
						this_.returnVoiceList.push(data[i]);
					};
					this_.voiceModule = true;
				})
			},
			addMediaTemplate: function(datas){//添加语音模板通讯
				console.log(datas);
				this.$httpPost('knowledge/mediaTemplate/addMediaTemplate',datas,function(data){
					console.log(data);
				})
			},
			clickAudition: function(){//试听语音
				this.theAudio = true;
				this.$nextTick(function(){
//					this.$refs.audio.$el.getAttribute('src') = this.returnVoiceList[0];
				})
			},
			nextVoice: function(){//连续播放语音
				
			}
		}
	}
</script>

<style lang="less">
	@import url("../../css/public.less");
	@import url("../../css/newTextVoiceCom.less");
</style>