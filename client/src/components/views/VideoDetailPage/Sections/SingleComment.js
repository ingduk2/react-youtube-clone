import React, { useState, useEffect } from "react";
import { Comment, Avatar, Button, Input } from "antd";
import { useSelector } from "react-redux";
import LikeDislikes from "./LikeDislikes";
import Axios from "axios";
const { TextArea } = Input;
function SingleComment(props) {
  const user = useSelector((state) => state.user);
  const [OpenReply, setOpenReply] = useState(false);
  const [commentValue, setcommentValue] = useState("");
  const onClickReplyOpen = () => {
    // alert(props.postId);
    setOpenReply(!OpenReply);
  };

  const onHandleChange = (event) => {
    setcommentValue(event.currentTarget.value);
    //commentValue , value 차이?
  };
  const onSubmit = (event) => {
    event.preventDefault();

    //모든 정보 저장.
    const variables = {
      content: commentValue,
      writer: user.userData._id,
      postId: props.postId,
      responseTo: props.comment._id,
    };
    console.log(variables);
    Axios.post("/api/comment/saveComment", variables).then((response) => {
      if (response.data.success) {
        console.log(response.data.result);
        setcommentValue("");
        onClickReplyOpen();
        props.refreshFunction(response.data.result);
      } else {
        alert("커맨트를 저장하지 못했습니다.");
      }
    });
  };
  const actions = [
    <LikeDislikes
      comment
      userId={localStorage.getItem("userId")}
      commentId={props.comment._id}
    />,
    <span onClick={onClickReplyOpen} key="comment-basic-reply-to">
      reply to
    </span>,
  ];
  return (
    <div>
      <Comment
        actions={actions}
        author={props.comment.writer.name}
        avatar={<Avatar src={props.comment.writer.image} alt="" />}
        content={<p>{props.comment.content}</p>}
      />
      {OpenReply && (
        <form style={{ display: "flex" }} onSubmit={onSubmit}>
          <textarea
            style={{ width: "100%", borderRadius: "5px" }}
            onChange={onHandleChange}
            value={commentValue}
            placeholder="코멘트를 작성해 주세요"
          />
          <br />
          <button style={{ width: "20%", htight: "52px" }} onClick={onSubmit}>
            Submit
          </button>
        </form>
      )}
    </div>
  );
}

export default SingleComment;
