// App/index.js
import React from "react";
import "./index.css";
import Header from "../Header";
import List from "../List";
import Note from "../Note";

class App extends React.Component {
  /* 
  State란 UI의 상태를 기록하는 데이터입니다.
  일반적으로 버튼의 활성화 상태, INPUT의 입력 값, 체크박스 체크 여부 등의 상태를 관리합니다.
  */
  state = {
    notes: [
      // {
      //   id: "_id1",
      //   title: "제목1",
      //   components: "내용1"
      // },
      // {
      //   id: "_id2",
      //   title: "제목2",
      //   components: "내용2"
      // },
      // {
      //   id: "_id3",
      //   title: "제목3",
      //   components: "내용3"
      // }
    ],
    //activeId: "_id3" // 세 번째 노트가 활성화 되었을 경우
    activeId: null
  };

  // 이벤트 핸들러 메소드
  handleListItemClick = id => {
    /* 
      this.setState() 는 state를 설정하는 메소드입니다.
      state를 변경할 때는 반드시 this.setState() 를 사용하세요.
      this.state를 직접 조작하면, render() 메소드가 다시 호출되지 않습니다.
      따라서 UI가 업데이트 되지 않습니다.
    */
    this.setState({ activeId: id });
  };

  render() {
    // return <div>Hello World!</div>;

    const { notes, activeId } = this.state;
    return (
      <div className="app">
        <Header />
        <div className="container">
          {/* notes와 activeId props로 전달 */}

          {/* 
          props는 상위 컴포넌트가 하위 컴포넌트에 데이터를 전달하는 방법입니다.
          하위 컴포넌트는 this.props 를 참조하여 데이터에 접근할 수 있습니다.
          props 데이터는 읽기 전용이기 때문에 절대 변경해서는 안됩니다.
          컴포넌트는 pure function 처럼 작동해야하기 때문입니다.
          UI를 변경할 필요가 있다면 state 를 활용하시면 됩니다.
          
          */}
          <List
            notes={notes}
            activeId={activeId}
            onListItemClick={this.handleListItemClick} // 메소드 전달
          />
          <Note />
        </div>
      </div>
    );
  }
}

export default App;
