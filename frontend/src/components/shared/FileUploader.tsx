import { useCallback } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";

import { Button } from "@/components/ui";

type FileUploaderProps = {
  fieldChange: (files: File[]) => void;
  mainFile: File | string | null;
  setMainFile: (file: File | string) => void;
};

const FileUploader = ({ fieldChange, mainFile, setMainFile }: FileUploaderProps) => {
  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      const newFiles = [...acceptedFiles];
      fieldChange(newFiles);
      if (newFiles.length > 0 && !mainFile) {
        setMainFile(newFiles[0]);
      }
    },
    [mainFile]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpeg", ".jpg"],
      "video/*": [".mp4"],
    },
  });

  return (
    <div
      {...getRootProps()}
      className="flex flex-center flex-col bg-dark-3 rounded-xl cursor-pointer">
      <input {...getInputProps()} className="cursor-pointer" />

      {mainFile ? (
        <>
          <div className="flex flex-1 justify-center w-full p-5 lg:p-10">
            {typeof mainFile === "string" ? (
              mainFile.endsWith(".mp4") ? (
                <video controls className="file_uploader-img w-full h-64 object-cover">
                  <source src={mainFile} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img src={mainFile} alt="image" className="file_uploader-img w-full h-64 object-cover" />
              )
            ) : mainFile.type.startsWith("image/") ? (
              <img src={URL.createObjectURL(mainFile)} alt="image" className="file_uploader-img w-full h-64 object-cover" />
            ) : (
              <video controls className="file_uploader-img w-full h-64 object-cover">
                <source src={URL.createObjectURL(mainFile)} type={mainFile.type} />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
          <p className="file_uploader-label">Click or drag photo to replace</p>
        </>
      ) : (
        <div className="file_uploader-box ">
          <img
            src="/assets/icons/file-upload.svg"
            width={96}
            height={77}
            alt="file upload"
          />

          <h3 className="base-medium text-light-2 mb-2 mt-6">
            Drag photo here
          </h3>
          <p className="text-light-4 small-regular mb-6">SVG, PNG, JPG</p>

          <Button type="button" className="shad-button_dark_4">
            Select from computer
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
