"use client";

import { useRef, useState } from "react";
import {
  User,
  Mail,
  ChevronDown,
  Check,
  Upload,
  FileText,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

const areas = [
  "Automations",
  "Operational Support",
  "Digital Content & Media",
  "Web Designer",
  "Recruitment",
  "Revenue/Sales",
  "Finance",
];

export default function Home() {
  const fileInput = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [area, setArea] = useState("");
  const [areaOpen, setAreaOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name || !email || !area || !file) {
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("email", email);
      formData.append("area", area);
      formData.append("cv", file);

      const response = await fetch(
        "/api/submit",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Webhook failed: ${response.status}`);
      }

      setSubmitted(true);
    } catch (error) {
      console.error("Application submission failed:", error);
      alert(
        "We could not submit your application. Please check your connection and try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="h-screen overflow-hidden bg-[#f4f8f9] px-4 py-5 text-[#124559] sm:px-6 sm:py-3">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-36 -top-36 h-72 w-72 rounded-full bg-[#e5efff]" />
        <div className="absolute -right-36 -top-32 h-80 w-80 rounded-full bg-[#eaf3ff]" />
        <div className="absolute -bottom-40 -left-36 h-80 w-80 rounded-full bg-[#e3efff]" />
      </div>

      <div className="relative z-10 flex h-full items-center justify-center">
        <section className="w-full max-w-lg">
          <div className="rounded-[22px] border border-[#dfe8f3] bg-white px-5 py-6 shadow-[0_18px_55px_rgba(13,55,105,0.12)] sm:rounded-[26px] sm:px-7 sm:py-4">

            {!submitted ? (
              <>
                <div className="mb-3">
                  <h1 className="text-3xl font-extrabold tracking-tight text-[#124559]">
                    Submit Your Application
                  </h1>

                  <p className="mt-1 text-xs leading-5 text-[#697991] sm:text-sm">
                    Fill in your details and upload your latest CV or resume
                    to get started.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-2.5">

                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-[#152541] sm:text-sm">
                      Full Name <span className="text-[#124559]">*</span>
                    </label>

                    <div className="relative">
                      <User
                        size={17}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#73829a]"
                      />

                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your full name"
                        className="h-12 w-full rounded-lg border border-[#d7e1ee] bg-white pl-10 pr-3 text-sm text-[#172640] outline-none transition placeholder:text-[#9aa7b8] hover:border-[#b8c9df] focus:border-[#124559] focus:ring-3 focus:ring-[#124559]/10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-[#152541] sm:text-sm">
                      Email Address <span className="text-[#124559]">*</span>
                    </label>

                    <div className="relative">
                      <Mail
                        size={17}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#73829a]"
                      />

                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="h-12 w-full rounded-lg border border-[#d7e1ee] bg-white pl-10 pr-3 text-sm text-[#172640] outline-none transition placeholder:text-[#9aa7b8] hover:border-[#b8c9df] focus:border-[#124559] focus:ring-3 focus:ring-[#124559]/10"
                      />
                    </div>
                  </div>

                  <div>
  <label className="mb-1.5 block text-xs font-bold text-[#152541] sm:text-sm">
    Area <span className="text-[#124559]">*</span>
  </label>

  <div className="relative">
    <button
      type="button"
      onClick={() => setAreaOpen(!areaOpen)}
      className={`flex h-12 w-full items-center rounded-xl border bg-white px-3.5 text-left text-sm outline-none transition-all duration-200 ${
        areaOpen
          ? "border-[#124559] ring-4 ring-[#124559]/10 shadow-[0_8px_25px_rgba(23,105,232,0.10)]"
          : "border-[#d7e1ee] hover:border-[#b8c9df]"
      }`}
    >
      <FileText
        size={17}
        className="mr-3 shrink-0 text-[#73829a]"
      />

      <span
        className={
          area
            ? "flex-1 text-[#172640]"
            : "flex-1 text-[#9aa7b8]"
        }
      >
        {area || "Select an area"}
      </span>

      <ChevronDown
        size={18}
        className={`text-[#73829a] transition-transform duration-200 ${
          areaOpen ? "rotate-180 text-[#124559]" : ""
        }`}
      />
    </button>

    {areaOpen && (
      <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-xl border border-[#d3e2e6] bg-white p-1.5 shadow-[0_18px_45px_rgba(13,55,105,0.16)]">

        <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#94a1b4]">
          Select your area
        </div>

        {areas.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => {
              setArea(item);
              setAreaOpen(false);
            }}
            className={`flex w-full items-center justify-between rounded-lg px-3 py-1 text-left text-sm transition-all duration-150 ${
              area === item
                ? "bg-[#e4f0f3] font-bold text-[#124559]"
                : "text-[#263751] hover:bg-[#edf4f6] hover:text-[#124559]"
            }`}
          >
            <span>{item}</span>

            {area === item && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#124559] text-white">
                <Check size={12} strokeWidth={3} />
              </span>
            )}
          </button>
        ))}
      </div>
    )}
  </div>
</div><div>
                    <label className="mb-1.5 block text-xs font-bold text-[#152541] sm:text-sm">
                      CV / Resume <span className="text-[#124559]">*</span>
                    </label>

                    <input
                      ref={fileInput}
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      onChange={(e) => {
                        const selected = e.target.files?.[0];

                        if (selected) {
                          setFile(selected);
                        }
                      }}
                    />

                    <button
                      type="button"
                      onClick={() => fileInput.current?.click()}
                      className="group flex min-h-[85px] w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#c9daf0] bg-[#f8fbff] px-4 py-2 text-center transition hover:border-[#124559] hover:bg-[#f3f8ff]"
                    >
                      <div className="mb-1.5 flex h-10 w-10 items-center justify-center rounded-full bg-[#e4f0f3] text-[#124559] transition group-hover:scale-105">
                        <Upload size={16} />
                      </div>

                      {file ? (
                        <>
                          <p className="max-w-[90%] truncate text-xs font-bold text-[#172640]">
                            {file.name}
                          </p>

                          <p className="mt-0.5 text-[10px] text-[#728198]">
                            Click to replace your CV
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-xs font-bold text-[#172640] sm:text-sm">
                            Upload your CV / Resume
                          </p>

                          <p className="mt-0.5 text-[10px] text-[#73829a] sm:text-xs">
                            PDF, DOC or DOCX
                          </p>

                          <p className="mt-1 text-[10px] text-[#9aa7b8]">
                            Click to browse your files
                          </p>
                        </>
                      )}
                    </button>
                  </div>

                  <button
  type="submit"
  disabled={submitting || !name || !email || !area || !file}
  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#124559] px-5 py-3 text-sm font-bold text-white shadow-[0_10px_25px_rgba(23,105,232,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#0d3544] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
>
  <span>{submitting ? "Submitting..." : "Submit Application"}</span>
  {!submitting && (
    <ArrowRight
      size={17}
      strokeWidth={2.5}
      className="transition-transform group-hover:translate-x-1"
    />
  )}
</button>
                </form>
              </>
            ) : (
              <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#e9f8ef] text-[#20a15a]">
                  <CheckCircle2 size={30} />
                </div>

                <h2 className="mt-5 text-2xl font-extrabold">
                  Application Submitted
                </h2>

                <p className="mt-2 max-w-lg text-sm leading-6 text-[#697991]">
                  Thank you for applying. Your application has been received
                  successfully.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setName("");
                    setEmail("");
                    setArea("");
                    setFile(null);
                  }}
                  className="mt-6 rounded-lg border border-[#d7e1ee] bg-white px-5 py-2.5 text-sm font-bold text-[#172640] transition hover:bg-[#f5f8fc]"
                >
                  Submit Another Application
                </button>
              </div>
            )}

          </div>
        </section>
      </div>
    </main>
  );
}