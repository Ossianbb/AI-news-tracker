import type { Article } from "@/types";

/** Fixed set of topics with keywords that signal each one */
const topicKeywords: Record<string, string[]> = {
  models: [
    "model", "gpt", "claude", "gemini", "llama", "llm", "language model",
    "foundation model", "multimodal", "parameters", "weights", "fine-tune",
    "fine-tuning", "benchmark", "training run",
  ],
  agents: [
    "agent", "agentic", "autonomous", "multi-agent", "tool use", "tool calling",
    "mcp", "function calling", "orchestration", "planning", "reasoning",
  ],
  policy: [
    "regulation", "policy", "legislation", "government", "congress", "eu",
    "gdpr", "executive order", "ban", "lawsuit", "copyright", "compliance",
    "senate", "parliament", "safety regulation",
  ],
  tools: [
    "developer tool", "api", "sdk", "framework", "library", "platform",
    "ide", "copilot", "cursor", "claude code", "vscode", "plugin",
    "integration", "devtool",
  ],
  research: [
    "paper", "research", "arxiv", "study", "breakthrough", "novel",
    "state-of-the-art", "sota", "experiment", "findings", "peer review",
    "dataset", "preprint",
  ],
  chips: [
    "chip", "gpu", "tpu", "nvidia", "amd", "intel", "semiconductor",
    "hardware", "h100", "b200", "compute", "silicon", "processor",
  ],
  robotics: [
    "robot", "robotics", "humanoid", "embodied", "manipulation",
    "autonomous vehicle", "self-driving", "drone", "sensor",
  ],
  startups: [
    "startup", "funding", "raised", "valuation", "series a", "series b",
    "seed round", "venture", "yc", "y combinator", "acquisition",
    "ipo", "unicorn",
  ],
  "open-source": [
    "open source", "open-source", "opensource", "hugging face", "huggingface",
    "github", "apache", "mit license", "weights release", "open model",
    "community", "free model",
  ],
  safety: [
    "safety", "alignment", "guardrail", "red team", "jailbreak", "harm",
    "bias", "ethics", "responsible ai", "existential risk", "x-risk",
    "misuse", "deepfake",
  ],
};

/**
 * Assign topics to an article based on keyword matches in the
 * title and summary. An article can have multiple topics.
 */
export function assignTopics(article: Article): Article {
  const text = `${article.title} ${article.summary}`.toLowerCase();
  const matched: string[] = [];

  for (const [topic, keywords] of Object.entries(topicKeywords)) {
    for (const keyword of keywords) {
      if (text.includes(keyword)) {
        matched.push(topic);
        break; // one match is enough for this topic
      }
    }
  }

  return { ...article, topics: matched.length > 0 ? matched : ["other"] };
}

/**
 * Tag all articles in an array.
 */
export function tagAll(articles: Article[]): Article[] {
  return articles.map(assignTopics);
}
