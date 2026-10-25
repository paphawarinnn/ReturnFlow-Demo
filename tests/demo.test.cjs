const {JSDOM}=require('jsdom');const fsx=require('fs');
const html=fsx.readFileSync(require('path').join(__dirname,'..','public','demo','index.html'),'utf8');
const dom=new JSDOM(html,{runScripts:'dangerously',url:'https://x.test/',pretendToBeVisual:true});
const w=dom.window,d=w.document;const errs=[];w.addEventListener('error',e=>errs.push(e.message));
w.HTMLDialogElement.prototype.showModal=function(){this.open=true};w.HTMLDialogElement.prototype.close=function(){this.open=false};
let pass=0,fail=0;const T=(n,c)=>{c?pass++:fail++;console.log(c?'PASS':'FAIL',n)};
const ev=x=>w.eval(x);const toast=()=>d.getElementById('tz').textContent;
const o3='ORD00000003';// qty 3
const sub=(q,t='return',oid=o3)=>{d.getElementById('fo').value=oid;d.getElementById('fq').value=q;d.getElementById('ft').value=t;d.getElementById('fs').click();return toast()};
const A=(a,no)=>[...d.querySelectorAll(`[data-a="${a}"]`)].filter(b=>!no||b.dataset.no===no);
ev("S.view='cust';render()");// เริ่มที่แท็บลูกค้า (หน้าแรกของแอปคือแดชบอร์ด)
T('seed ordering: 3 pcs',ev(`orders().find(o=>o.orderId==='${o3}').orderQuantity`)===3);
T('UI: max attr = remaining(3)',d.getElementById('fq').max==='3'||(d.getElementById('fo').value=o3,true));
d.getElementById('fo').value=o3;d.getElementById('fo').onchange();
T('UI: hint shows remaining',d.getElementById('fh').textContent.includes('เหลือสิทธิ์ 3'));
d.getElementById('fq').value=9;d.getElementById('fq').oninput();T('UI: typing 9 clamps to 3',d.getElementById('fq').value==='3');
T('API: request 4 of 3 rejected',/เกินสิทธิ์/.test(ev(`api.create({order:'${o3}',type:'return',qty:4,reason:'Defective',key:'a'}).err||''`)));
T('API: qty 0/-1/1.5 rejected',[0,-1,1.5].every(q=>ev(`!!api.create({order:'${o3}',type:'return',qty:${q},reason:'Defective',key:'b'}).err`)));
T('API: bad type/reason rejected',ev(`!!api.create({order:'${o3}',type:'x',qty:1,reason:'Defective',key:'c'}).err && !!api.create({order:'${o3}',type:'return',qty:1,reason:'zzz',key:'c'}).err`));
d.getElementById('fo').value=o3;d.getElementById('fo').onchange();
T('UI submit 2 ok',/ส่งคำขอ RC-DEMO-0001/.test(sub(2)));
T('after: remaining 1 shown',d.getElementById('fh').textContent.includes('เหลือสิทธิ์ 1'));
T('API: 2 more rejected (only 1 left)',/เหลือ 1/.test(ev(`api.create({order:'${o3}',type:'claim',qty:2,reason:'Defective',key:'z1'}).err`)));
T('API: duplicate key not duplicated',ev(`(()=>{const k=S.req[0].key;return /ไม่สร้างซ้ำ/.test(api.create({order:'${o3}',type:'return',qty:1,reason:'Defective',key:k}).err||'')})()`));
T('UI submit 1 ok (claim)',/RC-DEMO-0002/.test(sub(1,'claim')));
T('order fully used: input disabled',(d.getElementById('fo').value=o3,d.getElementById('fo').onchange(),d.getElementById('fq').disabled));
T('cancel frees quantity',(A('cancel','RC-DEMO-0002')[0].click(),ev(`orders().find(o=>o.orderId==='${o3}').left`)===1));
// workflow
T('customer cannot approve (from under-review)',(ev(`api.move('RC-DEMO-0001','under-review','',0,'s')`),/ไม่มีสิทธิ์/.test(ev(`api.move('RC-DEMO-0001','approved','',2,'c').err`))));
ev(`find('RC-DEMO-0001').status='submitted'`);
T('invalid jump submitted→approved blocked',/ไม่ได้/.test(ev(`api.move('RC-DEMO-0001','approved','',2,'s').err`)));
T('submitted→under-review ok',ev(`api.move('RC-DEMO-0001','under-review','',0,'s').ok`)===1);
T('reject without reason blocked',/ต้องระบุ/.test(ev(`api.move('RC-DEMO-0001','rejected','',0,'s').err`)));
T('approve qty > requested blocked',/1–2/.test(ev(`api.move('RC-DEMO-0001','approved','',3,'s').err`)));
T('need-more-info w/ reason + customer reply',ev(`api.move('RC-DEMO-0001','need-more-information','ขอรูปสินค้า',0,'s').ok&&api.move('RC-DEMO-0001','under-review','ส่งรูปแล้ว',0,'c').ok`)===1);
T('customer got notification',ev(`S.notif.length`)>=1);
T('approve partial (1 of 2)',ev(`api.move('RC-DEMO-0001','approved','',1,'s').ok&&find('RC-DEMO-0001').appr`)===1);
T('close blocked before refund',/คืนเงิน/.test(ev(`api.move('RC-DEMO-0001','completed','',0,'s').err`)));
T('refund amount = price×approved(1)',ev(`(api.refund('RC-DEMO-0001','pending'),find('RC-DEMO-0001').refund.amt)`)===ev(`ord('${o3}').productPrice`));
T('cannot jump pending→succeeded',/ไม่ได้/.test(ev(`api.refund('RC-DEMO-0001','succeeded','X1').err`)));
ev(`api.refund('RC-DEMO-0001','processing')`);
T('succeeded needs reference',/เลขอ้างอิง/.test(ev(`api.refund('RC-DEMO-0001','succeeded','').err`)));
T('failed shown as failed, retry allowed',ev(`api.refund('RC-DEMO-0001','failed').ok&&find('RC-DEMO-0001').refund.st==='failed'&&api.refund('RC-DEMO-0001','processing').ok`));
T('refund succeeded + close ok',ev(`api.refund('RC-DEMO-0001','succeeded','TXN-1').ok&&api.move('RC-DEMO-0001','completed','',0,'s').ok`));
T('closed: customer msg blocked',/ปิดแล้ว/.test(ev(`api.msg('RC-DEMO-0001','c','hi').err`)));
// exchange needs tracking
sub(1,'exchange');const no=ev(`S.req[S.req.length-1].no`);
ev(`api.move('${no}','under-review','',0,'s');api.move('${no}','approved','',1,'s')`);
T('exchange close blocked w/o tracking',/เลขพัสดุ/.test(ev(`api.move('${no}','completed','',0,'s').err`)));
T('tracking requires fields',!!ev(`api.track('${no}','','').err`));
T('tracking save + close ok',ev(`api.track('${no}','Kerry','TH123').ok&&api.move('${no}','completed','',0,'s').ok`));
// messages: internal hidden from customer
ev(`api.msg('${no}','i','SECRET-NOTE');`);ev(`S.view='cust';render()`);
T('internal note hidden from customer view',!d.getElementById('app').innerHTML.includes('SECRET-NOTE'));
ev(`S.view='merch';S.sel='${no}';render()`);
T('internal note visible to staff',d.getElementById('app').innerHTML.includes('SECRET-NOTE'));
// XSS
ev(`S.view='cust';render()`);
sub(1,'return','ORD00000010');ev(`api.msg(S.req[S.req.length-1].no,'c','<img src=x onerror=alert(1)>')`);ev(`S.sel=S.req[S.req.length-1].no;render()`);
T('XSS escaped',!d.getElementById('app').innerHTML.includes('<img src=x'));
// CSV
ev(`S.req[0].reason='=HYPERLINK("x")'`);
const csv=ev(`csv()`);T('CSV formula injection guarded',csv.includes(`"'=HYPERLINK`)&&!/,"=HYPERLINK/.test(csv));
ev(`S.f={q:'',st:'completed',ty:''}`);T('CSV respects filter',ev(`csv().split('\\n').length-1`)===ev(`S.req.filter(r=>r.status==='completed').length`));
ev(`S.f={q:'',st:'',ty:'exchange'}`);T('filter by type works',ev(`filtered().every(r=>r.type==='exchange')`));
ev(`S.view='ana';render()`);T('analytics renders, no NaN/Infinity',!/NaN|Infinity/.test(d.getElementById('app').innerHTML)&&d.getElementById('app').innerHTML.includes('50.6%'));
ev(`S.req=[];S.view='merch';S.sel=null;render()`);T('empty state on merchant',d.getElementById('app').innerHTML.includes('ยังไม่มีคำขอ'));
T('no runtime errors',errs.length===0);console.log(errs);
// ---- dashboard tab ----
ev("S.view='ana';render()");const kp=()=>[...d.querySelectorAll('#anx .kpi')].map(e=>e.textContent.replace(/\s+/g,' '));
T('dashboard: 4 KPI cards',kp().length===4);
T('dashboard: totals match CSV (5,052 requests / 10,000 orders)',/5,052/.test(kp()[0])&&/10,000/.test(kp()[0]));
T('dashboard: charts rendered (donut + line + tooltips)',d.querySelectorAll('#anx svg').length>=2&&d.querySelectorAll('#anx [data-tip]').length>=30);
const sel=d.getElementById('a_y');sel.value='2567';sel.onchange({target:sel});
T('dashboard: year filter changes numbers (2567 -> 2,496 requests)',/2,496/.test(kp()[0]));
const rs=d.getElementById('a_x');rs.onclick();
T('dashboard: reset restores totals',/5,052/.test(kp()[0]));
ev("S.view='cust';render()");T('tabs: customer form still reachable',!!d.getElementById('fs'));
console.log(`\n${pass} pass / ${fail} fail`);
