import crypto from 'crypto';

const masterId = 'workmj.work@gmail.com';
const password = 'Manish@2006';

// Hash password using SHA-256
const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

console.log('Master Admin Setup:');
console.log('==================');
console.log(`Master ID: ${masterId}`);
console.log(`Password (hashed): ${hashedPassword}`);
console.log('\nSQL to execute:');
console.log(`INSERT INTO admin_users (adminId, name, password, isActive, isMasterAdmin, createdAt) VALUES ('${masterId}', 'Master Admin', '${hashedPassword}', 'true', 'true', NOW());`);
