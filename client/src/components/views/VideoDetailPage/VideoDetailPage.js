import React, { useState, useEffect } from "react";
import { Col, Row, List, Avatar } from "antd";
import Axios from "axios";
import SideVideo from "./Sections/SideVideo";
import Subscribe from "./Sections/Subscribe";
import Comment from "./Sections/Comment";
import LikeDislikes from "./Sections/LikeDislikes";
function VideoDetailPage(props) {
  const [VideoDetail, setVideoDetail] = useState([]);
  const videoId = props.match.params.videoId;
  const variable = { videoId: videoId };
  const [Comments, setComments] = useState([]);
  useEffect(() => {
    let isCancelled = false;
    Axios.post("/api/video/getVideoDetail", variable).then((response) => {
      if (response.data.success) {
        console.log(response.data.videoDetail);
        if (!isCancelled) setVideoDetail(response.data.videoDetail);
      } else {
        alert("비디오 정보를 가져오길 실패했습니다.");
      }
    });

    Axios.post("/api/comment/getComments", variable).then((response) => {
      if (response.data.success) {
        console.log(response.data.comments);
        setComments(response.data.comments);
      } else {
        alert("코멘트 정보를 가져오는 것을 실패 하였습니다.");
      }
    });

    return () => {
      isCancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (VideoDetail.writer) {
    const subscribeButton = VideoDetail.writer._id !==
      localStorage.getItem("userId") && (
      <Subscribe
        userTo={VideoDetail.writer._id}
        userFrom={localStorage.getItem("userId")}
      />
    );

    const refreshFunction = (newComment) => {
      setComments(Comments.concat(newComment));
    };

    return (
      <Row gutter={[16, 16]}>
        <Col lg={18} xs={24}>
          <div style={{ width: "100%", padding: "3rem 4rem" }}>
            <video
              style={{ width: "100%" }}
              src={`http://localhost:5000/${VideoDetail.filePath}`}
              controls
            />

            <List.Item
              actions={[
                subscribeButton,
                <LikeDislikes
                  video
                  userId={localStorage.getItem("userId")}
                  videoId={videoId}
                />,
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar src={VideoDetail.writer.image} />}
                title={VideoDetail.writer.name}
                description={VideoDetail.description}
              ></List.Item.Meta>
            </List.Item>
            <Comment
              commentList={Comments}
              postId={videoId}
              refreshFunction={refreshFunction}
            />
          </div>
        </Col>
        <Col lg={6} xs={24}>
          <SideVideo />
        </Col>
      </Row>
    );
  } else {
    return <div>Loading...</div>;
  }
}

export default VideoDetailPage;
