#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const prompts_1 = require("@inquirer/prompts");
const child_process_1 = require("child_process");
const llm_1 = require("./utils/llm.cjs");
async function getSetupValues() {
    const projectName = await (0, prompts_1.input)({
        message: "What is the name of your project?",
    });
    const aiProvider = await (0, prompts_1.select)({
        message: "Which AI provider do you want to use?",
        choices: [
            { name: "OpenAI", value: "openai" },
            { name: "Anthropic", value: "anthropic" },
            { name: "Gemini", value: "google gemini" },
            { name: "MistralAI", value: "mistralai" },
        ],
    });
    const inputEnvVariables = await (0, prompts_1.confirm)({
        message: "Do you want to provide the required values for your .env file?",
    });
    const databaseURL = await (0, prompts_1.input)({ message: "NEONDB DATABASE URL" });
    const llmApiKey = await (0, prompts_1.input)({ message: "API key for selected LLM" });
    const authProviders = await (0, prompts_1.checkbox)({
        message: "Select the auth providers you want to use",
        choices: [
            { value: "github", name: "Github" },
            { value: "google", name: "Google" },
            { value: "email", name: "Email" },
        ],
    });
    return {
        projectName,
        aiProvider,
        databaseURL,
        llmApiKey,
        authProviders,
        inputEnvVariables
    };
}
function cloneRepo(projectName) {
    try {
        (0, child_process_1.execSync)(`git clone https://github.com/lenajeremy/nextjs-ai-neon-starter ${projectName}`);
        return true;
    }
    catch {
        process.exit(0);
    }
}
async function setupLLMConfigs() {
    (0, llm_1.setupAIProvider)("from the index.ts file");
}
function setupEnvVariables(options) {
}
(async function () {
    console.log("Welcome....\n\n");
    const { default: ora } = await Promise.resolve().then(() => __importStar(require("ora")));
    const spinner = ora();
    console.log("hello babyyyyy");
    try {
        // const setupValues = await getSetupValues()
        const setupValues = {
            projectName: 'testproject'
        };
        spinner.text = "Loading template...";
        spinner.start();
        // const isCloned = cloneRepo('hello')
        spinner.succeed("Templated loaded successfully");
        spinner.text = "Setting up LLM configurations";
        spinner.start();
        setupLLMConfigs();
    }
    catch (error) {
        process.exit(0);
    }
})();
