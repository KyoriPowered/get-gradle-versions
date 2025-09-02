import { globalIgnores} from "eslint/config";

import globals from "globals";
import tseslint  from "typescript-eslint";
import js from "@eslint/js";

export default tseslint.config([
    js.configs.recommended,
    tseslint.configs.recommended,
    {
        languageOptions: {
            globals: {
                ...globals.browser,
            },

            parser: tseslint.parser,
            "ecmaVersion": 2022,
            "sourceType": "module",
            parserOptions: {},
        },

        plugins: {
            "@typescript-eslint": tseslint.plugin,
        },

        "rules": {
            "@typescript-eslint/no-explicit-any": "off",
        },
    }, 
    globalIgnores(["**/dist/", "**/lib/", "**/node_modules/"])
]);
