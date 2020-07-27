import React, { useState, useEffect } from "react";
import { Tooltip, Icon } from "antd";
import Axios from "axios";
function LikeDislikes(props) {
  const [Likes, setLikes] = useState(0);
  const [LikeAction, setLikeAction] = useState(null);

  const [DisLikes, setDisLikes] = useState(0);
  const [DisLikeAction, setDisLikeAction] = useState(null);
  let variable = {};

  if (props.video) {
    variable = { videoId: props.videoId, userId: props.userId };
  } else {
    variable = { commentId: props.commentId, userId: props.userId };
  }
  useEffect(() => {
    Axios.post("/api/like/getLikes", variable).then((response) => {
      if (response.data.success) {
        // 얼마나 많은 좋아요를 받았는지
        setLikes(response.data.likes.length);

        //내가 이미 좋아료를 눌렀는지
        response.data.likes.map((like) => {
          if (like.userId === props.userId) {
            setLikeAction("liked");
          }
        });
      } else {
        alert("Likes에 정보를 가져오지 못했습니다.");
      }
    });

    Axios.post("/api/like/getDisLikes", variable).then((response) => {
      if (response.data.success) {
        // 얼마나 많은 싫어요를 받았는지
        setDisLikes(response.data.dislikes.length);

        //내가 이미 싷어요를 눌렀는지
        response.data.dislikes.map((dislike) => {
          if (dislike.userId === props.userId) {
            setDisLikeAction("disliked");
          }
        });
      } else {
        alert("DisLikes에 정보를 가져오지 못했습니다.");
      }
    });
  }, []);

  const onLike = () => {
    console.log("onLike");
    if (LikeAction === null) {
      Axios.post("/api/like/upLike", variable).then((response) => {
        if (response.data.success) {
          setLikes(Likes + 1);
          setLikeAction("liked");

          if (DisLikeAction !== null) {
            setDisLikeAction(null);
            setDisLikes(DisLikes - 1);
          }
        } else {
          alert("Like를 올리지 못했습니다.");
        }
      });
    } else {
      Axios.post("/api/like/unLike", variable).then((response) => {
        if (response.data.success) {
          setLikes(Likes - 1);
          setLikeAction(null);
        } else {
          alert("Like를 내리지 못했습니다.");
        }
      });
    }
  };

  const onDisLike = () => {
    if (DisLikeAction !== null) {
      Axios.post("/api/like/unDislike", variable).then((response) => {
        if (response.data.success) {
          setDisLikes(DisLikes - 1);
          setDisLikeAction(null);
        } else {
          alert("dislike를 지우지 못했습니니다.");
        }
      });
    } else {
      Axios.post("/api/like/upDislike", variable).then((response) => {
        if (response.data.success) {
          setDisLikes(DisLikes + 1);
          setDisLikeAction("disliked");

          if (LikeAction !== null) {
            setLikeAction(null);
            setLikes(Likes - 1);
          }
        } else {
          alert("dislike를 지우지 못했습니니다.");
        }
      });
    }
  };
  return (
    <div>
      <span key="comment-basic-like" style={{ paddingLeft: "8px" }}>
        <Tooltip title="Like">
          <Icon
            type="like"
            theme={LikeAction === "liked" ? "filled" : "outlined"}
            onClick={onLike}
          />
        </Tooltip>
        <span style={{ paddingLeft: "8px", sursor: "auto" }}>{Likes}</span>
      </span>
      &nbsp;
      <span
        key="comment-basic-dislike"
        style={{ paddingLeft: "8px", paddingRight: "8px" }}
      >
        <Tooltip title="DisLike">
          <Icon
            type="dislike"
            theme={DisLikeAction === "disliked" ? "filled" : "outlined"}
            onClick={onDisLike}
          />
        </Tooltip>
        <span style={{ paddingLeft: "8px", sursor: "auto" }}>{DisLikes}</span>
      </span>
      &nbsp;
    </div>
  );
}

export default LikeDislikes;
