const fs = require("fs");
const path = require("path");
const { readFile } = require("rbx-reader");

// Path to your RBXM file
const rbxmPath = path.join(__dirname, "rbxm", "easyPOS - easyNametags.rbxm");

// Read and parse the RBXM file directly
const model = readFile(rbxmPath);

// Serializer to keep only important properties for rebuilding
function serializeInstance(instance) {
  const importantProps = [
    "Anchored",
    "Size",
    "Position",
    "Orientation",
    "Transparency",
    "Reflectance",
    "Color",
    "Material",
    "Shape",
    "CanCollide",
    "Name",
    "Source" // include script source if present
  ];

  const usefulProps = {};
  for (const [key, value] of Object.entries(instance.Properties || {})) {
    if (importantProps.includes(key)) {
      usefulProps[key] = value;
    }
  }

  return {
    Name: instance.Name,
    ClassName: instance.ClassName,
    Properties: usefulProps,
    Children: instance.Children?.map(serializeInstance) || []
  };
}

// Serialize the model
const jsonModel = serializeInstance(model);

// Convert to formatted JSON string
const jsonString = JSON.stringify(jsonModel, null, 2);

// Write the JSON to a file
const outputPath = path.join(__dirname, "easyPOS-easyNametags.json");
fs.writeFileSync(outputPath, jsonString);

// Print the JSON to the console
console.log(jsonString);

console.log("✅ Exported JSON to", outputPath);
