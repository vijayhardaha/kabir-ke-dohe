#!/usr/bin/env node

import fs from "fs";
import path from "path";

import chalk from "chalk";

// Load the JSON file
const coupletsPath = path.resolve(process.cwd(), "data", "couplets.json");
const couplets = JSON.parse(fs.readFileSync(coupletsPath, "utf8"));

// Function to generate the prompt
const buildPrompt = (dohaNumber) => {
  const doha = couplets.find((item) => item.id === dohaNumber);

  if (!doha) {
    console.error(chalk.red(`Error: Doha with number ${dohaNumber} not found.`));
    process.exit(1);
  }

  const { couplet_hindi } = doha;

  return `
Analyze this Kabir doha and provide explanation in this EXACT markdown format:

**${couplet_hindi}**

➖➖➖

**✨ अर्थ: ⤵**
[Detailed Hindi explanation in 5-6 sentences]

➖➖➖

**🌾 वास्तविक जीवन उदाहरण: ⤵**
[Practical story in Hindi showing modern application]

➖➖➖

**🔥 संदेश: ⤵**
📌 [Key message 1 - short and impactful]
📌 [Key message 2 - short and impactful]
📌 [Key message 3 - short and impactful]

➖➖➖

— संत कबीरदास साहेब जी 🙏❤️💯

#कबीर #kabir #kabirgyan #kabirkedohe #kabirsaheb #kabirvani #sant #santkabir #spiritual #wisdom #advaita #gyan #india #gurudwara #guru #sanatani #hindu
  `.trim();
};

// Function to create the directory structure and save the file
const savePrompt = (dohaNumber, prompt, force) => {
  const startRange = Math.floor((dohaNumber - 1) / 50) * 50 + 1;
  const endRange = startRange + 49;
  const folderName = `${String(startRange).padStart(2, "0")}-${String(endRange).padStart(2, "0")}`;

  const folderPath = path.resolve(process.cwd(), "docs", "couplets", folderName);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
    console.log(chalk.green(`Created folder: ${folderPath}`));
  }

  const fileName = `doha-${String(dohaNumber).padStart(2, "0")}.md`;
  const filePath = path.join(folderPath, fileName);

  if (fs.existsSync(filePath) && !force) {
    console.log(chalk.yellow(`File already exists: ${filePath}. Use --force to overwrite.`));
    return;
  }

  fs.writeFileSync(filePath, prompt, "utf8");
  console.log(chalk.green(`Prompt saved to: ${filePath}`));
};

// Main function
const main = () => {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.error(chalk.red("Usage: buildPrompt <dohaNumber> [--force]"));
    process.exit(1);
  }

  const dohaNumber = parseInt(args[0], 10);
  const force = args.includes("--force");

  if (isNaN(dohaNumber) || dohaNumber <= 0) {
    console.error(chalk.red("Error: Please provide a valid doha number."));
    process.exit(1);
  }

  const prompt = buildPrompt(dohaNumber);
  savePrompt(dohaNumber, prompt, force);
};

main();
