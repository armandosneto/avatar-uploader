import React, { useEffect } from "react";
import "./AvatarUploader.scss";
import "croppie/croppie.css";
import { useDropzone } from "react-dropzone";
import { useState } from "react";
import Croppie from "croppie";

interface Props {
  // onDrop: (files: File[]) => void;
}
const AvatarUploader: React.FC<Props> = () => {
  const [image, setImage] = useState<File>();
  const [croppie, setCroppie] = useState<Croppie | null>(null);
  const [divRef, setDivRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (divRef && image && !croppie) {
      const croppieInstance = new Croppie(divRef, {
        enableExif: true,
        viewport: {
          width: 150,
          height: 150,
          type: "circle",
        },
        boundary: {
          width: 150,
          height: 150,
        },
      });
      croppieInstance.bind({
        url: URL.createObjectURL(image),
      });
      setCroppie(croppieInstance);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [divRef, image]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    multiple: false,
    onDrop: (acceptedFiles) => {
      setImage(acceptedFiles[0]);
      if (croppie) {
        croppie.bind({
          url: URL.createObjectURL(acceptedFiles[0]),
        });
      }
    },
    onError: (error) => {
      console.log(error);
    },
  });

  function handleSubmit(event: any) {
    event.preventDefault();
    if (croppie !== null) {
      croppie
        .result({
          type: "base64",
          size: {
            width: 480,
            height: 480,
          },
        })
        .then((blob) => {
          console.log(blob);
        });
    }
  }

  return (
    <>
      <div {...getRootProps({ className: "avatar-uploader" })}>
        {image ? (
          <div>
            <p className="title">Crop</p>
            <div ref={setDivRef} />
            <button onClick={handleSubmit} className="save-button">
              Save
            </button>
          </div>
        ) : (
          <>
            <input {...getInputProps()} />
            <div>
              <div className="avatar-uploader-title">
                <img src="image.svg" alt="img-logo" />
                <p>Organzation Logo </p>
              </div>
              <p>Drop the image here or click to browse.</p>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default AvatarUploader;
