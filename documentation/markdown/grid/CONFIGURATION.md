

# Configuration

## Configuration Options

<details>
<summary>Click for Configuration Options</summary>

<table>
  <thead>
    <tr><th>option</th><th>description</th><th>type</th><th>required</th><th>default</th><th>example</th></tr>
  </thead>
  <tbody>
    <tr><td>rows</td><td>The grid rows definition of the tab. <a href="#contentrows">More</a></td><td>Array</td><td>yes</td><td>-</td><td>
        <pre>
rows:
  - title: test
    domain: media_player
    card:
      type: tile
    filter:
      - filterConfig here
  - title: test2
    domain: sensor
    card:
      type: tile
    filter:
      - filterConfig here
</pre>
      </td></tr>
    <tr><td>minColumnWidth</td><td>Minimal Column Width in the Grid = The Minimal Width of the Cards.</td><td>number</td><td>yes</td><td>
<a href="/src/config/areaDefaultConfig.yml#L1">set</a>
</td><td>
        <pre>
minColumnWidth: 300
</pre>
      </td></tr>
    <tr><td>replaceCards</td><td>You can set a card to be used for a specific entity. Overwrites default card config</td><td>Object</td><td>no</td><td>-</td><td>
        <pre>
replaceCards:
  button.test:
    type: entity
    entities:
      - $entity
</pre>
      </td></tr>
  </tbody>
</table>

</details>
<br />

So a valid configuration could look like this:

```yaml
strategy:
  type: custom:grid-view-strategy
  config:
    rows:
      - title: test
        domain: media_player
        card:
          type: tile
        filter:
          - filterConfig here
      - title: test2
        domain: sensor
        card:
          type: tile
        filter:
          - filterConfig here
    minColumnWidth: 300
    replaceCards:
      button.test:
        type: entity
        entities:
          - $entity
icon: mdi:test
path: test
title: Test

```

I used all available options in this example. You don`t need to do this!

## Content/Rows

Define the Rows in the Tab.
Every Row consists of a (optional) title and a Grid with all the cards for the entities.
The row is defined by:

<details>
<summary>Click for Configuration Options</summary>

<table>
  <thead>
    <tr><th>option</th><th>description</th><th>type</th><th>required</th><th>example</th></tr>
  </thead>
  <tbody>
    <tr><td>title</td><td>Title shown over Grid. Will not be rendered when not set.</td><td>string</td><td>no</td><td>
        <pre>
title: Buttons
</pre>
      </td></tr>
    <tr><td>filter</td><td>Define include and exclude function for more fine-grained control of entities selected for row than only domain.<blockquote>A entity needs to match all include filters to be included but it needs only to match one of the exclude filters to be excluded!</blockquote></td><td></td><td>no</td><td>
        <pre>
filter:
  include:
    - type: domain
      value: binary_sensor
    - type: state
      value: on
  exclude:
    - type: entity
      value: sensor.test123
    - type: is_null
    - type: area
      value: living_room
</pre>
      </td></tr>
    <tr><td>card</td><td>The cardConfig of the card that should be rendered for every entity in the grid. You can use all cards you would normally use in your dashboard!<blockquote>You can insert the entityId of the entity with the $entity variable which will be replaced in the whole object by the entities entity_id.</blockquote></td><td>Object</td><td>yes</td><td>
        <pre>
card:
  type: tile
  entity: $entity
  iconColor: red
</pre>
      </td></tr>
  </tbody>
</table>

</details>
<br />

So a valid configuration could look like this:

```yaml
title: Buttons
filter:
  include:
    - type: domain
      value: binary_sensor
    - type: state
      value: on
  exclude:
    - type: entity
      value: sensor.test123
    - type: is_null
    - type: area
      value: living_room
card:
  type: tile
  entity: $entity
  iconColor: red

```

I used all available options in this example. You don`t need to do this!

### Filter

Filters can be defined for more fine-grained control which entities should be matched.
You can use both include and exclude as keys.

```yaml
filter:
  include:
    - ...
  exclude:
    - ...
```

Both accept the same types and syntax.

>[!NOTE]
>A entity needs to match all include filters to be included but it needs only to match one of the exclude filters to be excluded!

The filter object looks like this.

<details>
<summary>Click for Configuration Options</summary>

<table>
  <thead>
    <tr><th>option</th><th>description</th><th>type</th><th>required</th><th>example</th></tr>
  </thead>
  <tbody>
    <tr><td>type</td><td>The type of filter to determine the value or just specify the filter</td><td>Object</td><td>yes</td><td>
        <pre>
type: state
</pre>
      </td></tr>
    <tr><td>comparator</td><td>The comparator to use to compare the left value (the value in the entity described by the type) and the right value (the user specified value)</td><td>Object</td><td>no</td><td>
        <pre>
comparator: equal
</pre>
      </td></tr>
    <tr><td>value</td><td>The user specified value</td><td>unknown</td><td>no</td><td>
        <pre>
value: on
</pre>
      </td></tr>
  </tbody>
</table>

</details>
<br />

So a valid configuration could look like this:

```yaml
type: state
comparator: equal
value: on

```

I used all available options in this example. You don`t need to do this!

#### Filter Type

These are the options for filter type.

<details>
<summary>Click for Configuration Options</summary>

<table>
  <thead>
    <tr><th>option</th><th>description</th><th>example</th></tr>
  </thead>
  <tbody>
    <tr><td>entity</td><td>Filter on the entity_id of the entity.</td><td>
        <pre>
- type: entity
  comparator: equal
  value: sensor.test123
</pre>
      </td></tr>
    <tr><td>domain</td><td>Filter on the domain of the entity.</td><td>
        <pre>
- type: domain
  comparator: equal
  value: sensor
</pre>
      </td></tr>
    <tr><td>device</td><td>Filter on the parent device_id of the entity.</td><td>
        <pre>
- type: device
  comparator: equal
  value: 98b750a482bbf28ea959269981813219
</pre>
      </td></tr>
    <tr><td>area</td><td>Filter on the area_id of the entity.</td><td>
        <pre>
- type: area
  comparator: equal
  value: living_room
</pre>
      </td></tr>
    <tr><td>integration</td><td>Filter on the integration of the entity.</td><td>
        <pre>
- type: integration
  comparator: equal
  value: mqtt
</pre>
      </td></tr>
    <tr><td>label</td><td>Filter on the label of the entity.</td><td>
        <pre>
- type: label
  comparator: equal
  value: sort_1
</pre>
      </td></tr>
    <tr><td>state</td><td>Filter on the state of the entity.</td><td>
        <pre>
- type: state
  comparator: equal
  value: on
</pre>
      </td></tr>
    <tr><td>attribute</td><td>Filter on an attribute of the entity.</td><td>
        <pre>
- type: attribute
  comparator: equal
  value:
    key: volume
    value: 100
</pre>
      </td></tr>
    <tr><td>disabled_by</td><td>Filter on the disabled_by state of the entity.<blockquote>Possible Disablers <a href="https://github.com/home-assistant/core/blob/dev/homeassistant/helpers/entity_registry.py#L104">here</here></blockquote></td><td>
        <pre>
- type: disabled_by
  comparator: match
  value: .*
</pre>
      </td></tr>
    <tr><td>hidden_by</td><td>Filter on the hidden_by state of the entity.<blockquote>Possible Hiders <a href="https://github.com/home-assistant/core/blob/dev/homeassistant/helpers/entity_registry.py#L104">here</here></blockquote></td><td>
        <pre>
- type: hidden_by
  comparator: match
  value: .*
</pre>
      </td></tr>
  </tbody>
</table>

</details>
<br />

#### Filter Comparator

These are the options for filter comparator.

<details>
<summary>Click for Configuration Options</summary>

<table>
  <thead>
    <tr><th>option</th><th>description</th><th>example</th></tr>
  </thead>
  <tbody>
    <tr><td>equal</td><td>Check if the selected type value of the entity and the passed value are equal.</td><td>
        <pre>
- type: state
  comparator: equal
  value: on
</pre>
      </td></tr>
    <tr><td>match</td><td>Check if the selected type value of the entity matches against the passed regexp value.</td><td>
        <pre>
- type: entity
  comparator: match
  value: .*_occupancy
</pre>
      </td></tr>
    <tr><td>in</td><td>Check if the selected type value of the entity is in the list of defined values.</td><td>
        <pre>
- type: state
  comparator: in
  value:
    - on
    - off
</pre>
      </td></tr>
    <tr><td>greater_than</td><td>Check if the selected type value of the entity is greater than the defined value.<blockquote>Works only on numeric type values and defined values!</blockquote></td><td>
        <pre>
- type: state
  comparator: greater_than
  value: 5
</pre>
      </td></tr>
    <tr><td>lower_than</td><td>Check if the selected type value of the entity is lower than the defined value.<blockquote>Works only on numeric type values and defined values!</blockquote></td><td>
        <pre>
- type: state
  comparator: lower_than
  value: 5
</pre>
      </td></tr>
    <tr><td>is_null</td><td>Check if the selected type value of the entity is null.<blockquote>Does not need a value defined!</blockquote></td><td>
        <pre>
- type: state
  comparator: is_null
</pre>
      </td></tr>
    <tr><td>is_numeric</td><td>Check if the selected type value of the entity is numeric.<blockquote>Does not need a value defined!</blockquote></td><td>
        <pre>
- type: attribute
  comparator: is_numeric
  value:
    key: volume
</pre>
      </td></tr>
  </tbody>
</table>

</details>
<br />