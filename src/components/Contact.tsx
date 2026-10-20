import { Check, Copy, Download, Github, Linkedin, Send } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { profile } from '../data/portfolio';
import { useStation } from '../lib/station';
import { Burst } from './ui/Burst';

const TOPICS = ['Internship', 'Full-time role', 'Project idea', 'Just saying hi'];

export function Contact() {
  const { toast } = useStation();
  const [topic, setTopic] = useState(TOPICS[0]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      toast('EMAIL COPIED TO CLIPBOARD');
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      toast(profile.email.toUpperCase());
    }
  };

  const send = (e: FormEvent) => {
    e.preventDefault();
    const subject = `${topic}${name ? ` from ${name}` : ''} (via portfolio)`;
    const body = `${message}\n\n${name ? `— ${name}` : ''}`;
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body.trim())}`;
    toast('OPENING YOUR EMAIL APP…');
  };

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="on-light relative overflow-hidden bg-tomato py-20 text-ink lg:py-28"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: 'repeating-conic-gradient(from 0deg at 0% 100%, rgba(18,11,9,.09) 0deg 4deg, rgba(18,11,9,0) 4deg 8deg)',
        }}
      />
      <div className="relative mx-auto flex max-w-station flex-wrap items-center gap-16 px-4 sm:px-8">
        <div className="flex min-w-0 flex-[1_1_420px] flex-col items-start gap-6">
          <span className="rounded bg-ink px-2 py-0.5 font-screen text-[20px] text-marigold">CH 07</span>
          <h2
            id="contact-title"
            className="m-0 font-display text-[clamp(56px,8vw,112px)] font-normal leading-[0.92] text-newsprint"
            style={{ textShadow: '5px 5px 0 #120B09' }}
          >
            Call in now!
          </h2>
          <p className="m-0 max-w-[30rem] text-[20px] font-medium leading-relaxed">
            Hiring for a software or data internship, building something interesting, or just want to talk databases? Operators
            (me) are standing by.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" onClick={copyEmail} className="btn-primary">
              {copied ? <Check className="h-5 w-5" aria-hidden="true" /> : <Copy className="h-5 w-5" aria-hidden="true" />}
              {copied ? 'Copied!' : profile.email}
            </button>
          </div>
          <nav aria-label="Elsewhere" className="flex flex-wrap gap-2.5">
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="chbtn border-ink bg-ink no-underline">
              <Linkedin className="h-5 w-5" aria-hidden="true" />
              LinkedIn
            </a>
            <a href={profile.github} target="_blank" rel="noopener noreferrer" className="chbtn border-ink bg-ink no-underline">
              <Github className="h-5 w-5" aria-hidden="true" />
              GitHub
            </a>
            <a href={profile.resume} target="_blank" rel="noopener noreferrer" className="chbtn border-ink bg-ink no-underline">
              <Download className="h-5 w-5" aria-hidden="true" />
              Résumé
            </a>
          </nav>
        </div>

        <div className="relative min-w-0 flex-[1_1_420px]">
          <Burst
            size={138}
            outer="#120B09"
            className="absolute -right-4 -top-16 z-10"
            style={{ animation: 'wobble 2.4s ease-in-out infinite' }}
            fontSize={21}
          >
            Call
            <br />
            now!
          </Burst>
          <form
            onSubmit={send}
            aria-label="Write me an email"
            className="relative flex flex-col gap-5 rounded-2xl border-4 border-ink bg-newsprint p-6 shadow-[14px_14px_0_#120B09] sm:p-8"
          >
            <div className="flex items-start justify-between gap-4 border-b-[3px] border-dashed border-ink pb-4">
              <div className="flex flex-col gap-1">
                <p className="m-0 font-screen text-[20px] tracking-[3px] text-brick">VIEWER RESPONSE CARD</p>
                <p className="m-0 font-expanded text-[22px] font-extrabold uppercase leading-tight">Tell me what’s up</p>
              </div>
            </div>

            <fieldset className="m-0 min-w-0 border-0 p-0">
              <legend className="mb-2 p-0 font-screen text-[20px] tracking-[2px]">WHAT’S IT ABOUT?</legend>
              <div className="flex flex-wrap gap-2">
                {TOPICS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTopic(t)}
                    aria-pressed={topic === t}
                    className={`min-h-[44px] rounded-full border-[3px] border-ink px-4 font-wide text-[15px] font-bold transition-colors ${
                      topic === t ? 'bg-ink text-marigold' : 'bg-[#FFF8EA] text-ink hover:bg-marigold/40'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="cn-name" className="font-screen text-[20px] tracking-[2px]">
                YOUR NAME
              </label>
              <input
                id="cn-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                placeholder="Jane Doe"
                className="min-h-[50px] rounded-lg border-[3px] border-ink bg-[#FFF8EA] px-3.5 text-[17px] text-ink"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="cn-msg" className="font-screen text-[20px] tracking-[2px]">
                MESSAGE
              </label>
              <textarea
                id="cn-msg"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                required
                placeholder="We’re hiring a data engineering intern for summer…"
                className="resize-y rounded-lg border-[3px] border-ink bg-[#FFF8EA] px-3.5 py-3 text-[17px] leading-relaxed text-ink"
              />
            </div>
            <button type="submit" className="btn-primary mt-1 w-full shadow-[6px_6px_0_#120B09]">
              Open in my email app
              <Send className="h-5 w-5" aria-hidden="true" />
            </button>
            <p className="m-0 text-center text-[14px] leading-snug">
              Opens a pre-filled email to {profile.email}. Nothing is stored on this site.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
