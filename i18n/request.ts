import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import en from "./messages/en.json";
import fa from "./messages/fa.json";
import ar from "./messages/ar.json";
import tr from "./messages/tr.json";

const messages = { en, fa, ar, tr };

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = requestLocale as any;

  if (!locale || !routing.locales.includes(locale)) {
    locale = routing.defaultLocale;
  }

  return {
    messages: messages[locale],
  };
});
