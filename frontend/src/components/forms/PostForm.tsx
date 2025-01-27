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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type PostFormProps = {
  post?: any;
  action: "Create" | "Update";
};

const PostForm = ({ post, action }: PostFormProps) => {
  const navigate = useNavigate();
  const [selectedFiles, setSelectedFiles] = useState<(File | string)[]>([]);
  const [mainFile, setMainFile] = useState<File | string | null>(null);
  const [uploadFiles, {isLoading: isUploadLoading}] = useUploadFilesMutation();
  const [createPost, {isLoading: iscreateLoading, isSuccess:isCreatedPost, isError:isErrorCP, error:createPostError}] = useCreatePostMutation();
  const [updatePost, { isLoading: isUpdateLoading, isSuccess:isUpdatedPost, isError:isErrorUP, error:updatePostError }] = useUpdatePostMutation();
  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      caption: post ? post?.description : "",
      file: [],
      location: post ? post.location : "",
      tags: post ? post.tags.join(",") : "",
    },
  });

  useEffect(() => {
    if (post && Array.isArray(post.content)) {
      setSelectedFiles(post.content);
      setMainFile(post.content[0]);
    }
  }, [post]);

  const handleFileChange = (files: File[]) => {
    setSelectedFiles(prevFiles => [...prevFiles, ...files]);
    form.setValue("file", [...selectedFiles, ...files]);
    if (files.length > 0 && !mainFile) {
      setMainFile(files[0]);
    }
  };

  const handleCarouselClick = (file: File | string) => {
    setMainFile(file);
  };

  useEffect(()=>{
    if(action=="Create"){
      if(isCreatedPost){
        toast.success("Post Created Successfully");
        setTimeout(()=>{
          navigate('/');
        }, 2000)
      }else if(isErrorCP){
        if ('data' in createPostError) {
          toast.error((createPostError as any).data?.message || "An error occurred");
        } else {
          toast.error("An error occurred");
        }
      }
    }
    else if(action=="Update"){
      if(isUpdatedPost){
        toast.success("Post Updated Successfully");
        setTimeout(()=>{
          navigate('/');
        }, 2000)
      }else if(isErrorUP){
        if ('data' in updatePostError) {
          toast.error((updatePostError as any).data?.message || "An error occurred");
        } else {
          toast.error("An error occurred");
        }
      }
    }
  }, [isCreatedPost, isUpdatedPost, isErrorCP, isErrorUP])

  const handleRemoveFile = (file: File | string) => {
    const updatedFiles = selectedFiles.filter(f => {
      if (typeof f === "string" && typeof file === "string") {
        return f !== file; // For string comparison
      }
      if (f instanceof File && file instanceof File) {
        return f.name !== file.name || f.size !== file.size; // Compare File properties
      }
      return true; // Keep the file if the types don't match
    });
  
    setSelectedFiles(updatedFiles);
    console.log(updatedFiles);
    // form.setValue("file", updatedFiles);
    console.log("selected: ",selectedFiles)
    console.log("updated: ",updatedFiles)
  
    if (mainFile === file) {
      setMainFile(updatedFiles[0] || null); // Update mainFile if it was removed
    }
  };
  

  const handleSubmit = async (value: z.infer<typeof PostValidation>) => {
    try {
      let content: string[] = [];
      let contentType = post?.content_type || "image";

      const newFiles = selectedFiles.filter(file => file instanceof File) as File[];
      if (newFiles.length > 0) {
        const formData = new FormData();
        newFiles.forEach(file => {
          formData.append("files", file);
        });

        const uploadedUrls = await uploadFiles(formData).unwrap();
        if (uploadedUrls.status !== "success") throw new Error("Failed to upload files");
        const newUrls = uploadedUrls.data.map((url: { url: string, name: string, type: string }) => url.url);
        content = [...newUrls];
        contentType = uploadedUrls.data.length === 1 && uploadedUrls.data[0].type.startsWith("/video") ? "video" : "image";
      }

      // Include existing URLs that were not removed
      const existingUrls = selectedFiles.filter(file => typeof file === "string") as string[];
      content = [...content, ...existingUrls];
      if(content.length<=0) {toast.warning("Must select atleast one file"); return;}

      const postData = {
        location: value.location,
        description: value.caption,
        tags: value.tags.split(",").map((tag) => tag.trim()),
        content,
        content_type: contentType,
      };
      if (action === "Create") {
        createPost(postData);
      } else if (action === "Update") {
        updatePost({ postData, postId: post._id });
      }
    } catch (error) {
      console.error("error: ", error);
      toast.error("Failed to submit post");
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
          render={() => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Media</FormLabel>
              <FormControl>
                <FileUploader
                  fieldChange={handleFileChange}
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
                        {typeof file === "string" ? (
                          file.endsWith(".mp4") ? (
                            <video controls className="w-full h-64 object-cover cursor-pointer">
                              <source src={file} type="video/mp4" />
                              Your browser does not support the video tag.
                            </video>
                          ) : (
                            <img
                              src={file}
                              alt={`media-${index}`}
                              className="w-full h-64 object-cover cursor-pointer"
                            />
                          )
                        ) : file.type.startsWith("image/") ? (
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="w-full h-64 object-cover cursor-pointer"
                          />
                        ) : (
                          <video controls className="w-full h-64 object-cover cursor-pointer">
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
      <ToastContainer/>
    </Form>
  );
};

export default PostForm;
