import React from "react";
import AvatarUpload from "./AvatarUpload";
import "./App.scss";

function App() {
  const [image, setImage] = React.useState<string>();

  return (
    <div className="app">
      <AvatarUpload onSave={setImage} />
      <div className="image-preview">
        Image in parent:
        {image && <img src={image} alt="preview" />}
      </div>
    </div>
  );
}

export default App;
