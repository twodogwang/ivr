<template>
	<div class="main-content">
		<div class="newTextVoiceCom-div-1">
			<Icon type="chevron-left" color="#4a8df1" size="16" @click.native="returnBack"></Icon>
			<span>新建语音模板-语音合成</span>
			<Icon type="ios-information" color="#999999" size="16"></Icon>
		</div>
		<div class="newTextVoiceCom-div-2">
			<span class="formWork newTextVoiceCom-div-span-1">
				<Form label-position="right" ref="formCustom" :model="formCustom" :label-width="150" :rules="ruleValidate">
					<FormItem label="语音模板名称" prop="templateName">
			        	<Input v-model="formCustom.templateName" placeholder="请输入语音模板名称"></Input>
			        </FormItem>
			        <FormItem label="接收输入方式" prop="inputType">
					    <RadioGroup v-model="formCustom.inputType">
					        <Radio :label="1">
					        	<span>语音输入</span>
					        </Radio>
					        <Radio :label="0">
					        	<span>按键输入</span>
					        </Radio>
					    </RadioGroup>
			        </FormItem>
			        <FormItem label="打断方式" prop="breakWay">
			            <Select placeholder="请选择" v-model="formCustom.breakWay">
			                <Option value="support">语音打断</Option>
			                <Option value="notSupport">按键打断</Option>
			            </Select>
			        </FormItem>
			        <FormItem label="语音设置" prop="uploadFile">
			        	<Upload @on-success="uploadFileSuccess" accept="audio/*" :format="['wav']" action="knowledge/mediaTemplate/uploadAudio">
			            	<Button type="ghost" class="uploadFile">上传语音</Button>
			            </Upload>
			            <!--<Button class="uploadFile" @click="paramSetClick">设置参数</Button>-->
			        </FormItem>
			        <FormItem label="语音参数" prop="param" class="paramInput">
			            <Input v-model="formCustom.param" v-on:input="inputFunc" placeholder="可添加多个参数，用逗号隔开" />
			            <ul class="inputList">
			            	<li>
			            		
			            	</li>
			            </ul>
			            <Button class="defaultButton" type="primary">完成</Button>
			            <ul class="paramUl" v-if="paramUl">
			            	<li>11111</li>
			            	<li>11111</li>
			            	<li>11111</li>
			            </ul>
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
			            <Button @click="returnBack" type="ghost" style="margin-left: 8px">取消</Button>
			            <Button class="defaultButton" type="primary" @click="addModuleTextCom('formCustom')">保存</Button>
			        </FormItem>
				</Form>
			</span>
			<span class="formWork newVoiceCom-div-span-2">
				<div class="newVoiceCom-div-span-2-div">
					<p>上传语音列表  + 参数</p>
					<!--<span v-for="items in formCustom.voiceLists">
						<Icon type="document-text" size="18" color="#999999"></Icon>
			            <b>{{items}}</b>
			            <Icon type="ios-checkmark-outline" size="18" color="#67c23a"></Icon>
			            <b class="formItemB">试听语音</b>
					</span>-->
					<div>
						<ul id="todoList">
							<li v-for="(key,index,item) in formCustom.voiceLists" :key="index">
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
		</div>
	</div>
</template>

<script>
	import Sortable from 'sortablejs';
	export default{
		data(){
			const templateName = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('语音模板名称不能为空'));
                }else if(value.length > 12){
                	callback(new Error('语音模板名称不能超过12个字符'));
                }else{
                	callback();
                }
            };
            const param = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('参数不能为空'));
                }else if(value.length > 20){
                	callback(new Error('参数不能超过20个字符'));
                }else{
                	callback();
                }
            };
			return{
//				receptionType: '',
				paramUl: false,
				voiceModule: false,
                ruleValidate: {
                	templateName: [
                        { required: true,validator: templateName, trigger: 'blur' }
                    ],
                    inputType: [
                        { required: true,type: 'number',message: '请选择接收方式', trigger: 'change' }
                    ],
                    breakWay: [
                        { required: true, message: '请选择打断方式', trigger: 'change' }
                    ],
                    param: [
                        { required: false,validator: param, trigger: 'blur' }
                    ],
                    uploadFile: [
                    	{ required: true, message: '请上传语音', trigger: 'blur' }
                    ]
                },
                formCustom: {
                    templateName: '',
                    inputType: null,
                    breakWay: '',
                    param: '',
                    voiceLists: ['191','192']
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
                actionList: ['挂机','反转','转人工']
			}
		},
		mounted: function(){
			this.$nextTick(function(){
				this.mounted();
			})
		},
		methods: {
			returnBack: function(){//返回上一页
				this.$router.back(-1);
			},
//			paramSetClick: function(){//设置参数
//				this.paramSet = true;
//			},
			addModuleTextCom: function(name){//添加语音模板
				this.$refs[name].validate((valid) => {
                    if (valid) {
						console.log();
                        this.addMediaTemplate(this.formCustom);
                    } else {
                        
                    }
                })
			},
			addMediaTemplate: function(datas){//添加语音模板通讯
				console.log(datas);
//				if()
				this.$httpPost('/ivrcms/mediaTemplate/addMediaTemplate',datas,function(data){
					console.log(data);
				})
			},
			uploadFileSuccess: function(response){
				var events = response.data.data;
				for(i in events){
					this.formCustom.voiceLists.push(i);
				};
			},
			inputFunc: function(val){
				console.log(val);
			},
			mounted: function(){//拖拽
		    	document.body.ondrop = function (event) {
		            event.preventDefault();
		            event.stopPropagation();
		        };
		        let vm = this;
		        let todoList = document.getElementById('todoList');
		        Sortable.create(todoList, {
		            group: {
		                name: 'list',
		                pull: true
		            },
		            animation: 120,
		            ghostClass: 'placeholder-style',
		            fallbackClass: 'iview-admin-cloned-item',
		            onRemove (event) {
		                vm.doArray.splice(event.newIndex, 0, vm.formDatas.mediaList[event.item.getAttribute('data-index')]);
		            }
		        });
		    },
		    playPauseClick: function(e){
		    	this.elementSpan = e.target.nextElementSibling.nextElementSibling.firstChild;
		    	this.elementText = e.target;
		    	e.target.nextElementSibling.nextElementSibling.style.display = 'block';
				var audio = document.getElementById('audioTag');
				//监听音频播放时间并更新进度条
		        audio.addEventListener('timeupdate',this.updateProgress,false);
		        //监听播放完成事件
		        audio.addEventListener('ended',this.audioEnded,false);
		        //改变暂停/播放icon
		        if(audio.paused){
		            audio.play();
		            e.target.innerHTML = '取消试听';
		        } else{
		            audio.pause();
		            e.target.innerHTML = '试听语音';
		        }
			},
			
			//更新进度条
			updateProgress: function() {
			    var audio =document.getElementsByTagName('audio')[0];
			    var value = Math.round((Math.floor(audio.currentTime) / Math.floor(audio.duration)) * 100, 0);
			    this.elementSpan.style.width = value*1 + '%'
			},
			//播放完成
			audioEnded: function() {
				this.elementText.innerHTML = '重新试听';
			},
		}
	}
</script>

<style lang="less">
	@import url("../../css/public.less");
	@import url("../../css/newTextVoiceCom.less");
</style>