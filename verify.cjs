const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const elements=new Map();const values={'#search':'','#sort':'featured'};
const element=selector=>{if(!elements.has(selector))elements.set(selector,{value:values[selector]||'',innerHTML:'',textContent:'',classList:{add(){},remove(){}},addEventListener(){},setAttribute(){},focus(){}});return elements.get(selector);};
const storage=new Map();const context=vm.createContext({document:{querySelector:element,querySelectorAll:()=>[],addEventListener(){},body:{style:{}}},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},setTimeout:()=>0,clearTimeout(){}});
vm.runInContext(fs.readFileSync(__dirname+'/app.js','utf8')+`\n globalThis.testAPI={setAnswers:a=>{routineAnswers=a;calculateRoutine();return {ids:[...routineIds],message:routineMessage,total:routineIds.reduce((s,id)=>s+products.find(p=>p.id===id).price,0)}},add,cart:()=>({...cart}),clear:()=>{cart={};saveCart()},renderBag,renderProducts,setFilter:v=>{filter=v},products};`,context);
const api=context.testAPI;
let r=api.setAnswers({pace:'layered',texture:'light',budget:'2200'});assert.equal(r.total,2100);assert.equal(r.ids.length,2);assert.match(r.message,/left out the optional essence/);
r=api.setAnswers({pace:'layered',texture:'rich',budget:'2200'});assert.equal(r.total,2300);assert.match(r.message,/above your/);
r=api.setAnswers({pace:'layered',texture:'rich',budget:'3500'});assert.equal(r.total,3400);assert.equal(r.ids.length,3);
r=api.setAnswers({pace:'simple',texture:'light',budget:'any'});assert.equal(r.total,2100);assert.equal(r.ids.length,2);
api.clear();api.add('cleanser');api.renderBag();assert.match(element('#bag-dialog').innerHTML,/₹949/);api.add('gel');api.renderBag();assert.match(element('#bag-dialog').innerHTML,/Included/);assert.match(element('#bag-dialog').innerHTML,/₹2,100/);api.add('cleanser',19);api.add('cleanser');assert.equal(api.cart().cleanser,20);
api.setFilter('Moisturize');element('#search').value='cocoon';api.renderProducts();assert.match(element('#products').innerHTML,/Soft Cocoon/);assert.doesNotMatch(element('#products').innerHTML,/Petal Gel/);
element('#search').value='no-match';api.renderProducts();assert.match(element('#products').innerHTML,/No essentials found/);
for(const p of api.products)assert.ok(fs.existsSync(__dirname+'/assets/'+p.id+'.webp'),p.id+' photo missing');
const html=fs.readFileSync(__dirname+'/index.html','utf8');for(const match of html.matchAll(/(?:src|href)="([^"#][^"]*)"/g)){const path=match[1];if(!/^(https?:|mailto:)/.test(path))assert.ok(fs.existsSync(__dirname+'/'+path),path+' missing');}
assert.doesNotMatch(html,/dewroom/i);assert.doesNotMatch(fs.readFileSync(__dirname+'/app.js','utf8'),/dewroom/i);
console.log('Passed: budget-aware routine selection, optional steps, delivery totals, quantity limits, product discovery, empty states, asset references and Dewelle branding.');
