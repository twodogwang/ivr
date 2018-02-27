<template>
	<div>
		<h1>访问的页面不存在!</h1>
		<router-link to="/" tag="h2"> 点我返回首页 </router-link>
	</div>
</template>
<style lang="less" scoped>
div{
	width: 200px;
	margin: 0 auto;
	text-align: center;
}
h1{
	padding-top: 100px;
}
h2{
	margin-top: 30px;
	cursor: pointer;
}
</style>
