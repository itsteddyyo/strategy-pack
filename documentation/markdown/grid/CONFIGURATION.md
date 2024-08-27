# Configuration

## Configuration Options

<table>
  <thead>
    <tr>
      <th>option</th>
      <th>description</th>
      <th>type</th>
      <th>required</th>
      <th>default</th>
      <th>example</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>rows</td>
      <td>The grid rows definition of the view. <a href="#contentrows">More</a></td>
      <td>Object</td>
      <td>yes</td>
      <td>
        <pre>
rows:
  - title: test
    domain: media_player
    ...
  - title: test2
    domain: sensor
    ...
        </pre>
      </td>
    </tr>
    <tr>
      <td>minColumnWidth</td>
      <td>Minimal Column Width in the Grid = The Minimal Width of the Cards</td>
      <td>number</td>
      <td>yes</td>
      <td><a href="/src/config/gridDefaultConfig.yml#L1">set</a></td>
      <td>
        <pre>
minColumnWidth: 1000
        </pre>
      </td>
    </tr>
    <tr>
      <td>replaceCards</td>
      <td>You can set a card to be used for a specific entity. Overwrites Config in Rows - card.</td>
      <td>Object</td>
      <td>no</td>
      <td>-</td>
      <td>
        <pre>
replaceCards:
  button.test:
    type: entity
    entities:
      - $entity
        </pre>
      </td>
    </tr>
  </tbody>
</table>

So a valid dashboard with configration could look like this:

```yaml
strategy:
  type: custom:grid-view-strategy
  config:
    minColumnWidth: 300
    rows:
      - title: Updates
        domain: update
        filter:
          include:
            - type: state
              value: 'off'
        card:
          type: tile
          entity: $entity
    replaceCards:
      update.occupancy_sensor_living_room_firmware:
        card:
          type: picture
          image: https://www.thetimes.com/imageserver/image/%2Fmethode%2Ftimes%2Fprod%2Fweb%2Fbin%2F12466824-d58f-4bd3-939d-cbdd8514c9a2.jpg?crop=3358%2C1889%2C305%2C577&resize=1200

```

I used all available options in this example. You don`t need to do this!

## Content/Rows

Define the Rows in the View.
Every Row consists of a (optional) title and a Grid with all the cards for the entities.
The row is defined by:

<table>
  <thead>
    <tr>
      <th>attribute</th>
      <th>description</th>
      <th>type</th>
      <th>required</th>
      <th>example</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>title</td>
      <td>Title shown over Grid. Will not be rendered when not set.</td>
      <td>string</td>
      <td>no</td>
      <td>
        <pre>
title: Test
        </pre>
      </td>
    </tr>
    <td>card</td>
    <td>The cardConfig of the card that should be rendered for every entity in the grid. You can insert the entityId of the entity with the $entity variable. You can use all cards you would normally use in your dashboard!</td>
    <td>Object</td>
    <td>yes</td>
    <td>
      <pre>
card:
  type: tile
  entity: $entity
  iconColor: red
      </pre>
    </td>
    </tr>
    <tr>
      <td>filter</td>
      <td>Define include and exclude function for more fine-grained control of entities selected for row than only
        domain. <a href="#filter">More</a></td>
      <td>Object</td>
      <td>no</td>
      <td>
        <pre>
include:
  - type :state
    comparator: equal
    value: on
exclude:
  - type: attribute
    comparator: is_numeric
    value: key: clickCount
        </pre>
      </td>
    </tr>
  </tbody>
</table>

Complete example:

```yaml
rows:
  - title: Lights
    card:
      type: tile
      entity: $entity
    filter: ...
```

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

The filter object looks like this.

<table>
  <thead>
    <tr>
      <th>attribute</th>
      <th>description</th>
      <th>type</th>
      <th>required</th>
      <th>example</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>type</td>
      <td>
        <pre>
Type of filter.
Available are:
- entity
- domain
- device
- integration
- label
- state
- attribute
        </pre>
      </td>
      <td>enum</td>
      <td>yes</td>
      <td>
        <pre>
type: state
        </pre>
      </td>
    </tr>
    <tr>
      <td>comparator</td>
      <td>
        <pre>
Comparator used to compare/filter.
Available are:
- equal (needs value to be set!)
- match (needs value to be set!)
- in (needs value to be set!)
- greater_than (needs value to be set!)
- lower_than (needs value to be set!)
- is_numeric (does not need value. when type: attribute you need to specifiy key!)
- is_null (does not need value. when type: attribute you need to specifiy key!)
        </pre>
      </td>
      <td>enum</td>
      <td>no (default is equal)</td>
      <td>
        <pre>
comparator: is_numeric
        </pre>
      </td>
    </tr>
    <tr>
      <td>value</td>
      <td>Value to compare against. Can be in variable form. See example.</td>
      <td>dependant on type and comparator</td>
      <td>no (dependant on type and comparator)</td>
      <td>
        <pre>
include:
  - type: entity
    value: media_player.test
  - type: entity
    comparator: match
    value: media_player\..*bedroom.*
  - type: device
      comparator: in
      value:
        - e7130bc20010fd2399f89f1d39666146
        - b52d046e38fff9d5ca2bdb54304f4695
  - type: domain
    value: media_player
  - type: integration
    value: mqtt
  - type: label
    comparator: in
    value:
      - sort_1
      - sort_2
      - sort_3
  - type: state
    value: 5
  - type: state
    comparator: greater_than
    value: 2
  - type: state
    comparator: is_numeric
  - type: state
    comparator: is_null
  - type: state
    value: 5
  - type: attribute
    comparator: greater_than
    value:
      key: uptime
      value: 2
  - type: attribute
    comparator: is_numeric
    value:
      key: uptime
  - type: attribute
    comparator: is_null
    value:
      key: uptime
  - type: attribute
    comparator: in
    value:
      key: uptime
      value:
        - 1
        - 2
        - 3
        </pre>
      </td>
    </tr>

  </tbody>

</table>
