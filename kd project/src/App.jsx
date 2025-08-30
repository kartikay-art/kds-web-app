import React, { useMemo, useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip as RTooltip, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import * as UI from "./components/ui/index.jsx";

const demoTrend = [
  { day: "Mon", views: 1200, ctr: 5.1, retention: 42 },
  { day: "Tue", views: 1800, ctr: 5.8, retention: 44 },
  { day: "Wed", views: 2400, ctr: 6.3, retention: 47 },
  { day: "Thu", views: 2100, ctr: 5.6, retention: 45 },
  { day: "Fri", views: 2800, ctr: 6.9, retention: 49 },
  { day: "Sat", views: 3300, ctr: 7.1, retention: 52 },
  { day: "Sun", views: 3000, ctr: 6.7, retention: 50 },
];

const radarData = [
  { metric: "Titles", score: 78 },
  { metric: "Descriptions", score: 72 },
  { metric: "Tags", score: 66 },
  { metric: "Thumbnails", score: 82 },
  { metric: "Captions", score: 58 },
  { metric: "Cards/Ends", score: 61 },
];

function scoreChannel({ name, description, tags = [], uploadsPerWeek, hasBranding, playlists, aboutLinks }) {
  let score = 0;
  score += /tutorial|review|official|academy|learn|tech|gaming|vlog|news/i.test(name || "") ? 10 : 4;
  const desc = description || "";
  score += Math.min(20, Math.floor(desc.length / 30));
  score += /(subscribe|join|follow|newsletter|discord|community)/i.test(desc) ? 5 : 0;
  score += Math.min(12, (tags?.length || 0) * 1.5);
  score += hasBranding ? 10 : 2;
  score += Math.min(12, (playlists || 0) * 2);
  score += Math.min(8, (aboutLinks || 0) * 2);
  if (uploadsPerWeek >= 2) score += 18; else if (uploadsPerWeek === 1) score += 10; else score += 3;
  return Math.max(0, Math.min(100, score));
}

function scoreVideo({ title, description, tags = [], hasChapters, hasEndScreens, hasCards, hasCaptions, thumbTextChars, thumbFaceVisible, hashtags = [] }) {
  let s = 0;
  const t = title || "";
  s += t.length >= 30 && t.length <= 70 ? 15 : 7;
  s += /(ultimate|beginners|2025|step|easy|fast|pro|secret|guide|best|tricks|how to)/i.test(t) ? 6 : 0;
  const d = description || "";
  s += Math.min(18, Math.floor(d.length / 40));
  s += /(timestamps|resources|links|cta|subscribe|free)/i.test(d) ? 6 : 0;
  s += Math.min(12, (tags?.length || 0) * 1.2);
  s += Math.min(5, (hashtags?.length || 0));
  s += hasChapters ? 6 : 0;
  s += hasEndScreens ? 5 : 0;
  s += hasCards ? 4 : 0;
  s += hasCaptions ? 7 : 0;
  s += thumbTextChars > 0 && thumbTextChars <= 14 ? 6 : 2;
  s += thumbFaceVisible ? 5 : 0;
  return Math.max(0, Math.min(100, s));
}

function keywordIdeas(topic = "") {
  const base = topic.toLowerCase().slice(0, 18);
  return [
    `${base} tutorial 2025`,
    `${base} for beginners`,
    `${base} mistakes to avoid`,
    `${base} vs alternatives`,
    `best ${base} tools`,
    `${base} tips & tricks`,
    `${base} in 10 minutes`,
    `${base} advanced guide`,
  ].map((k, i) => ({ id: i + 1, keyword: k, diff: Math.round(30 + Math.random() * 55), volume: Math.round(500 + Math.random() * 5000) }));
}

function BestTimes() {
  return [
    { day: "Mon", time: "7–9 PM" },
    { day: "Wed", time: "6–8 PM" },
    { day: "Fri", time: "7–10 PM" },
    { day: "Sat", time: "11 AM–1 PM" },
  ];
}

const Pill = ({ children }) => <span className="badge" style={{marginRight:8}}>{children}</span>;

export default function App() {
  const [channelInput, setChannelInput] = useState({
    name: "Tech Learners Academy",
    description: "Learn coding, AI and app development. Subscribe for weekly tutorials, project guides and career tips.",
    tags: "coding, javascript, react, ai, tutorial, app development",
    uploadsPerWeek: 2,
    hasBranding: true,
    playlists: 6,
    aboutLinks: 3,
  });
  const [videoInput, setVideoInput] = useState({
    title: "React + AI: The Ultimate App Tutorial (2025)",
    description: "In this step-by-step guide, build an AI-powered app with React. Timestamps included. Links to resources & free templates inside.",
    tags: "react, ai app, tutorial, 2025, beginners, step by step",
    hashtags: "#react #javascript #ai #coding",
    hasChapters: true,
    hasEndScreens: true,
    hasCards: true,
    hasCaptions: true,
    thumbTextChars: 10,
    thumbFaceVisible: true,
  });

  const channelScore = useMemo(() => scoreChannel({
    name: channelInput.name,
    description: channelInput.description,
    tags: channelInput.tags.split(",").map(s=>s.trim()).filter(Boolean),
    uploadsPerWeek: Number(channelInput.uploadsPerWeek) || 0,
    hasBranding: channelInput.hasBranding,
    playlists: Number(channelInput.playlists) || 0,
    aboutLinks: Number(channelInput.aboutLinks) || 0,
  }), [channelInput]);

  const videoScore = useMemo(() => scoreVideo({
    title: videoInput.title,
    description: videoInput.description,
    tags: videoInput.tags.split(",").map(s=>s.trim()).filter(Boolean),
    hashtags: videoInput.hashtags.split(/\s+/).filter(Boolean),
    hasChapters: videoInput.hasChapters,
    hasEndScreens: videoInput.hasEndScreens,
    hasCards: videoInput.hasCards,
    hasCaptions: videoInput.hasCaptions,
    thumbTextChars: Number(videoInput.thumbTextChars) || 0,
    thumbFaceVisible: videoInput.thumbFaceVisible,
  }), [videoInput]);

  useEffect(()=>{ document.title = "KD's YT SEO"; }, []);

  const overall = Math.round((channelScore * 0.45 + videoScore * 0.55));
  const kws = useMemo(()=> keywordIdeas(videoInput.title), [videoInput.title]);
  const times = BestTimes();

  return (
    <div className="container">
      <div className="header">
        <div style={{display:'flex',gap:12,alignItems:'center'}}>
          <div className="card" style={{padding:12}}><strong>KD</strong></div>
          <div>
            <h1 style={{margin:0}}>KD's YT SEO</h1>
            <div className="small">Audit channel & videos, get scores and fixes</div>
          </div>
        </div>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <span className="small">Overall</span>
          <div style={{width:120}}><div className="progress"><i style={{width: overall + "%"}}/></div></div>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h3>Channel Inputs</h3>
          <div className="small">Name</div>
          <input className="input" value={channelInput.name} onChange={e=>setChannelInput(s=>({...s,name:e.target.value}))} />
          <div className="small" style={{marginTop:8}}>Description</div>
          <textarea className="input" rows={4} value={channelInput.description} onChange={e=>setChannelInput(s=>({...s,description:e.target.value}))} />
          <div style={{display:'flex',gap:8,marginTop:8}}>
            <button className="button" onClick={()=>{ setChannelInput({ name: \"Tech Learners Academy\", description: \"Learn coding, AI and app development. Subscribe for weekly tutorials, project guides and career tips.\", tags: \"coding, javascript, react, ai, tutorial, app development\", uploadsPerWeek:2, hasBranding:true, playlists:6, aboutLinks:3 })}}>Reset Demo</button>
          </div>
        </div>

        <div className="card">
          <h3>Channel Score</h3>
          <div style={{fontSize:34,fontWeight:700}}>{channelScore}</div>
          <div className="small">Target ≥ 80</div>
          <div style={{marginTop:12}}>
            <h4>Top Fixes</h4>
            <ul className="small">
              {channelScore < 85 && <li>Add 1–2 keyword-rich playlists and link socials in About.</li>}
              {channelScore < 75 && <li>Improve channel description with primary & LSI keywords + clear CTA.</li>}
              {(Number(channelInput.uploadsPerWeek)||0) < 2 && <li>Increase consistency to 2 uploads/week for momentum.</li>}
            </ul>
          </div>
        </div>
      </div>

      <div style={{height:16}}></div>

      <div className="grid grid-2">
        <div className="card">
          <h3>Video Inputs</h3>
          <div className="small">Title</div>
          <input className="input" value={videoInput.title} onChange={e=>setVideoInput(v=>({...v,title:e.target.value}))} />
          <div className="small" style={{marginTop:8}}>Description</div>
          <textarea className="input" rows={4} value={videoInput.description} onChange={e=>setVideoInput(v=>({...v,description:e.target.value}))} />
          <div style={{display:'flex',gap:8,marginTop:8}}>
            <label className="small">Chapters <input type="checkbox" checked={videoInput.hasChapters} onChange={e=>setVideoInput(v=>({...v,hasChapters:e.target.checked}))} /></label>
            <label className="small">Captions <input type="checkbox" checked={videoInput.hasCaptions} onChange={e=>setVideoInput(v=>({...v,hasCaptions:e.target.checked}))} /></label>
          </div>
        </div>

        <div className="card">
          <h3>Video SEO Score</h3>
          <div style={{fontSize:34,fontWeight:700}}>{videoScore}</div>
          <div className="small">Target ≥ 85</div>
          <div style={{marginTop:12}}>
            <h4>Top Fixes</h4>
            <ul className="small">
              {videoScore < 90 && <li>Refine title with 1 primary + 1 emotional/power word within 60 chars.</li>}
              {videoScore < 85 && <li>Expand description: add timestamps, 3–5 resource links, and a strong CTA.</li>}
              {videoScore < 80 && <li>Add captions and 3–5 relevant hashtags; ensure tags include LSI terms.</li>}
            </ul>
          </div>
        </div>
      </div>

      <div style={{height:16}}></div>

      <div className="card">
        <h3>Keyword Ideas</h3>
        <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
          {kws.map(k=> <div key={k.id} style={{padding:8,borderRadius:8,background:'#fff'}}><strong>{k.keyword}</strong><div className="small">Diff {k.diff} · Vol {k.volume}</div></div>)}
        </div>
      </div>

      <div style={{height:16}}></div>

      <div className="grid grid-2">
        <div className="card">
          <h3>Performance Trend</h3>
          <div className="chart">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={demoTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <RTooltip />
                <Legend />
                <Line type="monotone" dataKey="views" stroke="#8884d8" name="Views" />
                <Line type="monotone" dataKey="retention" stroke="#82ca9d" name="Retention %" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3>Quick Checklist</h3>
          <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
            {["Keyword in first 60 of title","First 2 lines of desc = hook","3–5 links + CTA","Chapters cover key moments","End screens to latest video","Captions uploaded"].map((c,i)=> <span key={i} className="badge" style={{margin:6}}>{c}</span>)}
          </div>
        </div>
      </div>

      <div style={{height:24}}></div>

      <div className="small">Implementation notes: connect to YouTube Data API for real metrics; use Capacitor to wrap into Android.</div>

    </div>
  );
}