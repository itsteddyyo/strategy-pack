require 'yaml'

module Jekyll
    module Examplify
      # Custom filter to process the complex object similar to the JS example
      def examplify(type, strategy_name)
        type = type || []
        # Reduces the input type array into a new hash (equivalent to JS Map)
        ret = type.reduce({}) do |prev, curr|
        # Ensure 'annotations' is an array
        annotations = curr['annotations']
        next prev unless annotations.is_a?(Array)

        # Find the annotation with the tag "@example"
        example = annotations.find { |ann| ann['tag'] == '@example' }

        # If no example is found, skip this iteration
        next prev unless example && example['content']

        # Parse the example content
        parsed_example = YAML.safe_load(example['content'])

        # Ensure parsed_example is a hash and has the desired key
        if parsed_example.is_a?(Hash) && parsed_example[curr['name']]
          prev[curr['name']] = parsed_example[curr['name']]
        end

        prev
      end
  
        # Apply logic based on strategyName
        if strategy_name && strategy_name.include?('-view-')
          return {
            'strategy' => { 'type' => "custom:#{strategy_name}", 'config' => ret },
            'icon' => 'mdi:test',
            'path' => 'test',
            'title' => 'Test'
          }
        elsif strategy_name && strategy_name.include?('-dashboard-')
          return {
            'strategy' => { 'type' => "custom:#{strategy_name}", 'config' => ret }
          }
        end
  
        return ret
      end
  
    end
  end
  
  # Register the custom filter with Liquid
  Liquid::Template.register_filter(Jekyll::Examplify)
  