# Strategy Pack

This is a collection of [Home Assistant Strategies](https://developers.home-assistant.io/docs/frontend/custom-ui/custom-strategy/).

A strategy is Javascript Code that gets executed to create Dashboards and Views automatically. They make it easy to have auto-populated Dashboards with next to no configuration!

The strategies can be at dashboard level generating whole dashboards with multiple views
```
type: custom:area-dashboard-strategy
other_options: ...
```
or at view level generating a single view.
```
views:
  - strategy: custom:area-view-strategy
    other_options: ...
  - other views you want...
```

The collection currently consists of 3 Strategies, but i just started and am looking forward to adding more.

## 1. Area Strategy

The Area Strategy is a Dashboard Strategy, meaning it does not only create a single View but multiple Views at once. 

It generates a Dashboard with one View per Area configured in your Home Assistant. The Dashboard contains all entities assigned to that Area (either per device or entity itself).

 ![Area Strategy](/documentation/area-strategy.gif "Area Strategy")

### Navigation

The Area Cards are forming a navigation menu. You can navigate the Views with a Click on the Area Card (=card with the picture) on the left Side. 

![Navigation](/documentation/area-strategy-navigation.png "Navigation")

You can see the Areas have a colored overlay.
I hope this helps with navigation at a glance but honestly i also just like the look. 

The currently selected Room will have no overlay to distinguish it from the others.
The colors can be [configured](see TODO)
The details of the area card can also be [configured](see TODO)

### Main

On the right Side you can see Entities assigned to the View-Area ("Living Room" in this case).

![Main](/documentation/area-strategy-main.png "Main")

#### Tabs

The Entities/Cards are grouped in different tabs and categories. Those are [configurable also](see TODO).

In the default configuration there are tabs for:
- Control
- Stats
- Camera

#### Content/Rows

A Tab can contains as many rows of entities as you like. The rows are supposed to represent different domains and their entities.

For example one row for media_players and another row for switches.

![Row](/documentation/area-strategy-main-rows.png "Row")

The number of rows, their content, the heading and the cards used to display the entities are also completly [configurable](see TOOD).

In the default configuration there are rows for:

Control:
- media_player
- cover
- vacuum
- switch, input_boolean
- select, input_select
- button, scene
- number

Stats:
- binary_sensor
- sensor (non-numeric ones)
- sensor (numeric ones)

Camera:
- camera

I skipped lights and fans because they already are controllable with the area-card in the navigation but feel free to add them to your configuration!


### Top Cards

The area above the navigation is completly configurable with a slot (of sorts) "topCards".

![TopCards](/documentation/area-strategy-top-cards.png "TopCards")

With the topCards option you can pass any array of cards you like. Just like with a normal lovelace dashboard config in yaml.

### Configuration
#### Configuration Options
| option         | description                                                                                   | type   | required | default    | example                                                                                        |
|----------------|-----------------------------------------------------------------------------------------------|--------|----------|------------|------------------------------------------------------------------------------------------------|
| tabs           | Tabs shown in the main area (link)                                                            | Array  | yes      | set (link) | tabs: - label: Test icon: mdi:test rows: [...]                                                 |
| areaColor      | Possible colors for overlay (at least one must be defined) (link)                             | Array  | yes      | set (link) | areaColor: - rgba(0,0,0,0.5)                                                                   |
| areaCardConfig | The config for the area card. All options allowed expect type, area, navigation_path          | Object | no       | set (link) | areaCardConfig: aspect_ratio: 1:1                                                              |
| topCards       | Slot for cards above navigation (link)                                                        | Array  | no       | -          | topCards: - type: entity entities: - button.test - button.test2                                |
| replaceCards   | You can set a card to be used for a specific entity. Overwrites Config in Tabs - Rows - card. | Object | no       | -          | replaceCards: button.test: type: entity entityAttribute: entities entityAttributeAsArray: true |


#### Area Color

Array of colors defined as rgba.
The rgb defines the color and the a defines the transparancy.

#### Tab

The Tab show in the the main section.
Is using the Tabbed-Card (TODO: See).
```
tabs:
  - label: Control
    icon: mdi:button-pointer
    rows: [...]
```
Define as many Tabs as you want. 
The Tab will only be shown in the View per Area when it has content.

Example: if the Living Room has a Tab where none of the rows would have entities (like Camera, which has only one row and can easily be empty) the whole Tab is hidden.

#### Content/Row

Define the Rows in the Tab.
Every Row consists of a (optional) title and a Grid with all the cards for the entities.
The row is defined by:
| attribute             | description                                                                                                                                      | type          | required              | example                                                                                                                                                                         |
|-----------------------|--------------------------------------------------------------------------------------------------------------------------------------------------|---------------|-----------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| domain                | Domain or Array of domains the entity must belong to.                                                                                            | string, Array | yes                   | domain: button or domain: - button - light                                                                                                                                      |
| title                 | Title shown over Grid. Will not be rendered when not set.                                                                                        | string        | no                    | title: Test                                                                                                                                                                     |
| entityAttribute       | The attribute in the card-config where the entityId will be inserted.                                                                            | string        | yes                   | entityAttribute: entity with entityAttributeAsArray: false for: entity: button.test or entityAttribute: entities with entityAttributeAsArray: true for: entities: - button.test |
| entityAttribueAsArray | If the entityId should be inserted as an Array. (needed for cards that could theoretically display multiple entities)                            | boolean       | no (default is false) | see above                                                                                                                                                                       |
| card                  | The cardConfig of the card that should be rendered for every entity in the grid. You can use all cards you would normally use in your dashboard! | Object        | yes                   | type: tile iconColor: red                                                                                                                                                       |
| filter                | Define include and exclude function for more fine-grained control of entities selected for row than only domain.                                 | Object        | no                    | include: - type: state comparator: equal value: on exclude: - type: attribute comparator: is_numeric value: key: clickCount                                                     |

##### Filter
Filters can be defined for more fine-grained control which entities should be matched.
You can use both include and exclude as keys.
```
filter:
  include:
    - ...
  exclude:
    - ...
```
Both accept the same types and syntax.

The filter object looks like this.

| attribute  | description                                                                                                                                                                                                                                                                           | type                             | required                              | example                                                                                                                                                                                                                                                                                                                                                                |
|------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------|---------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| type       | Type of filter. Available are: - domain - state - attribute Could be expanded in the future if needed.                                                                                                                                                                                | enum                             | yes                                   | type: state                                                                                                                                                                                                                                                                                                                                                            |
| comparator | Comparator used to compare/filter. Available are: - equal (needs value to be set!) - greater_than (needs value to be set!) - is_numeric (does not need value. but needs key when attribute-type is used!) _ is_null (does not need value. but needs key when attribute-type is used!) | enum                             | no (default is equal)                 | comparator: is_numeric                                                                                                                                                                                                                                                                                                                                                 |
| value      | Value to compare against. Can be in variable form. See example.                                                                                                                                                                                                                       | dependant on type and comparator | no (dependant on type and comparator) | Can be in the form of:  value: on  when: type is domain, state; comparator is equal, greater_than  not set  when: type is domain, state; comparator is is_numeric, is_null  value:  key: deviceClass  value: battery  when: type is attribute, comparator is equal, greater_than  value:  key: deviceClass  when: type is attribute, comparator is is_numeric, is_null |

### Default Config

There Area Cards show only device_type: occupancy as alarm icon + temperature/moisture as info.

There are 3 Tabs.

Control is for entities that can be interacted with (think media_players, buttons, selects, etc.).

![Control](/documentation/area-strategy-main-control.png "Control")

Stats is for "read-only" entities like binary_sensors and sensors.

![Stats](/documentation/area-strategy-main-stats.png "Stats")

Camera is for Camera-Streams.

![Camera](/documentation/area-strategy-main-camera.png "Camera")


## Battery View Strategy
## Update View Strategy
## Installation
## Issues
## More

Thanks to everyone working on Home Assistant and the everyone in the community. Without your Documentation, Code and Forum Posts i could not have done this.

The design is heavily inspired by [Dwains Dashboard](https://github.com/dwainscheeren/dwains-lovelace-dashboard), as that was my first dashboard because the design and auto-population really hit a nerve with me. I wanna thank Dwain for his great work. His Dashboard is more User-friendly and works without any yaml-Knowledge so it is absolutely a better fit for many Users. Give it a look!