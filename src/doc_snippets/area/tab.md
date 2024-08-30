## Tabs

The tabs shown in the the main section.

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
{%- for option in TabConfig %}
    <tr>
      <td>{{ option.name }}</td>
      <td>{{ option.annotations | find: "tag", "@description" | map: "content" }}</td>
      <td>
      {%- if option.type.type == "reference" -%}
        Object
      {%- elsif option.type.type == "array" -%}
        Array
      {%- else -%}
        {{- option.type.name -}}
      {%- endif -%}
      </td>
      <td>{{ option.flags.isOptional | ternary: "yes", "no" }}</td>
      <td>{{ option.annotations | find: "tag", "@default" | map: "content" }}</td>
      <td>
        <pre>
{{- option.annotations | find: "tag", "@example" | map: "content" -}}
        </pre>
      </td>
    </tr>
{%- endfor %}
  </tbody>
</table>

Complete example:

<<<TAB_CONFIGURATION_OPTIONS_EXAMPLE>>>

Define as many Tabs as you want.
The Tab will only be shown in the View per Area when it has content.

Example: if the Living Room has a Tab where none of the rows would have entities (like Camera, which has only one row and can easily be empty) the whole Tab is hidden.
