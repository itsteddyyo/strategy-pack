## Content/Rows

Define the Rows in the Tab.
Every Row consists of a (optional) title and a Grid with all the cards for the entities.
The row is defined by:

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
{%- for option in RowConfig %}
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

<<<ROW_CONFIGURATION_EXAMPLE>>>
