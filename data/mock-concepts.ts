import type { Concept } from "@/types";

export const mockConcepts: Concept[] = [
  {
    id: "concept-mcp",
    name: "Model Context Protocol (MCP)",
    slug: "mcp",
    simpleExplanation:
      "MCP is an open standard that lets AI assistants connect to external tools and data sources through a universal interface. Think of it like USB-C for AI — instead of building a custom integration for every tool, developers build one MCP server and any compatible AI assistant can use it.",
    deeperExplanation:
      "MCP defines a client-server architecture where AI applications (clients) communicate with tool providers (servers) using a standardised JSON-RPC protocol. Servers expose capabilities like tools (functions the AI can call), resources (data it can read), and prompts (reusable templates). This decouples the AI model from the tools it uses, so you can swap models or add new tools without rewriting integration code. Transport options include stdio for local servers and HTTP with server-sent events for remote ones.",
    whyItMattersNow:
      "As AI agents move from demos to production, the lack of a standard way to connect models to tools has been a major friction point. MCP is rapidly becoming the de facto standard, with adoption from major AI labs and tool providers. Understanding MCP is essential for building or using AI agents effectively.",
    relatedConcepts: ["concept-tool-calling", "concept-evals"],
    examples: [
      "A Claude Code MCP server that gives the AI access to your GitHub repos, letting it read issues and create PRs",
      "A database MCP server that lets an AI assistant query your PostgreSQL database safely with read-only access",
      "A Slack MCP server that allows an AI to search message history and post updates to channels",
    ],
    resources: [
      { title: "MCP Specification", url: "https://modelcontextprotocol.io" },
      { title: "Building MCP Servers (Anthropic Docs)", url: "https://docs.anthropic.com/en/docs/agents-and-tools/mcp" },
    ],
  },
  {
    id: "concept-evals",
    name: "Evals",
    slug: "evals",
    simpleExplanation:
      "Evals (evaluations) are tests that measure how well an AI model performs at specific tasks. Just like unit tests check that code works correctly, evals check that an AI model gives good answers, follows instructions, avoids harmful outputs, and handles edge cases.",
    deeperExplanation:
      "Evals range from simple automated benchmarks (multiple-choice accuracy, code execution pass rates) to complex human-judged assessments (response quality, safety). Good eval suites test multiple dimensions: capability (can it do the task?), reliability (does it do it consistently?), safety (does it avoid harm?), and calibration (does it know when it doesn't know?). Teams typically build custom evals specific to their use case alongside standard benchmarks. The challenge is that evals for open-ended generation are much harder to automate than evals for tasks with clear right answers.",
    whyItMattersNow:
      "As companies deploy AI in production, 'vibes-based' evaluation isn't enough. Evals are becoming the standard way to decide which model to use, whether a prompt change is an improvement, and whether a model is safe to deploy. The eval ecosystem is growing fast, with new frameworks and benchmarks appearing regularly.",
    relatedConcepts: ["concept-distillation", "concept-inference-time-compute"],
    examples: [
      "Running HumanEval to measure a model's ability to write correct Python functions",
      "A company building custom evals that test whether their customer support bot correctly handles refund requests",
      "Red-team evals that check whether a model can be tricked into generating harmful content",
    ],
    resources: [
      { title: "Anthropic's Approach to Evals", url: "https://docs.anthropic.com/en/docs/build-with-claude/develop-tests" },
    ],
  },
  {
    id: "concept-distillation",
    name: "Model Distillation",
    slug: "distillation",
    simpleExplanation:
      "Distillation is a technique where a small, fast AI model learns to mimic a large, powerful one. The large model (the 'teacher') generates examples, and the small model (the 'student') trains on those examples until it can produce similar quality outputs at a fraction of the cost and speed.",
    deeperExplanation:
      "In distillation, the student model doesn't just learn from the teacher's final answers — it learns from the teacher's output probability distributions, which contain richer information about relationships between possible answers. This 'soft label' training transfers more knowledge than training on hard labels alone. Variants include task-specific distillation (training a small model for one particular task) and general distillation (trying to preserve broad capabilities). The trade-off is that distilled models typically lose some of the teacher's generality and edge-case handling.",
    whyItMattersNow:
      "Distillation is a key reason why AI capabilities are spreading so fast. It lets teams deploy powerful AI on limited hardware, reduce API costs dramatically, and run models locally for privacy. Recent results show distilled models matching frontier performance on specific tasks, which challenges the assumption that you always need the biggest model.",
    relatedConcepts: ["concept-evals", "concept-inference-time-compute"],
    examples: [
      "A 7B parameter model distilled from GPT-4 that matches its medical QA accuracy",
      "A company distilling Claude into a small model that runs on-device for their mobile app",
      "DistilBERT — an early and famous example that retained 97% of BERT's performance at 60% the size",
    ],
    resources: [
      { title: "Distilling the Knowledge in a Neural Network (Hinton et al.)", url: "https://arxiv.org/abs/1503.02531" },
    ],
  },
  {
    id: "concept-inference-time-compute",
    name: "Inference-Time Compute",
    slug: "inference-time-compute",
    simpleExplanation:
      "Inference-time compute means letting an AI model 'think longer' on hard problems by using more processing power when generating a response, rather than just during training. Instead of always answering instantly, the model can spend extra time reasoning through a problem step by step, which often leads to much better answers.",
    deeperExplanation:
      "Traditional scaling focused on training: bigger models, more data, longer training runs. Inference-time compute scaling flips this — you keep the model the same but give it more resources at response time. Techniques include chain-of-thought prompting, extended thinking (where the model generates internal reasoning before answering), tree search over possible solutions, and self-verification loops. The key insight is that some problems benefit more from 'thinking harder' than from 'knowing more'. This creates a new cost-quality trade-off: you can use a smaller model with more inference compute and sometimes match a larger model's quality.",
    whyItMattersNow:
      "Extended thinking and reasoning models (like Claude's extended thinking or OpenAI's o-series) are the most visible application of this idea. They're showing dramatic improvements on math, coding, and complex reasoning tasks. This shift changes how developers should think about model selection — sometimes a cheaper model with more inference budget beats an expensive model with less.",
    relatedConcepts: ["concept-distillation", "concept-evals"],
    examples: [
      "Claude's extended thinking feature, where the model reasons internally before giving a final answer",
      "OpenAI's o1 model using chain-of-thought reasoning to solve competition math problems",
      "A coding agent that generates multiple solutions, tests each one, and returns the best — trading compute for accuracy",
    ],
    resources: [
      { title: "Scaling LLM Test-Time Compute (DeepMind)", url: "https://arxiv.org/abs/2408.03314" },
    ],
  },
  {
    id: "concept-tool-calling",
    name: "Tool Calling",
    slug: "tool-calling",
    simpleExplanation:
      "Tool calling (or function calling) is the ability for an AI model to use external tools — like searching the web, running code, querying a database, or calling an API — as part of generating a response. Instead of guessing at information, the model can go look it up or take real actions.",
    deeperExplanation:
      "When a model supports tool calling, you provide it with a list of available tools described as JSON schemas (name, description, parameters). During generation, the model can choose to emit a structured tool call instead of text. Your application executes the tool, returns the result to the model, and the model continues generating with that new information. This creates a loop: the model reasons about what tool to use, calls it, interprets the result, and decides whether to call another tool or respond. The challenge is reliability — the model needs to pick the right tool, format parameters correctly, and handle errors gracefully.",
    whyItMattersNow:
      "Tool calling is the foundation of AI agents. Without it, models are limited to what they learned during training. With it, they can access real-time data, take actions, and solve multi-step problems. Every major model provider now supports tool calling, and it's become a key differentiator in model quality — not just whether a model can call tools, but how reliably it does so.",
    relatedConcepts: ["concept-mcp"],
    examples: [
      "An AI assistant that calls a weather API to answer 'What's the weather in London?'",
      "Claude Code using tool calls to read files, run terminal commands, and edit code",
      "A customer support bot that calls internal APIs to look up order status and process refunds",
    ],
    resources: [
      { title: "Tool Use (Anthropic Docs)", url: "https://docs.anthropic.com/en/docs/build-with-claude/tool-use/overview" },
    ],
  },
  {
    id: "concept-agentic-ai",
    name: "Agentic AI",
    slug: "agentic-ai",
    simpleExplanation:
      "Agentic AI refers to AI systems that can autonomously plan and execute multi-step tasks, make decisions, use tools, and adapt their approach based on results — rather than just responding to a single prompt. Think of the difference between asking someone a question and hiring someone to complete a project.",
    deeperExplanation:
      "An agentic system typically combines a language model with a loop: the model observes the current state, decides on an action, executes it (often via tool calling), observes the result, and repeats until the task is done. Key capabilities include planning (breaking a goal into steps), tool use (interacting with external systems), memory (retaining context across steps), and error recovery (adapting when something goes wrong). The spectrum ranges from simple ReAct-style loops to complex multi-agent systems where specialised agents collaborate. The main challenges are reliability over long task horizons, knowing when to ask for human input, and avoiding compounding errors.",
    whyItMattersNow:
      "2025-2026 has seen agentic AI move from research demos to production tools. Coding agents (like Claude Code, Cursor, Devin) are the leading edge, but agents are appearing in customer support, data analysis, and DevOps. Understanding agentic patterns is becoming essential for developers building with AI.",
    relatedConcepts: ["concept-tool-calling", "concept-mcp"],
    examples: [
      "Claude Code autonomously reading a codebase, planning changes, writing code, running tests, and fixing failures",
      "An agent that researches a topic by searching the web, reading pages, synthesising findings, and writing a report",
      "A DevOps agent that monitors alerts, diagnoses issues, and applies fixes with human approval",
    ],
    resources: [
      { title: "Building Effective Agents (Anthropic)", url: "https://docs.anthropic.com/en/docs/build-with-claude/agentic-systems" },
    ],
  },
];
