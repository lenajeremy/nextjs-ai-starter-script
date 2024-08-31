#!/usr/bin/env node
const { input, select, confirm, checkbox } = require('@inquirer/prompts');
const simpleGit = require("simple-git");

const fs = require("fs");
const path = require("path");

async function initialize() {
  console.log("Create a new AI-powered NextJS project with NeonDB")
  const projectName = await input({ message: "What is the name of your project?" });
  const aiProvider = await select({
    message: "Which AI provider do you want to use?",
    choices: [
      { value: "OpenAI" },
      { value: "Anthropic" },
      { value: "Gemini" },
      { value: "MistralAI" },
    ],
  });
  const inputEnvVariables = await confirm({
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

  console.log("Project Name:", projectName);
  console.log("AI Provider:", aiProvider);
}

initialize().catch(console.error);
