-- Demo-only credits. Never treat these credits as money or withdrawable value.
create extension if not exists pgcrypto;
create table if not exists public.profiles(id uuid primary key, display_name text, demo_balance bigint not null default 0 check(demo_balance>=0), created_at timestamptz not null default now());
create table if not exists public.demo_balance_ledger(id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id), amount bigint not null check(amount<>0), balance_after bigint not null check(balance_after>=0), reason text not null, reference text not null unique, created_at timestamptz not null default now());
create or replace function public.admin_adjust_demo_balance(p_user_id uuid,p_amount bigint,p_reason text,p_reference text) returns jsonb language plpgsql security definer set search_path=public as $$
declare v_balance bigint;
begin
 if p_amount=0 or abs(p_amount)>1000000 or length(trim(p_reason))<4 then raise exception 'Invalid adjustment'; end if;
 update public.profiles set demo_balance=demo_balance+p_amount where id=p_user_id and demo_balance+p_amount>=0 returning demo_balance into v_balance;
 if not found then raise exception 'Profile missing or insufficient demo balance'; end if;
 insert into public.demo_balance_ledger(user_id,amount,balance_after,reason,reference) values(p_user_id,p_amount,v_balance,left(trim(p_reason),240),p_reference);
 return jsonb_build_object('user_id',p_user_id,'amount',p_amount,'balance_after',v_balance);
end;$$;
revoke all on function public.admin_adjust_demo_balance(uuid,bigint,text,text) from public,anon,authenticated;
grant execute on function public.admin_adjust_demo_balance(uuid,bigint,text,text) to service_role;
