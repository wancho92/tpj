// Note/index.js
import React from "react";
import "./index.css";

class Note extends React.Component {
  render() {
    const { note, onEditNote } = this.props;
    const { title, contents } = note;
    return (
      <div className="note">
        <input
          className="title"
          value={title}
          onChage={e => onEditNote("title", e)}
        />
        <textarea
          class="note-contents"
          value={contents}
          onChange={e => onEditNote("contents", e)}
        />
      </div>
    );
  }
}

export default Note;
