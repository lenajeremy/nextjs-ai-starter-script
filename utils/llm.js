const fs = require("node:fs/promises");
const path = require("path");
const { capitalize } = require("./others");
const { execSync } = require("node:child_process");

/**
 *
 * this function updates the setup.ts file for the llms
 * @param {string} selectedLLM
 * @param {string} fileURL
 */
async function processLLMSetupFile(selectedLLM, fileURL) {
  let createProviderValue = `create${capitalize(selectedLLM.toLowerCase())}`;

  if (selectedLLM === 'google') {
    createProviderValue = 'createGoogleGenerativeAI'
  }
  const apiProviderValue = `${selectedLLM.toLowerCase()}`;

  let template = `
import { ${createProviderValue} } from "@ai-sdk/${apiProviderValue}";

const ${apiProviderValue} = ${createProviderValue}({
    apiKey: process.env.LLM_KEY
})

export default ${apiProviderValue}
`;

  try {
    await fs.writeFile(fileURL, template);
  } catch (error) {
    throw new Error("failed to write into file from", fileURL);
  }
}

async function processLLMChatRoute(selectedLLM, fileURL) {
  const defaultModelForLLM = {
    openai: "gpt-4o-2024-08-06",
    anthropic: "claude-3-5-sonnet-20240620",
    google: "gemini-1.5-pro-latest",
    mistral: "mistral-large-latest"
  }

  const template = `
import { streamText, convertToCoreMessages } from 'ai'
import { ${selectedLLM.toLowerCase()} } from '../setup'
import { prisma } from '@/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import { NextResponse } from 'next/server'


type Message = {
    content: string,
    role: "assistant" | "user" | "system"
}

export async function POST(request: Request) {

    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
        return NextResponse.json({ message: "Unathenticated "})
    }
    
    const { messages, conversationId } = await request.json() as { conversationId: string, messages: Message[] };

    if (!conversationId || messages.length === 0) {
        return Response.json({ error: true, message: "Bad request" }, { status: 400 });
    }

    // Save the conversation messages
    await prisma.conversation.update({
        where: { id: conversationId },
        data: { messages: messages },
    });

    const result = await streamText({
        model: ${selectedLLM.toLowerCase()}("${defaultModelForLLM[selectedLLM.toLowerCase()]}", { cacheControl: true }),
        messages: convertToCoreMessages(messages)
    })

    return result.toDataStreamResponse()
}
`

try {
  await fs.writeFile(fileURL, template);
} catch (error) {
  throw new Error("failed to write into file from", fileURL);
}


}

function installLLMPackages(selectedLLM, projectName) {
  try {
    const options = {
      cwd: path.join(process.cwd(), projectName),
      stdio: "inherit",
    };
    execSync(`npm i @ai-sdk/${selectedLLM}`, options);
    console.log("Package installed successfully");
  } catch (error) {
    console.error("Error installing package:", error.message);
    console.error("Command:", error.cmd);
    console.error("Working directory:", error.cwd);
    throw error;
  }
}

module.exports = {
  processLLMSetupFile,
  processLLMChatRoute,
  installLLMPackages,
};
