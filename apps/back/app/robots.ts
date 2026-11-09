import type { MetadataRoute } from "next";

/*
 * Search engines may crawl, so they see the noindex header and meta tag
 * (ADR 0005). `Disallow: /` for them would lead to bare-URL listings instead.
 * AI and scraper bots are blocked by name.
 */
const blockedBots = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "anthropic-ai",
  "CCBot",
  "Google-Extended",
  "Applebot-Extended",
  "Bytespider",
  "PerplexityBot",
  "Perplexity-User",
  "meta-externalagent",
  "FacebookBot",
  "Amazonbot",
  "cohere-ai",
  "Diffbot",
  "ImagesiftBot",
  "Omgilibot",
  "Timpibot",
  "YouBot",
  "DuckAssistBot",
  "MistralAI-User",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: blockedBots, disallow: "/" },
    ],
  };
}
