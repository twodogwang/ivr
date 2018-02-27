import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const state = {
    count: 'nodeConfig',
    name: 'globalOption',
    nameS: 'basicConfig'
}

const mutations = {
    changeCount(state, name) {
        state.count = name;
    },
    changeName(state, name) {
        state.name = name;
    },
    changeNameS(state, name) {
        console.log(name);
        state.nameS = name;
    }
}

const action = {

}
export default new Vuex.Store({
    state,
    mutations,
    action
});