---
layout: page
title: Area Dashboard Strategy
parent: Dashboard Strategies
---

{% assign type = "area-dashboard-strategy" %}
{% assign area_strategy_options = site.data.types['src/area-dashboard-strategy.ts'].AreaStrategyOptions %}

# Area Dashboard Strategy

Fully configurabe Dashboard with View per Area and auto-populating entities ordered in Grids.

<img src="{{site.baseurl}}/assets/area/area-strategy.gif" alt="Area Strategy" style="max-height: 20rem;" />
 
The dashboard was designed to be fully responsive! You can absolutely use this also on tablets or phones!

<img src="{{site.baseurl}}/assets/area/area-strategy-responsive-new.gif" alt="Area Strategy Responsive" style="max-height: 20rem;" />

The Dashboard contains all entities assigned to the Area selected in the Navigation (either via device or entity itself).

This Dashboard Strategy generates multiple Views. One per Area configured in your Home Assistant instance.

{: .note }
> You may not be able to tell it generates multiple Views because all but one are made invisible in the top menu.
>
> <img src="{{site.baseurl}}/assets/area/area-strategy-top-menu.png" alt="Top Menu" style="max-height: 20rem;" />
>
> This is because the navigation is meant to be made with the left-sided navigation menu.

{% include usage.md type=type %}

{% include configuration_required_optional.md options=area_strategy_options %}

# UI explained

<img src="{{site.baseurl}}/assets/area/area-strategy-ui-explained.png" alt="UI Explained" style="max-height: 20rem;" />

## 1. Navigation

The Area Cards are forming a navigation menu. You can navigate the Views with a Click on the Area Card on the left Side.

{: .note }
> If you want the area card to show a background image you need to [upload an image to your area](https://www.home-assistant.io/docs/organizing/areas/#creating-an-area){:target="_blank"}.

## 2. Main

The Entities/Cards are grouped in different tabs.

They should be used to add another logical layer to dashboard apart from the grids and make the dashboard less cluttered.

## 3. Grids

A Tab can contains as many grids of entities as you like. The grids are supposed to represent different domains and their entities.

For example one grid for media_players and another grid for switches.

## 4. Top

The area above the navigation is completly configurable with a slot (of sorts) with the key `topCards`.

That means nothing is displayed there in the default configuration as this is individual.