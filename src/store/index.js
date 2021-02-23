import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

// init store
export const store = new Vuex.Store({
    state: {
        isDocumentLoaded: false,
        isDocumentLoading: false
    },
    mutations: {
        documentLoading(state) {
            state.isDocumentLoading = true;
            state.isDocumentLoaded = false;
        },
        documentLoaded(state) {
            state.isDocumentLoading = false;
            state.isDocumentLoaded = true;
        },
        documentUnloaded(state) {
            state.isDocumentLoading = false;
            state.isDocumentLoaded = false;
        }
    }
});
