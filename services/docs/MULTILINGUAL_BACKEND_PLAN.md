# Multilingual Backend Plan

No backend i18n implementation is assumed by this document. Activate only after a service contract requires multiple locales and the user approves the slice.

Minimum contract:

1. Resolve locale from an explicit supported input; define one fallback.
2. Keep stable message/error codes in service logic. Translate at the transport boundary.
3. Store catalogs in one shared service-local location; no hardcoded user-facing message matrix in controllers.
4. Preserve response shape and authorization behavior across locales.
5. Add one focused check for supported locale, unsupported fallback, and stable error code.

Do not add an i18n package when a small existing catalog/stdlib lookup covers the approved scope.
