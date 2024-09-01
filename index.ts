#!/usr/bin/env node
import { input, select, confirm as iqConfirm, checkbox } from "@inquirer/prompts"
import { execSync } from 'child_process'
import { type SetupValues } from './utils/types'
import { setupAIProvider } from './utils/llm'
import fs from 'fs'
import path from 'path'

async function getSetupValues(): Promise<SetupValues> {
  const projectName = await input({
    message: "What is the name of your project?",
  });

  const aiProvider = await select({
    message: "Which AI provider do you want to use?",
    choices: [
      { name: "OpenAI", value: "openai" },
      { name: "Anthropic", value: "anthropic" },
      { name: "Gemini", value: "google gemini" },
      { name: "MistralAI", value: "mistralai" },
    ] as const,
  });

  const inputEnvVariables = await iqConfirm({
    message: "Do you want to provide the required values for your .env file?",
  });

  const databaseURL = await input({ message: "NEONDB DATABASE URL" });
  const llmApiKey = await input({ message: "API key for selected LLM" });
  const authProviders = await checkbox({
    message: "Select the auth providers you want to use",
    choices: [
      { value: "github", name: "Github" },
      { value: "google", name: "Google" },
      { value: "email", name: "Email" },
    ] as const,
  });

  return {
    projectName,
    aiProvider,
    databaseURL,
    llmApiKey,
    authProviders,
    inputEnvVariables
  }
}

function cloneRepo(projectName: string): boolean {
  try {
    execSync(`git clone https://github.com/lenajeremy/nextjs-ai-neon-starter ${projectName}`)
    return true
  } catch {
    process.exit(0)
  }
}

async function setupLLMConfigs() {
setupAIProvider("from the index.ts file")

}

function setupEnvVariables(options: SetupValues) {

}

(async function () {
  console.log("Welcome....\n\n")
  const { default: ora } = await import("ora");
  const spinner = ora()
  console.log("hello babyyyyy")

  try {
    // const setupValues = await getSetupValues()
    const setupValues = {
      projectName: 'testproject'
    }

    spinner.text = "Loading template..."
    spinner.start()
    // const isCloned = cloneRepo('hello')
    spinner.succeed("Templated loaded successfully")

    spinner.text = "Setting up LLM configurations"
    spinner.start()
    setupLLMConfigs()






  } catch (error) {
    process.exit(0)
  }
})()
