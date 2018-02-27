<template>
<div class="createBusinessItem hmain">
	<p class="pageTitle"><router-link to="/business"><Icon type="chevron-left"></Icon></router-link>新建业务接口</p>
	<div class="createNewBusiness">
		<Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="240">
			<FormItem label="业务链接名" prop="name">
				<Input v-model="formValidate.name" placeholder="请输入业务链接名" :maxlength="12"></Input>
			</FormItem>
			<FormItem label="调用链的地址" prop="url">
				<Input v-model="formValidate.url" placeholder="调用链网址链接(例：http://www.example.com)" :maxlength="64"></Input>
			</FormItem>
			<FormItem label="调用链的描述">
				<Input v-model="desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="输入描述用句，检索关键词（非必选）" :maxlength="120">
				</Input>
			</FormItem>
			<FormItem class="formButtonItem">
				<Button type="ghost" class="cancelItem" @click="cancel">取消</Button><Button type="primary" class="saveItem" @click="addLink('formValidate')">创建完成</Button>
			</FormItem>
		</Form>
	</div>

</div>

</template>
<script>
import axios from 'axios'
    export default {
        data () {
			const validateName = (rule,value,callback) => {
				if(value === ''){
					callback(new Error('业务链接名不能为空'))
				}else if(value.replace(/\s/g,"") == ""){
					callback(new Error('业务链接名不能为空'))
				}else if(this.checkLinkName()){
					callback(new Error(this.checkLinkName()))
				}else{
					callback()
				}
			};
			const url = (rule, value, callback) => {
				if (value === ''||value.replace(/\s/g,"") == "") {
					callback(new Error('调用链的地址不能为空'));
				}else if(!/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/.test(value)){
					callback(new Error('调用链的格式不正确'))
				}
				else{
					callback()
				}
			};
            return {
				ID: this.commonID,// 用户模板id
				desc: '',
                formValidate: {
                    name: '',
                    url: ''
                },
                ruleValidate: {
                    name: [
						// {  message: '业务链接名不能为空', trigger: 'blur' }
						{required: true,validator: validateName, trigger:'blur'}
                    ],
                    url: [
                        { required: true, type: 'url',validator: url, trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
			//新建业务接口
			addLink(params){
				let temp = {};
				temp.uid = this.ID*1;
				temp.callback = this.formValidate.url;
				temp.linkName = this.formValidate.name;
				temp.linkDesc = this.desc;
				this.$refs[params].validate((valid) => {
					if(valid){
						this.$httpPost('knowledge/link/addLink',temp,(data) => {
							this.$Message.success(data.data.msg);
							this.$router.push({name:"businessInterface"})
						})
					}else{
						this.$Message.error('请填写符合要求的信息')
					}
				})
			},
			//判断业务接口名是否合法
			checkLinkName(){
				this.$httpPost('knowledge/link/checkLinkName',{
					linkName: this.formValidate.name,
					userVersionId: this.ID*1
				}, (data) => {
					if(data.data.status != 1000){
						return data.data.msg;
					}
					else{
						return true
					}
				})
			},
			cancel(){
				this.$router.push({name:"businessInterface"})
			},
        }
    }
</script>
<style lang="less">
@import url("../../css/public.less");
.createBusinessItem{
	padding: 1.6% 1.6% 0 1.6%;
	border: 1px solid #e1e1e1;
	.pageTitle{
		margin: 14px 0 0 0;
		padding-bottom: 14px;
		font-size: 16px;
		border-bottom: 1px solid #d7d7d7;
		.ivu-icon{
			margin-right: 10px;
		}
	}
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
	.createNewBusiness{
		margin-top: 50px;
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
	.formButtonItem{
		margin-top: 40px;
	}
}
</style>
