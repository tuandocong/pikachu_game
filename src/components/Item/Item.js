import classes from "./Item.module.css";

const Item = (props) => {
  const clickHandler = (data) => {
    props.handler(data);
  };
  return (
    <div>
      {props.item.data && (
        <div
          className={`${classes["item-img"]} ${
            props.item.status === 0 ? classes.hidden : ""
          } ${props.item.status === 1 ? classes.chosen : ""}`}
        >
          <img
            src={props.item.data.img}
            alt="this is a Pokemon"
            onClick={() => {
              clickHandler(props.item);
            }}
          />
        </div>
      )}
      {!props.item && <div>Not thing...</div>}
    </div>
  );
};
export default Item;
