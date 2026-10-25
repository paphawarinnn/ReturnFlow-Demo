"""สรุปข้อมูลจาก CSV เป็น JSON (agg.json) ที่ฝังอยู่ใน demo/index.html
รัน: python3 scripts/build_agg.py   (ต้องมี pandas)"""
import pandas as pd, json, os
base=os.path.join(os.path.dirname(__file__),"..","data")
o=pd.read_csv(os.path.join(base,"orders_clean.csv"),parse_dates=["orderDate"])
c=pd.read_csv(os.path.join(base,"claims.clean.csv"),parse_dates=["returnDate"])
m=o.merge(c,on="orderId",how="left"); m["ret"]=m.status.notna(); m["ym"]=m.orderDate.dt.strftime("%Y-%m")
tr=m.groupby("ym").agg(orders=("orderId","count"),returns=("ret","sum"),units=("orderQuantity","sum")).reset_index()
tr["retUnits"]=tr.ym.map(m[m.ret].groupby("ym").orderQuantity.sum()).fillna(0).astype(int)
cat=m.groupby("productCategory").agg(orders=("orderId","count"),units=("orderQuantity","sum")).reset_index()
cat["retUnits"]=cat.productCategory.map(m[m.ret].groupby("productCategory").orderQuantity.sum())
cat["retOrders"]=cat.productCategory.map(m[m.ret].groupby("productCategory").size())
r=m[m.ret]
cols=["orderId","orderDate","productCategory","productPrice","orderQuantity"]
op=m[~m.ret].head(8)[cols].copy(); op["orderDate"]=op.orderDate.dt.strftime("%Y-%m-%d")
d=dict(orders=len(o),units=int(o.orderQuantity.sum()),claims=len(c),retUnits=int(r.orderQuantity.sum()),
 val=round(float((r.productPrice*r.orderQuantity).sum()),2),avgDays=round(float(c.daysToReturn.mean()),1),
 trend=tr.to_dict("records"),cat=cat.to_dict("records"),reasons=c.returnReason.value_counts().to_dict(),open=op.to_dict("records"))
json.dump(d,open(os.path.join(os.path.dirname(__file__),"agg.json"),"w"),default=int,ensure_ascii=False)
print("wrote agg.json",d["claims"],"claims")
