---
layout: page
title: View Strategies
nav_order: 3
---

# View Strategies

View Strategies are Strategies that generate a single View.

### *What is a View?*

A [View](https://www.home-assistant.io/dashboards/views/){:target="_blank"} is a Tab inside an already existing Dashboard.

Take a look at the example image:

<img src="/assets/view/view.png" alt="View" style="max-height: 20rem;" />

 - the Dashboard is the Thing in the Sidebar
 - the View is the thing with the red mark inside the Dashboard

Only the View can get generated with a View Strategy!

### *How do i generate a View with a View Strategy?*

You just write YAML like in the following example.

```yaml
title: My already existing Dashboard
...
views:
  - strategy: 
      type: custom:example-view-strategy
      #The Config for this view dependant on the view; nothing to do with HA Config
      config: config for this view
    #The Home Assistant View Options like:
    ##icon: mdi-example
    ##path: example
    ##title: Example
    ##visible:
    ##  - user_you_want
  - other views you want...
```

{: .note }
>Note that the _views:_ key is a key in an already existing Dashboard and is a feature of the Home Assistant Dashboard Configuration!
>
>Look at an [example in the Home Assistant Documenation](https://www.home-assistant.io/dashboards/dashboards/#related-topics){:target="_blank"} above that Heading!