import React, { useState, useEffect } from "react";
import SingleComment from "./SingleComment";
function ReplyComment(props) {
  const [ChildCommentNumber, setChildCommentNumber] = useState(0);
  const [OpenReplyComment, setOpenReplyComment] = useState(false);

  useEffect(() => {
    let commentNumber = 0;
    props.commentList.map((comment) => {
      if (comment.responseTo === props.parentCommentId) {
        commentNumber += 1;
      }
    });
    setChildCommentNumber(commentNumber);
  }, [props.commentList]);

  const renderReplyComment = (parentCommentId) =>
    props.commentList.map((comment, index) => (
      <React.Fragment>
        {comment.responseTo === parentCommentId && (
          <div style={{ marginLeft: "100px" }}>
            <SingleComment
              refreshFunction={props.refreshFunction}
              comment={comment}
              postId={props.postId}
            />
            <ReplyComment
              commentList={props.commentList}
              postId={props.postId}
              parentCommentId={comment._id}
              refreshFunction={props.refreshFunction}
            />
          </div>
        )}
      </React.Fragment>
    ));

  const onHandleChange = () => {
    // alert(props.postId);
    setOpenReplyComment(!OpenReplyComment);
  };
  return (
    <div>
      {ChildCommentNumber > 0 && (
        <p
          style={{ fontSize: "14px", margin: 0, color: "grey" }}
          onClick={onHandleChange}
        >
          view {ChildCommentNumber} more comment(s)
        </p>
      )}
      {OpenReplyComment && renderReplyComment(props.parentCommentId)}
      {/* {renderReplyComment(props.parentCommentId)} */}
    </div>
  );
}

export default ReplyComment;
