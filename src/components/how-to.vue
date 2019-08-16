<template>
    <v-layout align-center class="mx-12 my-6">
        <v-item-group v-model="currentSection" class="shrink mr-6" mandatory tag="v-flex">
            <v-item v-for="i in sections.length" :key="i" v-slot:default="{ active, toggle }">
                <div>
                    <v-btn :input-value="active" icon small @click="toggle">
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
    /* max-height: 600px; */
    overflow: auto;
}

div.readme > pre > code {
    background-color: #1e1e1e;
    color: #dcdcdc;
    display: block;
    margin-bottom: 1em;
}
</style>

<script>
import MDText from "../../README.md";
import Showdown from "showdown/dist/showdown";
import hljs from "highlight.js/lib/highlight";
import javascript from "highlight.js/lib/languages/javascript";
import bash from "highlight.js/lib/languages/bash";
import ShowdownHighlight from "showdown-highlight";
import "highlight.js/styles/vs2015.css";
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("bash", bash);

Showdown.setFlavor("github");
const converter = new Showdown.Converter({
    extensions: [ShowdownHighlight],
    omitExtraWLInCodeBlocks: true,
    smartIndentationFix: true
});

const sections = [];
const regexH2 = new RegExp(/^(#\s.*)$\s{3}/gm);
let match = regexH2.exec(MDText);
let previousSectionStartIndex = null;
let previousSectionTitle = null;
while (match && match.index !== -1) {
    if (previousSectionStartIndex !== null) {
        sections.push({ title: previousSectionTitle, content: MDText.substring(previousSectionStartIndex, match.index) });
    }
    previousSectionStartIndex = match.index + match[0].length;
    previousSectionTitle = match[1];
    match = regexH2.exec(MDText);
}
sections.push({ title: previousSectionTitle, content: MDText.substring(previousSectionStartIndex, MDText.length) });
const htmlSections = [];
for (const section of sections) {
    htmlSections.push({ title: converter.makeHtml(section.title), content: converter.makeHtml(section.content) });
}

export default {
    data: function() {
        return {
            currentSection: 0,
            sections: htmlSections,
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
