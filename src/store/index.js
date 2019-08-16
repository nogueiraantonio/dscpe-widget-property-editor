import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        windowHeight: window.innerHeight
    },
    mutations: {
        setHeight: (state, height = window.innerHeight) => {
            state.windowHeight = height;
        }
    },
    getters: {}
});
