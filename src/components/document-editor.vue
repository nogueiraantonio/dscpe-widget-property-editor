/* eslint-disable vue/component-tags-order */
<template class="fill-height">
    <v-container>
        <v-row v-for="prop in properties" :key="prop.definition.key">
            <v-select
                v-if="prop.definition.type == 'select'"
                :id="prop.definition.id"
                v-model="prop.curValue"
                :items="prop.authorizedValues"
                :label="prop.definition.displayName"
                :readonly="prop.definition.isReadOnly || !hasModifyAccess"
                return-object
                dense
                @input="onInput"
                @change="onChange"
            />
            <v-text-field
                v-if="prop.definition.type == 'text'"
                :id="prop.definition.id"
                v-model.lazy="prop.curValue"
                :type="prop.definition.type"
                :readonly="prop.definition.isReadOnly || !hasModifyAccess"
                :placeholder="prop.definition.placeholder"
                :label="prop.definition.displayName"
                dense
            />
        </v-row>
        <v-row v-show="hasModifyAccess" justify="center">
            <v-col cols="auto">
                <v-btn
                    id="submitButton"
                    :disabled="!isDirty"
                    depressed="true"
                    color="#42a2da"
                    width="90px"
                    @click="save"
                >
                    Save
                </v-btn>
            </v-col>
            <v-col cols="auto">
                <v-btn
                    id="cancelButton"
                    :disabled="!isDirty"
                    depressed="true"
                    color="#f1f1f1"
                    width="90px"
                    @click="cancel"
                >
                    Cancel
                </v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<!-- no scope for app.vue, style defined here is global for the app -->

<script>

import { service3DSpaceUrl, documentPropertiesMap } from "../main";

const DEPENDANTS = "dependants";
const HAS_MODIFY_ACCESS = "hasModifyAccess";

let WAFData;

// It is not fully safe to use this in this way
// but WAFData will be available much sooner than required by the user in this way anyway.
 requirejs(["DS/WAFData/WAFData"],
    (_WAFData) => {
    WAFData = _WAFData;
});

export default {
    name: "DocumentEditor",
    data() {
        return {
            docType: null,
            docId: String,
            properties: [],
            editMode: false,
            activeDocument: {
                 default: null,
                 type: Object
            },
            hasModifyAccess: false
        };
    },
    computed: {
        // document contains unsaved values if true
        isDirty: function () {
            console.debug("WCAE: isDirty");

            try {
                // validation
                if (!this.properties) return false;

                const keysArray = Object.keys(this.properties);

                const propsLen = keysArray.length;

                if (propsLen > 0) {
                    for (let i = 0; i < propsLen; i++) {
                    const prop = this.properties[keysArray[i]];

                        if (Object.prototype.hasOwnProperty.call(prop.definition, "isReadOnly") && prop.definition.isReadOnly === true) {
                            continue;
                        }
                        // eslint-disable-next-line eqeqeq
                        if ((prop.value == null) && (prop.curValue == null)) {
                            continue;
                        }
                        // eslint-disable-next-line eqeqeq
                        if (((prop.value != null) && (prop.curValue == null))) {
                            return true;
                        }
                        // eslint-disable-next-line eqeqeq
                        if (((prop.curValue != null) && (prop.value == null))) {
                            return true;
                        }
                        // eslint-disable-next-line eqeqeq
                        if (prop.value != null && prop.curValue != null) {
                            if (prop.definition.type === "select") {
                                if ((prop.value.value.key.localeCompare(prop.curValue.value.key) !== 0) ||
                                   (prop.value.value.val.localeCompare(prop.curValue.value.val) !== 0)) {
                                    return true;
                                 }
                            } else {
                                if (prop.value.localeCompare(prop.curValue) !== 0) {
                                    return true;
                                }
                            }
                        }
                    }
                }
            } catch (err) {
                console.error(err);
            }

            return false;
        }
    },
    beforeUpdate () {
        console.debug("WCAE: document-editor beforeUpdate!");
    },
    updated () {
        console.debug("WCAE: document-editor updated!");
    },
    mounted () {
        console.debug("WCAE: document-editor mounted!");
    },
    created () {
        console.debug("WCAE: document-editor created!");
    },
    methods:
    {
        reset: function() {
            this.docType = null;
            this.docId = null;
            this.properties = [];
            this.editMode = false;
            this.activeDocument = null;
            this.hasModifyAccess = false;
        },
        onChange: function (newVal) {
            try {
                const newValue = newVal.value.val;
                const propKey = newVal.value.key;
                const props = this.properties;

                // get Id from properties

                for (let i = 0; i < Object.keys(props).length; i++) {
                    const keyName = Object.keys(props)[i];

                    const property = props[keyName];

                    if (property.definition.key === propKey) {
                        this.resetDescendantTree(property, newValue);
                        return;
                    }
                }
            } catch (err) {
                console.error(err);
            }
        },
        resetDescendantTree: function (prop, val) {
            if (!Object.prototype.hasOwnProperty.call(prop, DEPENDANTS)) return;

            if (!Array.isArray(prop.dependants) || prop.dependants.length < 1) { return; }

            const dependants = prop.dependants;

            dependants.forEach((element) => {
                element.curValue = { text: "-", value: { key: "", val: "" }, disabled: true };

                // this is the array of authorized values filtered by the parent newValue
                // it might be empty if the parent newValue does not match any of the keys
                // for instance in the case that it has not yet been set.
                element.authorizedValues = this.filterAuthorizedValues(
                val,
                element.definition.authorizedValues
                );

                this.resetDescendantTree(element, { text: "-", value: { key: "", val: "" }, disabled: true });
            });
        },
        filterAuthorizedValues: function (parentValue, rawAuthorizedValues) {
            if (Object.prototype.hasOwnProperty.call(rawAuthorizedValues, parentValue)) {
                 return rawAuthorizedValues[parentValue];
            }
            return [];
        },

        // Gets the document properties that have been changed by the user.
        getUpdatedProperties: function () {
            try {
                const updatedProperties = {};

                const keyArray = Object.keys(this.properties);

                keyArray.forEach((key) => {
                    const prop = this.properties[key];

                    if (prop.value !== prop.curValue) {
                        if ((prop.definition.type === "select") && prop.curValue !== null) {
                            updatedProperties[prop.definition.key] = prop.curValue.value.val;
                        } else {
                            updatedProperties[prop.definition.key] = prop.curValue;
                        };
                    }
                });

                return updatedProperties;
            } catch (err) {
                console.error(err);
            }

            return null;
        },
        // Gets the json definition of the updated document data
        getUpdateDocumentData: function () {
            const updateDocData = {
                csrf: { name: "", value: "" },
                data: [
                {
                    id: "",
                    type: "",
                    identifier: "",
                    source: "",
                    relativePath: "",
                    cestamp: "",
                    dataelements: {}
                }
                ]
            };

            try {
                // This might not be valid if the user takes a long time to change the properties
                // it is safer to request a new CSRF token before update.
                // Or check if a new value is required.
                updateDocData.csrf.name = this.activeDocument.csrf.name;
                updateDocData.csrf.value = this.activeDocument.csrf.value;

                updateDocData.data[0].id = this.activeDocument.data[0].id;
                updateDocData.data[0].type = this.activeDocument.data[0].type;
                updateDocData.data[0].identifier = this.activeDocument.data[0].identifier;
                updateDocData.data[0].source = this.activeDocument.data[0].source;
                updateDocData.data[0].relativePath = this.activeDocument.data[0].relativePath;
                updateDocData.data[0].cestamp = this.activeDocument.data[0].cestamp;

                updateDocData.data[0].dataelements = this.getUpdatedProperties();
            } catch (err) {
                console.error(err);
            }

            return updateDocData;
        },
        cancel: function () {
            console.debug("WCAE: cancel changes");
            this.load(this.docType, this.docId);
        },
        load: function (_docType, _docId) {
            console.debug("WCAE: loading document");

            this.$store.commit("documentLoading");

            this.docType = _docType;
            this.docId = _docId;

            const docTypeProps = this.getDocTypeProperties(documentPropertiesMap, this.docType);

            if (docTypeProps === null) {
                this.$store.commit("documentUnloaded");
                console.debug(`WCAE: No properties defined for document type : '${_docType}'`);
                return;
            }

            this.properties = this.preprocessProperties(docTypeProps);

            this.loadDocument(this.docId);
        },
        save: function () {
            console.debug("WCAE: save form");

            this.$store.commit("documentSaving");

            const documentId = this.docId;

            const updateDocUrl =
                service3DSpaceUrl +
                "/resources/v1/modeler/documents/" +
                documentId;

            const updateDocHeader = {
                SecurityContext: widget.getValue("ctx")
            };

            const updateDocMethod = "PUT";

            const updateDocumentData = this.getUpdateDocumentData();

            const _self = this;

            WAFData.authenticatedRequest(updateDocUrl, {
                method: updateDocMethod,
                headers: updateDocHeader,
                type: "json",

                data: JSON.stringify(updateDocumentData),

                onComplete: function (dataResp) {
                    console.debug(JSON.stringify(dataResp));

                    const docTypeProps = _self.getDocTypeProperties(documentPropertiesMap, _self.docType);

                    if (docTypeProps === null) {
                        _self.$store.commit("documentUnloaded");
                        console.debug(`WCAE: No properties defined for document type : '${_self.docType}'`);
                        return;
                    }

                    _self.properties = _self.preprocessProperties(docTypeProps);

                    // reload properties
                    _self.updateActiveDocumentForm(dataResp);
                },

                onFailure: function (err) {
                    console.error(err);
                }
            });
        },
        updateActiveDocumentForm: function (data) {
            try {
                const documentAttributes = this.parseAttributes(data, 0);
                this.updateForm(this.properties, documentAttributes);
                this.activeDocument = data;
                this.$store.commit("documentLoaded");
            } catch (err) {
                console.error(err);
            }
        },
        // Call to Document GET Web Services
        loadDocument: function (docId) {
            const _self = this;

            const urlWAF = service3DSpaceUrl + "/resources/v1/modeler/documents/" + docId;

            console.debug("WCAE : calling " + urlWAF);

            const headerWAF = {
                SecurityContext: widget.getValue("ctx")
            };

            const methodWAF = "GET";

            _self.activeDocument = null;

            WAFData.authenticatedRequest(urlWAF, {
                method: methodWAF,
                headers: headerWAF,
                type: "json",

                onComplete: function (dataResp) {
                    console.debug("WCAE: returned " + JSON.stringify(dataResp));

                    if (!_self.isSuccessful(dataResp)) {
                        console.error(JSON.stringify(dataResp));
                        return;
                    }

                    _self.updateActiveDocumentForm(dataResp);
                },
                onFailure: function (err) {
                    console.error(err);
                }
            });
        },
        isSuccessful: function (jsonData) {
            let ret = false;
            try {
                if (jsonData.success === true) {
                    ret = true;
                }
            } catch (error) {
                console.error(error);
            }
            return ret;
        },
        // Extract attributes from the item index in the get document details web service return
        parseAttributes: function (jsonData, index) {
            let ret = null;

            try {
                ret = jsonData.data[index].dataelements;
            } catch (err) {
                console.error(err);
                throw (err);
            }

            return ret;
        },
        // Recreates the this.properties by copying the property definitions for the document type
        getDocTypeProperties: function (_docTypesProperties, _docType) {
            try {
                for (let i = 0; i < _docTypesProperties.length; i++) {
                    if (_docTypesProperties[i].docType.toUpperCase() === _docType.toUpperCase()) {
                        return _docTypesProperties[i].props;
                    }
                }
            } catch (err) {
                console.error(err);
            }
            return null;
        },
        preprocessProperties: function (rawProperties) {
            const newProperties = {};
            for (let i = 0; i < rawProperties.length; i++) {
                const rawProperty = rawProperties[i];
                // TODO: Log issue
                if (!Object.prototype.hasOwnProperty.call(rawProperty, "key")) continue;
                // TODO: Log issue
                if (Object.prototype.hasOwnProperty.call(newProperties, rawProperty.key)) continue;
                // TEST: Check if this works with an id that contains spaces
                newProperties[rawProperty.key] = {
                    definition: rawProperty,
                    dependants: [], // Direct children
                    value: rawProperty.value,
                    curValue: rawProperty.value
                };
            }

            for (let i = 0; i < Object.keys(newProperties).length; i++) {
                const thisProperty = newProperties[Object.keys(newProperties)[i]];
                if (Object.prototype.hasOwnProperty.call(thisProperty.definition, "parentKey")) {
                    const parentKey = thisProperty.definition.parentKey;
                    if (Object.prototype.hasOwnProperty.call(newProperties, parentKey)) {
                        newProperties[parentKey].dependants.push(thisProperty);
                    }
                }
            }

            return newProperties;
        },
        // update properties table
        updateForm: function (props, attributes) {
            console.debug("WCAE: updateForm attributes : " + attributes);

            if (!Object.keys(attributes).includes(HAS_MODIFY_ACCESS)) {
                this.hasModifyAccess = false;
            } else {
                this.hasModifyAccess = ((attributes[HAS_MODIFY_ACCESS]).toUpperCase() === "TRUE");
            }

            Object.keys(props).forEach((propKey) => {
                const prop = props[propKey];

                if (propKey in attributes) {
                    if (Object.prototype.hasOwnProperty.call(prop.definition, "authorizedValues")) {
                        // logic for authorizedValue selection
                        const authorizedValues = prop.definition.authorizedValues;

                        if (Object.prototype.hasOwnProperty.call(prop.definition, "parentKey") &&
                            prop.definition.parentKey !== null) {
                            // Has parent
                            const parentKey = prop.definition.parentKey;

                            // Get the value of the parent from the attributes
                            if (parentKey in attributes) {
                                const parentValue = attributes[parentKey];

                                if (parentValue !== null &&
                                    Object.prototype.hasOwnProperty.call(authorizedValues, parentValue)) {
                                    const parentFilteredAuthorizedValues = prop.definition.authorizedValues[parentValue];
                                    this.setAuthorizedValue(prop, attributes[propKey], parentFilteredAuthorizedValues);
                                } else {
                                    console.error("WCAE: The parent value '" + parentValue +
                                        "' is missing from list of authorized values for the property '" + propKey + "'");
                                    // Does this need to be handled differently? with an error message?
                                    const attributeVal = attributes[propKey];
                                    this.setUnauthorizedValue(prop, attributeVal, []);
                                }
                                } else {
                                    console.debug("WCAE: The parentKey '" + parentKey + "' of the property '" +
                                    propKey + "' cannot be found in the input attributes"
                                );

                                // This needs to be handled differently with an error message
                                const attributeVal = attributes[propKey];
                                this.setUnauthorizedValue(prop, attributeVal, []);
                            }
                        } else {
                            this.setAuthorizedValue(prop, attributes[propKey], authorizedValues);
                        }
                    } else {
                        // TODO: Review the need for this
                        // eslint-disable-next-line no-new-wrappers
                        prop.value = new String(attributes[propKey]);
                        // eslint-disable-next-line no-new-wrappers
                        prop.curValue = new String(attributes[propKey]);
                    }
                }
            });
        },
        setAuthorizedValue: function (prop, val, authorizedValues) {
            let authorizedValueIndex = -1;
            for (let i = 0; i < authorizedValues.length; i++) {
                 if (Object.prototype.hasOwnProperty.call(authorizedValues[i], "value")) {
                     if (Object.prototype.hasOwnProperty.call(authorizedValues[i].value, "val")) {
                        if (authorizedValues[i].value.val === val) {
                             authorizedValueIndex = i;
                            break;
                        }
                     }
                 }
            }

            if (authorizedValueIndex > -1) {
                prop.value = authorizedValues[authorizedValueIndex];
                prop.curValue = authorizedValues[authorizedValueIndex];

                prop.authorizedValues = authorizedValues;
            } else {
                this.setUnauthorizedValue(prop, val, authorizedValues);
            }
        },
        setUnauthorizedValue: function (prop, val, authorizedValues) {
            if (prop === undefined || prop === null) return;
            if (val === undefined || val === null) return;

            try {
                const trimmedValue = val.trim();

                if (trimmedValue !== "") {
                    const unauthorizedValue = { text: trimmedValue, value: { key: prop.definition.key, val: trimmedValue }, disabled: true };

                    prop.value = unauthorizedValue;
                    prop.curValue = unauthorizedValue;

                    authorizedValues.unshift(unauthorizedValue);
                }

                prop.authorizedValues = authorizedValues;

                // Note that trimmedValue == "" is already being caught in
                // the index.html with the <option disabled value="">please select</option>
                // if (trimmedValue !== "") {
                //     prop.unauthorizedValues = [trimmedValue];
                // }
            } catch (err) {
                console.error(err);
            }
        }
    }
};
</script>
