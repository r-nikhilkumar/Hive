import * as z from "zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Textarea,
  Button
} from "@/components/ui";
import { PostValidation } from "@/lib/validation";
import { FileUploader, Loader } from "@/components/shared";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useUploadFilesMutation } from "@/redux/api/commonApi";
import { useCreatePostMutation, useUpdatePostMutation } from "@/redux/api/postApi";

type PostFormProps = {
  post?: any;
  action: "Create" | "Update";
};

const PostForm = ({ post, action }: PostFormProps) => {
  const navigate = useNavigate();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [mainFile, setMainFile] = useState<File | null>(null);
  const [uploadFiles, {isLoading: isUploadLoading}] = useUploadFilesMutation();
  const [createPost, {isLoading: iscreateLoading}] = useCreatePostMutation();
  const [updatePost, { isLoading: isUpdateLoading }] = useUpdatePostMutation();
  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      caption: post ? post?.caption : "",
      file: [],
      location: post ? post.location : "",
      tags: post ? post.tags.join(",") : "",
    },
  });


  useEffect(() => {
    if (post && post.mediaUrls) {
      const mediaFiles = post.mediaUrls.map((url: string) => {
        const file = new File([], url);
        Object.defineProperty(file, 'name', { value: url });
        return file;
      });
      setSelectedFiles(mediaFiles);
      setMainFile(mediaFiles[0]);
    }
  }, [post]);

  const handleFileChange = (files: File[]) => {
    setSelectedFiles(prevFiles => [...prevFiles, ...files]);
    form.setValue("file", [...selectedFiles, ...files]);
    if (files.length > 0 && !mainFile) {
      setMainFile(files[0]);
    }
  };

  const handleCarouselClick = (file: File) => {
    setMainFile(file);
  };

  const handleRemoveFile = (file: File) => {
    setSelectedFiles(prevFiles => prevFiles.filter(f => f !== file));
    form.setValue("file", selectedFiles.filter(f => f !== file));
    if (mainFile === file) {
      setMainFile(selectedFiles[0] || null);
    }
  };

  const handleSubmit = async (value: z.infer<typeof PostValidation>) => {
    try {
      let content = post?.mediaUrls || [];
      let contentType = post?.content_type || "image";

      if (selectedFiles.length > 0 && selectedFiles[0].name !== post?.mediaUrls[0]) {
        const formData = new FormData();
        selectedFiles.forEach(file => {
          if (!post?.mediaUrls.includes(file.name)) {
            formData.append("files", file);
          }
        });

        const uploadedUrls = await uploadFiles(formData).unwrap();
        if(uploadedUrls.status !== "success") throw new Error("Failed to upload files");
        const newUrls = uploadedUrls.data.map((url: { url: string, name: string, type: string }) => url.url);
        content = [...newUrls];
        contentType = uploadedUrls.data.length === 1 && uploadedUrls.data[0].type.startsWith("/video") ? "video" : "image";
      }

      const postData = {
        location: value.location,
        description: value.caption,
        tags: value.tags.split(",").map((tag) => tag.trim()),
        content,
        content_type: contentType,
      };

      if (action === "Create") {
        await createPost(postData);
      } else if (action === "Update") {
        await updatePost({ postData, postId: post._id });
      }

      navigate("/");
    } catch (error) {
      console.error("error: ", error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-9 w-full max-w-5xl">
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Caption</FormLabel>
              <FormControl>
                <Textarea
                  className="shad-textarea custom-scrollbar"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Media</FormLabel>
              <FormControl>
                <FileUploader
                  fieldChange={handleFileChange}
                  mediaUrls={post?.mediaUrls || []}
                  mainFile={mainFile}
                  setMainFile={setMainFile}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
              {selectedFiles.length > 0 && (
                <div className="mt-2">
                  <Carousel
                    additionalTransfrom={0}
                    arrows
                    autoPlaySpeed={3000}
                    centerMode={false}
                    className=""
                    containerClass="container-with-dots"
                    dotListClass=""
                    draggable
                    focusOnSelect={false}
                    infinite
                    itemClass=""
                    keyBoardControl
                    minimumTouchDrag={80}
                    renderButtonGroupOutside={false}
                    renderDotsOutside={false}
                    responsive={{
                      desktop: {
                        breakpoint: {
                          max: 3000,
                          min: 1024
                        },
                        items: 3,
                        partialVisibilityGutter: 40
                      },
                      mobile: {
                        breakpoint: {
                          max: 464,
                          min: 0
                        },
                        items: 1,
                        partialVisibilityGutter: 30
                      },
                      tablet: {
                        breakpoint: {
                          max: 1024,
                          min: 464
                        },
                        items: 2,
                        partialVisibilityGutter: 30
                      }
                    }}
                    showDots={false}
                    sliderClass=""
                    slidesToSlide={1}
                    swipeable
                  >
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="relative p-2" onClick={() => handleCarouselClick(file)}>
                        {file.type.startsWith("image/") ? (
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="w-full h-auto object-cover cursor-pointer"
                          />
                        ) : (
                          <video controls className="w-full h-auto object-cover cursor-pointer">
                            <source src={URL.createObjectURL(file)} type={file.type} />
                            Your browser does not support the video tag.
                          </video>
                        )}
                        <button
                          type="button"
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFile(file);
                          }}
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </Carousel>
                </div>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Location</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">
                Add Tags (separated by comma " , ")
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Art, Expression, Learn"
                  type="text"
                  className="shad-input"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <div className="flex gap-4 items-center justify-end">
          <Button
            type="button"
            className="shad-button_dark_4"
            onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button
            type="submit"
            className="shad-button_primary whitespace-nowrap">
            {(isUploadLoading || iscreateLoading || isUpdateLoading) ? <Loader /> : `${action} Post`}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostForm;
