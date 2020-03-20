// App/index.js
import React from "react";
import "./index.css";
import Header from "../Header";
import List from "../List";
import Note from "../Note";
import { generateId } from "../../utils"; // 랜덤ID

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

  // 편집 이벤트 핸들러
  hadnleEditNote = (type, e) => {
    // 새 notes 어레이 생성
    const notes = [...this.state.notes];

    // notes에서 현재 activeId와 일치하는 노트 객체 찾기
    const note = notes.find(item => item.id === this.state.activeId);

    // 객체의 속성에 값 할당. note.title 또는 note.contents
    note[type] = e.target.value;

    // notes에 새 array를 할당하여 state 편집
    this.setState({
      notes
    });
  };

  // 추가 이벤트 핸들러
  handleAddNote = () => {
    const id = generateId(); // 랜덤ID
    this.setState({
      notes: [...this.state.notes, { id, title: "제목", contents: "내용" }],
      activeId: id
    });
  };

  // 삭제 이벤트 핸들러
  handleDeleteNote = () => {
    // 현재 선택한 노트를 제외한 새로운 array 생성
    const notes = this.state.notes.filter(
      item => item.id !== this.state.activeId
    );

    console.log("notes : " + notes);

    // 새 array를 notes에 할당
    this.setState({
      notes,
      activeId: notes.length === 0 ? null : notes[0].id
    });
  };

  render() {
    // return <div>Hello World!</div>;

    const { notes, activeId } = this.state;
    const activeNote = notes.filter(item => item.id === activeId)[0];
    return (
      <div className="app">
        <Header
          onAddNote={this.handleAddNote}
          onDeleteNote={this.handleDeleteNote}
        />
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

          {/* activeNote가 존재할 경우 <Note />를 렌더링 한다. */}
          {/* note 속성에 activeNote를 전달한다. */}
          {notes.length !== 0 && (
            <Note note={activeNote} onEditNote={this.hadnleEditNote} />
          )}
        </div>
      </div>
    );
  }
}

export default App;
