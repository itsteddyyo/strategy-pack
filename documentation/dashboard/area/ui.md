---
layout: page
title: UI Explained
parent: Area Dashboard Strategy
---

# UI

## UI explained

![UI Explained](/assets/area/area-strategy-ui-explained.png "UI Explained")

### 1. Navigation

The Area Cards are forming a navigation menu. You can navigate the Views with a Click on the Area Card on the left Side.

You can see the Areas have a colored overlay.
I hope this helps with navigation at a glance, but honestly i also just like the look.

The currently selected Room will have no overlay to distinguish it from the others.

All the details of the area card, the overlay color and even a blacklist of areas you want to hide can be configured.
{: .note }
If you want the area card to show a background image you need to [upload an image to your area](https://www.home-assistant.io/docs/organizing/areas/#creating-an-area){:target="_blank"}.

### 2. Tabs

The Entities/Cards are grouped in different tabs.

They should be used to add another logical layer to dashboard apart from the rows and make the dashboard less cluttered.

### 3. Content/Rows

A Tab can contains as many rows of entities as you like. The rows are supposed to represent different domains and their entities.

For example one row for media_players and another row for switches.

### 4. Top

The area above the navigation is completly configurable with a slot (of sorts) with the key `topCards`.

That means nothing is displayed there in the default configuration as this is individual.
