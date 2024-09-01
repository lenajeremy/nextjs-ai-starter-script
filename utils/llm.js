const fs = require("node:fs/promises");
const path = require("path");
const { capitalize } = require("./text");
const { execSync } = require("node:child_process");

/**
 *
 * this function updates the setup.ts file for the llms
 * @param {string} selectedLLM
 * @param {string} fileURL
 */
async function processLLMSetupFile(selectedLLM, fileURL) {
  const createAIProviderKey = /{CREATE_AI_PROVIDER}/g;
  const apiProviderKey = /{AI_PROVIDER}/g;

  let template = `
import { {CREATE_AI_PROVIDER} } from "@ai-sdk/{AI_PROVIDER}";

const {AI_PROVIDER} = {CREATE_AI_PROVIDER}({
    apiKey: process.env.LLM_KEY
})

export default {AI_PROVIDER}
`;

  const createProviderValue = `create${capitalize(selectedLLM.toLowerCase())}`;
  const apiProviderValue = `${selectedLLM.toLowerCase()}`;

  try {
    template = template.replace(createAIProviderKey, createProviderValue);
    template = template.replace(apiProviderKey, apiProviderValue);
    await fs.writeFile(fileURL, template);
  } catch (error) {
    throw new Error("failed to write into file from", fileURL);
  }
}
function installLLMPackages(selectedLLM, projectName) {
  try {
    const options = {
      cwd: path.join(process.cwd(), projectName),
      stdio: 'inherit'
    };
    execSync(`npm i @ai-sdk/${selectedLLM}`, options);
    console.log('Package installed successfully');
  } catch (error) {
    console.error('Error installing package:', error.message);
    console.error('Command:', error.cmd);
    console.error('Working directory:', error.cwd);
    throw error;
  }
}

module.exports = {
  processLLMSetupFile,
  installLLMPackages,
};
