import React, { Component } from "react";

class AnaliticTableHeader extends Component {
  render() {
    let { lang, tableProperties } = this.props;
    let { columns } = tableProperties;
    return (
      <thead>
        <tr>
          {columns.map(column => (
            <th scope="col" key={column.label[lang]}>
              {column.label[lang]}
            </th>
          ))}
        </tr>
      </thead>
    );
  }
}

export default AnaliticTableHeader;
