// Usage: node scripts/hash-password.js "your-password"  -> paste the output into .env as ADMIN_PASSWORD_HASH
const c=require('crypto');const p=process.argv[2];if(!p||p.length<10){console.error('Usage: node scripts/hash-password.js "<password of at least 10 characters>"');process.exit(1)}
const s=c.randomBytes(16).toString('hex');console.log(s+':'+c.scryptSync(p,s,64).toString('hex'));
