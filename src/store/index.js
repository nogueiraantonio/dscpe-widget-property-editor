import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

// init store
export const store = new Vuex.Store({
    state: {
        messages: ["Hello 3DExperience Platform", "Made with Vue & Vuetify"],
        messageNumber: 0
    },
    mutations: {
        swapMessage(state) {
            state.messageNumber = (state.messageNumber + 1) % state.messages.length;
        }
    },
    getters: {
        currentMessage({ messages, messageNumber }) {
            return messages[messageNumber];
        }
    }
});
