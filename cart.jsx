// simulate getting products from DataBase
const products = [
  { name: "Apples_:", country: "Italy", cost: 3, instock: 10 },
  { name: "Oranges:", country: "Spain", cost: 4, instock: 3 },
  { name: "Beans__:", country: "USA", cost: 2, instock: 5 },
  { name: "Cabbage:", country: "USA", cost: 1, instock: 8 },
];
//=========Cart=============
const Cart = (props) => {
  const { Card, Accordion, Button } = ReactBootstrap;
  let data = props.location.data ? props.location.data : products;
  console.log(`data:${JSON.stringify(data)}`);

  return <Accordion defaultActiveKey="0">{list}</Accordion>;
};

const useDataApi = (initialUrl, initialData) => {
  const { useState, useEffect, useReducer } = React;
  const [url, setUrl] = useState(initialUrl);

  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    isError: false,
    data: initialData,
  });
  console.log(`useDataApi called`);
  useEffect(() => {
    console.log("useEffect Called");
    let didCancel = false;
    const fetchData = async () => {
      dispatch({ type: "FETCH_INIT" });
      try {
        const result = await axios(url);
        console.log("FETCH FROM URl");
        if (!didCancel) {
          dispatch({ type: "FETCH_SUCCESS", payload: result.data });
        }
      } catch (error) {
        if (!didCancel) {
          dispatch({ type: "FETCH_FAILURE" });
        }
      }
    };
    fetchData();
    return () => {
      didCancel = true;
    };
  }, [url]);
  return [state, setUrl];
};

const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case "FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    default:
      throw new Error();
  }
};

const Products = (props) => {
  const [items, setItems] = React.useState(products);
  const [cart, setCart] = React.useState([]);
  const [total, setTotal] = React.useState(0);
  const {
    Card,
    CardGroup,
    Accordion,
    Button,
    Container,
    Row,
    Col,
    Table,
    Image,
    Input,
  } = ReactBootstrap;
  //  Fetch Data
  const { Fragment, useState, useEffect, useReducer } = React;
  const [query, setQuery] = useState("http://localhost:1337/api/products");
  const [{ data, isLoading, isError }, doFetch] = useDataApi(
    "http://localhost:1337/api/products",
    {
      data: [],
    }
  );
  console.log(`Rendering Products ${JSON.stringify(data)}`);
  // Fetch Data
  const addToCart = (e) => {
    let name = e.target.name;
    let item = items.filter((item) => item.name == name);
    if (item[0].instock == 0) return;
    item[0].instock = item[0].instock -1;
    console.log(`add to Cart ${JSON.stringify(item)}`);
    setCart([...cart, ...item]);
    //doFetch(query);
  };

  const deleteCartItem = (delIndex) => {
    let newCart = cart.filter((item, i) => delIndex != i);
    let target = cart.filter((item, index) => delIndex == index);
    let newItems = items.map((item, index) => {
      if (item.name == target[0].name) item.instock = item.instock + 1;
      return item;
    });
    setCart(newCart);
    setItems(newItems);
  };
  const photos = ["apples.png", "oranges.png", "beans.png", "cabbage.png"];

  let list = items.map((item, index) => {
    return (       
      <Card style={{ width: '18rem' }}>
        <Card.Img variant="top" src={photos[index % 4]} />
        <Card.Body>
          <Card.Title>{item.name}, ${item.cost}</Card.Title>
          <Card.Text>
            Product of {item.country}
          </Card.Text>
          <input name={item.name} type="submit" value="Add to cart" onClick={addToCart}></input> {item.instock} left
        </Card.Body>
      </Card>
    );
  });

  let cartList = cart.map((item, index) => {
    return (
      <tr key={index}>
        <td>
          {item.name}, ${item.cost}
        </td>
        <td>
          <Button
            onClick={() => deleteCartItem(index)}
            eventKey={1 + index}
            name={item.name}
            variant="link"
          >Remove from cart
          </Button>
        </td>
      </tr>
    );
  });

  let finalList = () => {
    let total = checkOut();
    let final = cart.map((item, index) => {
      return (
        <div key={index} index={index}>
          {item.name} ${item.cost}
        </div>
      );
    });
    return { final, total };
  };

  const checkOut = () => {
    let costs = cart.map((item) => item.cost);
    const reducer = (accum, current) => accum + current;
    let newTotal = costs.reduce(reducer, 0);
    console.log(`total updated to ${newTotal}`);
    return newTotal;
  };
  // TODO: implement the restockProducts function
  const restockProducts = (url) => {};

  return (
    <Container>
      <Row className="gy-5">
        <Col>
          <h2>Product List</h2>
          <CardGroup>
            {list}
          </CardGroup>
        </Col>
      </Row>
      <Row className="gy-5">
        <Col>
          <h2>Cart Contents</h2>
          <Table striped size="sm">
            <tbody>
              {cartList}
            </tbody>
          </Table>
        </Col>
        <Col>
          <h2>CheckOut </h2>
          <Button onClick={checkOut}>CheckOut $ {finalList().total}</Button>
          <div> {finalList().total > 0 && finalList().final} </div>
        </Col>
      </Row>
      <Row className="gy-5">
        <Col>
            <form
              onSubmit={(event) => {
                restockProducts(`http://localhost:1337/api/${query}`);
                console.log(`Restock called on ${query}`);
                event.preventDefault();
              }}
            >
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              <button type="submit">ReStock Products</button>
            </form>
          
          <div>
            <p className="small">Photo attribution: Apples photo by <a href="https://unsplash.com/@cenali?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Matheus Cenali</a> on <a href="https://unsplash.com/s/photos/apples?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>, Oranges photo by <a href="https://unsplash.com/@sweetsimplesunshine?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Jen Gunter</a> on <a href="https://unsplash.com/s/photos/oranges?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>, Beans photo by <a href="https://unsplash.com/@lukasz_rawa?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Łukasz Rawa</a> on <a href="https://unsplash.com/s/photos/beans?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>, Cabbage photo by <a href="https://unsplash.com/@shelleypauls?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Shelley Pauls</a> on <a href="https://unsplash.com/s/photos/cabbage?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a></p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};
// ========================================
ReactDOM.render(<Products />, document.getElementById("root"));
