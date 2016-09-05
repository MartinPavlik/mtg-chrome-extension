import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { Field, reduxForm } from 'redux-form'
import { Button } from 'react-bootstrap'

class ImportForm extends Component {
  render() {
    const { handleSubmit } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <div>
          <Field name="text" component="textarea" type="text"/>
        </div>
        <Button bsStyle="primary" bsSize="lg" type="submit">
          Do the magic
        </Button>
      </form>
    );
  }
}

// Decorate the form component
ImportForm = reduxForm({
  form: 'import' // a unique name for this form
})(ImportForm);

export default ImportForm;