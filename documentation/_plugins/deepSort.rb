module Jekyll
    module DeepSort
      # Sorts the input array based on a deep key given by a dot-delimited path.
      # Items for which the value at the given path equals the target will be assigned a sort key of 1 (sorted later by default).
      # A third parameter, order, can be specified as 'asc' (default) or 'desc' to control the final order.
      # Example usage in Liquid:
      #   {% assign sorted_array = array | deepSort: "annotations.type", "deprecated", "desc" %}
      def deepSort(input, path, target, order = 'asc')
        sorted = input.sort_by do |item|
          value = get_deep_value(item, path)
          # Determine if the target is present along the path.
          has_target = if value.is_a?(Array)
                         value.flatten.any? { |v| v == target }
                       else
                         value == target
                       end
          has_target ? 1 : 0
        end
        order.downcase == 'desc' ? sorted.reverse : sorted
      end
  
      private
  
      # Recursively traverses an object using a dot-delimited path.
      # If an array is encountered, it maps the key over each element.
      def get_deep_value(object, path)
        keys = path.split('.')
        keys.reduce(object) do |current, key|
          case current
          when Array
            current.map { |elem| elem.is_a?(Hash) ? elem[key] : nil }
          when Hash
            current[key]
          else
            nil
          end
        end
      end
    end
  end
  
  Liquid::Template.register_filter(Jekyll::DeepSort)
  