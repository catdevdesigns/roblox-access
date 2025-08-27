const fs = require('fs');
const path = require('path');
const rbx = require('rbx-parser'); // Make sure it supports .rbxm

const filePath = path.join(__dirname, 'rbxm', 'easyPOS - easyNametags.rbxm');

fs.readFile(filePath, (err, data) => {
    if (err) throw err;

    rbx.parse(data)
        .then(json => {
            // Save full JSON
            fs.writeFileSync('output.json', JSON.stringify(json, null, 2));
            console.log('JSON saved as output.json');

            // Extract scripts
            const scriptsDir = path.join(__dirname, 'scripts');
            if (!fs.existsSync(scriptsDir)) fs.mkdirSync(scriptsDir);

            let counter = {};
            function extractScripts(obj) {
                if (['Script', 'LocalScript', 'ModuleScript'].includes(obj.ClassName)) {
                    let name = obj.Properties?.Name || 'Script';
                    if (counter[name]) { counter[name]++; name += `_${counter[name]}`; }
                    else counter[name] = 1;
                    const source = obj.Properties?.Source || '';
                    fs.writeFileSync(path.join(scriptsDir, `${name}.lua`), source);
                }
                (obj.Children || []).forEach(extractScripts);
            }

            extractScripts(json);
            console.log('Scripts extracted to /scripts folder');
        })
        .catch(err => console.error(err));
});
