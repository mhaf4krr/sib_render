const fs = require('fs');
const path = require('path');

// Path to the file we need to patch
const filePath = path.join(
  __dirname,
  '../node_modules/whatsapp-web.js/src/webCache/LocalWebCache.js'
);

try {
  // Read the current file content
  let content = fs.readFileSync(filePath, 'utf8');

  // The dangerous code pattern we want to replace
  const dangerousCode = /const version = indexHtml\.match\(\/manifest-\([\d\\\\.]\+\)\.json\/\)\[1\];/;

  // The safer replacement that guards against null
  const safeCode = `// Guard against missing manifest pattern
        const match = indexHtml.match(/manifest-([\\d\\.]+)\\.json/);
        if (!match) return;
        const version = match[1];`;

  // Replace the unsafe pattern with the safe one
  content = content.replace(dangerousCode, safeCode);

  // Write the patched content back
  fs.writeFileSync(filePath, content);

  console.log('✅ Successfully patched whatsapp-web.js to handle missing manifest pattern');
} catch (error) {
  // Log error but don't fail the install - the module might not be installed yet
  console.warn('⚠️ Could not patch whatsapp-web.js:', error.message);
  process.exit(0);
}