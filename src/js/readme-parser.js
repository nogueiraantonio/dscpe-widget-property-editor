import MDText from "./README.md";
import { Remarkable } from "remarkable";
import hljs from "highlight.js/lib/highlight";
import javascript from "highlight.js/lib/languages/javascript";
import bash from "highlight.js/lib/languages/bash";
import "highlight.js/styles/vs2015.css";
import mermaid from "mermaid";

const mermaidPlugin = (md, options) => {
    md.renderer.rules.fence_custom.mermaid = function(tokens, index) {
        const token = tokens[index];
        let result;
        mermaid.render("id1", token.content, cbResult => {
            result = cbResult;
        });
        return result;
    };
};

export default (() => {
    const md = new Remarkable("full", {
        highlight: function(str, lang = "bash") {
            return hljs.highlight(lang, str).value;
        },
        breaks: true
    });
    hljs.registerLanguage("javascript", javascript);
    hljs.registerLanguage("bash", bash);
    md.use(mermaidPlugin);

    const sections = [];
    const regexH2 = /^(#\s.*)([\r\n]{2}|\n)$/gm;
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
        htmlSections.push({ title: md.render(section.title), content: md.render(section.content) });
    }
    return htmlSections;
})();
