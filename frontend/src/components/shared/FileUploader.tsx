import { useCallback, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";

import { Button } from "@/components/ui";
import { convertFileToUrl } from "@/lib/utils";

type FileUploaderProps = {
  fieldChange: (files: File[]) => void;
  mediaUrls: string[];
  mainFile: File | null;
  setMainFile: (file: File) => void;
};

const FileUploader = ({ fieldChange, mediaUrls, mainFile, setMainFile }: FileUploaderProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [fileUrls, setFileUrls] = useState<string[]>(mediaUrls || []);

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      const imageFiles = acceptedFiles.filter(file => file.type.startsWith("image/"));
      const videoFiles = acceptedFiles.filter(file => file.type.startsWith("video/"));

      if (videoFiles.length > 1) {
        alert("You can only upload one video.");
        return;
      }

      const newFiles = [...imageFiles, ...videoFiles];
      setFiles(newFiles);
      fieldChange(newFiles);
      const newFileUrls = newFiles.map(file => convertFileToUrl(file));
      setFileUrls(newFileUrls);
      if (newFiles.length > 0 && !mainFile) {
        setMainFile(newFiles[0]);
      }
    },
    [files, mainFile]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpeg", ".jpg"],
      "video/*": [".mp4"],
    },
  });

  // console.log(mainFile)

  return (
    <div
      {...getRootProps()}
      className="flex flex-center flex-col bg-dark-3 rounded-xl cursor-pointer">
      <input {...getInputProps()} className="cursor-pointer" />

      {mainFile ? (
        <>
          <div className="flex flex-1 justify-center w-full p-5 lg:p-10">
            {mainFile.type.startsWith("image/") ? (
              <img src={URL.createObjectURL(mainFile)} alt="image" className="file_uploader-img" />
            ) : (
              <video controls className="file_uploader-img">
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
