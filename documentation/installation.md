---
layout: page
title: Installation
parent: Get Started
---

# Installation

## Prerequisites

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

- [Mini Graph Card][miniGraphCard]

  [![Open in HACS at your Home Assistant instance.][hacsBadge]][miniGraphCardHacs]

Thanks to the developers of all of these. Could not be done without their incredible work!

## HACS Installation

Click the badge below.

[![Open in HACS at your Home Assistant instance.][hacsBadge]][strategyPackHacs]

or ...

{: .note }
> Till the PR to add this to HACS default is merged you need to add it as a custom Repository.
>
> HACS - Custom Repositories (in kebap menu) - Add *https://github.com/itsteddyyo/strategy-pack*
>
> Alternatively just click the Badge/Link above. It will prompt you to add the custom Repository with pre-filled URL.

1. Open HACS in Home Assistant.
2. Go to the "Frontend" section.
3. Click the button with the `+` icon.
4. Search for "Strategy Pack" and install.

## Manual Installation

1. Download `strategy-pack.es.js` file from the [`dist`](./dist/) directory.

2. Save this file into your `config/www` folder on your Home Assistant instance.

3. Add a reference to `strategy-pack.es.js` in Dashboard. There are two ways to do that:

{: .note }
If you do not see the Resources menu, you will need to enable _Advanced Mode_ in your _User Profile_.

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

<!-- Badge References -->
[hacsBadge]: https://my.home-assistant.io/badges/hacs_repository.svg
<!-- URL References -->
[strategyPackHacs]: https://my.home-assistant.io/redirect/hacs_repository/?owner=itsteddyyo&repository=strategy-pack&category=Plugin
[resourcesBadge]: https://my.home-assistant.io/badges/lovelace_resources.svg
<!-- URL References -->
[hacsUrl]: https://hacs.xyz
[hacsInstallationUrl]: https://hacs.xyz/docs/setup/prerequisites
[resourcesUrl]: https://my.home-assistant.io/redirect/lovelace_resources

[cardMod]: https://github.com/thomasloven/lovelace-card-mod
[layoutCard]: https://github.com/thomasloven/lovelace-layout-card
[stateSwitch]: https://github.com/thomasloven/lovelace-state-switch
[tabbedCard]: https://github.com/kinghat/tabbed-card
[mushroomCards]: https://github.com/piitaya/lovelace-mushroom
[miniGraphCard]: https://github.com/kalkih/mini-graph-card

[cardModHacs]: https://my.home-assistant.io/redirect/hacs_repository/?owner=thomasloven&repository=lovelace-card-mod
[layoutCardHacs]: https://my.home-assistant.io/redirect/hacs_repository/?owner=thomasloven&repository=lovelace-layout-card
[stateSwitchHacs]: https://my.home-assistant.io/redirect/hacs_repository/?owner=thomasloven&repository=lovelace-state-switch
[tabbedCardHacs]: https://my.home-assistant.io/redirect/hacs_repository/?owner=kinghat&repository=tabbed-card
[mushroomCardsHacs]: https://my.home-assistant.io/redirect/hacs_repository/?owner=piitaya&repository=lovelace-mushroom
[miniGraphCardHacs]: https://my.home-assistant.io/redirect/hacs_repository/?owner=kalkih&repository=mini-graph-card
