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
      <td>platforms</td>
      <td>Platforms defining the Rows of Grids</td>
      <td>Array</td>
      <td>yes</td>
      <td>
        <pre>
platforms:
  - platform: mqtt
    title: Zigbee
  - platform: switchbot
    title: Switchbot
        </pre>
      </td>
      <td>
        <pre>
platforms:
  - platform: mqtt
    title: Everything MQTT
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
      <td>You can set a card to be used for a specific entity. Overwrites hard-coded default card.</td>
      <td>Object</td>
      <td>no</td>
      <td>-</td>
      <td>
        <pre>
replaceCards:
  sensor.test:
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
  type: custom:battery-view-strategy
  config:
    minColumnWidth: 1000
    platforms:
      - platform: mqtt
        title: Everything MQTT
    replaceCards:
      sensor.battery_test:
        card:
          type: picture
          image: https://www.thetimes.com/imageserver/image/%2Fmethode%2Ftimes%2Fprod%2Fweb%2Fbin%2F12466824-d58f-4bd3-939d-cbdd8514c9a2.jpg?crop=3358%2C1889%2C305%2C577&resize=1200
```

I used all available options in this example. You don`t need to do this!

More on the default configuration [here](#default-config-explained)

# Default Config explained

The default config is written as yaml. This should make it easy to make your own changes because it is written exactly as you would in your dashboard.

You can find it [here](/src/config/gridDefaultConfig.yml)

Additionally for this View Strategy the platforms options is hard-coded so it is not defined in yaml but can be overwritten!

There are Rows for:

- Zigbee
- Switchbot
- Other (always present everything that is not defined in platforms!)