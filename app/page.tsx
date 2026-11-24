"use client";

import { useState } from "react";
import { ArrowUpRight, ChevronDown, CircleHelp, Menu, Package, ShieldCheck, Sparkles, Wallet } from "lucide-react";

const cases = [
  { name: "STARTER", price: 99, color: "blue", tag: "ДЛЯ НОВИЧКОВ", item: "★", subtitle: "Первый шаг" },
  { name: "RED ALERT", price: 249, color: "red", tag: "ПОПУЛЯРНЫЙ", item: "✦", subtitle: "Красная коллекция" },
  { name: "PHANTOM", price: 499, color: "violet", tag: "РЕДКИЕ СКИНЫ", item: "◈", subtitle: "Охота за редкостью" },
  { name: "ELITE", price: 999, color: "gold", tag: "ПРЕМИУМ", item: "✧", subtitle: "Высокий риск" },
];

const drops = [
  { name: "AK-47 | Slate", rarity: "ЗАПРЕЩЁННОЕ", tone: "purple", value: "320 ₽" },
  { name: "AWP | Atheris", rarity: "ЗАСЕКРЕЧЕННОЕ", tone: "pink", value: "740 ₽" },
  { name: "USP-S | Cortex", rarity: "ЗАСЕКРЕЧЕННОЕ", tone: "pink", value: "510 ₽" },
  { name: "★ Нож | Doppler", rarity: "ТАЙНОЕ", tone: "gold", value: "8 900 ₽" },
];

export default function Home() {
  const [balance, setBalance] = useState(1500);
  const [selected, setSelected] = useState<number | null>(null);
  const [opening, setOpening] = useState(false);
  const [result, setResult] = useState<(typeof drops)[number] | null>(null);
  const [notice, setNotice] = useState("");

  function openCase(index: number) {
    const chosen = cases[index];
    if (balance < chosen.price || opening) {
      setNotice("Недостаточно демонстрационных средств.");
      return;
    }
    setBalance((value) => value - chosen.price);
    setSelected(index);
    setResult(null);
    setOpening(true);
    setNotice("");
    window.setTimeout(() => {
      setResult(drops[Math.floor(Math.random() * drops.length)]);
      setOpening(false);
    }, 1600);
  }

  return (
    <main className="site-shell">
      <div className="topline"><span><i className="live-dot" /> DEMO-СЕРВЕР РАБОТАЕТ</span><span>VENTADROP COMMUNITY <b>RU</b></span></div>
      <header className="header wrap">
        <a className="brand" href="#"><span className="brand-mark"><Package size={22} /></span><span>VENTA<span className="orange">DROP</span><small>CASE OPENING</small></span></a>
        <nav><a className="active" href="#cases">КЕЙСЫ</a><a href="#how">КАК ЭТО РАБОТАЕТ</a><a href="#drops">ПРЕДМЕТЫ</a></nav>
        <div className="header-actions"><div className="balance"><Wallet size={16}/><span>{balance.toLocaleString("ru-RU")} ₽</span></div><button className="profile-btn" onClick={() => setNotice("Профиль и авторизация появятся на следующем этапе.")}>МОЙ ПРОФИЛЬ <ArrowUpRight size={15}/></button><button className="mobile-menu" aria-label="Меню"><Menu/></button></div>
      </header>

      <section className="hero wrap">
        <div className="hero-copy">
          <div className="eyebrow"><Sparkles size={14}/> ОТКРЫВАЙ. СОБИРАЙ. ПОБЕЖДАЙ.</div>
          <h1>ТВОЙ ДРОП.<br/><span>ТВОИ ПРАВИЛА.</span></h1>
          <p>Открывай тематические кейсы, находи редкие предметы и собирай собственную коллекцию.</p>
          <a className="primary-btn" href="#cases">ВЫБРАТЬ КЕЙС <ArrowUpRight size={17}/></a>
          <div className="hero-note"><ShieldCheck size={15}/> ДЕМО-РЕЖИМ · БЕЗ РЕАЛЬНЫХ ПЛАТЕЖЕЙ</div>
        </div>
        <div className="hero-art" aria-label="Декоративная иллюстрация кейса">
          <div className="orbit orbit-one"/><div className="orbit orbit-two"/>
          <div className="hero-glow"/>
          <div className="hero-case"><div className="case-top">VD / 01</div><div className="case-emblem">V</div><div className="case-label">VENTA<br/>DROP</div><div className="case-bottom">SPECIAL DROP SERIES</div></div>
          <div className="float-chip chip-one">★ RARE DROP</div><div className="float-chip chip-two">CASE #001</div>
        </div>
      </section>

      <section className="stats wrap">
        <div><strong>4</strong><span>ДЕМО-КЕЙСА</span></div><div><strong>∞</strong><span>ВОЗМОЖНОСТЕЙ</span></div><div><strong>24/7</strong><span>ОТКРЫТИЯ В ДЕМО</span></div><div className="stats-caption">ТВОЯ КОЛЛЕКЦИЯ<br/><b>НАЧИНАЕТСЯ ЗДЕСЬ</b></div>
      </section>

      <section className="section wrap" id="cases">
        <div className="section-heading"><div><div className="eyebrow">ПОДБЕРИ СВОЙ ДРОП</div><h2>ВЫБЕРИ <span>КЕЙС</span></h2></div><a href="#how" className="text-link">КАК ЭТО РАБОТАЕТ <ArrowUpRight size={15}/></a></div>
        <div className="case-grid">
          {cases.map((item, index) => <article className={`case-card ${item.color}`} key={item.name}>
            <div className="case-card-top"><span>{item.tag}</span><span>VD / 0{index + 1}</span></div>
            <div className="case-visual"><div className="case-ring"/><div className="case-cube"><span>{item.item}</span></div></div>
            <div className="case-info"><div><h3>{item.name}</h3><p>{item.subtitle}</p></div><div className="case-price">{item.price} <small>₽</small></div></div>
            <button className="open-btn" onClick={() => openCase(index)} disabled={opening}>ОТКРЫТЬ КЕЙС <ArrowUpRight size={16}/></button>
          </article>)}
        </div>
        {notice && <p className="notice">{notice}</p>}
      </section>

      {(opening || result) && <section className="opening-panel wrap">
        <div className="section-heading"><div><div className="eyebrow">МОМЕНТ ИСТИНЫ</div><h2>{opening ? "ОТКРЫВАЕМ..." : "ТВОЙ ДРОП"}</h2></div><span className="demo-label">DEMO</span></div>
        <div className={`roulette ${opening ? "spinning" : ""}`}><div className="roulette-pointer"/>{opening ? <div className="roulette-placeholder">✦</div> : result && <div className={`drop-result ${result.tone}`}><span>✦</span><b>{result.name}</b><small>{result.rarity} · {result.value}</small></div>}</div>
        {result && <p className="result-caption">Предмет выпал в демонстрационном режиме. Реальные предметы не выдаются.</p>}
      </section>}

      <section className="section wrap" id="drops">
        <div className="section-heading"><div><div className="eyebrow">ЧТО МОЖНО НАЙТИ</div><h2>ПРИМЕРЫ <span>ДРОПОВ</span></h2></div></div>
        <div className="drop-grid">{drops.map((drop) => <div className={`drop-card ${drop.tone}`} key={drop.name}><div className="drop-icon">✦</div><div><b>{drop.name}</b><small>{drop.rarity}</small></div><strong>{drop.value}</strong></div>)}</div>
      </section>

      <section className="how wrap" id="how"><div className="how-icon"><CircleHelp size={24}/></div><div><div className="eyebrow">ПРОСТО И ПОНЯТНО</div><h2>КАК ЭТО <span>РАБОТАЕТ</span></h2><p>Выбери кейс → запусти открытие → получи случайный демонстрационный предмет. Вероятности, экономика и серверная логика будут настроены отдельно до запуска реальной версии.</p></div></section>
      <footer className="footer wrap"><a className="brand" href="#"><span className="brand-mark"><Package size={18}/></span><span>VENTA<span className="orange">DROP</span><small>CASE OPENING</small></span></a><span>© 2026 VENTADROP · ПРОТОТИП</span><span>ДЕМО-БАЛАНС НЕ ИМЕЕТ ДЕНЕЖНОЙ ЦЕННОСТИ</span></footer>
    </main>
  );
}
