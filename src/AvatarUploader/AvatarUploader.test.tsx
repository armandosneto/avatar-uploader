import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import AvatarUploader from "./AvatarUploader";

describe("Testing AvatarUploader component", () => {
  beforeEach(cleanup);

  function tree(onSave: () => void = jest.fn()) {
    return render(<AvatarUploader onSave={onSave} />);
  }

  it("should render initial state correctly", () => {
    tree();
    expect(screen.getByTestId("avatar-uploader")).toBeInTheDocument();
  });

  it("should set a image from user computer inside input", async () => {
    tree();
    const input = screen.getByTestId(
      "avatar-uploader-input"
    ) as HTMLInputElement;
    const mockFile = new File(["(⌐□_□)"], "test.png", { type: "image/png" });
    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      userEvent.upload(input, mockFile);
    });
    await waitFor(() => expect(input.files![0]).toStrictEqual(mockFile));
  });

  it("should show error-content when File isn't a image", async () => {
    tree();
    const input = screen.getByTestId(
      "avatar-uploader-input"
    ) as HTMLInputElement;
    const mockFile = new File(["(⌐□_□)"], "test.png", { type: "text/plain" });
    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      userEvent.upload(input, mockFile);
    });
    expect(screen.getByTestId("error-content")).toBeInTheDocument();
  });

  it("should show avatar-image-cropper when file is a image", async () => {
    tree();
    const input = screen.getByTestId(
      "avatar-uploader-input"
    ) as HTMLInputElement;
    window.URL.createObjectURL = jest.fn().mockImplementation(() => "url");
    const mockFile = new File(["(⌐□_□)"], "test.png", { type: "image/png" });
    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      Object.defineProperty(input, "files", {
        value: [mockFile],
      });
      fireEvent.drop(input);
    });
    expect(screen.getByTestId("avatar-image-cropper")).toBeInTheDocument();
    expect(screen.getByText("Crop")).toBeInTheDocument();
  });

  it("should return to begin when cancel button is clicked", async () => {
    tree();
    const input = screen.getByTestId(
      "avatar-uploader-input"
    ) as HTMLInputElement;
    window.URL.createObjectURL = jest.fn().mockImplementation(() => "url");
    const mockFile = new File(["(⌐□_□)"], "test.png", { type: "image/png" });
    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      Object.defineProperty(input, "files", {
        value: [mockFile],
      });
      fireEvent.drop(input);
    });
    const cancelButton = screen.getByTestId("cancel-button");

    // eslint-disable-next-line testing-library/no-unnecessary-act
    act(() => {
      fireEvent.click(cancelButton);
    });
    expect(
      screen.queryByTestId("avatar-image-cropper")
    ).not.toBeInTheDocument();
    expect(screen.getByTestId("avatar-uploader")).toBeInTheDocument();
  });
});
