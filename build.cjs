const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Compile TypeScript
exec('tsc', (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`TypeScript compilation complete.`);
  
  // Rename .js files to .cjs
  renameJsToCjs('./dist');
});

function renameJsToCjs(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      renameJsToCjs(filePath);
    } else if (path.extname(file) === '.js') {
      const newPath = path.join(dir, `${path.basename(file, '.js')}.cjs`);
      fs.renameSync(filePath, newPath);
      console.log(`Renamed ${file} to ${path.basename(newPath)}`);
    }
  }
}
