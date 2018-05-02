import React, { Component } from 'react';
import Formsy, { addValidationRule, withFormsy } from 'formsy-react';
import PropTypes from 'prop-types';
import {
  FormGroup,
  FormControl,
  ControlLabel,
  Button
} from 'modules/common/components';
import { ModalFooter } from 'modules/common/styles/main';

const propTypes = {
  brand: PropTypes.object,
  save: PropTypes.func.isRequired
};

const contextTypes = {
  closeModal: PropTypes.func.isRequired
};

class Input extends React.Component {
  constructor(props) {
    super(props);

    this.changeValue = this.changeValue.bind(this);
  }

  changeValue(event) {
    this.props.setValue(event.currentTarget.value);
  }

  render() {
    const error = this.props.isPristine() ? null : this.props.getErrorMessage();

    console.log(this.props.getErrorMessage());

    return (
      <div>
        <input
          onChange={this.changeValue}
          type="text"
          value={this.props.getValue() || ''}
        />
        <span>{error}</span>
      </div>
    );
  }
}

Input.propTypes = {
  getValue: PropTypes.func,
  setValue: PropTypes.func,
  getErrorMessage: PropTypes.func,
  isPristine: PropTypes.func
};

const InputWithFormsy = withFormsy(Input);

addValidationRule('isValue', function(values, value) {
  return Boolean(value);
});

class BrandForm extends Component {
  constructor(props) {
    super(props);

    this.generateDoc = this.generateDoc.bind(this);
    this.save = this.save.bind(this);
  }

  save(values) {
    console.log(values);
  }

  generateDoc() {
    return {
      doc: {
        name: document.getElementById('brand-name').value,
        description: document.getElementById('brand-description').value
      }
    };
  }

  renderContent() {
    const object = this.props.brand || {};

    return (
      <div>
        <FormGroup>
          <ControlLabel>Name</ControlLabel>
          <InputWithFormsy
            name="name"
            defaultValue={object.name}
            type="text"
            validations="isValue"
            validationError="Wrong value"
          />
        </FormGroup>

        <FormGroup>
          <ControlLabel>Description</ControlLabel>

          <FormControl
            id="brand-description"
            componentClass="textarea"
            rows={5}
            defaultValue={object.description}
          />
        </FormGroup>
      </div>
    );
  }

  render() {
    const onClick = () => {
      this.context.closeModal();
    };

    return (
      <Formsy onValidSubmit={this.save}>
        {this.renderContent()}
        <ModalFooter>
          <Button
            btnStyle="simple"
            type="button"
            icon="cancel-1"
            onClick={onClick}
          >
            Cancel
          </Button>

          <Button btnStyle="success" icon="checked-1" type="submit">
            Save
          </Button>
        </ModalFooter>
      </Formsy>
    );
  }
}

BrandForm.propTypes = propTypes;
BrandForm.contextTypes = contextTypes;

export default BrandForm;
