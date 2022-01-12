// Ex 3 - write out all items with their stock number
// provide a button and use onClick={moveToCart} to move 1 item into the Shopping Cart
// use React.useState to keep track of items in the Cart.
// use React.useState to keep track of Stock items
// list out the Cart items in another column
function NavBar({ stockitems, minstock }) {
  const [cart, setCart] = React.useState([]);
  const [stock, setStock] = React.useState(stockItems);
  const { Button } = ReactBootstrap;
  
  const moveToCart = (e) => {
    let [name,num] = e.target.innerHTML.split(":");
    if (num <= 0) return; // do nothing if stock is 0
    let item = stock.filter((item) => item.name == name);
    let newStock = stock.map((item, index) => {
      if (item.name == name) item.instock--;
      return item;
    });
    setCart([...cart, ...item]);
    setStock(newStock);
  };

  const updatedList = stock.map((item, index) => {
    return (
      <Button onClick={moveToCart} key={index}>
        {item.name}:{item.instock}
      </Button>
    );
  });

  // note that React needs to have a single Parent
  return (
    <>
      <ul style={{ listStyleType: "none" }}>{updatedList}</ul>
      <h1>Shopping Cart</h1>
      <Cart cartitems={cart}></Cart>
    </>
  );
}

function Cart({cartitems}) {
  const {Button} = ReactBootstrap;
  const cartList = cartitems.map((item, index) => {
    return <Button key={index}>{item.name}</Button>;
  });

  return (
    <ul style={{ listStyleType: "none" }} key="cart">{cartList}</ul>
  );
}

const stockItems = [
  { name: "apple", instock: 2 },
  { name: "pineapple", instock: 3 },
  { name: "pear", instock: 0 },
  { name: "peach", instock: 3 },
  { name: "orange", instock: 1 }
];
ReactDOM.render(
  <NavBar stockitems={stockItems} minstock={2} />,
  document.getElementById("root")
);


