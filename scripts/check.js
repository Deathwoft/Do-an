const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const required = [
  'package.json', 'client/package.json', 'client/index.html',
  'client/src/main.jsx', 'client/src/App.jsx',
  'server/package.json', 'server/index.js', 'server/chat-core.js'
];
let failed = false;
console.log('=== CHAT ONLINE: PRE-RUN SELF CHECK ===');
const major = Number(process.versions.node.split('.')[0]);
console.log(`${major >= 18 ? 'PASS' : 'FAIL'} Node.js ${process.version} (cần >= 18)`);
if (major < 18) failed = true;
for (const file of required) {
  const ok = fs.existsSync(path.join(root, file));
  console.log(`${ok ? 'PASS' : 'FAIL'} ${file}`);
  if (!ok) failed = true;
}
for (const file of ['server/index.js','server/chat-core.js','scripts/check.js']) {
  try {
    execFileSync(process.execPath, ['--check', path.join(root, file)], {stdio:'pipe'});
    console.log(`PASS cú pháp ${file}`);
  } catch (e) {
    console.log(`FAIL cú pháp ${file}: ${e.stderr?.toString() || e.message}`);
    failed = true;
  }
}
console.log('Ghi chú: kiểm tra kết nối WebSocket thực tế được thực hiện bằng npm test và chạy npm run dev.');
process.exit(failed ? 1 : 0);
