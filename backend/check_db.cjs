const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/nexhook').then(async () => {
  const users = await mongoose.connection.collection('adminusers').find().toArray();
  console.log('Users in DB:', users);
  process.exit();
});
