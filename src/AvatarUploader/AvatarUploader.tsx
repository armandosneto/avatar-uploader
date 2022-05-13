import React from "react";
import "./AvatarUploader.scss";
import { useDropzone } from "react-dropzone";

interface Props {
  // onDrop: (files: File[]) => void;
}
const AvatarUploader: React.FC<Props> = () => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    multiple: false,
    onDrop: (acceptedFiles) => {
      console.log(acceptedFiles);
    },
  });

  return (
    <div {...getRootProps({ className: "avatar-uploader" })}>
      <input {...getInputProps()} />
      <div>
        <div className="avatar-uploader-title">
          <img src="image.svg" alt="img-logo" />
          <p>Organzation Logo </p>
        </div>
        <p>Drop the image here or click to browse.</p>
      </div>
    </div>
  );
};

export default AvatarUploader;
