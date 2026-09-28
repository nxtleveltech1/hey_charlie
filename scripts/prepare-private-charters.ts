import {Client} from 'pg';
const c=new Client({connectionString:process.env.DATABASE_URL});await c.connect();
await c.query('ALTER TABLE bookings ADD COLUMN IF NOT EXISTS charter_duration text');
for(const [slug,name] of [['private-lunch','Lunch'],['private-drinks','Drinks']]){
 await c.query(`INSERT INTO addons(slug,name,description,price,price_unit,is_active,allow_quantity,max_quantity,display_order) VALUES($1,$2,$3,500,'per_person',true,false,1,0) ON CONFLICT(slug) DO UPDATE SET price=500,price_unit='per_person',is_active=true`,[slug,name,`Optional ${name.toLowerCase()} for your private charter, R500 per person.`]);
}
console.log('Duration storage and private charter add-ons prepared');await c.end();
