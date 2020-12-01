import React from "react";
import moment from "moment";

interface TableProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  rows: {}[];
  columns: {
    width: number;
    value: string;
    key: string;
    type?: string;
    filter?: boolean;
    align?: "left" | "right" | "center" | "";
    order?: "asc" | "desc" | "";
  }[];
  defaultOrder?: { key: string; order: string };
  filterCb?: any;
  editCb?: any;
  deleteCb?: any;
  dropDownFunction?: any;
  dropDownComponent?: JSX.Element | string;
}

interface TableState {
  openIndex?: number | null;
  dateColumns: string[];
  dateTimeColumns: string[];
  filterKey?: string;
  filterOrder?: string;
}

interface Table {}

class Table extends React.Component<TableProps, TableState> {
  constructor(props: TableProps) {
    super(props);
    this.state = {
      openIndex: null,
      dateColumns: [],
      dateTimeColumns: [],
      filterKey: props.defaultOrder ? props.defaultOrder.key : "",
      filterOrder: props.defaultOrder ? props.defaultOrder.order : "",
    };
  }

  componentDidMount() {
    if (!this.props.rows) throw new Error("Enter an array with the table rows");
    if (!this.props.columns)
      throw new Error("Enter an array with the table columns");
    let columns = 0;

    this.props.columns.forEach((column) => {
      if (column.width < 0 || column.width > 100) {
        throw new Error(
          "Width value in columns must be bigger than 0 or lower than 100"
        );
      }

      columns += column.width;
    });

    if (columns !== 100) {
      throw new Error(
        'The "width" value of the columns must be a number, in addition to the sum of these being exactly equal to 100'
      );
    }

    let dateColumns: string[] = [];
    let dateTimeColumns: string[] = [];
    this.props.columns.forEach((column) => {
      if (column.type === "date") dateColumns.push.apply(column.key);
      if (column.type === "datetime") dateTimeColumns.push.apply(column.key);
    });

    this.setState({
      dateColumns,
      dateTimeColumns,
    });
  }

  handleFilter(column: { key: string; order: string }) {
    let filter: any = {};
    filter.key = column.key;
    filter.order = "";

    if (filter.key !== this.state.filterKey) {
      filter.order = "ASC";
      this.props.filterCb(filter);
      return this.setState({ filterOrder: "ASC", filterKey: filter.key });
    }

    switch (this.state.filterOrder) {
      case "":
        this.setState({ filterOrder: "ASC" });
        filter.order = "ASC";
        break;
      case "ASC":
        this.setState({ filterOrder: "DESC" });
        filter.order = "DESC";
        break;
      case "DESC":
        this.setState({ filterOrder: "", filterKey: "" });
        filter.order = "";
        filter.key = "";
        break;
      default:
        this.setState({ filterOrder: "" });
        filter.order = "";
        break;
    }
    this.props.filterCb(filter);
  }

  getFilterIcon(rowKey: any, filter: any) {
    if (this.state.filterKey === rowKey && filter === true) {
      if (this.state.filterOrder === "ASC") {
        return <i className="lni lni-sort-amount-asc"></i>;
      }

      if (this.state.filterOrder === "DESC") {
        return <i className="lni lni-sort-amount-dsc"></i>;
      }

      if (this.state.filterOrder === "") {
        return "";
      }
    }
  }

  render() {
    const { openIndex } = this.state;
    return (
      <div {...this.props} className="_table">
        <div className="table-body">
          <div className="header">
            <div className="row">
              {this.props.columns.map((column: any, index) => {
                if (!column.width)
                  throw new Error(
                    'Enter the size of each column by passing a "width" key inside the "columns" object'
                  );
                return (
                  <div
                    onClick={() => {
                      if (column.filter) this.handleFilter(column);
                    }}
                    key={index}
                    style={{
                      display: "flex",
                      flex: column.width,
                      justifyContent: column.align || "",
                    }}
                    className="header-item"
                  >
                    <p>
                      {column.value}
                      {this.getFilterIcon(column.key, column.filter)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="body">
            {this.props.rows.map((row: any, index) => {
              if (this.props.editCb !== false) {
                row.edit = (
                  <span
                    className="table-icon"
                    onClick={() => this.props.editCb(row)}
                  >
                    <i className="lni lni-pencil" />
                  </span>
                );
              }

              if (this.props.deleteCb !== false) {
                row.delete = (
                  <span
                    className="table-icon"
                    onClick={() => this.props.deleteCb(row)}
                  >
                    <i className="lni lni-close"></i>
                  </span>
                );
              }

              return (
                <div key={index}>
                  <div className="row">
                    {Object.keys(row).map((key, columnIndex) => {
                      let columns = this.props.columns;
                      let { dateColumns, dateTimeColumns } = this.state;

                      let widthIndex = columns.findIndex(
                        (column) => column.key === key
                      );

                      if (widthIndex === -1) return null;

                      let alignIndex = columns.findIndex(
                        (column) => column.key === key
                      );

                      let isDate = dateColumns.findIndex(
                        (column) => key === column
                      );
                      let isDateTime = dateTimeColumns.findIndex(
                        (column) => key === column
                      );

                      let width =
                        columns[widthIndex] && columns[widthIndex].width;

                      let align =
                        columns[alignIndex] && columns[alignIndex].align;
                      return (
                        <div
                          key={columnIndex}
                          className="body-item"
                          style={{ flex: width, justifyContent: align || "" }}
                          onClick={async () => {
                            if (key !== "edit" && key !== "delete") {
                              this.props.dropDownFunction(row);

                              if (this.state.openIndex === index) {
                                this.setState({ openIndex: null });
                              } else {
                                this.setState({ openIndex: index });
                              }
                            }
                          }}
                        >
                          {isDate >= 0 && (
                            <p>
                              {moment(new Date(row[key])).format("DD/MM/YYYY")}
                            </p>
                          )}
                          {isDateTime >= 0 && (
                            <p>
                              {moment(new Date(row[key])).format(
                                "DD/MM/YYYY HH:MM:ss"
                              )}
                            </p>
                          )}
                          {isDate < 0 && isDateTime < 0 && <p>{row[key]}</p>}
                        </div>
                      );
                    })}
                  </div>
                  {
                    <div
                      className={`dropdown ${index === openIndex && "active"} ${
                        index === openIndex && "show"
                      }`}
                    >
                      <div className="dropdown-content">
                        <div className="dropdown-item">
                          {this.props.dropDownComponent}
                        </div>
                      </div>
                    </div>
                  }
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default Table;
