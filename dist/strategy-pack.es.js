const B = "ll-strategy-dashboard-", N = "ll-strategy-view-";
var h = /* @__PURE__ */ ((a) => (a.equal = "equal", a.in = "in", a.greater_than = "greater_than", a.lower_than = "lower_than", a.is_null = "is_null", a.is_numeric = "is_numeric", a))(h || {});
const T = (a) => !a.disabled_by && !a.hidden_by, w = (a, r, t) => {
  const i = parseFloat(r), e = parseFloat(t);
  switch (a) {
    case h.equal:
      return r == t;
    case h.in:
      if (Array.isArray(t))
        return t.includes(r);
      throw Error("Cannot compare. Value must be array.");
    case h.greater_than:
      if (isNaN(i) || isNaN(e))
        throw Error("Cannot compare. One or more values are not numeric");
      return i > e;
    case h.lower_than:
      if (isNaN(i) || isNaN(e))
        throw Error("Cannot compare. One or more values are not numeric");
      return i < e;
    case h.is_null:
      return !!r;
    case h.is_numeric:
      return !isNaN(i);
  }
}, q = {
  entity: (a, r, t, i) => {
    const e = a.entity_id;
    return w(i, e, t);
  },
  domain: (a, r, t, i) => {
    const e = a.entity_id.split(".")[0];
    return w(i, e, t);
  },
  device: (a, r, t, i) => {
    const e = a.device_id;
    return w(i, e, t);
  },
  integration: (a, r, t, i) => {
    const e = a.platform;
    return w(i, e, t);
  },
  label: (a, r, t, i) => a.labels.map((o) => w(i, o, t)).indexOf(!0) > 0,
  state: (a, r, t, i) => {
    var o;
    const e = (o = r.states[a.entity_id]) == null ? void 0 : o.state;
    return w(i, e, t);
  },
  attribute: (a, r, t, i) => {
    var c;
    const e = (c = r.states[a.entity_id]) == null ? void 0 : c.attributes;
    if (((l) => !!t && typeof t == "object" && t.hasOwnProperty("key") && t.hasOwnProperty("value"))())
      return w(i, e[t.key], t.value);
    throw Error("value is not defined correctly");
  }
}, A = (a, r) => {
  const t = (o) => {
    const c = o.filter((l) => l.startsWith("sort_")).map((l) => l.replace("sort_", ""));
    return c.push(1 / 0), c;
  }, i = t(a.labels || [])[0], e = t(r.labels || [])[0];
  return i - e;
};
function F(a) {
  return a != null;
}
const H = {
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
}, x = (a, r, t, i) => {
  const e = [], o = [];
  return a.forEach((c) => {
    var n;
    const l = ((n = (i || {})[c.entity_id]) == null ? void 0 : n.card) || r.card, d = Object.entries(l).filter(([u, y]) => JSON.stringify(y).includes("$entity")).map(([u, y]) => {
      const m = JSON.stringify(y);
      return [u, JSON.parse(m.replace("$entity", c.entity_id))];
    });
    o.push({
      ...l,
      ...Object.fromEntries(d)
    });
  }), o.length > 0 && (t && e.push({
    type: "custom:mushroom-title-card",
    title: t,
    subtitle_tap_action: {
      action: "none"
    }
  }), e.push({
    type: "custom:layout-card",
    layout_type: "custom:grid-layout",
    layout: {
      "grid-template-rows": "auto",
      "grid-template-columns": "repeat(auto-fit, minmax(150px, 1fr))",
      padding: "0px 10px"
    },
    cards: o
  })), e;
};
class D extends HTMLTemplateElement {
  static async generate(r, t) {
    var d;
    const [i, e, o] = await Promise.all([
      t.callWS({ type: "config/entity_registry/list" }),
      t.callWS({ type: "config/device_registry/list" }),
      t.callWS({ type: "config/area_registry/list" })
    ]);
    return {
      views: [...o.filter((n) => {
        var u;
        return !((u = r.config) != null && u.areaBlacklist) || r.config.areaBlacklist.indexOf(n.area_id) == -1;
      }).sort(A).map((n, u) => ({
        strategy: {
          type: "custom:area-view-strategy",
          meta: {
            entities: i,
            devices: e,
            areas: o
          },
          config: {
            ...H,
            ...r.config || {},
            area: n.area_id
          }
        },
        title: n.name,
        path: n.area_id,
        icon: "mdi:home",
        type: "panel",
        subview: !1,
        visible: u == 0
      })), ...((d = r.config) == null ? void 0 : d.extraViews) || []]
    };
  }
}
class I extends HTMLTemplateElement {
  static async generate(r, t) {
    const { config: i, meta: e } = r, { area: o, tabs: c, replaceCards: l, topCards: d, areaColors: n, areaCardConfig: u, areaBlacklist: y } = i;
    let m = Array(), E = Array(), O = Array();
    if (e)
      m = e.entities, E = e.devices, O = e.areas;
    else {
      const s = await Promise.all([
        t.callWS({ type: "config/entity_registry/list" }),
        t.callWS({ type: "config/device_registry/list" }),
        t.callWS({ type: "config/area_registry/list" })
      ]);
      m = s[0], E = s[1], O = s[2];
    }
    m = [...m].sort(A), E = [...E].sort(A), O = [...O].sort(A);
    const M = O.filter((s) => !y || y.indexOf(s.area_id) == -1), k = O.find((s) => s.area_id == o);
    if (!k) throw Error("No area defined");
    const L = /* @__PURE__ */ new Set();
    for (const s of E)
      s.area_id === k.area_id && L.add(s.id);
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
    }, S = M.reduce(
      (s, _, p) => {
        const f = {
          ...u,
          type: "area",
          area: _.area_id,
          navigation_path: `${_.area_id}#main`
        };
        return s.cards[0].cards.push({
          type: "conditional",
          conditions: [{
            condition: "screen",
            media_query: "(max-width: 1000px)"
          }],
          card: {
            ...f,
            card_mod: {
              style: `
                  hui-image {
                    opacity: 0.3;
                  }
                  div.navigate {
                    background-color: ${n[p]};
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
            card: _.area_id == k.area_id ? f : {
              ...f,
              card_mod: {
                style: `
                        hui-image {
                          opacity: 0.3;
                        }
                        div.navigate {
                          background-color: ${n[p]};
                        }`
              }
            }
          }
        ), s;
      },
      R
    );
    S.cards = [...d || [], ...S.cards];
    const W = (s) => s.reduce((_, p) => {
      let f = m.filter(T).filter((g) => g.area_id ? g.area_id === k.area_id : L.has(g.device_id)).filter((g) => {
        const $ = g.entity_id.split(".")[0];
        return Array.isArray(p.domain) ? p.domain.filter((b) => b == $).length > 0 : p.domain == $;
      });
      p.filter && (f = f.filter((g) => {
        var b;
        return (((b = p.filter) == null ? void 0 : b.include) || []).reduce((C, v) => C && q[v.type](g, t, v.value, v.comparator || h.equal), !0);
      }), f = f.filter((g) => {
        var b;
        return (((b = p.filter) == null ? void 0 : b.exclude) || []).reduce((C, v) => C && !q[v.type](g, t, v.value, v.comparator || h.equal), !0);
      }));
      const P = x(f, p, p.title, l);
      return _.push(...P), _;
    }, Array()), z = c.map((s) => {
      const _ = W(s.rows);
      return _.length > 0 ? {
        attributes: {
          label: s.label,
          icon: s.icon,
          stacked: !0
        },
        card: {
          type: "vertical-stack",
          cards: _
        }
      } : null;
    }).filter(F), V = {
      type: "custom:tabbed-card",
      styles: {
        "--mdc-tab-text-label-color-default": "var(--primary-text-color)",
        "--mdc-tab-color-default": "var(--primary-text-color)"
      },
      tabs: z
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
                    S,
                    {
                      type: "custom:gap-card",
                      height: 60
                    }
                  ]
                },
                default: {
                  type: "vertical-stack",
                  cards: [
                    V,
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
              cards: [S, V]
            }
          }
        ]
      }]
    };
  }
}
customElements.define(`${B}area-dashboard-strategy`, D);
customElements.define(`${N}area-view-strategy`, I);
class U extends HTMLTemplateElement {
  static async generate(r, t) {
    const [i] = await Promise.all([
      t.callWS({ type: "config/entity_registry/list" })
    ]), e = {
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
    }, o = i.filter(T).filter((n) => {
      var y, m;
      return n.entity_id.split(".")[0] == "sensor" && ((m = (y = t.states[n.entity_id]) == null ? void 0 : y.attributes) == null ? void 0 : m.device_class) == "battery";
    }), c = o.filter((n) => !["mqtt", "switchbot"].includes(n.platform)), l = o.filter((n) => ["mqtt"].includes(n.platform)), d = o.filter((n) => ["switchbot"].includes(n.platform));
    return {
      panel: !0,
      cards: [
        {
          type: "vertical-stack",
          cards: [
            ...c.length > 0 ? x(c, e, "Other") : [],
            ...l.length > 0 ? x(l, e, "Zigbee") : [],
            ...d.length > 0 ? x(d, e, "Switchbot") : []
          ]
        }
      ]
    };
  }
}
customElements.define(`${N}battery-view-strategy`, U);
class j extends HTMLTemplateElement {
  static async generate(r, t) {
    const [i] = await Promise.all([
      t.callWS({ type: "config/entity_registry/list" })
    ]), e = {
      card: {
        type: "tile",
        entity: "$entity",
        hide_state: !0,
        features: [
          { type: "update-actions", backup: "ask" }
        ]
      }
    }, o = i.filter(T).filter((n) => {
      const u = n.entity_id.split(".")[0];
      return !n.disabled_by && !n.hidden_by && u == "update";
    }), c = o.filter((n) => !["unifi", "esphome"].includes(n.platform)), l = o.filter((n) => ["unifi"].includes(n.platform)), d = o.filter((n) => ["esphome"].includes(n.platform));
    return {
      panel: !0,
      cards: [
        {
          type: "vertical-stack",
          cards: [
            ...c.length > 0 ? x(c, e, "Other") : [],
            ...l.length > 0 ? x(l, e, "UniFi") : [],
            ...d.length > 0 ? x(d, e, "ESPHome") : []
          ]
        }
      ]
    };
  }
}
customElements.define(`${N}update-view-strategy`, j);
