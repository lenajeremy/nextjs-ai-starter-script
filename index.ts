#!/usr/bin/env node
const { input, select, confirm: iqConfirm, checkbox } = require("@inquirer/prompts");
const { simpleGit, CleanOptions } = require('simple-git');
const fs = require("fs");
const path = require("path");

type SetupValues = {
  projectName: string;
  aiProvider: 'openai' | "anthropic" | "google gemini" | "mistralai";
  inputEnvVariables: Boolean;
  authProviders: ('email' | 'google' | 'github')[];
  llmApiKey?: string;
  databaseURL?: string;
}

async function getSetupValues(): Promise<SetupValues> {
  const projectName = await input({
    message: "What is the name of your project?",
  });

  const aiProvider = await select({
    message: "Which AI provider do you want to use?",
    choices: [
      { value: "OpenAI" },
      { value: "Anthropic" },
      { value: "Gemini" },
      { value: "MistralAI" },
    ],
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
    ],
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

  (async function () {
    console.log("Welcome....\n\n")
    // const setupValues = await getSetupValues()

    simpleGit().clean(CleanOptions.FORCE);

    simpleGit().clone("https://github.com/lenajeremy/nextjs-ai-neon-starter", [])




  })()
