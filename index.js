#!/usr/bin/env node

const { input, select, confirm: iqConfirm } = require("@inquirer/prompts");
const { execSync } = require("child_process");
const {
  processLLMSetupFile,
  processLLMChatRoute,
  installLLMPackages,
  processEnvVariables,
} = require("./utils");

const TEMPLATE_REPOSITORY_URL =
  "https://github.com/lenajeremy/nextjs-ai-neon-starter";

const LLM_CHOICES = [
  { name: "OpenAI", value: "openai" },
  { name: "Anthropic", value: "anthropic" },
  { name: "Google", value: "google" },
  { name: "MistralAI", value: "mistral" },
];

async function main() {
  const ora = (await import("ora")).default;

  try {
    const projectName = await input({
      message: "What is the name of your project?",
      required: true,
    });

    const aiProvider = await select({
      message: "Which AI provider do you want to use?",
      choices: LLM_CHOICES,
    });

    const inputEnvVariables = await iqConfirm({
      message: "Do you want to provide the required values for your .env file?",
    });

    let dburl = "";
    let mailersendapiKey = "";
    let llmkey = "";
    let usesGithubAuth = false;
    let githubId = "";
    let githubSecret = "";

    if (inputEnvVariables) {
      dburl = await input({
        message:
          "Enter your database URL from Neon (press enter if unavailable). Make sure you visit neon.tech and create now. Do it now! I can see you👀",
        default: "",
      });

      llmkey = await input({
        message: "Enter the API key for your AI provider of choice.",
        default: "",
      });

      usesGithubAuth = await iqConfirm({
        message: "Do you want to use Github as an OAuth Provider?",
        default: false,
      });

      if (usesGithubAuth) {
        githubId = await input({
          message: "Enter your Github App client ID",
          default: "",
        });

        githubSecret = await input({
          message: "Enter your Github App Secret",
          default: "",
        });
      }

      mailersendapiKey = await input({
        message: "Enter your Mailersend API key (press enter if unavailable)",
        default: "",
      });
    }

    const spinner = ora();

    spinner.text = "Fetching template code...\n";
    spinner.start();

    // clone the repo into the provided folder
    execSync(`git clone ${TEMPLATE_REPOSITORY_URL} ${projectName}`, {
      stdio: ["ignore", "ignore", "pipe"],
    });

    spinner.succeed("Template code retrieved successfully\n");
    setupLLM(
      aiProvider,
      {
        projectName,
        nextAuthSecret: "secret",
        mailersendAPIKey: mailersendapiKey,
        authGithubSecret: githubSecret,
        authGithubID: githubId,
        llmKey: llmkey,
        databaseURL: dburl,
        shouldInputEnv: inputEnvVariables,
      },
      spinner
    );
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

async function setupLLM(selectedLLM, details, spinner) {
  const llmSetupFileURL = `${process.cwd()}/${details.projectName}/src/app/api/ai/setup.ts`;
  const llmChatRouteURL = `${process.cwd()}/${details.projectName}/src/app/api/ai/chat/route.ts`;
  const envFileURL = `${process.cwd()}/${details.projectName}/.env`;

  spinner.text = "Customizing template to match your project details\n";
  spinner.start();
  sleep();
  processLLMSetupFile(selectedLLM, llmSetupFileURL);
  processLLMChatRoute(selectedLLM, llmChatRouteURL);

  if (details.shouldInputEnv) {
    processEnvVariables(envFileURL, details);
  }
  spinner.succeed("Customization completed");

  spinner.text = "Installing required packages\n";
  spinner.start();
  installLLMPackages(selectedLLM, details.projectName);
  spinner.succeed("Packages installed successfully");

  console.log(
    `\n\n project setup complete... run the following command: \ncd ${details.projectName} && npm run dev`
  );
}

function sleep() {
  return new Promise((res) => {
    setTimeout(res, 2000);
  });
}

main();
