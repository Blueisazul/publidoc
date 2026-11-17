import fs from 'node:fs';

const filePath = 'src/content/docs/ee1ebcb3-b350-4854-9930-959624859807.md';
const original = fs.readFileSync(filePath, 'utf8');

// Ensure LF
let content = original.replace(/\r\n/g, '\n');

// 1. Unescape markdown headers: \# -> #, \## -> ##, etc.
content = content.replace(/^\\(#{1,6}\s)/gm, '$1');
content = content.replace(/(\n)\\(#{1,6}\s)/g, '$1$2');

// 2. Unescape horizontal rules: \--- -> ---
content = content.replace(/^\\---$/gm, '---');

// 3. Unescape blockquotes: \> -> >
content = content.replace(/^\\(>\s?)/gm, '$1');

// 4. Unescape list numbers and bullets: 1\. -> 1.  and \- -> -
content = content.replace(/^(\s*\d+)\\\.\s/gm, '$1. ');
content = content.replace(/^(\s*)\\\-\s/gm, '$1- ');
content = content.replace(/^(\s*)\\\*\s/gm, '$1* ');

// 5. Unescape code backticks: \` -> `
const BT = String.fromCharCode(96);
content = content.split('\\' + BT).join(BT);

// 6. Unescape bold: \*\* -> **
content = content.replace(/\\\*\\\*/g, '**');

// 7. Unescape italic/single asterisk: \* -> *
content = content.replace(/\\\*/g, '*');

// 8. Unescape alert brackets: \[! -> [! and \] -> ]
content = content.replace(/\\\[!/g, '[!');
content = content.replace(/\\\]/g, ']');

// 9. Unescape snake_case underscores: \_ -> _
content = content.replace(/\\_/g, '_');

console.log('Original length:', original.length);
console.log('Normalized length:', content.length);
console.log('Preserved C:\\Evocara?', content.includes('C:\\Evocara'));

// Check sample diff around line 18
const origLines = original.replace(/\r\n/g, '\n').split('\n');
const normLines = content.split('\n');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully written normalized content to', filePath);
