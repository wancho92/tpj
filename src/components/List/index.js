// List/index.js
import React from "react";
import "./index.css";
import ListItem from "../ListItem";

class List extends React.Component {
  render() {
    const { notes, activeId, onListItemClick } = this.props;
    return (
      <div className="list">
        {/* <ListItem />
        <ListItem />
        <ListItem />
        <ListItem />
        <ListItem />
        <ListItem /> */}

        {/*
        반복문을 돌 때에는 KEY 가 필수입니다.
        리액트는 어떤 엘리먼트가 변경, 생성, 삭제 되었는지 판단할 때 KEY를 활용합니다.
        각 엘리먼트에 유일성(IDENTITY)을 보장하기 위해 ID와 같은 유니크한 키를 사용합니다.
        */}
        {notes.map(item => {
          const { id, title, contents } = item;
          return (
            <ListItem
              key={id}
              id={id}
              active={id === activeId}
              title={title}
              contents={contents}
              onClick={() => onListItemClick(id)} // onClick이 호출되면 () => onListItemClick(id) 호출되어 <App />의 handleListItemClick이 호출됩니다.
            />
          );
        })}
      </div>
    );
  }
}

export default List;
