interface PromptConfig {
  keywordGeneratorPrompt: string;
  keywordExplainerPrompt: string;
}

// 默认的提示词
export const DEFAULT_PROMPTS = {
  // 关键词生成器提示词
  keywordGenerator: `
  Generate ONE Google search command from user's input (Chinese or English) as ONE string, combining ALL roles, ensuring output keyword semantics are 100% identical to input intent and language, with consistent role parsing across runs. Output ONLY ONE JSON.
  
  Rules:
  1. Generate ONE string:
     - Roles: Topic (core phrase, e.g., "区块链技术" → "\"区块链技术\"", "data analysis" → "\"data analysis\""), Modifier (descriptive, e.g., "安全相关的" → "security", "tutorial" → "tutorial", separate from topic), File type ("pdf" → "filetype:pdf"), Website ("政府网站" → "site:*.gov"), URL ("在博客上" → "inurl:blog"), Exclusion ("不要博客" → "-inurl:blog").
     - Join ALL roles in ONE string with spaces, exclusions first, ensuring 100% semantic equivalence and consistent output.
     - **NEVER** translate (e.g., "区块链技术" stays "\"区块链技术\"").
     - **NEVER** split, omit, or output partial strings; include ALL roles.
  2. Output: {"keyword": "command", "explanation": "English explanation"}.
     - **NEVER** output arrays, multiple JSONs, or incomplete strings.
     - Output EXACTLY ONE JSON.
  
  Return: {"keyword": "command", "explanation": "English explanation"}
  
  Examples:
  Input: "data analysis tutorial on blogs"
  Output: {"keyword": "inurl:blog \"data analysis\" tutorial", "explanation": "Output keyword semantics 100% match input: 'data analysis' (topic), 'tutorial' (modifier), 'on blogs' (URL) in ONE string, consistently parsed."}
  Input: "区块链技术 安全相关的 pdf 不要博客"
  Output: {"keyword": "-inurl:blog \"区块链技术\" security filetype:pdf", "explanation": "Output keyword semantics 100% match input: '区块链技术' (topic), '安全相关的' (modifier), 'pdf' (file type), '不要博客' (exclusion) in ONE string, consistently parsed."}
  `

  ,

  // 关键词解释器提示词
  keywordExplainer: `
  You’re a Google search expert. Return ONLY a single JSON object for user-provided Google search commands with EXACTLY four fields: "search_command" (input string), "explanation" (part roles, ~30 words), "intent" (one-sentence purpose, ~20 words), "suggestions" (one tweak, ~10 words). Use ultra-simple, everyday English. Keep intent and explanation friendly, chatty, no techy words like “operator”, “logic”, “restrict”. Don’t explain word meanings (e.g., book details). STRICTLY no headers, markdown, or extra text—ONLY JSON.
  
  Examples:
  Input: "machine learning filetype:pdf"
  Output: {
    "search_command": "machine learning filetype:pdf",
    "explanation": "machine learning finds those words. filetype:pdf only gets PDFs.",
    "intent": "This finds machine learning PDFs, like papers or guides.",
    "suggestions": "Try site:*.edu for school stuff."
  }
  Input: "时间简史 filetype:pdf"
  Output: {
    "search_command": "时间简史 filetype:pdf",
    "explanation": "时间简史 finds that phrase. filetype:pdf only gets PDFs.",
    "intent": "This finds 时间简史 PDFs, like e-books or summaries.",
    "suggestions": "Try site:*.edu for school stuff."
  }
  `


};

/**
 * 获取提示词配置
 * 优先从环境变量中获取，如果没有则使用默认值
 */
export function getPromptConfig(): PromptConfig {
  // Create custom prompts that explicitly request English responses
  const keywordGeneratorCustomPrompt = DEFAULT_PROMPTS.keywordGenerator + "\n\nIMPORTANT: Always respond in English only, regardless of the input language. All keyword explanations must be in English.";
  const keywordExplainerCustomPrompt = DEFAULT_PROMPTS.keywordExplainer + "\n\nIMPORTANT: Always respond in English only, regardless of the input language. All explanations must be in English.";
  
  // Set these custom prompts in localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem('custom_prompt_keywordGenerator', keywordGeneratorCustomPrompt);
    localStorage.setItem('custom_prompt_keywordExplainer', keywordExplainerCustomPrompt);
  }
  
  return {
    keywordGeneratorPrompt: keywordGeneratorCustomPrompt,
    keywordExplainerPrompt: keywordExplainerCustomPrompt
  };
}

/**
 * 设置自定义提示词
 * 用于在运行时动态更新提示词
 * @param type 提示词类型
 * @param content 提示词内容
 */
export function setCustomPrompt(type: 'keywordGenerator' | 'keywordExplainer', content: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(`custom_prompt_${type}`, content);
  }
}

/**
 * 获取自定义提示词
 * @param type 提示词类型
 * @returns 自定义提示词或undefined
 */
export function getCustomPrompt(type: 'keywordGenerator' | 'keywordExplainer'): string | undefined {
  if (typeof window !== 'undefined') {
    const customPrompt = localStorage.getItem(`custom_prompt_${type}`);
    return customPrompt || undefined;
  }
  return undefined;
}

/**
 * 重置自定义提示词为默认值
 * @param type 提示词类型
 */
export function resetPrompt(type: 'keywordGenerator' | 'keywordExplainer'): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(`custom_prompt_${type}`);
  }
} 