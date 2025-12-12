import { getProducts } from '@/lib/tools/getProducts';
import { compareProducts } from '@/lib/tools/compareProducts';

export const SYSTEM_PROMPT = `
You are a friendly e-commerce shopping assistant. Speak in English naturally.

RULES:
1. Handle casual chat (hi/hello/how are you) friendly
2. Use TOOLS for product questions: getProducts, compareProducts
3. Never give fake data - always tool call
4. Give smart suggestions: price, category, user needs based
5. Keep answers short, helpful

Examples:
User: "hi" → "Hello! How can I help you?"
User: "beauty products under 500" → TOOL: getProducts({categorySlug: "beauty", maxPrice: 500})
User: "iPhone vs Samsung compare" → TOOL: compareProducts(productIds: ["1","2"])
`;

export const tools = [
  {
    functionDeclarations: [
      {
        name: 'getProducts',
        description: 'Fetch products by category, price range, search. Real database data.',
        parameters: {
          type: 'object',
          properties: {
            categorySlug: { type: 'string', description: 'beauty, fragrances, furniture, groceries' },
            maxPrice: { type: 'number' },
            minPrice: { type: 'number' },
            searchTerm: { type: 'string' },
            limit: { type: 'number', default: 5 }
          }
        }
      },
      {
        name: 'compareProducts',
        description: 'Compare 2 products by IDs. Price, rating, features.',
        parameters: {
          type: 'object',
          properties: {
            productIds: {
              type: 'array',
              items: { type: 'string' },
              description: 'Exactly 2 product IDs (strings) - like ["1", "2"]'
            }
          }
        }
      }
    ]
  }
];

export async function executeTool(
  functionCall: any,
  _messages: { role: string; content: string }[],
) {
  const fnName = functionCall.name as string;
  const args = functionCall.args ? JSON.parse(functionCall.args) : {};

  let result: any;

  if (fnName === 'getProducts') {
    result = await getProducts(args);
  } else if (fnName === 'compareProducts') {
    result = await compareProducts(args);
  } else {
    result = { error: 'Unknown tool function' };
  }

  return {
    functionResponse: {
      name: fnName,
      response: result,
    },
  };
}
