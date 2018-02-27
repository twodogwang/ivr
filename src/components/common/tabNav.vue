<template>
	<div>
		<Tabs type="card" :value="$store.state.name" @on-click="clickThisTab">
	        <TabPane label="全局配置" :name="$store.state.nameS" ref="pane2" class="pane2">
	        	<Tabs :value="$store.state.nameS" @on-click="turnUrlS" class="subTabNav-1" v-if="subNavBase">
			        <TabPane label="基本配置表" name="basicConfig"></TabPane>
			        <TabPane label="语音模板配置表" name="voiceTplConfig"></TabPane>
			        <TabPane label="启动规则配置" name="startRulesConfig"></TabPane>
			    </Tabs>
	        </TabPane>
	        <TabPane label="节点配置" :name="$store.state.count" ref="pane3" class="pane3">
	        	<Tabs :value="$store.state.count" @on-click="turnUrl" class="subTabNav-2" v-if="subNavNode">
			        <TabPane label="总览" name="nodeConfig"></TabPane>
			        <TabPane label="指令节点" name="instructionNode"></TabPane>
			        <TabPane label="业务节点" name="businessNode"></TabPane>
			        <TabPane label="语音交互节点" name="speedInterNode"></TabPane>
			        <TabPane label="按键交互节点" name="keypadInterNode"></TabPane>
			    </Tabs>
	        </TabPane>
	        <TabPane label="语音模板" name="phonetics" class="pane1"></TabPane>
	        <TabPane label="业务接口" name="businessInterface" class="pane1"></TabPane>
	    </Tabs>
    </div>
</template>

<script>
	export default{
		name: 'app',
		data(){
			return{
				subName: '',
				tabName: '',
				subNameS: '',
				subNavBase: false,
				subNavNode: false,
			}
		},
		created: function(){
			var url = window.location.hash;
			if(url == '#/global/basic'){
				this.$store.state.name = 'basicConfig';
				this.$store.state.nameS = 'basicConfig';
    			document.getElementsByClassName('ivu-tabs-tab-active')[0].style.borderLeft = 'none';
			}else if(url == '#/global/voicetpl'){
				this.$store.state.name = 'voiceTplConfig';
				this.$store.state.nameS = 'voiceTplConfig';
    			document.getElementsByClassName('ivu-tabs-tab-active')[0].style.borderLeft = 'none';
			}else if(url == '#/global/startrules'){
				this.$store.state.name = 'startRulesConfig';
				this.$store.state.nameS = 'startRulesConfig';
    			document.getElementsByClassName('ivu-tabs-tab-active')[0].style.borderLeft = 'none';
			}
		},
        mounted: function(){
        	this.$nextTick(function(){
				var url = window.location.hash;
				console.log(url);
				if(url == "#/businessNode/paramNode"){
					this.$store.state.name = 'businessNode';
					this.$store.state.count = 'businessNode';
				}else if(url == '#/phonetics'){
					this.$store.state.name = 'phonetics';
				}else if(url == '#/global/basic'){
					this.$store.state.name = 'basicConfig';
					this.$store.state.nameS = 'basicConfig';
        			document.getElementsByClassName('ivu-tabs-tab-active')[0].style.borderLeft = 'none';
				}else if(url == '#/global/voicetpl'){
					this.$store.state.name = 'voiceTplConfig';
					this.$store.state.nameS = 'voiceTplConfig';
        			document.getElementsByClassName('ivu-tabs-tab-active')[0].style.borderLeft = 'none';
				}else if(url == '#/global/startrules'){
					this.$store.state.name = 'startRulesConfig';
					this.$store.state.nameS = 'startRulesConfig';
        			document.getElementsByClassName('ivu-tabs-tab-active')[0].style.borderLeft = 'none';
				}else if(url == '#/business'){
					this.$store.state.name = 'businessInterface';
				}else if(url == '#/nodeConfig'){
					this.$store.state.name = 'nodeConfig';
					this.$store.state.count = 'nodeConfig';
				}else if(url == '#/instructionNode'){
					this.$store.state.name = 'instructionNode';
					this.$store.state.count = 'instructionNode';
				}else if(url == '#/businessNode'){
					this.$store.state.name = 'businessNode';
					this.$store.state.count = 'businessNode';
				}else if(url == '#/speedInterNode'){
					this.$store.state.name = 'speedInterNode';
					this.$store.state.count = 'speedInterNode';
				}else if(url == '#/keypadInterNode'){
					this.$store.state.name = 'keypadInterNode';
					this.$store.state.count = 'keypadInterNode';
				}
        		this.tabName = this.$store.state.name;
        		var name = this.tabName;
	            this.judgmentName(name);
				this.paneStyle();
        	})
        },
		methods: {
			turnUrl: function(name){
	        	this.subName = name;
	            this.$store.commit('changeCount',this.subName);
	        	this.$store.commit('changeName',this.subName);
	            this.$router.push({name:name});
	            this.judgmentName(name);
	        },
	        turnUrlS: function(name){
	        	this.subNameS = name;
	            this.$store.commit('changeNameS',this.subNameS);
	        	this.$store.commit('changeName',this.subNameS);
	            this.$router.push({name:name});
	            this.judgmentName(name);
	            this.paneStyle();
	        },
	        clickThisTab: function(name){//tab的切换
	        	this.tabName = name;
	        	this.$store.commit('changeName',this.tabName);
	        	this.$router.push({name:name});
	            this.judgmentName(name);
	            this.paneStyle();

	        },
	        judgmentName: function(name){
	        	if(name == 'basicConfig' || name == 'voiceTplConfig' || name == 'startRulesConfig'){
	        		this.subNavBase = true;
	        	}else if(name == 'nodeConfig' || name == "instructionNode" || name == "businessNode" || name == "speedInterNode" || name == "keypadInterNode"){
	        		this.subNavNode = true;
	        	}else{
	        		this.subNavBase = false;
	        		this.subNavNode = false;
	        	}
	        },
	        paneStyle: function(){
	        	this.$nextTick(function(){
	        		if(this.$refs.pane2.$el.innerHTML === ''){
						this.$refs.pane2.$el.style.display = 'none';
						this.$refs.pane3.$el.style.display = 'inline-block';
					}else if(this.$refs.pane3.$el.innerHTML === ''){
						this.$refs.pane3.$el.style.display = 'none';
						this.$refs.pane2.$el.style.display = 'inline-block';
					}
	        	})

	        }
		}
	}
</script>

<style>
</style>
