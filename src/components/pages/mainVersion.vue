<template>
	<div class="basicTpl hmain">
		<p class="pageTitle"><router-link to="/"><Icon type="chevron-left"></Icon></router-link><span>知识库基础模板</span><Tooltip>
			<Icon type="information-circled" color="#999" size="14" />
			<div slot="content">
				<p>用户版本只能从版本模型内添加，点击</p>
				<p>即可在该模型内添加用户版本。</p>
			</div>
			</Tooltip></p>
		<Row class="cardFir">
			<Col>
				<Card>
					<p class="cardTitle" slot="title">基础模板一</p>
					<Table :columns="columns1" :data="data1"></Table>
					<p class="cardButton"><Button type="info">预测器</Button><Button type="primary" @click="turnCus">用户模板</Button></p>
				</Card>
			</Col>
		</Row>
		<Row class="cardSec" v-if="data1.length==2">
			<Col>
				<Card>
					<p class="cardTitle" slot="title">基础模板二</p>
					<Table :columns="columns1" :data="data1"></Table>
					<p class="cardButton"><Button type="info">预测器</Button><Button type="primary" @click="turnCus">用户模板</Button></p>
				</Card>
			</Col>
		</Row>
	</div>
</template>
<script>
    export default {
		data () {
            return {
                columns1: [
                    {
                        title: '版本名',
                        key: 'knowledgeName'
                    },
                    {
                        title: '版本描述',
                        key: 'knowledgeDesc'
                    },
                    {
                        title: '创建时间',
                        key: 'createTime'
                    },
                    {
                        title: '更新时间',
                        key: 'updateTime'
					}
                ],
                data1: []
            }
		},
		methods:{
			getSpKnVerList(){
				this.$httpGet('knowledge/version/getSpKnVerList',{},(data) => {
					this.data1 = data.data.data;
					console.log(data.data)
				})
			},
			turnCus(){
				this.$router.push({name:"customVersion"})
			}
		},
		mounted(){
			this.getSpKnVerList();
		}
    }
</script>
<style lang="less">
@import url("../../css/public.less");
.basicTpl{
	padding: 1.6% 1.6% 0 1.6%;
	border: 1px solid #e1e1e1;
	.pageTitle{
		margin: 14px 0 0 0;
		padding-bottom: 14px;
		font-size: 16px;
		border-bottom: 1px solid #d7d7d7;
		.ivu-icon{
			margin-right: 12px;
		}
	}
	.cardFir{
		margin: 45px 0 0 55px;
	}
	.cardSec{
		margin: 48px 0 0 55px;
	}
	.cardFir,.cardSec{
		width: 700px;
		height: 266px;
		.ivu-card-head,.ivu-card-body{
			padding: 0;
		}
		.ivu-card-head{
			height: 50px;
		}
		.cardTitle{
			height: 50px;
			line-height: 50px;
			padding-left: 28px;
			background: #f7f7f7;
		}
		.ivu-table-wrapper{
			.ivu-table-header{
				th{
					height: 45px;
				}
				th:first-child{
					padding-left: 28px;
				}
			}
			.ivu-table-body{
				td:first-child{
					padding-left: 28px;
				}
			}
		}
		.cardButton{
			margin: 48px 28px;
			display: flex;
			justify-content: space-between;
			button{
				height: 34px;
			}
			button[type="info"]{
				width: 80px;
			}
		}
	}
}
</style>
