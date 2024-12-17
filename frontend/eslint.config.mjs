import js from "@eslint/js";
import reactPlugin from "eslint-plugin-react";
import securityPlugin from "eslint-plugin-security";
import cypressPlugin from "eslint-plugin-cypress/flat";
import jestPlugin from "eslint-plugin-jest";
import globals from "globals";

export default [
    js.configs.recommended,
    reactPlugin.configs.flat.recommended,
    securityPlugin.configs.recommended,
    cypressPlugin.configs.globals,
    {
        plugins: {
            reactPlugin,
            pluginSecurity: securityPlugin,
            cypress: cypressPlugin,
            jest: jestPlugin
        },

        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.browser,
                ...jestPlugin.environments.globals.globals,
                Atomics: "readonly",
                SharedArrayBuffer: "readonly",
            },

            ecmaVersion: 2020,
            sourceType: "module",

            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },

        settings: {
            react: {
                version: "18.3.1",
            },
        },

        rules: {
            indent: ["error", 2, {
                SwitchCase: 1,
            }],

            "linebreak-style": ["error", "unix"],
            quotes: ["error", "double"],
            semi: ["error", "always"],
            eqeqeq: "error",
            "no-trailing-spaces": "error",
            "object-curly-spacing": ["error", "always"],

            "arrow-spacing": ["error", {
                before: true,
                after: true,
            }],
        },
    }];
