import type { Article } from "@/types";

export const mockArticles: Article[] = [
  {
    id: "art-1",
    title: "Claude 4 Launches with Extended Thinking and Tool Use Improvements",
    source: "The Verge",
    url: "https://example.com/claude-4-launch",
    publishedAt: "2026-04-09T08:00:00Z",
    summary:
      "Anthropic releases Claude 4, its most capable model yet, featuring extended thinking for complex reasoning and significantly improved tool use. The model scores state-of-the-art on coding and math benchmarks.",
    topics: ["models", "research"],
    importanceScore: 9,
    whyItMatters:
      "Sets a new bar for frontier model capabilities, particularly in agentic coding tasks.",
  },
  {
    id: "art-2",
    title: "EU AI Act Enforcement Begins for General-Purpose AI",
    source: "Reuters",
    url: "https://example.com/eu-ai-act-enforcement",
    publishedAt: "2026-04-08T14:30:00Z",
    summary:
      "The first enforcement provisions of the EU AI Act take effect, requiring providers of general-purpose AI models to publish training data summaries and comply with copyright obligations.",
    topics: ["policy"],
    importanceScore: 8,
    whyItMatters:
      "First major regulatory framework actively enforcing rules on foundation model providers.",
  },
  {
    id: "art-3",
    title: "Google DeepMind Achieves Breakthrough in Protein-Drug Interaction Prediction",
    source: "MIT Technology Review",
    url: "https://example.com/deepmind-protein-drugs",
    publishedAt: "2026-04-09T10:15:00Z",
    summary:
      "A new DeepMind model predicts how drug molecules interact with protein targets with unprecedented accuracy, potentially cutting early-stage drug discovery timelines from years to months.",
    topics: ["research", "models"],
    importanceScore: 8,
    whyItMatters:
      "Demonstrates AI's growing real-world impact beyond text and code, directly accelerating pharmaceutical R&D.",
  },
  {
    id: "art-4",
    title: "OpenAI Open-Sources Its Structured Output Parser",
    source: "Hacker News",
    url: "https://example.com/openai-structured-outputs-oss",
    publishedAt: "2026-04-07T18:00:00Z",
    summary:
      "OpenAI releases the library behind its structured outputs feature as an open-source project, letting developers constrain LLM output to valid JSON schemas without model fine-tuning.",
    topics: ["open-source", "tools"],
    importanceScore: 6,
    whyItMatters:
      "Lowers the barrier for building reliable AI-powered applications that need structured data.",
  },
  {
    id: "art-5",
    title: "NVIDIA Announces Next-Gen Blackwell Ultra GPUs for AI Training",
    source: "Ars Technica",
    url: "https://example.com/nvidia-blackwell-ultra",
    publishedAt: "2026-04-08T09:00:00Z",
    summary:
      "NVIDIA unveils Blackwell Ultra, delivering 2x training throughput over the previous generation. Major cloud providers announce immediate availability.",
    topics: ["chips"],
    importanceScore: 7,
    whyItMatters:
      "Hardware improvements directly determine what models can be trained and at what cost.",
  },
  {
    id: "art-6",
    title: "Anthropic Introduces MCP Registry for Standardised Tool Discovery",
    source: "Simon Willison's Blog",
    url: "https://example.com/mcp-registry",
    publishedAt: "2026-04-09T06:45:00Z",
    summary:
      "The Model Context Protocol now has an official registry where developers can publish and discover MCP servers, making it easier for AI agents to find and connect to tools and data sources.",
    topics: ["tools", "agents"],
    importanceScore: 7,
    whyItMatters:
      "Standardised tool discovery is a key missing piece for making AI agents practical in production.",
  },
  {
    id: "art-7",
    title: "Mistral Releases Codestral 2 with 128K Context for Code",
    source: "The Verge",
    url: "https://example.com/mistral-codestral-2",
    publishedAt: "2026-04-07T12:00:00Z",
    summary:
      "Mistral's latest code-specialised model supports 128K context windows and matches GPT-4 level performance on code generation benchmarks while running at a fraction of the cost.",
    topics: ["models", "open-source"],
    importanceScore: 6,
    whyItMatters:
      "Competitive open-weight code models increase choice and push down API pricing for developers.",
  },
  {
    id: "art-8",
    title: "Figure Robotics Demos Autonomous Warehouse Worker",
    source: "Reuters",
    url: "https://example.com/figure-warehouse-robot",
    publishedAt: "2026-04-08T16:00:00Z",
    summary:
      "Figure's humanoid robot completes a full shift of warehouse tasks autonomously, including picking, packing, and navigating around human workers, in a pilot with a major logistics company.",
    topics: ["robotics", "agents"],
    importanceScore: 7,
    whyItMatters:
      "Moves humanoid robotics from demos to real commercial deployments, a significant milestone.",
  },
  {
    id: "art-9",
    title: "Startup Raises $200M to Build AI Safety Evaluation Platform",
    source: "TechCrunch",
    url: "https://example.com/safety-eval-startup",
    publishedAt: "2026-04-09T11:30:00Z",
    summary:
      "A new startup launches with $200M in funding to build an independent platform for evaluating AI model safety, offering standardised benchmarks and red-teaming services to model providers.",
    topics: ["startups", "safety"],
    importanceScore: 6,
    whyItMatters:
      "Independent safety evaluation infrastructure is critical as models become more capable and widely deployed.",
    clusterId: "cluster-safety-evals",
  },
  {
    id: "art-10",
    title: "Researchers Show Distilled 7B Model Matches GPT-4 on Medical QA",
    source: "MIT Technology Review",
    url: "https://example.com/distillation-medical-qa",
    publishedAt: "2026-04-07T20:00:00Z",
    summary:
      "A team of researchers demonstrates that a 7-billion parameter model, distilled from a much larger teacher model, achieves GPT-4 level accuracy on medical question-answering benchmarks.",
    topics: ["research", "models"],
    importanceScore: 7,
    whyItMatters:
      "Distillation is making frontier-level performance accessible on smaller, cheaper hardware — key for healthcare and edge deployment.",
  },
];
