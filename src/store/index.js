import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

// init store
export const store = new Vuex.Store({
    state: {
        isDocumentLoaded: false,
        isDocumentLoading: false,
        isDocumentSaving: false
    },
    getters: {
        isDocumentUnloaded: function(state) {
            return (!state.isDocumentLoaded && !state.isDocumentLoading && !state.isDocumentSaving);
        }
    },
    mutations: {
        documentLoading(state) {
            state.isDocumentLoading = true;
            state.isDocumentLoaded = false;
            state.isDocumentSaving = false;
        },
        documentLoaded(state) {
            state.isDocumentLoading = false;
            state.isDocumentLoaded = true;
            state.isDocumentSaving = false;
        },
        documentUnloaded(state) {
            state.isDocumentLoading = false;
            state.isDocumentLoaded = false;
            state.isDocumentSaving = false;
        },
        documentSaving(state) {
            state.isDocumentLoading = false;
            state.isDocumentLoaded = false;
            state.isDocumentSaving = true;
        }
    }
});
