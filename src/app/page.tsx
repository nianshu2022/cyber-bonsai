"use client";

import { useState } from "react";
import { Copy, Check, ExternalLink, Sparkles, RefreshCw, HelpCircle } from "lucide-react";

const GithubIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export default function Home() {
  const [username, setUsername] = useState("");
  const [submittedUsername, setSubmittedUsername] = useState("");
  const [copiedMarkdown, setCopiedMarkdown] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);

  const getBonsaiApiUrl = (user: string) => {
    if (typeof window !== "undefined") {
      const origin = window.location.origin;
      return `${origin}/api/bonsai/${encodeURIComponent(user)}`;
    }
    return `https://cyber-bonsai.pages.dev/api/bonsai/${user}`;
  };

  const getMarkdownCode = (user: string) => {
    const imgUrl = getBonsaiApiUrl(user);
    const linkUrl = `https://github.com/${user}`;
    return `[![@${user}'s CyberBonsai](${imgUrl})](${linkUrl})`;
  };

  const getHtmlCode = (user: string) => {
    const imgUrl = getBonsaiApiUrl(user);
    const linkUrl = `https://github.com/${user}`;
    return `<a href="${linkUrl}"><img src="${imgUrl}" alt="@${user}'s CyberBonsai" width="320" height="340" /></a>`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    setPreviewLoading(true);
    setSubmittedUsername(username.trim().toLowerCase());
    // Simulate image loading
    setTimeout(() => {
      setPreviewLoading(false);
    }, 800);
  };

  const handleCopy = async (text: string, type: "markdown" | "html" | "url") => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "markdown") {
        setCopiedMarkdown(true);
        setTimeout(() => setCopiedMarkdown(false), 2000);
      } else if (type === "html") {
        setCopiedHtml(true);
        setTimeout(() => setCopiedHtml(false), 2000);
      } else if (type === "url") {
        setCopiedUrl(true);
        setTimeout(() => setCopiedUrl(false), 2000);
      }
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f6f0] dark:bg-[#121214] text-neutral-800 dark:text-neutral-200 transition-colors duration-300 font-mono">
      {/* Top Retro Banner */}
      <div className="border-b-4 border-black bg-emerald-600 text-white p-3 text-center font-bold text-sm tracking-wider">
        📟 SYSTEM STATUS: ONLINE | 👾 VERSION 1.0.0 | 🌱 KEEP COMMITTING & GROW YOUR TREE
      </div>

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <header className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 border-2 border-black bg-amber-100 text-black text-xs font-bold rounded-full mb-4 shadow-[2px_2px_0px_#000]">
            <Sparkles className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
            STANDALONE WIDGET PROJECT
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-neutral-900 dark:text-white uppercase">
            🌱 CyberBonsai
          </h1>
          <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-400 max-w-lg mx-auto leading-relaxed">
            一个运行在 Cloudflare Edge 的动态 README 挂件。用你的 GitHub 提交活跃度来浇灌你的像素风盆栽，见证它的繁茂与休眠。
          </p>
        </header>

        {/* Form and Preview Grid */}
        <div className="grid md:grid-cols-12 gap-8 items-start">
          
          {/* Left panel: Input and Config */}
          <div className="md:col-span-7 bg-white dark:bg-[#1a1a1e] border-4 border-black p-6 rounded-none shadow-[6px_6px_0px_rgba(0,0,0,0.85)] dark:shadow-[6px_6px_0px_rgba(255,255,255,0.1)]">
            <h2 className="text-lg font-black uppercase mb-4 pb-2 border-b-2 border-black flex items-center gap-2">
              <span>01. 盆栽培育配置</span>
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase mb-2 text-neutral-500">
                  GitHub 用户名 (Username)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="例如: nianshu2022"
                    className="flex-1 px-4 py-3 border-2 border-black rounded-none bg-neutral-50 dark:bg-[#252529] focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-bold"
                    required
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-emerald-600 text-white font-bold border-2 border-black rounded-none shadow-[3px_3px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#000] active:translate-x-[3px] active:translate-y-[3px] active:shadow-[0px_0px_0px_#000] transition-all text-sm uppercase"
                  >
                    生成
                  </button>
                </div>
              </div>
            </form>

            {submittedUsername && (
              <div className="mt-8 space-y-4 animate-fadeIn">
                <h3 className="text-xs font-bold uppercase text-neutral-500">
                  02. 复制你的嵌入代码
                </h3>
                
                {/* Code Tabs */}
                <div className="space-y-3 text-xs">
                  {/* Markdown */}
                  <div className="border-2 border-black p-3 bg-neutral-50 dark:bg-[#252529] flex flex-col gap-2">
                    <div className="flex justify-between items-center font-bold">
                      <span className="text-emerald-600">MARKDOWN (适用于 README)</span>
                      <button
                        onClick={() => handleCopy(getMarkdownCode(submittedUsername), "markdown")}
                        className="p-1 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#1a1a1e] hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors flex items-center gap-1"
                      >
                        {copiedMarkdown ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                        <span>{copiedMarkdown ? "已复制" : "复制"}</span>
                      </button>
                    </div>
                    <code className="block bg-neutral-200 dark:bg-neutral-800 p-2 overflow-x-auto select-all rounded font-mono text-[10px] break-all">
                      {getMarkdownCode(submittedUsername)}
                    </code>
                  </div>

                  {/* HTML */}
                  <div className="border-2 border-black p-3 bg-neutral-50 dark:bg-[#252529] flex flex-col gap-2">
                    <div className="flex justify-between items-center font-bold">
                      <span className="text-amber-600">HTML (适用于博客/个人网站)</span>
                      <button
                        onClick={() => handleCopy(getHtmlCode(submittedUsername), "html")}
                        className="p-1 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#1a1a1e] hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors flex items-center gap-1"
                      >
                        {copiedHtml ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                        <span>{copiedHtml ? "已复制" : "复制"}</span>
                      </button>
                    </div>
                    <code className="block bg-neutral-200 dark:bg-neutral-800 p-2 overflow-x-auto select-all rounded font-mono text-[10px] break-all">
                      {getHtmlCode(submittedUsername)}
                    </code>
                  </div>

                  {/* URL */}
                  <div className="border-2 border-black p-3 bg-neutral-50 dark:bg-[#252529] flex flex-col gap-2">
                    <div className="flex justify-between items-center font-bold">
                      <span className="text-blue-600">IMAGE URL (图片直链)</span>
                      <button
                        onClick={() => handleCopy(getBonsaiApiUrl(submittedUsername), "url")}
                        className="p-1 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#1a1a1e] hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors flex items-center gap-1"
                      >
                        {copiedUrl ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                        <span>{copiedUrl ? "已复制" : "复制"}</span>
                      </button>
                    </div>
                    <code className="block bg-neutral-200 dark:bg-neutral-800 p-2 overflow-x-auto select-all rounded font-mono text-[10px] break-all">
                      {getBonsaiApiUrl(submittedUsername)}
                    </code>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right panel: Preview */}
          <div className="md:col-span-5 flex flex-col items-center">
            <div className="w-full bg-white dark:bg-[#1a1a1e] border-4 border-black p-4 rounded-none shadow-[6px_6px_0px_rgba(0,0,0,0.85)] dark:shadow-[6px_6px_0px_rgba(255,255,255,0.1)] flex flex-col items-center">
              <div className="w-full flex justify-between items-center pb-2 mb-4 border-b-2 border-black font-bold text-xs uppercase text-neutral-500">
                <span>实时预览</span>
                <span className="flex items-center gap-1">
                  <RefreshCw className={`h-3 w-3 ${previewLoading ? "animate-spin" : ""}`} />
                  30M 缓存更新
                </span>
              </div>

              {submittedUsername ? (
                <div className="relative aspect-[320/340] w-full max-w-[320px] border-2 border-dashed border-neutral-300 dark:border-neutral-700 p-1 bg-[#fcfbf7] dark:bg-[#18181b]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getBonsaiApiUrl(submittedUsername)}
                    alt="CyberBonsai Preview"
                    className="w-full h-auto object-contain transition-opacity duration-300"
                    onLoad={() => setPreviewLoading(false)}
                    style={{ opacity: previewLoading ? 0.3 : 1 }}
                  />
                  {previewLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-black/50">
                      <span className="text-xs font-bold">获取数据中...</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-[320/340] w-full max-w-[320px] border-4 border-dashed border-neutral-300 dark:border-neutral-700 flex flex-col items-center justify-center p-6 text-center text-xs text-neutral-400 dark:text-neutral-600 bg-neutral-50 dark:bg-[#151518]">
                  <HelpCircle className="h-10 w-10 mb-4 stroke-1" />
                  <p className="font-bold">暂无预览</p>
                  <p className="mt-2">在左侧输入你的 GitHub 用户名并点击生成，培育你的专属赛博盆栽。</p>
                </div>
              )}

              {submittedUsername && (
                <a
                  href={`https://github.com/${submittedUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-emerald-600 transition-colors"
                >
                  <GithubIcon className="h-3.5 w-3.5" />
                  <span>访问 GitHub 个人主页</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Growth Rules Explainer */}
        <section className="mt-16 border-4 border-black bg-amber-50 dark:bg-[#201e1a] p-6 rounded-none">
          <h2 className="text-lg font-black uppercase mb-4 pb-2 border-b-2 border-black text-amber-950 dark:text-amber-100 flex items-center gap-2">
            🌱 盆栽成长法典 (Growth Rules)
          </h2>
          <p className="text-xs text-amber-900 dark:text-amber-300 leading-relaxed mb-6">
            你的赛博盆栽是一面镜子，忠实折射你最近 7 天在 GitHub 上的工作活跃度。commits/PRs 越多，盆栽就越茂盛、甚至会绽放繁花；一旦搁置开发，它将面临枯萎与休眠。
          </p>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            <div className="border border-amber-900/20 p-3 bg-white/60 dark:bg-black/20 rounded">
              <strong className="block text-amber-800 dark:text-amber-400 mb-1">LV.0 种子萌芽 (Sprout)</strong>
              <span>最近 7 天内有 0-1 次 commit</span>
            </div>
            <div className="border border-amber-900/20 p-3 bg-white/60 dark:bg-black/20 rounded">
              <strong className="block text-emerald-800 dark:text-emerald-400 mb-1">LV.1 幼苗小树 (Sapling)</strong>
              <span>最近 7 天内有 2-4 次 commits</span>
            </div>
            <div className="border border-amber-900/20 p-3 bg-white/60 dark:bg-black/20 rounded">
              <strong className="block text-blue-800 dark:text-blue-400 mb-1">LV.2 成长阶段 (Growing)</strong>
              <span>最近 7 天内有 5-9 次 commits</span>
            </div>
            <div className="border border-amber-900/20 p-3 bg-white/60 dark:bg-black/20 rounded">
              <strong className="block text-indigo-800 dark:text-indigo-400 mb-1">LV.3 成熟盆景 (Bonsai)</strong>
              <span>最近 7 天内有 10-19 次 commits</span>
            </div>
            <div className="border border-amber-900/20 p-3 bg-white/60 dark:bg-black/20 rounded">
              <strong className="block text-purple-800 dark:text-purple-400 mb-1">LV.4 繁花似锦 (Blooming)</strong>
              <span>最近 7 天内有 20+ 次 commits 🌸</span>
            </div>
            <div className="border border-amber-900/20 p-3 bg-white/60 dark:bg-black/20 rounded">
              <strong className="block text-amber-700 dark:text-amber-500 mb-1">🍂 缺水休眠 (Dormant)</strong>
              <span>最近 7 天内 0 commit，盆栽干旱枯黄</span>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t-4 border-black py-8 bg-neutral-100 dark:bg-[#151518] text-center text-xs text-neutral-500">
        <p>© {new Date().getFullYear()} CyberBonsai · Open Source Standalone Project</p>
        <p className="mt-1">
          Designed by <a href="https://blog.nianshu2022.cn" className="underline hover:text-emerald-600 transition-colors">念舒档案局</a>
        </p>
      </footer>
    </div>
  );
}
