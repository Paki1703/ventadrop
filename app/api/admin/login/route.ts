import {NextRequest,NextResponse} from "next/server";
import {createHmac,timingSafeEqual} from "node:crypto";
export const runtime="nodejs";
export async function POST(req:NextRequest){
 const pass=process.env.ADMIN_PASSWORD,secret=process.env.ADMIN_SESSION_SECRET;
 if(!pass||!secret)return NextResponse.json({error:"Настрой ADMIN_PASSWORD и ADMIN_SESSION_SECRET в Vercel."},{status:503});
 const body=await req.json().catch(()=>({})),a=Buffer.from(String(body.password??"")),b=Buffer.from(pass);
 if(a.length!==b.length||!timingSafeEqual(a,b))return NextResponse.json({error:"Неверный пароль."},{status:401});
 const exp=String(Date.now()+8*60*60*1000),sig=createHmac("sha256",secret).update(exp).digest("hex"),res=NextResponse.json({ok:true});
 res.cookies.set("vd_admin",`${exp}.${sig}`,{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"strict",path:"/",maxAge:28800});return res;
}
