"use client";
import { useState } from "react";
import { waLink } from "@/lib/clinic";

export function ContactForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [msg, setMsg] = useState("");

  function sendWA() {
    if (!name.trim()) { setMsg("Please enter your name."); return; }
    const txt = `Hello Dr. Esther! My name is *${name}*${phone ? `, WhatsApp: ${phone}` : ''}.\n\n${message || 'I would like to book an appointment.'}\n\nThank you!`;
    setMsg("✅ Opening WhatsApp...");
    window.open(waLink(txt), "_blank");
  }
  function sendEmail() {
    if (!name.trim()) { setMsg("Please enter your name."); return; }
    const body = `Dear Dr. Esther,\n\nMy name is ${name}${phone ? `, my number is ${phone}` : ''}.\n\n${message || 'I would like to book an appointment.'}\n\nThank you.`;
    setMsg("✅ Opening email...");
    window.location.href = `mailto:info@kaysdentalclinic.com?subject=Appointment%20Request%20–%20Kays%20Dental&body=${encodeURIComponent(body)}`;
  }

  return (
    <div className="flex flex-col gap-3">
      <input className="cf-in" type="text" placeholder="Your full name" value={name} onChange={e => setName(e.target.value)} />
      <input className="cf-in" type="tel" placeholder="Your WhatsApp number" value={phone} onChange={e => setPhone(e.target.value)} />
      <textarea className="cf-in cf-ta" placeholder="How can Dr. Esther help you today?" value={message} onChange={e => setMessage(e.target.value)} />
      <div className="flex gap-2 flex-wrap">
        <button onClick={sendWA} className="btn btn-wa flex-1 min-w-[140px]">Send via WhatsApp</button>
        <button onClick={sendEmail} className="btn btn-green flex-1 min-w-[140px]">Send via email</button>
      </div>
      {msg && <p className="text-[#555A56] dark:text-[#A6AAA6] text-sm font-medium mt-1 text-center">{msg}</p>}
    </div>
  );
}
