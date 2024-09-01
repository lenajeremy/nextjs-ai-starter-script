#!/usr/bin/env node

const {
  input,
  select,
  confirm: iqConfirm,
  checkbox,
} = require("@inquirer/prompts");
const { execSync } = require("child_process");
const { processLLMSetupFile, installLLMPackages } = require("./utils/llm");
const fs = require("fs");
const path = require("path");

const TEMPLATE_REPOSITORY_URL =
  "https://github.com/lenajeremy/nextjs-ai-neon-starter";

const LLM_CHOICES = [
  { name: "OpenAI", value: "openai" },
  { name: "Anthropic", value: "anthropic" },
  { name: "Google", value: "google" },
  { name: "MistralAI", value: "mistral" },
  { name: "AzureAI", value: "azure" },
];

async function main() {
  try {
    const projectName = await input({
      message: "what is the name of your project?",
    });

    const aiProvider = await select({
      message: "Which AI provider do you want to use?",
      choices: LLM_CHOICES,
    });

    // clone the repo into the provided folder
    execSync(`git clone ${TEMPLATE_REPOSITORY_URL} ${projectName}`)

    setupLLM(aiProvider, projectName);
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

function setupLLM(selectedLLM, projectName) {
  const llmSetupFileURL = `${__dirname}/${projectName}/src/app/api/ai/setup.ts`;
  const packageJSONFileURL = `${__dirname}/${projectName}/package.json`;

  processLLMSetupFile(selectedLLM, llmSetupFileURL);
  installLLMPackages(selectedLLM, projectName)
  execSync(`cat ${packageJSONFileURL}`)

  // read package.json and update the packages
}

main();

//   const inputEnvVariables = await iqConfirm({
//     message: "Do you want to provide the required values for your .env file?",
//   });

//   const databaseURL = await input({ message: "NEONDB DATABASE URL" });
//   const llmApiKey = await input({ message: "API key for selected LLM" });
//   const authProviders = await checkbox({
//     message: "Select the auth providers you want to use",
//     choices: [
//       { value: "github", name: "Github" },
//       { value: "google", name: "Google" },
//       { value: "email", name: "Email" },
//     ] as const,
//   });

//   return {
//     projectName,
//     aiProvider,
//     databaseURL,
//     llmApiKey,
//     authProviders,
//     inputEnvVariables
//   }
// }

// function cloneRepo(projectName: string): boolean {
//   try {
//     execSync(`git clone https://github.com/lenajeremy/nextjs-ai-neon-starter ${projectName}`)
//     return true
//   } catch {
//     process.exit(0)
//   }
// }

// async function setupLLMConfigs() {
// setupAIProvider("from the index.ts file")

// }

// function setupEnvVariables(options: SetupValues) {

// }

// (async function () {
//   console.log("Welcome....\n\n")
//   const { default: ora } = await import("ora");
//   const spinner = ora()
//   console.log("hello babyyyyy")

//   try {
//     // const setupValues = await getSetupValues()
//     const setupValues = {
//       projectName: 'testproject'
//     }

//     spinner.text = "Loading template..."
//     spinner.start()
//     // const isCloned = cloneRepo('hello')
//     spinner.succeed("Templated loaded successfully")

//     spinner.text = "Setting up LLM configurations"
//     spinner.start()
//     setupLLMConfigs()

//   } catch (error) {
//     process.exit(0)
//   }
// })()
