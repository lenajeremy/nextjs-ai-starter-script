#!/usr/bin/env node

const { input, select, confirm: iqConfirm } = require("@inquirer/prompts");
const { execSync } = require("child_process");
const {
  processLLMSetupFile,
  processLLMChatRoute,
  installLLMPackages,
} = require("./utils/llm");
const ora = require("ora").default;

const TEMPLATE_REPOSITORY_URL =
  "https://github.com/lenajeremy/nextjs-ai-neon-starter";

const LLM_CHOICES = [
  { name: "OpenAI", value: "openai" },
  { name: "Anthropic", value: "anthropic" },
  { name: "Google", value: "google" },
  { name: "MistralAI", value: "mistral" },
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
          message: "Enterm your Github App Secret",
          default: "",
        });
      }

      mailersendapiKey = await input({
        message: "Enter your Mailersend API key (press enter if unavailable)",
        default: "",
      });
    }

    const spinner = ora();

    spinner.text = "Fetching template code...";
    spinner.start();

    // clone the repo into the provided folder
    execSync(`git clone ${TEMPLATE_REPOSITORY_URL} ${projectName}`);

    spinner.succeed("Template code retrieved successfully");
    setupLLM(aiProvider, projectName, spinner);
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

async function setupLLM(selectedLLM, projectName, spinner) {
  const llmSetupFileURL = `${__dirname}/${projectName}/src/app/api/ai/setup.ts`;
  const llmChatRouteURL = `${__dirname}/${projectName}/src/app/api/ai/chat/route.ts`;

  spinner.text = "Customizing template to match your project details";
  spinner.start();
  sleep()
  processLLMSetupFile(selectedLLM, llmSetupFileURL);
  processLLMChatRoute(selectedLLM, llmChatRouteURL);
  spinner.succeed("customization completed")

  spinner.text = "installing required packages"
  installLLMPackages(selectedLLM, projectName);
  spinner.succeed("packages installed successfully")

  console.log(`\n\n project setup complete... run the following command: \ncd ${projectName} && npm run dev`)
}

function sleep() {
  return new Promise((res) => {
    setTimeout(res, 2000);
  });
}

main();

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
