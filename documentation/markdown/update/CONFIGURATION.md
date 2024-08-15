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
  - platform: unifi
    title: UniFi
  - platform: esphome
    title: ESPHome
  - platform: mqtt
    title: Zigbee
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
  update.test:
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
  type: custom:update-view-strategy
  config:
    platforms:
      - platform: mqtt
        title: Everything MQTT
    replaceCards:
      update.occupancy_sensor_living_room_firmware:
        card:
          type: picture
          image: https://www.thetimes.com/imageserver/image/%2Fmethode%2Ftimes%2Fprod%2Fweb%2Fbin%2F12466824-d58f-4bd3-939d-cbdd8514c9a2.jpg?crop=3358%2C1889%2C305%2C577&resize=1200
```

I used all available options in this example. You don`t need to do this!

More on the default configuration [here](#default-config-explained)

# Default Config explained

The default config is written as yaml. This should make it easy to make your own changes because it is written exactly as you would in your dashboard.

You can find it [here](./src/config/gridDefaultConfig.yml)

Additionally for this View Strategy the platforms options is hard-coded so it is not defined in yaml but can be overwritten!

There are Rows for:

- UniFi
- ESPHome
- Zigbee
- Other (always present everything that is not defined in platforms!)