import React, { Component } from "react";
import AnaliticTableRow from "./analiticTableRowComponent";

class AnaliticTableBody extends Component {
  render() {
    let { tableProperties, data, lang } = this.props;
    let { rows } = tableProperties;

    return (
      <tbody>
        {rows.map(row => (
          <AnaliticTableRow
            key={row.propertyName}
            value={data[row.propertyName]}
            rowProperties={row}
            lang={lang}
          />
        ))}
      </tbody>
    );
  }
}

export default AnaliticTableBody;
