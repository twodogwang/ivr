<template>
    <div class="layout">
        <Row type="flex">
            <i-col class="layout-menu-left">
            	<Sider ref="side1" hide-trigger collapsible :collapsed-width="78" v-model="isCollapsed">
	                <Menu active-name="customVersion" theme="dark" width="auto" :class="menuitemClasses" @on-select="turnUrl" :open-names="['border']">
	                    <div class="layout-logo-left">IVR后台管理系统</div>
	                    <!--<Submenu name="tableMonitor" class="li-div-1">
	
	                        <template slot="title">
	                            <Icon class="layout-menu-left-i layout-menu-left-i-1"></Icon>坐席监控
	                        </template>
	                    </Submenu>
	                    <Submenu name="systemManage" class="li-div-2">
	                        <template slot="title">
	                            <Icon class="layout-menu-left-i layout-menu-left-i-2"></Icon>系统管理
	                        </template>
	                    </Submenu>-->
	                    <Submenu name="border" class="li-div-3">
	                        <template slot="title">
	                           	<Icon class="layout-menu-left-i layout-menu-left-i-3"></Icon>知识库
	                        </template>
	                        <MenuItem name="customVersion">
	                        	版本控制
	                        </MenuItem>
	                    </Submenu>
	                    <!--<Submenu name="serverManage" class="li-div-4">
	                        <template slot="title">
	                            <Icon class="layout-menu-left-i layout-menu-left-i-4"></Icon>服务器管理
	                        </template>
	                    </Submenu>
	                    <Submenu name="logManage" class="li-div-5">
	                        <template slot="title">
	                            <Icon class="layout-menu-left-i layout-menu-left-i-5"></Icon>日志记录
	                        </template>
	                    </Submenu>
	                    <Submenu name="rootManage" class="li-div-6">
	                        <template slot="title">
	                            <Icon class="layout-menu-left-i layout-menu-left-i-6"></Icon>权限设置
	                        </template>
	                    </Submenu>-->
	                </Menu>
            	</Sider>
            </i-col>
            <i-col ref="span">
                <div class="layout-header">
                    <i-button type="text" @click="toggleClick">
                        <Icon @click.native="collapsedSider" type="navicon" size="32"></Icon>
                    </i-button>
                </div>
                <div class="layout-content">
                    <div class="layout-content-main" :style="contentStyle">
                    	<router-view></router-view>
                    </div>
                </div>
            </i-col>
        </Row>
    </div>
</template>
<script>
	import store from '@/vuex/store'
    export default {
        data () {
            return {
                isCollapsed: false
            }
        },
        mounted: function(){
        	this.$nextTick(function(){
        		this.$refs.span.$el.style.width = 'calc(100% - 200px)';
        	})
        },
        computed: {
            iconSize: function(){
                return this.spanLeft === 5 ? 14 : 24;
            },
            contentStyle: function(){
           		var innerHeight = window.innerHeight;// 这里注意，只是针对Chrome浏览器的算法
           		var contentHeight = innerHeight - 75;
            	return "min-height: " + contentHeight + "px";
            },
            rotateIcon: function() {
                return [
                    'menu-icon',
                    this.isCollapsed ? 'rotate-icon' : ''
                ];
            },
            menuitemClasses: function() {
                return [
                    'menu-item',
                    this.isCollapsed ? 'collapsed-menu' : ''
                ]
            }
        },
        methods: {
            toggleClick: function(){
                if (this.spanLeft === 5) {
                    this.spanLeft = 2;
                    this.spanRight = 22;
                } else {
                    this.spanLeft = 5;
                    this.spanRight = 19;
                }
            },
            turnUrl: function(name){
	            this.$router.push({name:name});
	        },
	        collapsedSider: function() {
                this.$refs.side1.toggleCollapse();
                if(this.$refs.span.$el.offsetLeft == 200){
                	this.$refs.span.$el.style.width = 'calc(100% - 78px)';
                }else{
                	this.$refs.span.$el.style.width = 'calc(100% - 200px)';
                }
            }
		},
		created () {
			this.$Message.config({
				duration: 3
			});
		}
    }
</script>
<style scoped lang="less">
	@import url("css/public.less");
</style>
