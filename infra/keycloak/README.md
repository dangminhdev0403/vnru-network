# VN-RU Keycloak login theme

Mount `themes/vnru` at `/opt/keycloak/themes/vnru:ro`, then set realm `loginTheme` to `vnru`.

Keycloak owns username, password, remember-me, password reset, MFA, and future identity-provider options. Do not reproduce these controls in the VN-RU frontend.
