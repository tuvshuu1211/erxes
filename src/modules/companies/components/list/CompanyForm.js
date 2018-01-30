import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';
import {
  Button,
  Icon,
  FormGroup,
  FormControl,
  ControlLabel,
  validate,
  Form
} from 'modules/common/components';

const propTypes = {
  addCompany: PropTypes.func.isRequired
};

const contextTypes = {
  closeModal: PropTypes.func.isRequired
};

class CompanyForm extends React.Component {
  constructor(props) {
    super(props);

    this.addCompany = this.addCompany.bind(this);
  }

  addCompany(e) {
    e.preventDefault();
    validate('asd');
    //
    // this.props.addCompany({
    //   doc: {
    //     name: document.getElementById('company-name').value,
    //     website: document.getElementById('company-website').value
    //   },
    //
    //   callback: () => {
    //     this.context.closeModal();
    //   }
    // });
  }

  render() {
    const onClick = () => {
      this.context.closeModal();
    };

    return (
      <Form onSubmit={this.addCompany} id="asd">
        <FormGroup>
          <ControlLabel>Name</ControlLabel>
          <FormControl
            id="company-name"
            type="text"
            validation={{ required: true, email: true, minLength: 10 }}
          />
        </FormGroup>

        <FormGroup>
          <ControlLabel>Website</ControlLabel>
          <FormControl
            id="company-website"
            type="text"
            validation={{ required: true }}
          />
        </FormGroup>

        <Modal.Footer>
          <Button btnStyle="simple" onClick={onClick}>
            <Icon icon="close" />
            Cancel
          </Button>

          <Button btnStyle="success" type="submit">
            <Icon icon="checkmark" />
            Save
          </Button>
        </Modal.Footer>
      </Form>
    );
  }
}

CompanyForm.propTypes = propTypes;
CompanyForm.contextTypes = contextTypes;

export default CompanyForm;
