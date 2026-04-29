const connectDB = require('./config/connectDB');
const UserModel = require('./models/user.model');
const AddressModel = require('./models/address.model');

async function fixChetanPhone() {
  await connectDB();
  console.log('Connected, fixing Chetan phone...');

  const phone = '9876543210';

  // Update Chetan users
  const usersUpdated = await UserModel.updateMany({
    name: /Chetan/i
  }, { $set: { mobile: phone } });
  console.log(`Updated ${usersUpdated.modifiedCount} Chetan users with mobile ${phone}`);

  // Update Chetan addresses
  const addressesUpdated = await AddressModel.updateMany({
    name: /Chetan/i
  }, { $set: { mobile: phone } });
  console.log(`Updated ${addressesUpdated.modifiedCount} Chetan addresses with mobile ${phone}`);

  console.log('Fix complete. Restart servers to see updated orders.');
  process.exit(0);
}

fixChetanPhone().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});

