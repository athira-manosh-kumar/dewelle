const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const elements=new Map();const values={'#search':'','#sort':'featured'};
const element=selector=>{if(!elements.has(selector))elements.set(selector,{value:values[selector]||'',innerHTML:'',textContent:'',classList:{add(){},remove(){}},addEventListener(){},setAttribute(){},focus(){}});return elements.get(selector);};
const storage=new Map();const context=vm.createContext({document:{querySelector:element,querySelectorAll:()=>[],addEventListener(){},body:{style:{}}},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},setTimeout:()=>0,clearTimeout(){}});
vm.runInContext(fs.readFileSync(__dirname+'/catalog.js','utf8'),context);
vm.runInContext(fs.readFileSync(__dirname+'/app.js','utf8')+`\n globalThis.testAPI={setAnswers:a=>{routineAnswers=a;calculateRoutine();return {ids:[...routineIds],message:routineMessage,total:routineIds.reduce((s,id)=>s+products.find(p=>p.id===id).price,0)}},setGroup:v=>{group=v},matchingProducts,cartItems,toggleWishlist,wishlist:()=>[...wishlist],add,cart:()=>({...cart}),clear:()=>{cart={};saveCart()},renderBag,renderProducts,setFilter:v=>{filter=v},products};`,context);
const api=context.testAPI;
let r=api.setAnswers({pace:'layered',texture:'light',budget:'2200'});assert.equal(r.total,2100);assert.equal(r.ids.length,2);assert.match(r.message,/left out the optional essence/);
r=api.setAnswers({pace:'layered',texture:'rich',budget:'2200'});assert.equal(r.total,2300);assert.match(r.message,/above your/);
r=api.setAnswers({pace:'layered',texture:'rich',budget:'3500'});assert.equal(r.total,3400);assert.equal(r.ids.length,3);
r=api.setAnswers({pace:'simple',texture:'light',budget:'any'});assert.equal(r.total,2100);assert.equal(r.ids.length,2);
api.clear();api.add('cleanser');api.renderBag();assert.match(element('#bag-dialog').innerHTML,/₹949/);api.add('gel');api.renderBag();assert.match(element('#bag-dialog').innerHTML,/Included/);assert.match(element('#bag-dialog').innerHTML,/₹2,100/);api.add('cleanser',19);api.add('cleanser');assert.equal(api.cart().cleanser,20);
api.setFilter('Moisturize');element('#search').value='cocoon';api.renderProducts();assert.match(element('#products').innerHTML,/Soft Cocoon/);assert.doesNotMatch(element('#products').innerHTML,/Petal Gel/);
element('#search').value='no-match';api.renderProducts();assert.match(element('#products').innerHTML,/No products found/);

const html=fs.readFileSync(__dirname+'/index.html','utf8');for(const match of html.matchAll(/(?:src|href)="([^"#][^"]*)"/g)){const path=match[1];if(!/^(https?:|mailto:)/.test(path))assert.ok(fs.existsSync(__dirname+'/'+path),path+' missing');}
assert.doesNotMatch(html,/dewroom/i);assert.doesNotMatch(fs.readFileSync(__dirname+'/app.js','utf8'),/dewroom/i);
console.log('Passed: budget-aware routine selection, optional steps, delivery totals, quantity limits, product discovery, empty states, asset references and Dewelle branding.');

api.toggleWishlist("cleanser");assert.equal(api.wishlist().includes("cleanser"),true);assert.equal(JSON.parse(storage.get("dewelle-wishlist"))[0],"cleanser");api.toggleWishlist("cleanser");assert.equal(api.wishlist().length,0);
api.setFilter("All");element("#search").value="";api.renderProducts();assert.match(element("#products").innerHTML,/product.html\?product=cleanser/);assert.match(element("#products").innerHTML,/data-wish="cleanser"/);assert.doesNotMatch(html,/motion-toggle|01—03|04 \/|↗/);assert.ok(fs.existsSync(__dirname+"/product.html"));console.log("Passed: wishlist save/remove, dedicated product links, card actions and requested label removals.");
let detailPage;
context.document.createElement=()=>{detailPage={innerHTML:'',querySelector:s=>({outerHTML:'',insertAdjacentHTML(){}})};return detailPage;};
element('footer').before=()=>{};
vm.runInContext('renderProductPage("cleanser")',context);
assert.match(detailPage.innerHTML,/Cloud Cleanser/);assert.match(detailPage.innerHTML,/Ingredient direction/);assert.equal(context.document.title,'Cloud Cleanser — Dewelle');
vm.runInContext('renderProductPage("invalid")',context);assert.match(detailPage.innerHTML,/Product not found/);
console.log('Passed: product detail rendering and invalid product fallback.');

assert.equal(api.products.length,86);
api.setFilter('All');element('#search').value='';element('#skin-filter').value='Oily';let matches=api.matchingProducts();assert.ok(matches.some(p=>p.id==='gel'));assert.ok(!matches.some(p=>p.id==='cream'));
element('#skin-filter').value='';element('#ingredient-filter').value='Snail mucin';matches=api.matchingProducts();assert.equal(matches.length,2);element('#ingredient-filter').value='';
api.clear();api.add('sheer-balm',1,'Rose');api.add('sheer-balm',1,'Peach');assert.equal(api.cart()['sheer-balm~Rose'],1);assert.equal(api.cart()['sheer-balm~Peach'],1);api.renderBag();assert.match(element('#bag-dialog').innerHTML,/Petal Sheer Tint Balm · Rose/);assert.match(element('#bag-dialog').innerHTML,/Petal Sheer Tint Balm · Peach/);
api.clear();api.add('foot-mask');api.renderBag();assert.match(element('#bag-dialog').innerHTML,/₹449/);
const catalog=JSON.parse(fs.readFileSync(__dirname+'/catalog.json','utf8'));assert.equal(catalog.combos.length,14);for(const c of catalog.combos)for(const id of c.items)assert.ok(api.products.some(p=>p.id===id),c.id+' has invalid item');assert.equal(new Set(api.products.map(p=>p.id)).size,86);assert.ok(api.products.find(p=>p.id==='medicated-patches').notice.includes('not specified'));assert.ok(api.products.filter(p=>p.category==='Sun Care').every(p=>p.notice.includes('not a tested')));console.log('Passed: 86 products, 14 valid combos, skin/ingredient discovery, shade-specific bags and concept claim labels.');

for(const p of api.products)assert.ok(fs.existsSync(__dirname+'/'+p.image),p.id+' photo missing');

api.setFilter("All");element("#search").value="";element("#skin-filter").value="";element("#ingredient-filter").value="";api.setGroup("Hair");assert.ok(api.matchingProducts().every(p=>p.category==="Haircare"));api.setGroup("Body");assert.ok(api.matchingProducts().every(p=>p.category==="Body Care"));api.setGroup("Face");assert.ok(api.matchingProducts().every(p=>!["Haircare","Body Care","Men’s Edit","Accessories"].includes(p.category)));api.setGroup("All");for(const file of ["index.html","product.html","app.js"])assert.ok(!/[→←↓]/u.test(fs.readFileSync(__dirname+"/"+file,"utf8")));console.log("Passed: collection filters and internal links without arrows.");

const catalogue=JSON.parse(fs.readFileSync(__dirname+"/catalog.json","utf8"));for(const c of catalogue.combos)assert.ok(fs.existsSync(__dirname+"/assets/combos/"+c.id+".webp"));assert.ok(fs.readFileSync(__dirname+"/app.js","utf8").includes("assets/combos/${c.id}.webp"));console.log("Passed: all 14 single-scene combo image references.");
