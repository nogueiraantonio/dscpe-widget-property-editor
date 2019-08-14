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
                                <strong class="title">{{ section.innerHTML }}</strong>
                                <v-spacer />
                                <v-btn icon>
                                    <v-icon>mdi-account</v-icon>
                                </v-btn>
                            </v-layout>
                            <div v-html="section.innerHTML"></div>
                        </v-card-text>
                    </v-card>
                </v-window-item>
            </v-window>
        </v-flex>
    </v-layout>
</template>

<!-- no scope for app.vue, style defined here is global for the app -->
<style>
</style>

<script>
// import MarkdownItVue from "markdown-it-vue";
import MarkdownItText from "../../README.md";
import "markdown-it-vue/dist/markdown-it-vue.css";
import Showdown from "showdown/dist/showdown";
import { Remarkable } from "remarkable";
/* const md = new Remarkable("full", {
    html: true,
    typographer: true
}); */

const converter = new Showdown.Converter();
const html = converter.makeHtml(MarkdownItText);
const parser = new DOMParser();
const doc = parser.parseFromString(html, "text/html");
const sections = Array.from(doc.querySelectorAll("h2"));

console.log(doc);
console.log(sections);

export default {
    data: () => ({
        currentSection: 0,
        content: html,
        sections: sections
    }),
    mounted: function() {
        console.log(this.sections);
    }
};
</script>
