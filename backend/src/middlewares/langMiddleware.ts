import { Request, Response, NextFunction } from "express";
import pt from "../locales/pt.json";
import en from "../locales/en.json";

const translations = {
  pt,
  en,
} as const;

type Lang = keyof typeof translations;

export function langMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const langCookie = req.cookies?.lang as string | undefined;

  const lang: Lang =
    langCookie && langCookie in translations ? (langCookie as Lang) : "pt";

  const dictionary = translations[lang];

  req.t = (key: string): string => {
    return dictionary[key as keyof typeof dictionary] ?? key;
  };

  next();
}
