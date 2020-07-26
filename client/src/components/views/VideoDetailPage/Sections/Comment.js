import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useSelector } from "react-redux";
import SingleComment from "./SingleComment";
import ReplyComment from "./ReplyComment";
function Comment(props) {
  const user = useSelector((state) => state.user);
  console.log(user.userData._id);
  const videoId = props.postId;
  const [commentValue, setCommentValue] = useState("");

  const handleClick = (event) => {
    setCommentValue(event.currentTarget.value);
  };

  const onSubmit = (event) => {
    event.preventDefault();

    const variables = {
      content: commentValue,
      writer: user.userData._id,
      postId: videoId,
    };
    Axios.post("/api/comment/saveComment", variables).then((response) => {
      if (response.data.success) {
        console.log(response.data.result);
        props.refreshFunction(response.data.result);
        setCommentValue("");
      } else {
        alert("커맨트를 저장하지 못했습니다.");
      }
    });
  };
  return (
    <div>
      <br />
      <p> Replies</p>
      <hr />

      {/* Comment Lists */}
      {props.commentList &&
        props.commentList.map((comment, index) => {
          if (!comment.responseTo)
            return (
              <React.Fragment>
                <SingleComment
                  refreshFunction={props.refreshFunction}
                  comment={comment}
                  postId={videoId}
                />
                <ReplyComment
                  commentList={props.commentList}
                  parentCommentId={comment._id}
                  postId={videoId}
                  refreshFunction={props.refreshFunction}
                />
              </React.Fragment>
            );
        })}

      {/* Root Comment Form */}

      <form style={{ display: "flex" }} onSubmit={onSubmit}>
        <textarea
          style={{ width: "100%", borderRadius: "5px" }}
          onChange={handleClick}
          value={commentValue}
          placeholder="코멘트를 작성해 주세요"
        />
        <br />
        <button style={{ width: "20%", htight: "52px" }} onClick={onSubmit}>
          Submit
        </button>
      </form>
    </div>
  );
}

export default Comment;
