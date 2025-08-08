import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Deployment-friendly overrides
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/prefer-as-const": "warn",
      "react-hooks/exhaustive-deps": "warn",
      // Allow any for API responses during development
      "@typescript-eslint/no-explicit-any": process.env.NODE_ENV === "production" ? "error" : "warn",
    },
  },
];

export default eslintConfig;
