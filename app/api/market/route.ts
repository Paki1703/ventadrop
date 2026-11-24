import { NextResponse } from "next/server";
export const revalidate = 300;
export async function GET() {
  try {
    const r = await fetch("https://api.skinport.com/v1/items?app_id=730&currency=RUB&tradable=1",{headers:{"Accept-Encoding":"br"},next:{revalidate:300}});
    if(!r.ok) return NextResponse.json({items:[],source:"Skinport",error:`HTTP ${r.status}`},{status:502});
    const raw=await r.json();
    const items=Array.isArray(raw)?raw.filter((x:any)=>x?.market_hash_name && Number.isFinite(Number(x.min_price??x.suggested_price))).slice(0,120).map((x:any)=>({name:x.market_hash_name,price:Number(x.min_price??x.suggested_price),median:x.median_price==null?null:Number(x.median_price),quantity:Number(x.quantity??0),url:x.item_page??null})):[];
    return NextResponse.json({items,source:"Skinport",updated:new Date().toISOString()});
  } catch { return NextResponse.json({items:[],source:"Skinport",error:"Marketplace unavailable"},{status:502}); }
}
