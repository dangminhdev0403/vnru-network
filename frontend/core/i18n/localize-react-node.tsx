import {
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";
import type { Locale } from "./locale";

export type TranslationMap = Record<
  Exclude<Locale, "vi">,
  Record<string, string>
>;

const LOCALIZED_PROPS = ["aria-label", "alt", "placeholder", "title"] as const;

function translate(
  value: string,
  locale: Locale,
  translations: TranslationMap,
) {
  if (locale === "vi") return value;
  const dictionary = translations[locale];
  const trimmed = value.trim();
  if (dictionary[trimmed]) return value.replace(trimmed, dictionary[trimmed]);

  return Object.entries(dictionary)
    .sort(([a], [b]) => b.length - a.length)
    .reduce(
      (localized, [source, target]) => localized.replaceAll(source, target),
      value,
    );
}

export function localizeReactNode(
  node: ReactNode,
  locale: Locale,
  translations: TranslationMap,
): ReactNode {
  if (locale === "vi") return node;
  if (typeof node === "string") return translate(node, locale, translations);
  if (Array.isArray(node)) {
    return node.map((child, index) => {
      const localized = localizeReactNode(child, locale, translations);
      if (isValidElement(localized) && localized.key == null) {
        return cloneElement(localized, {
          key: isValidElement(child) && child.key != null ? child.key : index,
        });
      }
      return localized;
    });
  }
  if (!isValidElement(node)) return node;

  const element = node as ReactElement<Record<string, unknown>>;
  const props = { ...element.props };
  if (props["data-no-localize"] !== undefined) return element;
  for (const name of LOCALIZED_PROPS) {
    if (typeof props[name] === "string") {
      props[name] = translate(props[name], locale, translations);
    }
  }
  if ("children" in props) {
    props.children = localizeReactNode(
      props.children as ReactNode,
      locale,
      translations,
    );
  }
  return cloneElement(element, props);
}
