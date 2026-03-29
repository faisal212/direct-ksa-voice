// scripts/vapi/types.ts
// Shared type definitions for Vapi agent setup scripts

export interface AgentDef {
  key: string
  name: string
  voice: { provider: string; voiceId: string; model: string }
  firstMessage?: string
  prompt: string
  tools: unknown[]  // Vapi has two heterogeneous tool shapes (transferCall + function)
}
