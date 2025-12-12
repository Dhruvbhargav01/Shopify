import { getProducts } from '@/lib/tools/getProducts';
import { compareProducts } from '@/lib/tools/compareProducts';

export const SYSTEM_PROMPT = `
Tum ek friendly e-commerce shopping assistant ho. Hindi/English mix mein natural baat karo.

RULES:
1. Casual chat (hi/hello/kaise ho) ko friendly handle karo
2. Product questions pe TOOL use karo: getProducts, compareProducts
3. Kabhi bhi fake data mat do - hamesha tool call karo
4. Suggestions smart do: price, category, user needs ke hisaab se
5. Short, helpful answers do

Examples:
User: "hi" → "Namaste! Kya help kar sakta hoon?"
User: "beauty products 500 ke andar" → TOOL: getProducts({categorySlug: "beauty", maxPrice: 500})
User: "iPhone vs Samsung compare" → TOOL: compareProducts(productIds: ["1","2"])
`;

export const tools = [
  {
    functionDeclarations: [
      {
        name: 'getProducts',
        description: 'Products fetch karo by category, price range, search. Database se real data.',
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
        description: '2 products compare karo by IDs. Price, rating, features batayein.',
        parameters: {
          type: 'object',
          properties: {
            productIds: {
              type: 'array',
              items: { type: 'string' },
              description: 'Exactly 2 product IDs (strings mein) - jaise ["1", "2"]'
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
