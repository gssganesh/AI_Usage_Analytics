const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'src', 'pages');
const files = fs.readdirSync(dir);
for (let file of files) {
  if (file.endsWith('.jsx')) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/<ResponsiveContainer\s+width=["']100%["']\s+height=["']100%["']\s*>/g, '<ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>');
    fs.writeFileSync(filePath, content);
    console.log('Fixed', file);
  }
}
