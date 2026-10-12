export const dynamic = 'force-static'

// The docs are ATBP Hosting's own, not open source. Search engines may index them so customers can find answers;
// every other crawler, scraper and AI agent is asked to stay out (see /llms.txt and /general/using-these-docs).
// AI crawlers are named one by one as well, because some only obey a rule that names them.
const SEARCH = ['Googlebot', 'Googlebot-Image', 'Bingbot', 'DuckDuckBot', 'Applebot', 'Yandex', 'Baiduspider']
const AI = [
  'GPTBot', 'ChatGPT-User', 'OAI-SearchBot', 'ClaudeBot', 'Claude-User', 'Claude-SearchBot', 'anthropic-ai',
  'Google-Extended', 'GoogleOther', 'Applebot-Extended', 'CCBot', 'PerplexityBot', 'Perplexity-User', 'Bytespider',
  'Amazonbot', 'meta-externalagent', 'meta-externalfetcher', 'FacebookBot', 'cohere-ai', 'cohere-training-data-crawler',
  'Diffbot', 'Omgilibot', 'ImagesiftBot', 'YouBot', 'Timpibot', 'AI2Bot', 'DuckAssistBot', 'MistralAI-User',
  'ExaSearchBot', 'KeenableBot', 'PetalBot', 'Scrapy', 'img2dataset'
]

export default function robots() {
  return {
    rules: [
      { userAgent: SEARCH, allow: '/' },
      { userAgent: AI, disallow: '/' },
      { userAgent: '*', disallow: '/' }
    ],
    sitemap: 'https://docs.atbphosting.com/sitemap.xml'
  }
}
