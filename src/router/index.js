import Vue from 'vue'
import Router from 'vue-router'
import notFound from '@/components/common/404'
import customVersion from '@/components/pages/customVersion' //用户版本
import businessInterface from '@/components/pages/businessInterface' //业务接口
import createBusiness from '@/components/pages/createBusiness' //新建业务
import mainVersion from '@/components/pages/mainVersion' //基础版本
import createVersion from '@/components/pages/createVersion' //创建版本
import phonetics from '@/components/pages/phonetics' //语音模板
import newTextVoiceCom from '@/components/pages/newTextVoiceCom' //语音模板（文字合成）
import newVoiceCom from '@/components/pages/newVoiceCom' //语音模板（语音合成）
import nodeConfig from '@/components/pages/nodeConfig' // 总览（节点配置）
import instructionNode from '@/components/pages/instructionNode' //指令节点（节点配置）
import businessNode from '@/components/pages/businessNode' //业务节点（节点配置）
import paramNode from '@/components/pages/paramNode' //参数节点（节点配置）
import newParamNode from '@/components/pages/newParamNode' //新建参数节点（节点配置）
import speedInterNode from '@/components/pages/speedInterNode' //语音交互节点（节点配置）
import newVoiceInterNode from '@/components/pages/newVoiceInterNode' //新建语音交互节点设置
import keypadInterNode from '@/components/pages/keypadInterNode' //按键交互节点（节点配置）

//hzh
import basicConfig from '@/components/pages/basicConfig' //基本配置（全局配置）
import voiceTplConfig from '@/components/pages/voiceTplConfig' //语音模板配置（全局配置）
import startRulesConfig from '@/components/pages/startRulesConfig' //启用规则配置（全局配置）

Vue.use(Router)

export default new Router({
    // mode: 'history',
    routes: [{
            path: '/main',
            name: 'mainVersion',
            component: mainVersion
        },
        {
            path: '/version/create',
            name: 'createVersion',
            component: createVersion
        },
        {
            path: '*',
            name: 'notFound',
            component: notFound
        }, {
            path: '/',
            name: 'customVersion',
            component: customVersion
        }, {
            path: '/business',
            name: 'businessInterface',
            component: businessInterface
        }, {
            path: '/business/create',
            name: 'createBusiness',
            component: createBusiness
        },
        {
            path: '/phonetics',
            name: 'phonetics',
            component: phonetics
        },
        {
            path: '/phonetics/newTextVoiceCom',
            name: 'newTextVoiceCom',
            component: newTextVoiceCom
        },
        {
            path: '/phonetics/newVoiceCom',
            name: 'newVoiceCom',
            component: newVoiceCom
        },
        {
            path: '/nodeConfig',
            name: 'nodeConfig',
            component: nodeConfig
        },
        {
            path: '/instructionNode',
            name: 'instructionNode',
            component: instructionNode
        },
        {
            path: '/businessNode',
            name: 'businessNode',
            component: businessNode
        },
        {
            path: '/businessNode/paramNode',
            name: 'paramNode',
            component: paramNode
        },
        {
            path: '/businessNode/newParamNode',
            name: 'newParamNode',
            component: newParamNode
        },
        {
            path: '/speedInterNode',
            name: 'speedInterNode',
            component: speedInterNode
        },
        {
            path: '/keypadInterNode',
            name: 'keypadInterNode',
            component: keypadInterNode
        },
        //hzh
        {
            path: '/global/basic',
            name: 'basicConfig',
            component: basicConfig
        },
        {
            path: '/global/voicetpl',
            name: 'voiceTplConfig',
            component: voiceTplConfig
        },
        {
            path: '/global/startrules',
            name: 'startRulesConfig',
            component: startRulesConfig
        },
        {
            path: '/global/newVoiceInterNode',
            name: 'newVoiceInterNode',
            component: newVoiceInterNode
        }
    ]
})