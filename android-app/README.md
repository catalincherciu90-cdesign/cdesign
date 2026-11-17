# C Design Admin — aplicația Android

Aplicație Android (Trusted Web Activity) care deschide adminul site-ului,
`https://www.c-design.ro/programari`, și primește notificările push trimise de
site (programări, mesaje și lead-uri noi). Nu are logică proprie: orice
modificare făcută în admin apare în aplicație fără un APK nou.

- Pachet: `ro.cdesign.admin`
- Android minim: 7.0 (API 24)
- Pe telefon e nevoie de Chrome (sau alt browser care suportă TWA).

## Build

Cerințe: JDK 17+, Gradle 8.13+, Android SDK (platforms;android-36,
build-tools;36.0.0).

```
export ANDROID_HOME=/cale/android-sdk
export CDESIGN_KEYSTORE=/cale/cdesign-admin.keystore
export CDESIGN_KEYSTORE_PASS='parola-keystore'
gradle assembleRelease
# rezultat: app/build/outputs/apk/release/app-release.apk
```

Keystore-ul și parola NU se pun în repo. Orice versiune nouă trebuie semnată
cu același keystore, altfel telefonul refuză actualizarea. La o versiune nouă
crește `versionCode` și `versionName` în `app/build.gradle`.

## Legătura cu site-ul (Digital Asset Links)

Ca aplicația să ruleze pe tot ecranul (fără bara de adresă) și notificările să
apară sub numele aplicației, `https://www.c-design.ro/.well-known/assetlinks.json`
trebuie să conțină amprenta SHA-256 a certificatului de semnare. Worker-ul
servește deja acest fișier (`ANDROID_APP_SHA256` în `_worker.js`), dar serverul
din fața site-ului trebuie să lase calea `/.well-known/` să ajungă la worker
sau să servească el același fișier.
