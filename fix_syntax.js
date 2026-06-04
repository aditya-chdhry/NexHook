const fs = require('fs');

function fixFile(file, getFn, setFn, saveFn, delFn) {
  let code = fs.readFileSync(file, 'utf8');
  
  // Fix reload syntax error
  code = code.replace(`const reload = () => { (); ${setFn}(${getFn}()); };`, `const reload = async () => ${setFn}(await ${getFn}());`);
  code = code.replace(`useEffect(reload, []);`, `useEffect(() => { reload(); }, []);`);
  
  // Fix onChange save
  code = code.replace(new RegExp(`onChange=\\{e=>\\{${saveFn}\\(\\{\\.\\.\\..+?\\}\\);reload\\(\\);\\}\\}`, 'g'), (match) => {
    return match.replace(`onChange={e=>{${saveFn}(`, `onChange={async e=>{await ${saveFn}(`).replace(`);reload();}}`, `);await reload();}}`);
  });

  // Fix handleDelete
  code = code.replace(new RegExp(`${delFn}\\((.+?)\\); reload\\(\\);`, 'g'), `await ${delFn}($1); await reload();`);
  code = code.replace(new RegExp(`const handleDelete = \\(?(id)\\)? => \\{`, 'g'), `const handleDelete = async (id) => {`);

  fs.writeFileSync(file, code);
}

fixFile('src/admin/Leads.js', 'getLeads', 'setLeads', 'saveLead', 'deleteLead');
fixFile('src/admin/Invoices.js', 'getInvoices', 'setInvoices', 'saveInvoice', 'deleteInvoice');
fixFile('src/admin/Clients.js', 'getClients', 'setClients', 'saveClient', 'deleteClient');
fixFile('src/admin/Payments.js', 'getPayments', 'setPayments', 'savePayment', 'deletePayment');
console.log('Fixed syntax errors');
