const fs = require('fs');
const path = require('path');

// 1. Create a "public" output folder (The most common Vercel standard)
const outputDir = path.join(__dirname, 'public');
if (fs.existsSync(outputDir)) {
    fs.rmSync(outputDir, { recursive: true, force: true });
}
fs.mkdirSync(outputDir);

// 2. Copy the project files to "public"
const filesToWorkWith = ['assets', 'css', 'js', 'index.html', 'vercel.json'];
filesToWorkWith.forEach(item => {
    const srcPath = path.join(__dirname, item);
    const destPath = path.join(outputDir, item);
    if (fs.existsSync(srcPath)) {
        fs.cpSync(srcPath, destPath, { recursive: true });
    }
});

// 3. Perform the secret injection in the final "public" folder
const configPath = path.join(outputDir, 'js', 'config.js');
if (fs.existsSync(configPath)) {
    let content = fs.readFileSync(configPath, 'utf8');

    const supabaseUrl = process.env.SUPABASE_URL || '__SUPABASE_URL__';
    const supabaseKey = process.env.SUPABASE_ANON_KEY || '__SUPABASE_ANON_KEY__';

    // Inject keys
    content = content.replace(/__SUPABASE_URL__/g, supabaseUrl);
    content = content.replace(/__SUPABASE_ANON_KEY__/g, supabaseKey);

    fs.writeFileSync(configPath, content);
    console.log('MAGA: Supabase Secrets Injected Successfully in public/js/config.js.');
} else {
    console.error('MAGA: config.js NOT FOUND! SHAMEFUL!');
}

console.log('MAGA: Build completed. Output is in "public" folder.');
