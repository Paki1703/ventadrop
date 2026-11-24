import {NextRequest,NextResponse} from "next/server";
import {createHmac,timingSafeEqual,randomUUID} from "node:crypto";
export const runtime="nodejs";
function valid(v:string,s:string){const [e,h]=v.split(".");if(!e||!h||Number(e)<Date.now())return false;const a=Buffer.from(h),b=Buffer.from(createHmac("sha256",s).update(e).digest("hex"));return a.length===b.length&&timingSafeEqual(a,b);}
export async function POST(req:NextRequest){
 const secret=process.env.ADMIN_SESSION_SECRET;if(!secret||!valid(req.cookies.get("vd_admin")?.value??"",secret))return NextResponse.json({error:"Нет доступа."},{status:401});
 const url=process.env.SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY;if(!url||!key)return NextResponse.json({error:"Не настроены Supabase Environment Variables."},{status:503});
 const b=await req.json().catch(()=>({})),id=String(b.userId??""),amount=Number(b.amount),reason=String(b.reason??"").trim().slice(0,240);
 if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id))return NextResponse.json({error:"Некорректный UUID пользователя."},{status:400});
 if(!Number.isSafeInteger(amount)||amount===0||Math.abs(amount)>1000000||reason.length<4)return NextResponse.json({error:"Проверь сумму и причину операции."},{status:400});
 const r=await fetch(`${url.replace(/\/$/,"")}/rest/v1/rpc/admin_adjust_demo_balance`,{method:"POST",headers:{"Content-Type":"application/json","apikey":key,"Authorization":`Bearer ${key}`},body:JSON.stringify({p_user_id:id,p_amount:amount,p_reason:reason,p_reference:randomUUID()}),cache:"no-store"});
 const data=await r.json().catch(()=>null);if(!r.ok)return NextResponse.json({error:data?.message??"Ошибка Supabase RPC."},{status:502});return NextResponse.json({ok:true,result:data});
}
