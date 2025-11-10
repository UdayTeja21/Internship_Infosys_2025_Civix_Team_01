
const mongoose = require('mongoose');
const Petition = require('./models/Petition');

async function testComparison() {
  await mongoose.connect(process.env.MONGO_URI);
  
  const petition = await Petition.findById('68c04dc29b6d49a9d89791af');
  const userId = '68beb64a4bf8eccdae731227';
  
  console.log('Petition creator:', petition.creator.toString());
  console.log('User ID:', userId);
  console.log('Match:', petition.creator.toString() === userId);
  console.log('Type of petition.creator:', typeof petition.creator.toString());
  console.log('Type of userId:', typeof userId);
}

testComparison();