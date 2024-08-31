#!/usr/bin/env node

const inquirer = require('inquirer')
const simpleGit = require('simple-git')
const fs = require('fs')
const path = require('path')

async function initialize() {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'What is the name of your project?',
    },
    {
      type: 'list',
      name: 'aiProvider',
      message: 'Which AI provider do you want to use?',
      choices: ['OpenAI', 'Anthropic', 'Other'],
    },
  ]);

  console.log('Project Name:', answers.projectName);
  console.log('AI Provider:', answers.aiProvider);

  // TODO: Implement repository cloning and project setup
}


initialize().catch(console.error)