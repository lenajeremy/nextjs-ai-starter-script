"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupAIProvider = setupAIProvider;
const path_1 = __importDefault(require("path"));
function setupAIProvider(message) {
    // console.log(__dirname, __filename, message)
    console.log("my name is jeremiah");
    const llmSetupFile = path_1.default.join('/');
}
setupAIProvider('from the llm.ts file');
