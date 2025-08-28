const fs = require("fs");
const path = require("path");
const reader = require("rbx-reader");

const filePath = path.join(__dirname, "easyPOS - easyNametags.rbxm");

// Check if file exists
if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
}

// Read file as a buffer (binary)
const buffer = fs.readFileSync(filePath);

// Parse Roblox model file
const model = reader.parseBuffer(buffer);

// Save full JSON output
const outputPath = path.join(__dirname, "output.json");
fs.writeFileSync(outputPath, JSON.stringify(model, null, 2));
console.log(`✅ JSON saved to ${outputPath}`);

// Extract scripts
const scriptsDir = path.join(__dirname, "scripts");
if (!fs.existsSync(scriptsDir)) fs.mkdirSync(scriptsDir);

let counter = {};
function extractScripts(obj) {
    if (obj.ClassName && ["Script", "LocalScript", "ModuleScript"].includes(obj.ClassName)) {
        let name = obj.Properties?.Name || "Script";
        if (counter[name]) {
            counter[name]++;
            name += `_${counter[name]}`;
        } else {
            counter[name] = 1;
        }
        const sourceProp = obj.Properties?.Source;
        if (sourceProp) {
            fs.writeFileSync(path.join(scriptsDir, `${name}.lua`), sourceProp);
        }
    }
    if (obj.Children && Array.isArray(obj.Children)) {
        obj.Children.forEach(extractScripts);
    }
}

if (Array.isArray(model)) {
    model.forEach(extractScripts);
}

console.log(`✅ Scripts extracted to ${scriptsDir}`);
