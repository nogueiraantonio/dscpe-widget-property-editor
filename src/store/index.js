import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        message: ""
    },
    mutations: {
        setMessage: (state, message = "") => {
            state.message = message;
        }
    },
    getters: {}
});
