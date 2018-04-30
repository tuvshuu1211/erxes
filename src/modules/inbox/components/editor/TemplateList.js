import React, { Component } from 'react';
import PropTypes from 'prop-types';
import strip from 'strip';
import highlighter from 'fuzzysearch-highlight';

import { ResponseSuggestions, ResponseSuggestionItem } from '../../styles';

// response templates
class TemplateList extends Component {
  normalizeIndex(selectedIndex, max) {
    let index = selectedIndex % max;

    if (index < 0) {
      index += max;
    }

    return index;
  }

  render() {
    const { suggestionsState, onSelect } = this.props;

    const { selectedIndex, searchText, templates } = suggestionsState;

    if (!templates) {
      return null;
    }

    const normalizedIndex = this.normalizeIndex(
      selectedIndex,
      templates.length
    );

    return (
      <ResponseSuggestions>
        {templates.map((template, index) => {
          const style = {};

          if (normalizedIndex === index) {
            style.backgroundColor = '#F6F8FB';
          }

          return (
            <ResponseSuggestionItem
              key={template._id}
              onClick={() => onSelect(index)}
              style={style}
            >
              <span
                style={{ fontWeight: 'bold' }}
                dangerouslySetInnerHTML={{
                  __html: highlighter(searchText, template.name)
                }}
              />
              <span
                dangerouslySetInnerHTML={{
                  __html: highlighter(searchText, strip(template.content))
                }}
              />
            </ResponseSuggestionItem>
          );
        }, this)}
      </ResponseSuggestions>
    );
  }
}

TemplateList.propTypes = {
  suggestionsState: PropTypes.object,
  onSelect: PropTypes.func
};

export default TemplateList;
