# Configuration

## Configuration Options

| option         | description                                                                                   | type   | required | default    | example                                                                                        |
|----------------|-----------------------------------------------------------------------------------------------|--------|----------|------------|------------------------------------------------------------------------------------------------|
| tabs           | Tabs shown in the main area. [More](#tabs)                                                            | Array  | yes      | [set](./src/defaultConfig.yml#L1) | <pre>tabs:<br>  - label: Test<br>    icon: mdi:test<br>    rows: [...]                                                |
| areaColor      | Possible colors for overlay (at least one must be defined!). Must be in the form of a rgba css-value. rgb defines the color and the a-channel defines transparency. The 8 predefined colors get repeated when you have more than 8 areas so when you want more unique colors you need to add some to your configuration.                            | Array  | yes      | [set](./src/defaultConfig.yml#L232) | <pre>areaColor:<br>  - rgba(0,0,0,0.5)                                                                   |
| areaCardConfig | The config for the area card. All options allowed expect type, area, navigation_path          | Object | no       | [set](./src/defaultConfig.yml#L225) | <pre>areaCardConfig:<br>  aspect_ratio: 1:1                                                              |
| topCards       | Slot for cards above navigation.                                                       | Array  | no       | -          | <pre>topCards:<br>  - type: entity<br>    entities:<br>      - button.test<br>      - button.test2                                |
| replaceCards   | You can set a card to be used for a specific entity. Overwrites Config in Tabs - Rows - card. | Object | no       | -          | <pre>replaceCards:<br>  button.test:<br>    type: entity<br>    entityAttribute: entities<br>    entityAttributeAsArray: true |

So a valid dashboard with configration could look like this:

```
type: custom:area-dashboard-strategy
options:
  areaColor:
    - rgba(1,1,1,0.4)
  areaCardConfig:
    aspect_ratio: 2:1
    sensor_classes:
      - temperature
  topCards:
    - type: picture
      image: https://i.scdn.co/image/ab67616100005174d432d36ca35d0b7a6bf82cef
    - type: tile
      entity: update.home_assistant_core_update
  tabs:
    - label: Updates
      icon: mdi:package-up
      rows:
        - title: Updates
          domain: update
          include:
            - type: state
              value: off
          entityAttribute: entity
          card:
            type: tile
  replaceCards:
    update.home_assistant_core_update:
      card:
        - type: picture
          image: https://i.scdn.co/image/ab67616100005174d432d36ca35d0b7a6bf82cef

```

I used all available options in this example. You don`t need to do this!

More on the default configuration [here](#default-config-explained)

## Tabs

The Tab show in the the main section.
Is using the Tabbed-Card (TODO: See).

```
tabs:
  - label: Control
    icon: mdi:button-pointer
    rows:
      - <row 1 definition>
      - <row 2 definition>
      - ...
  - label: Test
    icon: mdi:test
    rows: [...]
```

More on [rows](#contentrows)

Define as many Tabs as you want.
The Tab will only be shown in the View per Area when it has content.

Example: if the Living Room has a Tab where none of the rows would have entities (like Camera, which has only one row and can easily be empty) the whole Tab is hidden.

## Content/Rows

Define the Rows in the Tab.
Every Row consists of a (optional) title and a Grid with all the cards for the entities.
The row is defined by:
| attribute             | description                                                                                                                                      | type          | required              | example                                                                                                                                                                         |
|-----------------------|--------------------------------------------------------------------------------------------------------------------------------------------------|---------------|-----------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| domain                | Domain or Array of domains the entity must belong to.                                                                                            | string, Array | yes                   | <pre>domain: button<br>or<br>domain:<br>  - button<br>  - light                                                                                                                                      |
| title                 | Title shown over Grid. Will not be rendered when not set.                                                                                        | string        | no                    | <pre>title: Test                                                                                                                                                                     |
| entityAttribute       | The attribute in the card-config where the entityId will be inserted.                                                                            | string        | yes                   | <pre>entityAttribute: entity<br>with<br>entityAttributeAsArray: false<br>for:<br>entity: button.test<br><br>or<br><br>entityAttribute: entities<br>with<br>entityAttributeAsArray: true<br>for:<br>entities:<br>  - button.test |
| entityAttribueAsArray | If the entityId should be inserted as an Array. (needed for cards that could theoretically display multiple entities)                            | boolean       | no (default is false) | <pre>see above                                                                                                                                                                       |
| card                  | The cardConfig of the card that should be rendered for every entity in the grid. You can use all cards you would normally use in your dashboard! | Object        | yes                   | <pre>type: tile<br>iconColor: red                                                                                                                                                       |
| filter                | Define include and exclude function for more fine-grained control of entities selected for row than only domain. [More](#filter)                                 | Object        | no                    | <pre>include:<br>  - type: state<br>    comparator: equal<br>    value: on<br>exclude:<br>  - type: attribute<br>    comparator: is_numeric<br>    value: key: clickCount                                                     |

### Filter

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
| type       | <pre>Type of filter.<br>Available are:<br>- domain<br>- state<br>- attribute<br>Could be expanded in the future if needed.                                                                                                                                                                                | enum                             | yes                                   | <pre>type: state                                                                                                                                                                                                                                                                                                                                                            |
| comparator | <pre><br>Comparator used to compare/filter.<br>Available are:<br>- equal (needs value to be set!)<br>- greater_than (needs value to be set!)<br>- is_numeric (does not need value. but needs key when attribute-type is used!)<br>- is_null (does not need value. but needs key when attribute-type is used!) | enum                             | no (default is equal)                 | <pre>comparator: is_numeric                                                                                                                                                                                                                                                                                                                                                 |
| value      | Value to compare against. Can be in variable form. See example.                                                                                                                                                                                                                       | dependant on type and comparator | no (dependant on type and comparator) | <pre>Can be in the form of:<br><br>value: on<br>when: type is domain, state; comparator is equal, greater_than <br><br>not set<br>when: type is domain, state; comparator is is_numeric, is_null<br><br>value:<br>  key: deviceClass<br>  value: battery<br>when: type is attribute, comparator is equal, greater_than<br><br>value:<br>  key: deviceClass<br>when: type is attribute, comparator is is_numeric, is_null |

# Default Config explained

The default config is written as yaml. This should make it easy to make your own changes because it is written exactly as you would in your dashboard.

You can find it [here](./src/defaultConfig.yml)

The Area Cards shows only device_type: occupancy as an alarm icon and temperature/moisture as info.

![Area Card](/documentation/area-strategy-navigation-single.png "Area Card")

There are 3 Tabs.

Control is for entities that can be interacted with (think media_players, buttons, selects, etc.).

![Control](/documentation/area-strategy-main-control.png "Control")

Stats is for "read-only" entities like binary_sensors and sensors.

![Stats](/documentation/area-strategy-main-stats.png "Stats")

Camera is for Camera-Streams.

![Camera](/documentation/area-strategy-main-camera.png "Camera")
