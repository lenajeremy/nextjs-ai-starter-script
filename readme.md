this is meant to be an npm script to initialize a nextjs starter template. the script is going to use a package to get allow the user make choices from the command line. These are the steps to follow:
1. user runs command something like `npx ai-next initialize`
2. the script begins to run and asks the user for the name of the project they want to initialize. this is used to create a folder. 
3. the command ask the user for the ai provider they want to use.
3. upon selection, the script clones a branch of a particular repo on the user's device (the selected branch is deteermined by the selected ai provider)
4. after the code has been cloned. you display a command to say "intialized completed... run `cd (project name)


