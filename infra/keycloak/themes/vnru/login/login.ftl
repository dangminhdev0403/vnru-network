<#import "template.ftl" as layout>
<#import "field.ftl" as field>
<#import "social-providers.ftl" as identityProviders>
<#import "passkeys.ftl" as passkeys>
<@layout.registrationLayout displayMessage=!messagesPerField.existsError('username','password') displayInfo=false; section>
  <#if section = "header">
    ${msg("loginTitle")}
  <#elseif section = "form">
    <section class="vnru-auth-hero" aria-label="${msg("networkName")}">
      <a class="vnru-auth-brand" href="http://localhost:3000/"><span class="vnru-brand-mark" aria-hidden="true"></span><span>${msg("networkName")}<small>${msg("brandTagline")}</small></span></a>
      <div class="vnru-network-scene" aria-hidden="true">
        <svg viewBox="0 0 700 700" preserveAspectRatio="xMidYMid meet">
          <defs><linearGradient id="vnruAuthGrad"><stop offset="0" stop-color="#69d1ff"/><stop offset="1" stop-color="#ff7188"/></linearGradient></defs>
          <path class="net-path" d="M130 160 C220 190 250 270 335 330"/><path class="net-path" d="M115 360 C205 345 260 340 335 330"/><path class="net-path" d="M160 545 C225 480 275 404 335 330"/><path class="net-path hot" d="M335 330 C410 300 472 300 548 330"/><path class="net-path" d="M548 330 C585 260 615 210 640 155"/><path class="net-path" d="M548 330 C607 338 628 350 664 365"/><path class="net-path" d="M548 330 C595 410 616 477 642 545"/>
          <circle class="net-node" cx="130" cy="160" r="5"/><circle class="net-node" cx="115" cy="360" r="5"/><circle class="net-node" cx="160" cy="545" r="5"/><circle class="net-core" cx="335" cy="330" r="10"/><circle class="net-node red" cx="548" cy="330" r="6"/><circle class="net-node red" cx="640" cy="155" r="5"/><circle class="net-node red" cx="664" cy="365" r="5"/><circle class="net-node red" cx="642" cy="545" r="5"/>
        </svg>
      </div>
      <div class="vnru-auth-copy">
        <span class="vnru-eyebrow">${msg("secureAccess")}</span>
        <h1>${msg("heroTitleLead")} <span class="vnru-title-accent">${msg("heroTitleAccent")}</span></h1>
        <p>${msg("heroDescription")}</p>
        <div class="vnru-capabilities"><div><b>${msg("knowledgeTitle")}</b><span>${msg("knowledgeDescription")}</span></div><div><b>${msg("expertsTitle")}</b><span>${msg("expertsDescription")}</span></div><div><b>${msg("cooperationTitle")}</b><span>${msg("cooperationDescription")}</span></div></div>
      </div>
      <div class="vnru-visual-foot"><span>${msg("identityProtected")}</span><span>${msg("researchEcosystem")}</span></div>
    </section>
    <a class="vnru-back-link" href="http://localhost:3000/">${msg("backHome")}</a>
    <div class="vnru-form-head"><h2>${msg("welcomeBack")}</h2><#if realm.registrationAllowed && !registrationDisabled??><p>${msg("noAccount")} <a href="${url.registrationUrl}">${msg("createAccount")}</a></p></#if></div>
    <#if realm.password>
      <form id="kc-form-login" class="${properties.kcFormClass!}" onsubmit="login.disabled = true; return true;" action="${url.loginAction}" method="post" novalidate="novalidate">
        <#if !usernameHidden??>
          <div class="${properties.kcFormGroupClass}">
            <label for="username" class="${properties.kcFormLabelClass}"><span class="${properties.kcFormLabelTextClass}">${msg("usernameLabel")}</span></label>
            <span class="${properties.kcInputClass} vnru-input vnru-user-input <#if messagesPerField.existsError('username','password')>${properties.kcError}</#if>">
              <input id="username" name="username" value="${login.username!''}" type="text" autocomplete="username" autofocus placeholder="${msg("usernamePlaceholder")}" aria-invalid="${messagesPerField.existsError('username','password')?c}"/>
            </span>
          </div>
        </#if>

        <div class="${properties.kcFormGroupClass}">
          <label for="password" class="${properties.kcFormLabelClass}"><span class="${properties.kcFormLabelTextClass}">${msg("passwordLabel")}</span></label>
          <div class="${properties.kcInputGroup} vnru-input vnru-password-input">
            <div class="${properties.kcInputGroupItemClass} ${properties.kcFill}">
              <span class="${properties.kcInputClass}">
                <input id="password" name="password" type="password" autocomplete="current-password" placeholder="${msg('passwordPlaceholder')}" aria-invalid="${messagesPerField.existsError('username','password')?c}"/>
              </span>
            </div>
            <div class="${properties.kcInputGroupItemClass}">
              <button class="${properties.kcFormPasswordVisibilityButtonClass}" type="button" aria-label="${msg('showPassword')}" aria-controls="password" data-password-toggle data-icon-show="fa-eye fas" data-icon-hide="fa-eye-slash fas" data-label-show="${msg('showPassword')}" data-label-hide="${msg('hidePassword')}" id="password-show-password"><i class="fa-eye fas" aria-hidden="true"></i></button>
            </div>
          </div>
          <#if realm.resetPasswordAllowed><div class="vnru-options"><a href="${url.loginResetCredentialsUrl}">${msg("forgotPassword")}</a></div></#if>
        </div>

        <#if messagesPerField.existsError('username','password')>
          <div class="${properties.kcFormHelperTextClass}" aria-live="polite"><span class="${properties.kcInputErrorMessageClass}">${kcSanitize(messagesPerField.getFirstError('username','password'))?no_esc}</span></div>
        </#if>
        <input type="hidden" id="id-hidden-input" name="credentialId" <#if auth.selectedCredential?has_content>value="${auth.selectedCredential}"</#if>/>
        <button class="${properties.kcButtonPrimaryClass} ${properties.kcButtonBlockClass}" name="login" id="kc-login" type="submit">${msg("portalLogin")}</button>
      </form>
      <p class="vnru-terms">${msg("termsNotice")}</p>
      <div class="vnru-security-note"><span aria-hidden="true">◇</span><div><b>${msg("secureLoginTitle")}</b> ${msg("secureLoginDescription")}</div></div>
    </#if>
    <@passkeys.conditionalUIData />
  <#elseif section = "socialProviders">
    <#if realm.password && social.providers?? && social.providers?has_content>
      <div class="vnru-divider"><span>${msg("alternativeLogin")}</span></div>
      <@identityProviders.show social=social/>
    </#if>
  </#if>
</@layout.registrationLayout>
