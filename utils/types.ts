export type SetupValues = {
    projectName: string;
    aiProvider: 'openai' | "anthropic" | "google gemini" | "mistralai";
    inputEnvVariables: boolean;
    authProviders: ('email' | 'google' | 'github')[];
    llmApiKey?: string;
    databaseURL?: string;
  }