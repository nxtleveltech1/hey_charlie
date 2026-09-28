import assert from 'node:assert/strict';
import {privateCharterPricing,PRIVATE_OPTIONS,addonsForPackage} from '../src/lib/private-charters';
import {calculateBookingTotal} from '../src/lib/addon-pricing';
import {db} from '../src/db';import {addons} from '../src/db/schema';import {TIME_SLOTS} from '../src/lib/booking-utils';
const available=addonsForPackage((await db.select().from(addons)).filter(a=>a.isActive),'private-celebration');
for (const slug of ['jetski-2-hours','jetski-full-day','shuttle-pickup','shuttle-dropoff']) assert.ok(available.some(a=>a.slug===slug), `${slug} must remain available`);
assert.ok(!available.some(a=>['catering','refreshments','catering-refreshments'].includes(a.slug)));
const catalogue=available.filter(a=>['private-lunch','private-drinks'].includes(a.slug));
assert.equal(addonsForPackage(catalogue,"sundowner-cruise").length,0);
assert.equal(catalogue.length,2);for(const a of catalogue){assert.equal(Number(a.price),500);assert.equal(a.priceUnit,'per_person');}
let combinations=0;
for(const option of PRIVATE_OPTIONS){const slots=option.id==='full-day'?TIME_SLOTS.map(s=>s.id):[TIME_SLOTS[0].id];const price=privateCharterPricing(option.id,slots);assert.equal(price.pricePerPerson,option.price);
 for(let mask=0;mask<4;mask++){const selection=Object.fromEntries(catalogue.filter((_,i)=>mask&(1<<i)).map(a=>[a.id,1]));const total=calculateBookingTotal(price.pricePerPerson,6,selection,catalogue);assert.equal(total.totalPrice,(option.price+500*Object.keys(selection).length)*6);combinations++;}}
assert.throws(()=>privateCharterPricing(undefined,['morning']));assert.throws(()=>privateCharterPricing('full-day',['morning']));assert.throws(()=>privateCharterPricing('one-hour',TIME_SLOTS.map(s=>s.id)));
console.log(`${combinations} duration/add-on totals passed; invalid duration/window combinations rejected.`);
