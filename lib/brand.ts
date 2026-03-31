// lib/brand.ts
// Central brand config — override any value via NEXT_PUBLIC_BRAND_* env vars.
// NEXT_PUBLIC_ prefix makes these available in client components and Node scripts alike.
// Defaults are the original DirectKSA values so existing deploys need no changes.
//
// NOTE: Uses getter properties so env vars are read at access time, not at module
// load time. This is necessary for Node.js scripts (setup-vapi.ts, seed-data.ts)
// where dotenv.config() runs after imports are hoisted.

export const brand = {
  get name()       { return process.env.NEXT_PUBLIC_BRAND_NAME         ?? 'Direct KSA' },
  get nameAr()     { return process.env.NEXT_PUBLIC_BRAND_NAME_AR      ?? 'دايركت'     },
  get nameAccent() { return process.env.NEXT_PUBLIC_BRAND_NAME_ACCENT  ?? 'KSA'        },
  get idPrefix()   { return process.env.NEXT_PUBLIC_BRAND_ID_PREFIX    ?? 'DK'         },
  get idPrefixAr() { return process.env.NEXT_PUBLIC_BRAND_ID_PREFIX_AR ?? 'دي كي'      },
  get color()      { return process.env.NEXT_PUBLIC_BRAND_COLOR        || '#C9A84C'    },
}

export const brandDerived = {
  get goodbyeAr()  { return `شكراً لاتصالك بـ${brand.nameAr}! مع السلامة!`            },
  get goodbyeEn()  { return `Thank you for calling ${brand.name}! Goodbye!`            },
  get greetingAr() { return `أهلاً بك في ${brand.nameAr}!`                             },
  get catchallEn() { return `Thank you for calling ${brand.name}. مع السلامة.`         },
  get idFormat()   { return `${brand.idPrefix}-YYYY-XXX`                               },
  get idExample()  { return `${brand.idPrefix}-2026-001`                               },
}
