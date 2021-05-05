// / <reference types="next" />
// / <reference types="next/types/global" />
// / <reference types="@types/node" />

declare module "*.module.css" {
  const classes: { [key: string]: string };
  export default classes;
}

declare module "remark-prism" {
  export default any;
}

declare module "remark-linkify-regex" {
  export default any;
}
