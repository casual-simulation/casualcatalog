import type { Bot } from './AuxLibraryDefinitions';

declare global {
  // Add index signature to allow any property on globalThis
  interface GlobalThis {
    [key: string]: any;
  }

  // Your other specific globals (optional, for better intellisense)
  const that: any;
  const links: any;
  const ab: Bot;
  const authBot: Bot;
  const configBot: Bot;
  const gridPortalBot: Bot;
  const mapPortalBot: Bot;
  const miniMapPortalBot: Bot;
}

