<template>
<!-- <div> -->
	<div class="h-select-wrapper">
		<div class="selected-wrapper ivu-select ivu-select-single">
			<div class="h span-wrapper">
				<div class="h ivu-tag ivu-tag-checked" v-for="(option, index) in renderLabel" :key="index">
					<span class="h ivu-tag-text" :value="option.value">{{option.label}}</span>
					<i class="h ivu-icon ivu-icon-ios-close-empty" @click.stop="deleteSpan"></i>
				</div>
			</div>
			<!-- v-model="renderLabel.value"
			:label="label" -->
			<Select
				v-if="selectShow"
				ref='select'
				filterable
				remote
				label-in-value
				:value='val'
				:remote-method="remoteMethod"
				:loading="isLoading"
				@on-change="addToSpanArr"
				@on-query-change="bus">
				<Option v-for="(option, index) in renderOptions" :value="option.value" :key="index" :label="option.label">{{option.label}}</Option>
			</Select>
		</div>
	</div>
<!-- </div> -->
</template>
<script>
//使用js数组自己固有的函数去删除这个元素
Array.prototype.remove = function(val) {
	var index = this.indexOf(val);
	if (index > -1) {
		this.splice(index, 1);
	}
};
export default {
	props: ['renderLabel','renderOptions','isLoading'],
	data () {
		return {
			label:'',
			val: '',
			selectShow: true,
			num: 0
		}
	},
	methods: {
		addToSpanArr(val){//model push a value
		//可以尝试clearable的方法 然后这这里判断val的值

			// if(val == '')
			// 	return;
			this.renderLabel.push(val);

			this.$emit('bindModel',this.renderLabel)
			this.selectShow = false;
			setTimeout(()=> {
				this.selectShow = true;
			},1);
		},
		bus(query){
			this.$emit('remoteMethod',query);
		},
		remoteMethod() {},
		deleteSpan(event,index){
			let text = event.target.previousSibling.previousSibling.getAttribute('value');
			this.renderLabel.forEach(e => {
				if(e.value==text){
					this.renderLabel.remove(e);
				}
			});
		}
	},
}
</script>
<style lang="less">
.h-select-wrapper{
	// position: relative;
	width: 420px;
	border: 1px solid #e1e1e1;
	.selected-wrapper{
		// position: absolute;
		// left: 5px;
		z-index: 9;
		.span-wrapper{
			display: inline!important;
		}
		.ivu-select{
			display: inline-block!important;
			width: 100px;

		}
		.ivu-select-input{
			height: 30px;
			width: inherit;
		}
		.ivu-select-dropdown{
			width: 420px!important;
			left: 0!important;
		}
	}
	.ivu-tag.ivu-tag-checked,.ivu-select-selection{
		// display: inline-block;
	}
	.ivu-select-selection{
		border: none;
		width: inherit;
		display: inline-block!important;
		box-shadow: none;
		height: 30px;
		line-height: 30px;
		.ivu-tag {
			display: none;
		}
	}
}
</style>
