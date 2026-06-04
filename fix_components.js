const fs = require('fs');
const files = ['Leads.js', 'Invoices.js', 'Clients.js', 'Payments.js'];

files.forEach(f => {
  let content = fs.readFileSync('src/admin/' + f, 'utf8');
  
  // Fix imports (remove initAdminData and genId)
  content = content.replace(/initAdminData,*\s*/g, '');
  content = content.replace(/genId,*\s*/g, '');
  
  // Fix reload
  const getFunc = f === 'Leads.js' ? 'getLeads' : f === 'Invoices.js' ? 'getInvoices' : f === 'Clients.js' ? 'getClients' : 'getPayments';
  const setFunc = f === 'Leads.js' ? 'setLeads' : f === 'Invoices.js' ? 'setInvoices' : f === 'Clients.js' ? 'setClients' : 'setPayments';
  
  content = content.replace(
    new RegExp(`const reload = \\(\\) => ${setFunc}\\(${getFunc}\\(\\)\\);`, 'g'),
    `const reload = async () => ${setFunc}(await ${getFunc}());`
  );
  
  // Fix save logic
  // find: saveLead(toSave); reload(); close();
  const saveFunc = f === 'Leads.js' ? 'saveLead' : f === 'Invoices.js' ? 'saveInvoice' : f === 'Clients.js' ? 'saveClient' : 'savePayment';
  
  content = content.replace(new RegExp(`${saveFunc}\\(toSave\\);\\s*reload\\(\\);`, 'g'), `await ${saveFunc}(toSave); await reload();`);
  content = content.replace(/const handleSubmit = \(e\) => \{/g, 'const handleSubmit = async (e) => {');
  
  // Fix inline status changes
  content = content.replace(new RegExp(`onChange=\\{e => \\{ ${saveFunc}\\(\\{\\.\\.\\.([a-z]), status:e\\.target\\.value\\}\\); reload\\(\\); \\}\\}`, 'g'),
    `onChange={async e => { await ${saveFunc}({...$1, status:e.target.value}); await reload(); }}`);

  // Fix delete
  const delFunc = f === 'Leads.js' ? 'deleteLead' : f === 'Invoices.js' ? 'deleteInvoice' : f === 'Clients.js' ? 'deleteClient' : 'deletePayment';
  content = content.replace(new RegExp(`onClick=\\{\\(\\) => \\{ if\\(window\\.confirm\\('Sure\\?'\\)\\) \\{ ${delFunc}\\(([a-z]\\.id)\\); reload\\(\\); \\} \\}\\}`, 'g'),
    `onClick={async () => { if(window.confirm('Sure?')) { await ${delFunc}($1); await reload(); } }}`);
    
  // Kanban board specific client edits
  if (f === 'Clients.js') {
    content = content.replace(/onDrop=\{\(e\) => \{\n\s*const id = e\.dataTransfer\.getData\('id'\);\n\s*const c = clients\.find\(x => x\.id === id\);\n\s*if \(c\) \{ saveClient\(\{ \.\.\.c, stage: col \}\); reload\(\); \}\n\s*\}\}/g,
      `onDrop={async (e) => {
                  const id = e.dataTransfer.getData('id');
                  const c = clients.find(x => x.id === id);
                  if (c) { await saveClient({ ...c, stage: col }); await reload(); }
                }}`);
  }

  // Remove genId logic since backend handles it
  content = content.replace(/if \(!toSave\.id\) toSave\.id = .*/g, '');

  fs.writeFileSync('src/admin/' + f, content);
});
console.log('Fixed components');
