import React from 'react';
import PropTypes from 'prop-types';
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
  onSubmit: PropTypes.func
};

class Form extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.inputs = [];
    this.getAllInputs(this.props.children);
  }

  getAllInputs(children) {
    children.forEach(child => {
      // if(child instanceof Object && child.props.children && Array.isArray(child.props.children)) {
      //   this.getAllInputs(child.props.children);
      // } else if( child instanceof Object && child.props.componentClass){
      //   this.inputs.push(child);
      // }

      //   if (
      //     child instanceof Object &&
      //     React.Children.only(child) &&
      //     child.props.children instanceof Array
      //   ) {
      //     this.getAllInputs(child.props.children);
      //   }
      //   this.inputs.push(child);
      // });
      if (child instanceof Object && child.type.name === 'FormControl') {
        this.inputs.push(child);
      } else if (
        child instanceof Object &&
        child.props.children instanceof Array
      ) {
        this.getAllInputs(child.props.children);
      }
    });
  }

  render() {
    console.log(this.inputs);
    // this.asd();
    return <form onSubmit={this.props.onSubmit}>{this.props.children}</form>;
  }
}

Form.propTypes = propTypes;

export default Form;
