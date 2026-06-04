const fs = require('fs');
const files = ['src/admin/Leads.js', 'src/admin/Invoices.js', 'src/admin/Clients.js', 'src/admin/Payments.js'];

files.forEach(f => {
  let code = fs.readFileSync(f, 'utf8');
  code = code.replace('const handleSave = () => {', 'const handleSave = async () => {');
  fs.writeFileSync(f, code);
});
console.log('Fixed handleSave');
