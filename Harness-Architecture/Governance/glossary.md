---
title: Glossary
type: reference
status: active
updated: 2026-10-19
tags:
  - hermes
  - glossary
---

# Glossary

| Term | Definition |
|---|---|
| **Harness** | Software layer around the LLM: context, tools, execution, limits, and evaluation. |
| **Hermes** | This ecosystem's proprietary harness, materialized as this vault + MCP + processes. |
| **LLM** | Language model that generates text/actions. Not the same as the agent. |
| **Agent** | LLM + instructions + tools + memory, operating in a loop. |
| **Main Agent** | Orchestrator agent: understands, decides, delegates, validates, delivers. |
| **Subagent** | Temporary instance with a closed scope, created for one task. |
| **Specialist** | Persistent agent that owns a domain and its tools. |
| **Skill** | Reusable, versioned procedure with triggers and steps. |
| **Plugin** | Extension of a tool (IDE, Obsidian, browser) that adds capability. |
| **MCP** | *Model Context Protocol*: standard protocol for exposing tools/resources to agents. |
| **Tool** | Operation exposed by an MCP server (e.g., `vault_search`). |
| **Hook** | Automatic trigger before/after an action (e.g., validate before commit). |
| **LSP** | *Language Server Protocol*: gives the agent diagnostics, symbols, and code navigation. |
| **Spec-driven** | Develop from a short, verifiable specification before coding. |
| **Gate** | Mandatory checkpoint between workflow stages. |
| **Loop** | Execute → verify → correct cycle with an explicit stop condition. |
| **Code review** | Structured review at the end of delivery, with severity and criteria. |
| **Handoff** | Task transfer between agents with the minimum sufficient context. |
| **Token budget** | Context/cost limit defined before starting the task. |
| **Context rot** | Quality degradation caused by long, redundant, or irrelevant context. |
| **ADR** | *Architecture Decision Record*: short record of a structural decision. |
| **DoD** | *Definition of Done*: objective criteria for considering delivery complete. |
