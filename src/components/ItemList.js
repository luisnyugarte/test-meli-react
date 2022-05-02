import React, { Component } from "react";
import { API_URL } from "../constants";
import { connect } from "react-redux";
import { setItems, setSearch } from "../redux/actions";
import Loader from "react-loader-spinner";
import Item from "./Item";
import "../styles/itemList.scss";

class ItemList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      breadcrumb: ""
    };
  }

  async componentWillMount() {
    let urlParam = new URLSearchParams(this.props.location.search).get(
      "search"
    );
    if (urlParam !== null && urlParam !== this.props.search) {
      await this.props.setSearch(urlParam);
      await this.getItems();
    }
  }

  async componentDidUpdate(prevProps, newState) {
    if (this.props.search !== prevProps.search) {
      await this.getItems();
    }
  }

  async getItems() {
    this.setState({ isLoading: true });
    try {
      let { search } = this.props;
      const response = await fetch(`${API_URL}/api/items?q=${search}`);
      let data = await response.json();
      // most repeated category
      const categories_id = [];
      data.items.forEach((item) => {
        categories_id.push({
          "category": item.category_id
        })
      });
      let category_id = 0;
      let couenter = 0;
      let count = 0;
      categories_id.map(p => {
        count = 0
        categories_id.map(x => {
            if (p === x) { count++ }
        })
        if (count > couenter) {
            couenter = count;
            category_id = p;
        }
      });
      //Get most repeat category
      const categories = await fetch(
        `${API_URL}/api/categories/${category_id.category}`
      );
      this.setState({ isLoading: false });
      let breadcrumb = await categories.json();
      data.categories = breadcrumb.category;
      await this.props.setItems(data);
      await this.props.setCategories(breadcrumb.category);

    } catch (error) {
      console.log(error);
    }
  }


  render() {
    const items = this.props.items.length
      ? this.props.items.map((item, index) => {
          return (
            <li key={index}>
              <Item item={item} />
            </li>
          );
        })
      : [];

    if (this.state.isLoading) {
      return (
        <div className="main-container">
          <Loader type="Circles" color="#3483FA" />;
        </div>
      );
    }

    if (items.length) {
      return <ul data-testid="listSearch">{items.slice(0, 4)}</ul>;
    } else {
      let msg = this.props.noItems
        ? "No se encontraron resultados"
        : "Resultados ...";
      return (
        <div className="main-container">
          <h1>{msg}</h1>
        </div>
      );
    }
  }
}

export default connect(
  ({ items, search, noItems, categories }) => {
    return { items, search, categories };
  },
  { setItems, setSearch }
)(ItemList);