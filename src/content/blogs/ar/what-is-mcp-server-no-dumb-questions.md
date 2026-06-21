---
title: "🔌 مفيش أسئلة غبية: ايه هو MCP Server وليه يهمك؟"
description: "ايه هو MCP Server؟ شرح مبسط لـ Model Context Protocol، وليه مهم للـ AI agents، وازاي تبني واحد."
excerpt: "MCP Server مبسط: ايه هو، وليه مهم للـ AI agents، وازاي تبدأ. مفيش أسئلة غبية."
date: 2026-05-09
updated: 2026-05-09
tags:
  - mcp
  - ai-agents
  - llm
  - developer-tools
  - fullstack
image: "/images/blogs/mcp-server.jpg"
share: true
featured: false
---

# 🔌 مفيش أسئلة غبية: ايه هو MCP Server وليه يهمك؟

## الاختصار اللي بيظهر في كل مكان

لو كنت قريب من عالم الـ AI development السنة دي، غالباً شفت "MCP" ذكرت على الأقل عشرة مرات. Model Context Protocol. بيبدو زي standard تاني محدش طالبه — بس استنى لحظة، لأن ده فعلاً مهم.

Stack Overflow نشرت مؤخراً "No Dumb Questions" explainer عن MCP، وده فكرني قد ايه مطوري كتير (وأنا فيهم في الأول) بيعانوا عشان يفهموا ايه هو فعلاً وليه مهم. خليني أشرحه من منظور fullstack developer.

---

## ايه هو MCP فعلاً

ببساطة، **MCP هو طريقة معيارية للـ AI models تتفاعل مع external tools و data sources.** فكر فيه زي USB-C للـ AI agents — interface مشترك أي model تقدر تستخدمه يتصل بأي tool، database، أو API من غير custom integration code.

قبل MCP، لو عايز الـ LLM يعمل query على database، يبعت email، أو fetch من API، كنت لازم:

1. تكتب custom function-calling logic لكل tool
2. تتعامل مع الـ tool definitions في الـ format المحدد لكل model (OpenAI format, Anthropic format, Ollama format — كلهم مختلفين)
3. تدير الـ authentication والـ state بنفسك

مع MCP، الـ model server بيعلن عن الـ tools المتاحة من خلال protocol معياري. أي MCP-compatible client (Claude Desktop, Cline, Roo Code, ودلوقتي Google's ADK و Gemini CLI) يقدر يكتشف ويستخدم الـ tools دي من غير glue code.

---

## مثال عملي

تخيل عايز الـ AI coding assistant بتاعك يقدر يعمل query على الـ PostgreSQL database بتاعك مباشرة.

**قبل MCP:** تكتب custom tool handler، تسجله مع الـ agent framework، ت format الـ function schema لكل LLM provider، وت wire الـ error handling بنفسك.

**مع MCP:** تشغل MCP server بي expose الـ database كـ tool:

```typescript
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const server = new Server({
  name: 'postgres-mcp-server',
  version: '1.0.0',
}, {
  capabilities: { tools: {} },
});

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [{
    name: 'query_database',
    description: 'Execute a read-only SQL query',
    inputSchema: {
      type: 'object',
      properties: {
        sql: { type: 'string', description: 'SQL query to execute' },
        params: { type: 'array', items: { type: 'string' } },
      },
      required: ['sql'],
    },
  }],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === 'query_database') {
    const { sql, params } = request.params.arguments;
    const result = await pool.query(sql, params);
    return { content: [{ type: 'text', text: JSON.stringify(result.rows) }] };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
```

دلوقتي أي MCP-compatible AI client يقدر يتصل بالـ server ده ويعمل query على الـ database — من غير custom integration، من غير provider-specific glue، من غير duplicated effort.

---

## ليه ده مهم لمطوري الـ Fullstack

دي النقطة الحقيقية: MCP مش بس للـ AI researchers أو ML engineers. **ده tooling standard كل fullstack developer لازم يفهمه.**

فكر في الـ development workflow بتاعك. بتستخدم tools كتير يومياً — الـ database، الـ cloud provider API، الـ CI/CD pipeline، الـ monitoring stack، الـ issue tracker. كل دول عندهم API، بس توصل AI assistant لكل دول محتاج custom integration work.

MCP بي standardize ده. اكتب MCP server مرة واحدة للـ internal tool بتاعك، وأي AI agent فريقك بيستخدمه يقدر يستفيد منه. محتاج agent يقدر يشوف الـ production logs، يعمل query على الـ database، يعمل Jira ticket، وي deploy hotfix؟ ده أربعة MCP servers شغالين مع بعض.

---

## الـ ecosystem بينمو بسرعة

دعم الـ MCP بي explode. دول اللي بيدعموا أو بيبنيوا دعم في مايو 2026:

- **Claude Desktop** — native MCP support من أوائل 2025
- **Google Agent Development Kit (ADK)** — first-class MCP integration
- **Gemini CLI** — أضاف مؤخراً subagents + MCP tool support
- **Cline / Roo Code** — VS Code extensions مع MCP support
- **OpenAI** — بيضيف MCP compatibility للـ Agents SDK
- **Custom servers** — مئات الـ community-built MCP servers على GitHub لكل حاجة من GitHub لـ Slack لـ Figma

الـ Stack Overflow article بتأكد النقطة دي: MCP بيتحول لـ universal plug-in protocol للـ AI tools، وتجاهله معناه فريقك هيعيد اختراع نفس الـ tool interfaces مرة ورا مرة.

---

## المفروض تعمل MCP Server؟

لو عندك internal tool، API، أو data source فريقك بيستخدمه مع AI بشكل منتظم، **أيوه بالتأكيد.** ده استثمار صغير بيدفع في تقليل الـ integration debt.

دي قاعدتي: لو عنده API واتمنيت مرة الـ AI coding assistant بتاعك يقدر يتكلم معه مباشرة، ده مرشح لـ MCP server. ابدأ بالـ database، والـ issue tracker، والـ documentation — دول بيغطوا 80% من اللي المطورين محتاجينه من الـ AI assistants.

---

## الخلاصة

MCP مش buzzword تتجاهله. ده الـ infrastructure layer اللي بتخلي رؤية "AI agent في كل developer's toolbelt" تشتغل فعلاً. بيحول الـ promise بتاع tool-using AI من per-provider hack لـ universal standard.

لو بتبني software بشكل احترافي، اتعلم MCP. اكتب server صغير لحاجة بتستخدمها يومياً. الـ time investment صغير، والـ perspective اللي هتاخدها على تطور الـ AI tooling لا يقدر بثمن.

## اقرأ أيضاً

- [استضافة على Dokploy](/blogs/self-host-nextjs-blog-on-dokploy)
- [ليه شلت الداتابيز](/blogs/why-i-ditched-database-for-static-site)
