import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import { connect } from "react-redux";

class Content extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <main>
          <ul className="list-breadcrumb">
            <li>{this.props.categories}</li>
          </ul>
          <div className="list-container">{this.props.children}</div>
      </main>
    );
  }
}

export default withRouter(
  connect(({ categories }) => {
    return { categories };
  })(Content)
);