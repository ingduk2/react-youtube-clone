import React, { useState, useCallback } from "react";
import { Typography, Button, Form, message, Input, Icon } from "antd";
import { useDropzone } from "react-dropzone";
import { useSelector } from "react-redux";
import Axios from "axios";
const { TextArea } = Input;
const { Title } = Typography;

const PrivateOptions = [
  { value: 0, label: "Private" },
  { value: 1, label: "Pulic" },
];

const CategoryOptions = [
  { value: 0, label: "film & Animation" },
  { value: 1, label: "Autos & Vehicles" },
];

function MyDropzone(props) {
  const { setFilePath, setDuration, setThumbnailPath } = props;

  const onDrop = useCallback((files) => {
    // console.log(acceptedFiles);
    let formData = new FormData();
    const config = {
      header: { "content-type": "multipart/form-data" },
    };
    formData.append("file", files[0]);

    console.log(files);
    Axios.post("/api/video/uploadfiles", formData, config).then((response) => {
      if (response.data.success) {
        console.log(response.data);

        let variable = {
          url: response.data.url,
          fileName: response.data.fileName,
        };

        setFilePath(response.data.url);
        Axios.post("/api/video/thumbnail", variable).then((response) => {
          if (response.data.success) {
            console.log(response.data);
            setDuration(response.data.fileDuration);
            setThumbnailPath(response.data.url);
          } else {
            alert("썸네일 생성에 실패 했습니다.");
          }
        });
      } else {
        alert("비디오 업로드를 실패했습니다.");
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      style={{
        width: "300px",
        height: "240px",
        border: "1px solid lightgray",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <Icon type="plus" style={{ fontSize: "3rem" }} />
      )}
    </div>
  );
}

function VideoUploadPage(props) {
  const user = useSelector((state) => state.user);
  const [VideoTitle, setVideoTitle] = useState("");
  const [Description, setDescription] = useState("");
  const [Private, setPrivate] = useState(0);
  const [Category, setCategory] = useState("film & animation");
  const [FilePath, setFilePath] = useState("");
  const [Duration, setDuration] = useState("");
  const [ThumbnailPath, setThumbnailPath] = useState("");
  const onTitleChange = (e) => {
    setVideoTitle(e.currentTarget.value);
  };

  const onDescriptionChange = (e) => {
    setDescription(e.currentTarget.value);
  };

  const onPrivateChange = (e) => {
    setPrivate(e.currentTarget.value);
  };

  const onCategoryChange = (e) => {
    setCategory(e.currentTarget.value);
  };

  const onSubmit = (e) => {
    //클릭하면 하려던 것들 방지.
    e.preventDefault();

    const variables = {
      writer: user.userData._id,
      title: VideoTitle,
      description: Description,
      privacy: Private,
      filePath: FilePath,
      category: Category,
      duration: Duration,
      thumbnail: ThumbnailPath,
    };
    Axios.post("/api/video/uploadVideo", variables).then((response) => {
      if (response.data.success) {
        console.log(response.data);
        message.success("성공적으로 업로드를 했습니다.");

        setTimeout(() => {
          props.history.push("/");
        }, 3000);
      } else {
        alert("비디오 업로드에 실패 했습니다.");
      }
    });
  };
  return (
    <div style={{ maxWidth: "700px", margin: "2rem auto" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <Title level={2}>Upload Video</Title>
      </div>

      <Form onSubmit={onSubmit}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {/* Drop zone */}
          <MyDropzone
            setFilePath={setFilePath}
            setDuration={setDuration}
            setThumbnailPath={setThumbnailPath}
          />

          {/* sumbnail */}
          {ThumbnailPath && (
            <div>
              <img
                src={`http://localhost:5000/${ThumbnailPath}`}
                alt="thumbnail"
              />
            </div>
          )}
        </div>
        <br />
        <br />
        <label>Title</label>
        <Input onChange={onTitleChange} value={VideoTitle} />
        <br />
        <br />
        <label>Discription</label>
        <TextArea onChange={onDescriptionChange} value={Description} />
        <br />
        <br />
        <select onChange={onPrivateChange}>
          {PrivateOptions.map((item, index) => (
            <option key={index} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>

        <br />
        <br />
        <select onChange={onCategoryChange}>
          {CategoryOptions.map((item, index) => (
            <option key={index} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <br />
        <br />
        <Button type="primary" size="large" onClick={onSubmit}>
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default VideoUploadPage;
