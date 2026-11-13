// eslint.config.js
export default [
    {
        files: ["**/*.js"],
        rules: {
            complexity: ["error", 6],
            "max-lines-per-function": ["error", 40],
            "max-lines": ["error", 120],
            "max-params": ["error", 4],
            "no-var": "error",
            "prefer-const": "error",
            "no-unused-vars": "error",
        },
    },
];