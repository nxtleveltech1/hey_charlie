import { Client } from 'pg';
import { readFile } from 'node:fs/promises';
import { getPackageBySlug } from '../src/lib/content/packages';
const client = new Client({connectionString: process.env.DATABASE_URL});
await client.connect();
const replacement = (value: string) => value.replace(/Victoria\s*(?:&|and)\s*Alfred Waterfront|V(?:&amp;|&| and )A(?: Waterfront)?/gi, 'Houtbay Harbor').replace(/Hout Bay & Houtbay Harbor/g, 'Houtbay Harbor');
try {
 await client.query('BEGIN');
 const targets: Record<string,string[]> = {packages:['name','tagline','description','highlights'],site_settings:['location'],articles:['title','excerpt','content','tags'],crew_members:['bio'],weather_alerts:['title','message']};
 const counts: Record<string,number> = {};
 for(const [table,columns] of Object.entries(targets)) {
  const rows=await client.query(`SELECT id, ${columns.map(c=>'"'+c+'"').join(',')} FROM "${table}" FOR UPDATE`);
  counts[table]=0;
  for(const row of rows.rows) {
   const changed: Record<string,unknown>={};
   for(const col of columns){const v=row[col]; const next=typeof v==='string'?replacement(v):Array.isArray(v)?v.map(x=>typeof x==='string'?replacement(x):x):v; if(JSON.stringify(v)!==JSON.stringify(next)) changed[col]=next;}
   const entries=Object.entries(changed); if(!entries.length)continue;
   await client.query(`UPDATE "${table}" SET ${entries.map(([col],i)=>'"'+col+'"=$'+(i+1)).join(',')} WHERE id=$${entries.length+1}`,[...entries.map(([,v])=>v),row.id]); counts[table]++;
  }
 }
 const pkg=getPackageBySlug('sundowner-cruise'); if(!pkg)throw Error('Missing sundowner content');
 const bytes=await readFile('public/images/atlantic-sundowner-cruise.png');
 const media=await client.query('INSERT INTO media_assets(filename,mime_type,size_bytes,data) VALUES($1,$2,$3,$4) RETURNING id',['atlantic-sundowner-cruise.png','image/png',bytes.length,bytes.toString('base64')]);
 const url='/api/media/'+media.rows[0].id;
 await client.query('UPDATE packages SET tagline=$1,description=$2,highlights=$3,image_url=$4,updated_at=now() WHERE slug=$5',[pkg.tagline,pkg.longDescription,pkg.highlights,url,pkg.slug]);
 const coast=getPackageBySlug('coastline-explorer');
 if(coast) await client.query('UPDATE packages SET description=$1,tagline=$2,highlights=$3,updated_at=now() WHERE slug=$4',[coast.longDescription,coast.tagline,coast.highlights,coast.slug]);
 await client.query("ALTER TABLE bookings ALTER COLUMN departure_location SET DEFAULT 'hout-bay'");
 await client.query("ALTER TABLE site_settings ALTER COLUMN location SET DEFAULT 'Houtbay Harbor, Cape Town'");
 const migrated=await client.query("UPDATE bookings SET departure_location='hout-bay',updated_at=now() WHERE departure_location='va-waterfront'");
 await client.query('COMMIT'); console.log(JSON.stringify({updated:counts,departuresUpdated:migrated.rowCount,imageUrl:url}));
} catch(e){await client.query('ROLLBACK');throw e;} finally{await client.end();}
