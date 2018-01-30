import React from 'react';
import PropTypes from 'prop-types';
import { validateField } from './';
import {
  Input,
  Select,
  SelectWrapper,
  Textarea,
  FormLabel,
  Radio,
  Checkbox
} from './styles';

const propTypes = {
  children: PropTypes.node,
  id: PropTypes.string,
  onChange: PropTypes.func,
  onClick: PropTypes.func,
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  defaultChecked: PropTypes.bool,
  checked: PropTypes.bool,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  name: PropTypes.string,
  required: PropTypes.bool,
  round: PropTypes.bool,
  componentClass: PropTypes.oneOf([
    'select',
    'radio',
    'checkbox',
    'textarea',
    'input'
  ]),
  validation: PropTypes.object
};

const defaultProps = {
  componentClass: 'input',
  required: false,
  defaultChecked: false
};

const renderElement = (Element, attributes, type, child) => {
  return (
    <FormLabel>
      <Element {...attributes} type={type} />
      <span>&nbsp;&nbsp;{child}</span>
    </FormLabel>
  );
};

class FormControl extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      errMsg: ''
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    const value = e.target.value;
    const { validation } = this.props;

    const msg = validateField(value, validation);

    this.setState({ errMsg: msg });

    if (this.props.onChange) {
      this.props.onChange();
    }
    console.log(this.state);
  }

  render() {
    const props = this.props;
    const childNode = props.children;
    const elementType = props.componentClass;

    const attributes = {
      onChange: this.handleChange,
      onClick: props.onClick,
      value: props.value,
      defaultValue: props.defaultValue,
      checked: props.defaultChecked ? props.defaultChecked : props.checked,
      placeholder: props.placeholder,
      type: props.type,
      name: props.name,
      round: props.round,
      required: props.required,
      id: props.id,
      validation: props.validation
    };
    const { errMsg } = this.state;
    let errorMessage = null;
    console.log(this);

    if (errMsg !== '') {
      errorMessage = <p>{errMsg}</p>;
    }

    if (elementType === 'select') {
      return (
        <div>
          <SelectWrapper>
            <Select {...attributes}>{childNode}</Select>
          </SelectWrapper>
          {errorMessage}
        </div>
      );
    }

    if (elementType === 'radio') {
      return renderElement(Radio, attributes, elementType, childNode);
    }

    if (elementType === 'checkbox') {
      return renderElement(Checkbox, attributes, elementType, childNode);
    }

    if (elementType === 'textarea') {
      return (
        <div>
          <Textarea {...attributes} />
          {errorMessage}
        </div>
      );
    }

    return (
      <div>
        <Input {...attributes} /> {errorMessage}
      </div>
    );
  }
}

FormControl.propTypes = propTypes;
FormControl.defaultProps = defaultProps;

export default FormControl;
