const fs = require('fs');
const path = require('path');

// 1. Create a "public" output folder
const outputDir = path.join(__dirname, 'public');
if (fs.existsSync(outputDir)) {
    fs.rmSync(outputDir, { recursive: true, force: true });
}
fs.mkdirSync(outputDir);

// 2. Copy the project files to "public"
const filesToWorkWith = ['assets', 'css', 'js', 'index.html', 'vercel.json', 'supabase.sql'];
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

    // Helper: Get sanitized env or provided default
    const getSecret = (key, fallback = '') => {
        const val = process.env[key] || fallback;
        // CRITICAL FIX: Trim newlines and whitespaces that cause SyntaxErrors
        return val.toString().replace(/[\r\n]/g, '').trim();
    };

    // MAGA: Preferred keys provided by the user
    const supabaseUrl = getSecret('SUPABASE_URL', 'https://jjcplqmdlbzkaxhkfdli.supabase.co');
    const supabaseKey = getSecret('SUPABASE_ANON_KEY', 'sb_publishable_42sD3WdanDiRF_Ca7OqfAA_jLXJhHXs');
    const vantageKey  = getSecret('VANTAGE_KEY', '0AQFRLJK08VO4WZV');
    const finnhubKey  = getSecret('FINNHUB_KEY', 'd73vkbhr01qno4pvskt0d73vkbhr01qno4pvsktg');
    const fredKey     = getSecret('FRED_KEY', '48bf00ac5df3a0548ae2df72648a0de8');
    const polygonKey  = getSecret('POLYGON_KEY', 'a8aMBxrSJnA5JypSfnfXzWHYj57X3AGe');

    // Inject keys
    content = content.replace(/__SUPABASE_URL__/g, supabaseUrl);
    content = content.replace(/__SUPABASE_ANON_KEY__/g, supabaseKey);
    content = content.replace(/__VANTAGE_KEY__/g, vantageKey);
    content = content.replace(/__FINNHUB_KEY__/g, finnhubKey);
    content = content.replace(/__FRED_KEY__/g, fredKey);
    content = content.replace(/__POLYGON_KEY__/g, polygonKey);

    fs.writeFileSync(configPath, content);
    console.log('MAGA: Secret Injection Completed Successfully.');
} else {
    console.error('MAGA: config.js NOT FOUND! SHAMEFUL!');
}

console.log('MAGA: Build completed. Output is in "public" folder.');
