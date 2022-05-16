import React from "react";
import AvatarUploader from "./AvatarUploader";
import "./App.scss";

function App() {
  const [image, setImage] = React.useState<string>();

  return (
    <div className="app">
      <AvatarUploader onSave={setImage} />
      <div className="image-preview">
        Image in parent:
        {image && <img src={image} alt="preview" />}
      </div>
    </div>
  );
}

export default App;
