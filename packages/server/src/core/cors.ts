type CorsConfig = {
  origin?: string | boolean;
  methods?: null | "" | "*" | string[];
  allowedHeaders?: string | string[];
  exposedHeaders?: string | string[];
  credentials?: boolean;
  maxAge?: number;
  preflight?: boolean;
  optionsSuccessStatus?: number;
};

const defaultCorsConfig = {
  origin: true,
  methods: "*",
  allowedHeaders: "*",
  exposedHeaders: "*",
  credentials: false,
  maxAge: 5,
  preflight: true,
} satisfies CorsConfig;

export const cors = (config = defaultCorsConfig) => {};
