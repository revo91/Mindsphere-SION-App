import React, { Component } from "react";

class AnaliticTableRow extends Component {
  render() {
    let { value, rowProperties, lang } = this.props;
    if (!value) return null;

    let { label, unit, max, min } = rowProperties;

    return (
      <tr className={this.formatTrClass(value, max, min)}>
        <td>{label[lang]}</td>
        <td>{`${value.toFixed(2)} ${unit}`}</td>
      </tr>
    );
  }

  formatTrClass(value, max, min) {
    let mmin = 0.5 * min;
    let mmax = 1.5 * max;
    if (value < mmin || value > mmax) return "table-danger";
    if (value < min || value > max) return "table-warning";

    return "table-default";
  }
}

export default AnaliticTableRow;
