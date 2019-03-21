import React, { Component } from "react";
import AnaliticTableBody from "./analiticTableBodyComponent";
import AnaliticTableHeader from "./analiticTableHeaderComponent";
import "./analiticTableComponent.css";

class AnaliticTable extends Component {
  render() {
    if (!this.props.tableProperties) return "";
    if (!this.props.data) return "";
    if (!this.props.lang) return "";

    let { tableProperties, data, lang } = this.props;
    let { title } = tableProperties;
    return (
      <div className="shadow p-3 mb-5 bg-white rounded">
        <h3 className="text-center mb-5">{title[lang]}</h3>
        <table className="table">
          <AnaliticTableHeader tableProperties={tableProperties} lang={lang} />
          <AnaliticTableBody
            tableProperties={tableProperties}
            data={data}
            lang={lang}
          />
        </table>
      </div>
    );
  }
}

export default AnaliticTable;
