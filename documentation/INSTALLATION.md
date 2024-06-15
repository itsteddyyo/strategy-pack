# Installation
## Prerequisites

>[!NOTE]
>Till the PR to add this to HACS default is merged you need to add it as a custom repository. HACS - Custom Repositores (in kebap menu) - Add https://github.com/itsteddyyo/strategy-pack

Strategy Pack and dependencies are available in [HACS][hacsUrl] (Home Assistant Community Store).  
Install HACS if you don't have it already.
For assistance, you can follow the [HACS Installation Guide][hacsInstallationUrl].

You need to install the following HACS integrations before you can use this strategy.  
Open the links below and follow the installation instructions or use the badges to open the HACS repository at your Home
Assistant instance directly.

- [card-mod][cardMod]

  [![Open in HACS at your Home Assistant instance.][hacsBadge]][cardModHacs]

- [Layout Card][layoutCard]

  [![Open in HACS at your Home Assistant instance.][hacsBadge]][layoutCardHacs]

- [State-Switch][stateSwitch]

  [![Open in HACS at your Home Assistant instance.][hacsBadge]][stateSwitchHacs]

- [Tabbed Card][tabbedCard]

  [![Open in HACS at your Home Assistant instance.][hacsBadge]][tabbedCardHacs]

- [Mushroom Cards][mushroomCards]

  [![Open in HACS at your Home Assistant instance.][hacsBadge]][mushroomCardsHacs]

Optionally you can install:

- [Mini Graph Card][miniGraphCard]

  [![Open in HACS at your Home Assistant instance.][hacsBadge]][miniGraphCardHacs]

It is not really needed for the strategy to run but is used in the default config for the Area-Dashboard/View-Strategy and in the Battery-View-Strategy.

Thanks to the developers of all of these. Could not be done without their incredible work!

## HACS

Click the badge below.

[![Open in HACS at your Home Assistant instance.][hacsBadge]][strategyPackHacs]

or ...

1. Open HACS in Home Assistant.
2. Go to the "Frontend" section.
3. Click the button with the `+` icon.
4. Search for "Strategy Pack" and install.

## Manual

1. Download `strategy-pack.es.js` file from the [`dist`](./dist/) directory.

2. Save this file into your `config/www` folder on your Home Assistant instance.

3. Add a reference to `strategy-pack.es.js` in Dashboard. There are two ways to do that:

>[!NOTE]
>If you do not see the Resources menu, you will need to enable _Advanced Mode_ in your _User Profile_.

   1. **Using UI:** Click the badge...

      [![Open your Home Assistant instance and show your dashboard resources.][resourcesBadge]][resourcesUrl]

      or...

      - Go to _Settings_ → _Dashboards_ → _More Options icon_ → _Resources_ → _Add Resource_ → Set _Url_
        to `/local/strategy-pack.es.js` → Set _Resource type_ to `JavaScript Module`.

   2. **Using YAML:** Add the following code to the `lovelace` section.

      ```yaml
      resources:
        - url: /local/strategy-pack.es.js
          type: module
      ```
