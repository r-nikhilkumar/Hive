import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React from "react";
import { SignUpValidation, SignInValidation } from "@/lib/validation";
import Loader from "@/components/shared/Loader";
import { Link } from "react-router-dom";

function SignInForm() {
  const isLoading = false;

  const form = useForm<z.infer<typeof SignInValidation>>({
    resolver: zodResolver(SignInValidation),
    defaultValues: {
      userOrEmail: "",
      password: ""
    },
  });

  function onSubmit(values: z.infer<typeof SignInValidation>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <div className="sm:420 flex-center flex-col pr-3">
        <img
          src="/assets/images/full_logo_white_1.png"
          alt="logo"
          width={150}
          height={100}
        />
        <p className="h3-bold md:h2-bold pt-3 sm:pt-12">Log In</p>
        <p className="text-light-3 small-medium md:base-regular py-2">Welcome back, log in to connect again!</p>
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 lg:w-420">
        <FormField
          control={form.control}
          name="userOrEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username or Email</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter your username or email"
                  className="shad-input"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter password"
                  className="shad-input"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" className="shad-button_primary space-y-3 w-full">
          {isLoading ? (<div className="flex-center gap-2"><Loader/> Loading </div>): "Submit"}
        </Button>
        <p className="text-sm flex justify-center w-full">Do not have account? &nbsp; <span className="text-secondary-500"><Link to="/sign-up">create an account</Link></span></p>
      </form>
    </Form>
  );
}

export default SignInForm;
