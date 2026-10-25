"""อัปเดตข้อมูลทั้งหมดใน demo/index.html จาก CSV (คำสั่งเดียวจบ)
รัน:  python3 scripts/build_dashboard.py [--orders path] [--claims path]   (ต้องมี pandas)

เปลี่ยน dataset ใหม่: วางไฟล์ใหม่แทน data/orders_clean.csv และ data/claims.clean.csv แล้วรันคำสั่งนี้
- ถ้าชื่อคอลัมน์ต่างจากเดิม แก้ที่ COLS ด้านล่างเพียงจุดเดียว
- ปี หมวดสินค้า เหตุผลการคืน ตัวกรอง ตัวเลขทั้งหมด และออเดอร์ตัวอย่างฝั่งลูกค้า จะเปลี่ยนตามข้อมูลเอง
- หมวด/เหตุผลที่ไม่มีชื่อภาษาไทยจะแสดงเป็นชื่อเดิมในไฟล์ (เพิ่มชื่อไทยได้ที่ RTHG/CTHG ใน index.html)
"""
import pandas as pd, json, os, re, sys, argparse
COLS=dict(order_id="orderId",order_date="orderDate",category="productCategory",price="productPrice",qty="orderQuantity",
          claim_order_id="orderId",reason="returnReason",days="daysToReturn",status="status")
root=os.path.join(os.path.dirname(os.path.abspath(__file__)),"..")
ap=argparse.ArgumentParser();ap.add_argument("--orders",default=os.path.join(root,"data","orders_clean.csv"));ap.add_argument("--claims",default=os.path.join(root,"data","claims.clean.csv"))
a=ap.parse_args()
o=pd.read_csv(a.orders);c=pd.read_csv(a.claims)
need_o=[COLS[k] for k in("order_id","order_date","category","price","qty")];need_c=[COLS[k] for k in("claim_order_id","reason","days")]
for df,need,name in((o,need_o,a.orders),(c,need_c,a.claims)):
    miss=[x for x in need if x not in df.columns]
    if miss: sys.exit(f"ไฟล์ {name} ไม่มีคอลัมน์ {miss} — แก้ชื่อคอลัมน์ใน COLS ของสคริปต์นี้ (คอลัมน์ที่พบ: {list(df.columns)})")
o=o.rename(columns={COLS["order_id"]:"orderId",COLS["order_date"]:"orderDate",COLS["category"]:"productCategory",COLS["price"]:"productPrice",COLS["qty"]:"orderQuantity"})
c=c.rename(columns={COLS["claim_order_id"]:"orderId",COLS["reason"]:"returnReason",COLS["days"]:"daysToReturn"})
o["orderDate"]=pd.to_datetime(o.orderDate,errors="coerce")
bad=o.orderDate.isna().sum()
if bad: print(f"คำเตือน: ข้ามออเดอร์ที่วันที่อ่านไม่ได้ {bad} แถว"); o=o.dropna(subset=["orderDate"])
c=c.drop_duplicates("orderId"); orphan=(~c.orderId.isin(o.orderId)).sum()
if orphan: print(f"คำเตือน: คำขอคืน {orphan} แถวไม่มีออเดอร์ในไฟล์ orders — ข้าม"); c=c[c.orderId.isin(o.orderId)]
m=o.merge(c[["orderId","returnReason","daysToReturn"]],on="orderId",how="left"); m["ret"]=m.returnReason.notna(); m["ym"]=m.orderDate.dt.strftime("%Y-%m")
ag=m.groupby(["ym","productCategory"]).agg(o=("orderId","count"),u=("orderQuantity","sum")).reset_index()
r=m[m.ret].groupby(["ym","productCategory","returnReason"]).agg(n=("orderId","count"),u=("orderQuantity","sum"),d=("daysToReturn","sum")).reset_index()
cats=sorted(o.productCategory.unique()); rs=sorted(c.returnReason.dropna().unique())
A=[[x.ym,cats.index(x.productCategory),int(x.o),int(x.u)] for x in ag.itertuples()]
R=[[x.ym,cats.index(x.productCategory),rs.index(x.returnReason),int(x.n),int(x.u),int(x.d)] for x in r.itertuples()]
open_=m[~m.ret].head(8)[["orderId","orderDate","productCategory","productPrice","orderQuantity"]].copy(); open_["orderDate"]=open_.orderDate.dt.strftime("%Y-%m-%d")
dd=json.dumps(dict(cats=cats,rs=rs,A=A,R=R),separators=(",",":"),ensure_ascii=False)
dj=json.dumps(dict(open=open_.to_dict("records")),ensure_ascii=False)
p=os.path.join(root,"demo","index.html"); html=open(p,encoding="utf-8").read()
html,n1=re.subn(r"const DD=\{.*?\};\n",lambda _:"const DD="+dd+";\n",html,count=1,flags=re.S)
html,n2=re.subn(r"^const D=\{.*?\};$",lambda _:"const D="+dj+";",html,count=1,flags=re.S|re.M)
assert n1==1 and n2==1,"ไม่พบบรรทัด const DD= / const D= ใน demo/index.html"
open(p,"w",encoding="utf-8").write(html)
print(f"อัปเดตแล้ว: {len(o):,} ออเดอร์, {len(c):,} คำขอคืน, {len(cats)} หมวด, {len(rs)} เหตุผล, {len(A)} แถวออเดอร์, {len(R)} แถวคืน")
