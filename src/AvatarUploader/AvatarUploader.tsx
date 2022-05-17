import React, { useCallback, useEffect, useState } from "react";
import "./AvatarUploader.scss";
import "croppie/croppie.css";
import { useDropzone } from "react-dropzone";
import Croppie from "croppie";

interface Props {
  onSave: (image: string) => void;
}

const AvatarUploader: React.FC<Props> = ({ onSave }) => {
  const [image, setImage] = useState<string | undefined>();
  const [saved, setSaved] = useState(false);
  const [croppie, setCroppie] = useState<Croppie | null>(null);
  const [divRef, setDivRef] = useState<HTMLDivElement | null>(null);
  const [hasError, setHasError] = useState(false);

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
        url: image,
      });
      setCroppie(croppieInstance);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [divRef, image]);

  const handleDrop = useCallback(
    (files: File[]) => {
      setSaved(false);
      setCroppie(null);
      setImage(URL.createObjectURL(files[0]));
    },
    [setSaved, setCroppie, setImage]
  );

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    multiple: false,
    onDrop: (acceptedFiles) => {
      handleDrop(acceptedFiles);
    },
    onError: (error) => {
      setHasError(true);
    },
  });

  const handleSubmit = useCallback(
    (event: any) => {
      event.preventDefault();
      if (croppie) {
        croppie
          .result({
            type: "base64",
            size: {
              width: 480,
              height: 480,
            },
          })
          .then((blob) => {
            onSave(blob);
            setImage(blob);
            setSaved(true);
          });
      }
    },
    [croppie, onSave]
  );

  const handleCancel = useCallback(() => {
    setImage(undefined);
    setHasError(false);
    setCroppie(null);
  }, [setImage, setHasError, setCroppie]);

  return (
    <>
      {hasError ? (
        <div className="avatar-uploader">
          <div className="error-content" data-testid="error-content">
            <div className="logo-image error">
              <img className="error-image" src="alert-circle.svg" alt="error" />
            </div>
            <div className="error-body">
              Sorry, The Upload failed.
              <button className="error-button" onClick={() => handleCancel()}>
                Please try again.
              </button>
              <button onClick={handleCancel} className="cancel-button">
                <img src="close.svg" alt="close" />
              </button>
            </div>
          </div>
        </div>
      ) : image && !saved ? (
        <div className="avatar-uploader" data-testid="avatar-image-cropper">
          <div>
            <p className="title">Crop</p>
            <div ref={setDivRef} />
            <button
              onClick={handleSubmit}
              className="save-button"
              data-testid="save-button"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="cancel-button"
              data-testid="cancel-button"
            >
              <img src="close.svg" alt="close" />
            </button>
          </div>
        </div>
      ) : (
        <div
          {...getRootProps({ className: "avatar-uploader" })}
          data-testid="avatar-uploader"
        >
          <input {...getInputProps()} data-testid="avatar-uploader-input" />
          {image && (
            <div className="logo-image">
              <img className="logo" src={image} alt="logo" />
            </div>
          )}
          <div>
            <div className="avatar-uploader-title">
              <img src="image.svg" alt="img-logo" />
              <p>Organzation Logo </p>
            </div>
            <p>Drop the image here or click to browse.</p>
          </div>
        </div>
      )}
    </>
  );
};

export default AvatarUploader;
