<template>
    <v-layout align-center class="mx-12 my-6">
        <v-item-group v-model="currentSection" class="shrink mr-6" mandatory tag="v-flex">
            <v-item v-for="i in sections.length" :key="i" v-slot:default="{ active, toggle }">
                <div>
                    <v-btn :input-value="active" icon @click="toggle">
                        <v-icon>mdi-record</v-icon>
                    </v-btn>
                </div>
            </v-item>
        </v-item-group>

        <v-flex>
            <v-window v-model="currentSection" class="elevation-1" vertical>
                <v-window-item v-for="(section, i) in sections" :key="i">
                    <v-card flat>
                        <v-card-text>
                            <!-- <markdown-it-vue class="md-body" :content="content" :options="options" />-->
                            <v-layout align-center mb-4>
                                <v-avatar color="grey" class="mr-4" />
                                <strong class="title" v-html="section.title"></strong>
                            </v-layout>
                            <div :style="{ maxHeight: maxHeight + 'px' }" class="readme" v-html="section.content"></div>
                        </v-card-text>
                    </v-card>
                </v-window-item>
            </v-window>
        </v-flex>
    </v-layout>
</template>

<style>
div.readme {
    line-height: 1.5rem !important;
    overflow: auto;
}
div.readme > pre > code {
    background-color: #1e1e1e;
    color: #dcdcdc;
    display: block;
    margin-bottom: 1em;
    margin-right: 0.5em;
    padding: 0.6em;
}
div.readme > pre > code::before {
    content: unset;
}
div.readme > pre > code::after {
    content: unset;
}
div.readme blockquote {
    margin-top: 16px;
    border-left: 4px solid #ccc;
    padding-left: 8px;
}
</style>

<script>
import sections from "../js/readme-parser";

export default {
    data: function() {
        return {
            currentSection: 0,
            sections: sections,
            windowHeight: window.innerHeight
        };
    },

    computed: {
        maxHeight: function() {
            return this.$store.state.windowHeight * 0.7;
        }
    }
};
</script>
