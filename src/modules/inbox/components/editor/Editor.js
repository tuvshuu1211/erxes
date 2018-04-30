import React, { Component } from 'react';
import PropTypes from 'prop-types';
import createMentionPlugin, {
  defaultSuggestionsFilter
} from 'bat-draft-js-mention-plugin';
import {
  EditorState,
  ContentState,
  getDefaultKeyBinding,
  Modifier
} from 'draft-js';
import {
  ErxesEditor,
  toHTML,
  createStateFromHTML
} from 'modules/common/components/editor/Editor';
import { TemplateList, MentionEntry } from './';
import { extractEntries } from '../../utils';

export default class Editor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editorState: EditorState.createEmpty(),
      collectedMentions: [],
      suggestions: this.props.mentions.toArray(),
      templatesState: null
    };

    this.mentionPlugin = createMentionPlugin({
      mentionPrefix: '@'
    });

    this.onAddMention = this.onAddMention.bind(this);
    this.getContent = this.getContent.bind(this);

    this.getTemplatesState = this.getTemplatesState.bind(this);
    this.onTemplatesStateChange = this.onTemplatesStateChange.bind(this);
    this.onSelectTemplate = this.onSelectTemplate.bind(this);
    this.onArrow = this.onArrow.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.responseTemplate !== this.props.responseTemplate) {
      const editorState = createStateFromHTML(
        this.state.editorState,
        nextProps.responseTemplate
      );

      // calling onChange, because draftjs's onChange is not trigerring after
      // this setState
      this.props.onChange(this.getContent(editorState));

      // set editor state from response template
      this.setState({ editorState });
    }
  }

  onChange(editorState) {
    this.setState({ editorState });

    this.props.onChange(this.getContent(editorState));

    window.requestAnimationFrame(() => {
      this.onTemplatesStateChange(this.getTemplatesState());
    });
  }

  onTemplatesStateChange(templatesState) {
    this.setState({ templatesState });
  }

  getTemplatesState(invalidate = true) {
    if (!invalidate) {
      return this.state.templatesState;
    }

    const { editorState } = this.state;
    const { responseTemplates } = this.props;

    const contentState = editorState.getCurrentContent();

    // get content as text
    const textContent = contentState.getPlainText().toLowerCase();

    if (!textContent) {
      return null;
    }

    // search from response templates
    const foundTemplates = responseTemplates.filter(
      template =>
        template.name.toLowerCase().includes(textContent) ||
        template.content.toLowerCase().includes(textContent)
    );

    if (foundTemplates.length > 0) {
      return {
        templates: foundTemplates.slice(0, 5),
        searchText: textContent,
        selectedIndex: 0
      };
    }

    return null;
  }

  onSelectTemplate(index) {
    const { templatesState } = this.state;
    const { templates, selectedIndex } = templatesState;
    const selectedTemplate = templates[index || selectedIndex];

    if (!selectedTemplate) {
      return null;
    }

    let editorState = createStateFromHTML(
      EditorState.createEmpty(),
      selectedTemplate.content
    );

    const selection = EditorState.moveSelectionToEnd(
      editorState
    ).getSelection();
    const contentState = Modifier.insertText(
      editorState.getCurrentContent(),
      selection,
      ' '
    );
    const es = EditorState.push(editorState, contentState, 'insert-characters');

    editorState = EditorState.moveFocusToEnd(es);

    this.setState({ editorState, templatesState: null });
  }

  onArrow(e, nudgeAmount) {
    const templatesState = this.getTemplatesState(false);

    if (!templatesState) {
      return;
    }

    e.preventDefault();

    templatesState.selectedIndex += nudgeAmount;

    this.templatesState = templatesState;
    this.onTemplatesStateChange(templatesState);
  }

  onUpArrow(e) {
    this.onArrow(e, -1);
  }

  onDownArrow(e) {
    this.onArrow(e, 1);
  }

  // Render response templates suggestions
  renderTemplates() {
    const { templatesState } = this.state;

    if (!templatesState) {
      return null;
    }

    // Set suggestionState to SuggestionList.
    return (
      <TemplateList
        onSelect={this.onSelectTemplate}
        suggestionsState={templatesState}
      />
    );
  }

  onSearchChange({ value }) {
    this.setState({
      suggestions: defaultSuggestionsFilter(
        value,
        this.props.mentions.toArray()
      )
    });
  }

  onAddMention(object) {
    const mention = extractEntries(object);

    const collectedMentions = this.state.collectedMentions;

    collectedMentions.push(mention);

    this.setState({ collectedMentions });
  }

  getContent(editorState) {
    let content = toHTML(editorState);

    // some mentioned people may have been deleted
    const finalMentions = [];

    // replace mention content
    this.state.collectedMentions.forEach(m => {
      const toFind = `@${m.name}`;
      const re = new RegExp(toFind, 'g');

      // collect only not removed mentions
      const findResult = content.match(re);

      if (findResult && findResult.length > 0) {
        finalMentions.push(m);
      }

      content = content.replace(
        re,
        `<b data-user-id='${m._id}'>@${m.name}</b>`
      );
    });

    // send mentioned user to parent
    this.props.onAddMention(finalMentions.map(mention => mention._id));

    return content;
  }

  keyBindingFn(e) {
    // handle new line
    if (e.key === 'Enter' && e.shiftKey) {
      return getDefaultKeyBinding(e);
    }

    // handle enter  in editor
    if (e.key === 'Enter') {
      // select response template
      if (this.state.templatesState) {
        this.onSelectTemplate();

        return null;
      }

      // call parent's method to save content
      this.props.addMessage();

      // clear content
      const state = this.state.editorState;

      const editorState = EditorState.push(
        state,
        ContentState.createFromText('')
      );

      this.setState({ editorState: EditorState.moveFocusToEnd(editorState) });

      return null;
    }

    return getDefaultKeyBinding(e);
  }

  render() {
    const { MentionSuggestions } = this.mentionPlugin;
    const plugins = [this.mentionPlugin];

    const pluginContent = (
      <MentionSuggestions
        onSearchChange={value => this.onSearchChange(value)}
        suggestions={this.props.showMentions ? this.state.suggestions : []}
        entryComponent={MentionEntry}
        onAddMention={object => this.onAddMention(object)}
        onChange={state => this.onChange(state)}
      />
    );

    const props = {
      ...this.props,
      editorState: this.state.editorState,
      onChange: state => this.onChange(state),
      keyBindingFn: e => this.keyBindingFn(e),
      onUpArrow: e => this.onUpArrow(e),
      onDownArrow: e => this.onDownArrow(e),
      handleFileInput: this.props.handleFileInput,
      plugins,
      pluginContent
    };

    return (
      <div>
        {this.renderTemplates()}
        <ErxesEditor {...props} />
      </div>
    );
  }
}

Editor.propTypes = {
  onChange: PropTypes.func,
  onAddMention: PropTypes.func,
  addMessage: PropTypes.func,
  showMentions: PropTypes.bool,
  responseTemplate: PropTypes.string,
  responseTemplates: PropTypes.array,
  handleFileInput: PropTypes.func,
  mentions: PropTypes.object // eslint-disable-line
};
