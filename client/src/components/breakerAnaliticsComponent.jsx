import React, { Component } from "react";
import SIONCharacteristicCalculator from "./SIONCharateristicCalculator";
import AnaliticTable from "./common/analiticTableComponent";

class BreakerAnalitics extends Component {
  breakersLimits = {};

  calculateData = () => {
    let { data } = this.props;

    try {
      let calc = new SIONCharacteristicCalculator();
      calc.load(data);

      return calc.getData();
    } catch (error) {
      console.log(error);

      return {};
    }
  };

  render() {
    let data = this.calculateData();
    return (
      <React.Fragment>
        <AnaliticTable
          data={data}
          tableProperties={this.formatTableProperties()}
          lang={this.props.lang}
        />
      </React.Fragment>
    );
  }

  formatTableProperties() {
    let { tableProperties, data } = this.props;
    let wasClosing = data._wasClosing;

    let newTableProperties = { ...tableProperties };
    newTableProperties.rows = [];

    for (let row of tableProperties.rows) {
      let newRow = this.formatTableRow(row, wasClosing);

      if (newRow) newTableProperties.rows.push(newRow);
    }

    return newTableProperties;
  }

  formatTableRow(row, wasClosing) {
    let newRow = { ...row };

    if (!((wasClosing && newRow.Closing) || (!wasClosing && newRow.Opening)))
      return null;

    newRow.max = wasClosing ? newRow.Closing.max : newRow.Opening.max;
    newRow.min = wasClosing ? newRow.Closing.min : newRow.Opening.min;

    return newRow;
  }
}

export default BreakerAnalitics;
