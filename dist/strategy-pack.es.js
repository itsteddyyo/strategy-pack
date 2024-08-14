const F = "ll-strategy-dashboard-", T = "ll-strategy-view-";
var v = /* @__PURE__ */ ((e) => (e.equal = "equal", e.in = "in", e.greater_than = "greater_than", e.lower_than = "lower_than", e.is_null = "is_null", e.is_numeric = "is_numeric", e))(v || {});
const L = (e) => !e.disabled_by && !e.hidden_by, O = (e, n, t) => {
  const i = parseFloat(n), a = parseFloat(t);
  switch (e) {
    case v.equal:
      return n == t;
    case v.in:
      if (Array.isArray(t))
        return t.includes(n);
      throw Error("Cannot compare. Value must be array.");
    case v.greater_than:
      if (isNaN(i) || isNaN(a))
        throw Error("Cannot compare. One or more values are not numeric");
      return i > a;
    case v.lower_than:
      if (isNaN(i) || isNaN(a))
        throw Error("Cannot compare. One or more values are not numeric");
      return i < a;
    case v.is_null:
      return !!n;
    case v.is_numeric:
      return !isNaN(i);
  }
}, W = {
  entity: (e, n, t, i) => {
    const a = e.entity_id;
    return O(i, a, t);
  },
  domain: (e, n, t, i) => {
    const a = e.entity_id.split(".")[0];
    return O(i, a, t);
  },
  device: (e, n, t, i) => {
    const a = e.device_id;
    return O(i, a, t);
  },
  integration: (e, n, t, i) => {
    const a = e.platform;
    return O(i, a, t);
  },
  label: (e, n, t, i) => e.labels.map((o) => O(i, o, t)).indexOf(!0) > 0,
  state: (e, n, t, i) => {
    var o;
    const a = (o = n.states[e.entity_id]) == null ? void 0 : o.state;
    return O(i, a, t);
  },
  attribute: (e, n, t, i) => {
    var l;
    const a = (l = n.states[e.entity_id]) == null ? void 0 : l.attributes;
    if (((c) => !!t && typeof t == "object" && t.hasOwnProperty("key") && t.hasOwnProperty("value"))())
      return O(i, a[t.key], t.value);
    throw Error("value is not defined correctly");
  }
}, N = (e, n) => {
  const t = (o) => {
    const l = o.filter((c) => c.startsWith("sort_")).map((c) => c.replace("sort_", ""));
    return l.push(1 / 0), l;
  }, i = t(e.labels || [])[0], a = t(n.labels || [])[0];
  return i - a;
};
function H(e) {
  return e != null;
}
const D = {
  minColumnWidth: 150,
  tabs: [
    {
      label: "Control",
      icon: "mdi:button-pointer",
      rows: [
        {
          domain: "alarm_control_panel",
          title: "Alarm",
          card: {
            type: "tile",
            entity: "$entity",
            features: [{
              type: "alarm-modes",
              modes: [
                "armed_home",
                "armed_away",
                "armed_night",
                "armed_vacation",
                "armed_custom_bypass",
                "disarmed"
              ]
            }],
            tap_action: { action: "more-info" },
            icon_tap_action: { action: "none" },
            hold_action: { action: "more-info" }
          }
        },
        {
          domain: "media_player",
          title: "Media",
          card: {
            type: "custom:mushroom-media-player-card",
            entity: "$entity",
            use_media_artwork: !0,
            show_volume_level: !0,
            use_media_info: !1,
            collapsible_controls: !0,
            volume_controls: ["volume_set"],
            media_controls: ["play_pause_stop"],
            tap_action: { action: "toggle" },
            icon_tap_action: { action: "none" },
            hold_action: { action: "more-info" }
          }
        },
        {
          domain: "cover",
          title: "Cover",
          card: {
            type: "tile",
            entity: "$entity",
            features: [{ type: "cover-open-close" }],
            tap_action: { action: "more-info" },
            icon_tap_action: { action: "none" },
            hold_action: { action: "more-info" }
          }
        },
        {
          domain: "vacuum",
          title: "Vacuum",
          card: {
            type: "tile",
            entity: "$entity",
            features: [{
              type: "vacuum-commands",
              commands: [
                "start_pause",
                "return_home"
              ]
            }],
            tap_action: { action: "more-info" },
            icon_tap_action: { action: "none" },
            hold_action: { action: "more-info" }
          }
        },
        {
          domain: [
            "switch",
            "input_boolean"
          ],
          title: "Switch",
          card: {
            type: "tile",
            entity: "$entity",
            hide_state: !0,
            color: "amber",
            tap_action: { action: "toggle" },
            icon_tap_action: { action: "none" },
            hold_action: { action: "more-info" }
          }
        },
        {
          domain: [
            "select",
            "input_select"
          ],
          title: "Select",
          card: {
            type: "tile",
            entity: "$entity",
            hide_state: !0,
            color: "primary",
            features: [{ type: "select-options" }],
            tap_action: { action: "more-info" },
            icon_tap_action: { action: "none" },
            hold_action: { action: "more-info" }
          }
        },
        {
          domain: [
            "button",
            "scene"
          ],
          title: "Button",
          card: {
            type: "tile",
            entity: "$entity",
            hide_state: !0,
            color: "primary",
            tap_action: { action: "toggle" },
            icon_tap_action: { action: "none" },
            hold_action: { action: "more-info" }
          }
        },
        {
          domain: "number",
          title: "Number",
          card: {
            type: "tile",
            entity: "$entity",
            hide_state: !0,
            features: [{
              type: "numeric-input",
              style: "slider"
            }],
            tap_action: { action: "more-info" },
            icon_tap_action: { action: "none" },
            hold_action: { action: "more-info" }
          }
        }
      ]
    },
    {
      label: "Stats",
      icon: "mdi:chart-line",
      rows: [
        {
          domain: "binary_sensor",
          title: "Alert",
          filter: { exclude: [
            {
              type: "attribute",
              value: {
                key: "device_class",
                value: "motion"
              }
            },
            {
              type: "attribute",
              value: {
                key: "device_class",
                value: "occupancy"
              }
            }
          ] },
          card: {
            type: "tile",
            entity: "$entity",
            hide_state: !0,
            color: "primary",
            tap_action: { action: "more-info" },
            icon_tap_action: { action: "none" },
            hold_action: { action: "more-info" }
          }
        },
        {
          domain: "sensor",
          title: "Sensor",
          filter: { exclude: [
            {
              type: "attribute",
              value: {
                key: "device_class",
                value: "battery"
              }
            },
            {
              type: "state",
              comparator: "is_numeric"
            }
          ] },
          card: {
            type: "tile",
            entity: "$entity",
            color: "primary",
            tap_action: { action: "more-info" },
            icon_tap_action: { action: "none" },
            hold_action: { action: "more-info" }
          }
        },
        {
          domain: "sensor",
          title: "Graphs",
          filter: {
            exclude: [{
              type: "attribute",
              value: {
                key: "device_class",
                value: "battery"
              }
            }],
            include: [{
              type: "state",
              comparator: "is_numeric"
            }]
          },
          card: {
            type: "custom:mini-graph-card",
            entities: ["$entity"],
            align_header: "left",
            align_icon: "left",
            align_state: "center",
            font_size: 50,
            font_size_header: 12,
            tap_action: { action: "more-info" },
            icon_tap_action: { action: "none" },
            hold_action: { action: "more-info" },
            card_mod: { style: `.header {
  max-width: 80%;
}
.line--rect,
.fill--rect,
.line--points {
  {% set COLOR = 'grey' %}
  {% if state_attr(config.entities[0].entity,'device_class') in ['date', 'timestamp', 'irradiance', 'distance', 'duration', 'illuminance', 'enum', 'monetary'] %} 
    {% set COLOR = 'grey' %}
  {% elif state_attr(config.entities[0].entity,'device_class') in ['apparent_power', 'battery', 'current', 'energy', 'energy_storage', 'power_factor', 'power', 'voltage'] %} 
    {% set COLOR = 'yellow' %}
  {% elif state_attr(config.entities[0].entity,'device_class') in ['aqi', 'sulphur_dioxide', 'volatile_organic_compounds', 'volatile_organic_compounds_parts', 'atmospheric_pressure', 'carbon_dioxide', 'carbon_monoxide', 'nitrogen_dioxide', 'gas', 'nitrogen_monoxide', 'nitrous_oxide', 'ozone', 'pm1', 'pm10', 'pm25'] %} 
    {% set COLOR = 'green' %}
  {% elif state_attr(config.entities[0].entity,'device_class') in ['pressure', 'reactive_power', 'speed', 'temperature', 'weight', 'wind_speed'] %} 
    {% set COLOR = 'orangered' %}
  {% elif state_attr(config.entities[0].entity,'device_class') in ['moisture', 'ph', 'precipitation', 'precipitation_intensity', 'humidity', 'water', 'volume', 'volume_storage'] %} 
    {% set COLOR = 'royalblue' %}
  {% elif state_attr(config.entities[0].entity,'device_class') in ['data_rate', 'data_size', 'signal_strength', 'frequency', 'sound_pressure'] %}
    {% set COLOR = 'orange' %}
  {% endif %}            
  fill: {{COLOR}};
  stroke: {{COLOR}};
}
` }
          }
        }
      ]
    },
    {
      label: "Camera",
      icon: "mdi:camera",
      rows: [{
        domain: "camera",
        card: {
          type: "picture-entity",
          entity: "$entity",
          tap_action: { action: "more-info" },
          icon_tap_action: { action: "none" },
          hold_action: { action: "more-info" }
        }
      }]
    }
  ],
  areaCardConfig: {
    aspect_ratio: "35:15",
    alert_classes: ["occupancy"],
    sensor_classes: [
      "temperature",
      "moisture"
    ]
  },
  areaColors: [
    "rgba(42,72,100,0.3)",
    "rgba(234,162,33,0.3)",
    "rgba(214,64,92,0.3)",
    "rgba(190,70,178,0.3)",
    "rgba(145,142,80,0.3)",
    "rgba(12,162,121,0.3)",
    "rgba(76,159,171,0.3)",
    "rgba(147,72,26,0.3)"
  ]
}, E = (e, n, t, i, a) => {
  const o = [], l = [];
  return e.forEach((c) => {
    var d;
    const u = ((d = (a || {})[c.entity_id]) == null ? void 0 : d.card) || n.card, m = Object.entries(u).filter(([_, r]) => JSON.stringify(r).includes("$entity")).map(([_, r]) => {
      const p = JSON.stringify(r);
      return [_, JSON.parse(p.replace("$entity", c.entity_id))];
    });
    l.push({
      ...u,
      ...Object.fromEntries(m)
    });
  }), l.length > 0 && (i && o.push({
    type: "custom:mushroom-title-card",
    title: i,
    subtitle_tap_action: {
      action: "none"
    }
  }), o.push({
    type: "custom:layout-card",
    layout_type: "custom:grid-layout",
    layout: {
      "grid-template-rows": "auto",
      "grid-template-columns": `repeat(auto-fit, minmax(${t}px, 1fr))`,
      padding: "0px 10px"
    },
    cards: l
  })), o;
};
class I extends HTMLTemplateElement {
  static async generate(n, t) {
    var u;
    const [i, a, o] = await Promise.all([
      t.callWS({ type: "config/entity_registry/list" }),
      t.callWS({ type: "config/device_registry/list" }),
      t.callWS({ type: "config/area_registry/list" })
    ]);
    return {
      views: [...o.filter((m) => {
        var d;
        return !((d = n.config) != null && d.areaBlacklist) || n.config.areaBlacklist.indexOf(m.area_id) == -1;
      }).sort(N).map((m, d) => ({
        strategy: {
          type: "custom:area-view-strategy",
          meta: {
            entities: i,
            devices: a,
            areas: o
          },
          config: {
            ...D,
            ...n.config || {},
            area: m.area_id
          }
        },
        title: m.name,
        path: m.area_id,
        icon: "mdi:home",
        type: "panel",
        subview: !1,
        visible: d == 0
      })), ...((u = n.config) == null ? void 0 : u.extraViews) || []]
    };
  }
}
class U extends HTMLTemplateElement {
  static async generate(n, t) {
    const { config: i, meta: a } = n, { area: o, tabs: l, minColumnWidth: c, replaceCards: u, topCards: m, areaColors: d, areaCardConfig: _, areaBlacklist: r } = i;
    let p = Array(), w = Array(), f = Array();
    if (a)
      p = a.entities, w = a.devices, f = a.areas;
    else {
      const s = await Promise.all([
        t.callWS({ type: "config/entity_registry/list" }),
        t.callWS({ type: "config/device_registry/list" }),
        t.callWS({ type: "config/area_registry/list" })
      ]);
      p = s[0], w = s[1], f = s[2];
    }
    p = [...p].sort(N), w = [...w].sort(N), f = [...f].sort(N);
    const M = f.filter((s) => !r || r.indexOf(s.area_id) == -1), S = f.find((s) => s.area_id == o);
    if (!S)
      throw Error("No area defined");
    const V = /* @__PURE__ */ new Set();
    for (const s of w)
      s.area_id === S.area_id && V.add(s.id);
    const R = {
      type: "vertical-stack",
      cards: [
        {
          type: "custom:layout-card",
          layout_type: "custom:grid-layout",
          layout: {
            "grid-template-rows": "auto",
            "grid-template-columns": "repeat(auto-fit, minmax(300px, 1fr))"
          },
          cards: []
        }
      ]
    }, $ = M.reduce(
      (s, g, y) => {
        const h = {
          ..._,
          type: "area",
          area: g.area_id,
          navigation_path: `${g.area_id}#main`
        };
        return s.cards[0].cards.push({
          type: "conditional",
          conditions: [{
            condition: "screen",
            media_query: "(max-width: 1000px)"
          }],
          card: {
            ...h,
            card_mod: {
              style: `
                  hui-image {
                    opacity: 0.3;
                  }
                  div.navigate {
                    background-color: ${d[y]};
                  }`
            }
          }
        }), s.cards[0].cards.push(
          {
            type: "conditional",
            conditions: [{
              condition: "screen",
              media_query: "(min-width: 1001px)"
            }],
            card: g.area_id == S.area_id ? h : {
              ...h,
              card_mod: {
                style: `
                        hui-image {
                          opacity: 0.3;
                        }
                        div.navigate {
                          background-color: ${d[y]};
                        }`
              }
            }
          }
        ), s;
      },
      R
    );
    $.cards = [...m || [], ...$.cards];
    const z = (s) => s.reduce((g, y) => {
      let h = p.filter(L).filter((b) => b.area_id ? b.area_id === S.area_id : V.has(b.device_id)).filter((b) => {
        const A = b.entity_id.split(".")[0];
        return Array.isArray(y.domain) ? y.domain.filter((x) => x == A).length > 0 : y.domain == A;
      });
      y.filter && (h = h.filter((b) => {
        var x;
        return (((x = y.filter) == null ? void 0 : x.include) || []).reduce((k, C) => k && W[C.type](b, t, C.value, C.comparator || v.equal), !0);
      }), h = h.filter((b) => {
        var x;
        return (((x = y.filter) == null ? void 0 : x.exclude) || []).reduce((k, C) => k && !W[C.type](b, t, C.value, C.comparator || v.equal), !0);
      }));
      const B = E(h, y, c, y.title, u);
      return g.push(...B), g;
    }, Array()), P = l.map((s) => {
      const g = z(s.rows);
      return g.length > 0 ? {
        attributes: {
          label: s.label,
          icon: s.icon,
          stacked: !0
        },
        card: {
          type: "vertical-stack",
          cards: g
        }
      } : null;
    }).filter(H), q = {
      type: "custom:tabbed-card",
      styles: {
        "--mdc-tab-text-label-color-default": "var(--primary-text-color)",
        "--mdc-tab-color-default": "var(--primary-text-color)"
      },
      tabs: P
    };
    return {
      panel: !0,
      cards: [{
        type: "vertical-stack",
        cards: [
          {
            type: "conditional",
            conditions: [{
              condition: "screen",
              media_query: "(max-width: 1000px)"
            }],
            card: {
              type: "custom:state-switch",
              entity: "hash",
              default: "default",
              states: {
                "": {
                  type: "vertical-stack",
                  cards: [
                    $,
                    {
                      type: "custom:gap-card",
                      height: 60
                    }
                  ]
                },
                default: {
                  type: "vertical-stack",
                  cards: [
                    q,
                    {
                      type: "custom:mushroom-chips-card",
                      card_mod: {
                        style: `
                        ha-card { --chip-background: none; }
                        :host {
                          --chip-icon-size: 1em !important;
                          z-index: 2;
                          width: 100%;
                          position: fixed;
                          bottom: 0;
                          margin: 0 !important;
                          padding: 20px;
                          background: var(--app-header-background-color);
                          left: 50%;
                          transform: translateX(-50%);
                        }
                        @media (min-width: 1001px) {
                          :host {
                            display: none;
                          }
                        }`
                      },
                      chips: [
                        { type: "spacer" },
                        {
                          type: "template",
                          icon: "mdi:home",
                          icon_height: "40px",
                          tap_action: {
                            action: "navigate",
                            navigation_path: window.location.pathname
                          }
                        },
                        { type: "spacer" }
                      ]
                    },
                    {
                      type: "custom:gap-card",
                      height: 60
                    }
                  ]
                }
              }
            }
          },
          {
            type: "conditional",
            conditions: [{
              condition: "screen",
              media_query: "(min-width: 1001px)"
            }],
            card: {
              type: "custom:layout-card",
              layout_type: "custom:grid-layout",
              layout: {
                "grid-template-columns": "2fr 3fr",
                "grid-template-areas": "navigation main"
              },
              cards: [$, q]
            }
          }
        ]
      }]
    };
  }
}
customElements.define(`${F}area-dashboard-strategy`, I);
customElements.define(`${T}area-view-strategy`, U);
class j extends HTMLTemplateElement {
  static async generate(n, t) {
    const { config: i } = n, { minColumnWidth: a, replaceCards: o } = i, [l] = await Promise.all([
      t.callWS({ type: "config/entity_registry/list" })
    ]), c = {
      card: {
        type: "custom:mini-graph-card",
        entities: ["$entity"],
        align_header: "left",
        align_icon: "left",
        align_state: "center",
        font_size: 50,
        font_size_header: 12,
        lower_bound: 0,
        upper_bound: 100,
        card_mod: {
          style: `
              .header {
                max-width: 80%;
              }
              .line--rect,
              .fill--rect,
              .line--points {
                fill: amber;
                stroke: amber;
              }`
        }
      }
    }, u = l.filter(L).filter((r) => {
      var w, f;
      return r.entity_id.split(".")[0] == "sensor" && ((f = (w = t.states[r.entity_id]) == null ? void 0 : w.attributes) == null ? void 0 : f.device_class) == "battery";
    }), m = u.filter((r) => !["mqtt", "switchbot"].includes(r.platform)), d = u.filter((r) => ["mqtt"].includes(r.platform)), _ = u.filter((r) => ["switchbot"].includes(r.platform));
    return {
      panel: !0,
      cards: [
        {
          type: "vertical-stack",
          cards: [
            ...m.length > 0 ? E(m, c, a, "Other", o) : [],
            ...d.length > 0 ? E(d, c, a, "Zigbee", o) : [],
            ..._.length > 0 ? E(_, c, a, "Switchbot", o) : []
          ]
        }
      ]
    };
  }
}
customElements.define(`${T}battery-view-strategy`, j);
class J extends HTMLTemplateElement {
  static async generate(n, t) {
    const { config: i } = n, { minColumnWidth: a, replaceCards: o } = i, [l] = await Promise.all([
      t.callWS({ type: "config/entity_registry/list" })
    ]), c = {
      card: {
        type: "tile",
        entity: "$entity",
        hide_state: !0,
        features: [
          { type: "update-actions", backup: "ask" }
        ]
      }
    }, u = l.filter(L).filter((r) => {
      const p = r.entity_id.split(".")[0];
      return !r.disabled_by && !r.hidden_by && p == "update";
    }), m = u.filter((r) => !["unifi", "esphome"].includes(r.platform)), d = u.filter((r) => ["unifi"].includes(r.platform)), _ = u.filter((r) => ["esphome"].includes(r.platform));
    return {
      panel: !0,
      cards: [
        {
          type: "vertical-stack",
          cards: [
            ...m.length > 0 ? E(m, c, a, "Other", o) : [],
            ...d.length > 0 ? E(d, c, a, "UniFi", o) : [],
            ..._.length > 0 ? E(_, c, a, "ESPHome", o) : []
          ]
        }
      ]
    };
  }
}
customElements.define(`${T}update-view-strategy`, J);
