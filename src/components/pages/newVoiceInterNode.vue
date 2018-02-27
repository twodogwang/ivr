<template>
	<div class="main-content">
		<div class="newVoiceInterNode-div-1">
			<Icon type="chevron-left" @click.native="returnBack" color="#4a8df1" size="16"></Icon>
			<span>{{this.$route.query.name}}</span>
			<Icon type="ios-information" size="16" color="#666666"></Icon>
		</div>
		<div class="newVoiceInterNode-div-2">
			<Form label-position="right" ref="formCustom" :model="formCustom" :label-width="150" :rules="ruleValidate">
		        <FormItem v-if="this.$route.query.name == '新建语音交互节点'" label="语音交互节点名称" prop="name">
		        	<Input placeholder="请输入语音交互节点名称" v-model="formCustom.name"></Input>
		        </FormItem>
		        <FormItem v-else label="按键交互节点名称" prop="name">
		        	<Input placeholder="请输入按键交互节点名称" v-model="formCustom.name"></Input>
		        </FormItem>
		        <FormItem label="引导语语音模板" prop="naviMediaId">
		            <Select placeholder="请选择" v-model="formCustom.naviMediaId">
		                <Option v-for="item in voiceList" :value="item.id" :key="item.id">{{item.templateName}}</Option>
		            </Select>
		        </FormItem>
		        <FormItem label="参数传递键值" prop="pLabel">
		        	<Input v-model="formCustom.pLabel"></Input>
		        </FormItem>
		        <FormItem label="参数默认值" prop="defaultValue">
		        	<Input v-model="formCustom.defaultValue"></Input>
		        </FormItem>
		        <FormItem label="参数节点类型" prop="pType">
		        	<Select v-model="formCustom.pType" placeholder="请选择">
		                <Option v-for="item in ptypeList" :value="item.value" :key="item.value">{{item.label}}</Option>
		           </Select>
		        </FormItem>
		        <FormItem label="参数超时时间间隔" prop="timeoutInterval">
		        	<Input placeholder="10" number v-model="formCustom.timeoutInterval"></Input>秒
		        </FormItem>
		        <FormItem label="超时上限动作" prop="maxTimeoutAction">
		            <RadioGroup v-model="formCustom.maxTimeoutAction">
				        <Radio :label="1">挂机</Radio>
				        <Radio :label="2">反转</Radio>
				        <Radio :label="3">转人工</Radio>
				    </RadioGroup>
		        </FormItem>
		        <FormItem label="超时语音列表" prop="timeoutMediaList">
		            <Select multiple="multiple" placeholder="请选择" v-model="formCustom.timeoutMediaList">
		                <Option v-for="item in voiceList" :value="item.id" :key="item.id">{{item.templateName}}</Option>
		            </Select>
		        </FormItem>
		        <FormItem label="检查链的链头" prop="checkLinkHeaderName">
		            <Input v-model="formCustom.checkLinkHeaderName"></Input>
		        </FormItem>
		        <FormItem label="帮助语语音列表" prop="helpMediaId">
		            <Select placeholder="请选择" v-model="formCustom.helpMediaId">
		                <Option v-for="item in voiceList" :value="item.id" :key="item.id">{{item.templateName}}</Option>
		            </Select>
		        </FormItem>
		        <FormItem label="语音交互版本描述" prop="nodeDesc">
		            <Input v-model="formCustom.nodeDesc" type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>
		        </FormItem>
		        <FormItem>
		            <Button @click="returnBack" type="ghost" style="margin-left: 8px">取消</Button>
		            <Button type="primary" @click="submitClick('formCustom')">确定</Button>
		        </FormItem>
		    </Form>
		</div>
	</div>
</template>

<script>
export default {
  data() {
    const name = (rule, value, callback) => {
      if (value === "" || value == null) {
        callback(new Error("名称不能为空"));
      } else if (value != null && value.length > 12) {
        callback(new Error("名称不能超过12个字符"));
      } else {
        callback();
      }
    };
    const timeoutInterval = (rule, value, callback) => {
      if (value === "" || value == null) {
        callback(new Error("交互超时时间间隔不能为空"));
      } else if (value != null && !/^[a-z0-9]+$/.test(value)) {
        callback(new Error("交互超时时间间隔必须为数字"));
      } else if (value != null && value > 255) {
        callback(new Error("交互超时时间间隔不能超过255"));
      } else {
        callback();
      }
    };
    const checkLinkHeaderName = (rule, value, callback) => {
      if (value === "" || value == null) {
        callback(new Error("检查链的链头不能为空"));
      } else if (value != null && value.length > 20) {
        callback(new Error("检查链的链头不能超过20个字符"));
      } else {
        callback();
      }
    };
    return {
      ruleValidate: {
        naviMediaId: [
          {
            required: true,
            type: "number",
            message: "请选择引导语语音模板",
            trigger: "change"
          }
        ],
        pLabel: [
          { required: true, message: "参数传递键值不能为空", trigger: "blur" }
        ],
        timeoutInterval: [
          { required: true, validator: timeoutInterval, trigger: "blur" }
        ],
        maxTimeoutAction: [
          {
            required: true,
            type: "number",
            message: "请选择超时上限动作",
            trigger: "change"
          }
        ],
        timeoutMediaList: [
          {
            required: true,
            type: "array",
            message: "请选择超时语音",
            trigger: "change"
          }
        ],
        helpMediaId: [
          {
            required: true,
            type: "number",
            message: "请选择帮助语语音模板",
            trigger: "change"
          }
        ],
        checkLinkHeaderName: [
          { required: true, validator: checkLinkHeaderName, trigger: "blur" }
        ],
        pType: [
          {
            required: true,
            type: "number",
            message: "请选择参数节点类型",
            trigger: "change"
          }
        ],
        nodeDesc: [
          {
            required: false,
            message: "语音交互版本描述不能为空",
            trigger: "blur"
          }
        ],
        defaultValue: [
          { required: true, message: "参数默认值", trigger: "blur" }
        ],
        name: [{ required: true, validator: name, trigger: "blur" }]
      },
      formCustom: {
        vUserId: parseInt(this.commonID),
        name: null,
        nodeDesc: null,
        timeoutInterval: null,
        timeoutMediaList: [],
        maxTimeoutAction: null,
        helpMediaId: null,
        pType: null,
        naviMediaId: null,
        checkLinkHeaderName: null,
        pLabel: null,
        defaultValue: null
      },
      ptypeList: [
        {
          label: "时间",
          value: 1
        },
        {
          label: "数字",
          value: 2
        },
        {
          label: "服务类型",
          value: 3
        },
        {
          label: "操作类型",
          value: 4
        },
        {
          label: "语音数字",
          value: 5
        }
      ],
      voiceList: [],
      actionList: ["挂机", "反转", "转人工"]
    };
  },
  created: function() {
    this.getMediaTemplateListByUserVersionId();
  },
  methods: {
    returnBack: function() {
      this.$router.back(-1);
    },
    submitClick: function(name) {
      var this_ = this;
      this.$refs[name].validate(valid => {
        if (valid) {
          this_.addInteractiveNode();
        } else {
        }
      });
    },
    addInteractiveNode: function() {
      var this_ = this;
      parseInt(this.formCustom.timeoutInterval);
      this.$httpPost(
        "knowledge/node/addInteractiveNode",
        this.formCustom,
        function(data) {
          this_.$router.push({ name: "keypadInterNode" });
        }
      );
    },
    getMediaTemplateListByUserVersionId: function() {
      var this_ = this;
      this.$httpPost(
        "knowledge/mediaTemplate/getMediaTemplateListByUserVersionId",
        { userVersionId: parseInt(this.commonID) },
        function(data) {
          this_.voiceList = data.data.data;
        }
      );
    }
  }
};
</script>

<style scoped lang="less">
@import url("../../css/public.less");
@import url("../../css/speedInterNode.less");
</style>