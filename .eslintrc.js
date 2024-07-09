module.exports = {
    root: true,
    env: {
        node: true,
       'vue/setup-compiler-macros': true, 
    },  

    rules: {
        "vue/html-indent": ["error", 4, { "baseIndent": 1 }]
    },

    extends: [
        'plugin:vue/vue3-essential',
        'plugin:vue/vue3-recommended',
    ],
    parser: "vue-eslint-parser",
}