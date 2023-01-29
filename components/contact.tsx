"use client";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type FormValues = {
  name: string;
  email: string;
  subject: string;
  message: string;
};
const notify = (message: string) => toast(message);

const Contact = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const onSubmit: SubmitHandler<FormValues> = (data, e) => {
    e?.preventDefault();
    console.log("submitted");

    notify("Thank You For Contacting Me");
    fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        // notify(data.toastMessage);
      });
    console.log(data);
  };

  return (
    <section className="bg-slate-300 ">
      <div className="container mx-auto max-w-screen-xl grid grid-cols-2 grid-row-3 p-6">
        <h1 className="font-bold text-3xl text-center col-span-full row-start-1 p-3">
          Contact Section
        </h1>
        <ToastContainer />
        <div className="col-start-1 row-start-2 col-span-full w-full">
          <form
            className="flex flex-col w-[50%] mx-auto space-y-5"
            action="/api/contact"
            method="POST"
            onSubmit={handleSubmit(onSubmit)}
          >
            <input
              className=""
              type="text"
              placeholder="Name"
              {...register("name", {
                required: "please enter a valid name",
                min: 5,
                maxLength: 80,
              })}
            />
            <input
              type="text"
              placeholder="Email"
              {...register("email", {
                required: "please enter a valid email",
                pattern: /^\S+@\S+$/i,
              })}
            />
            <input
              type="text"
              placeholder="Subject"
              {...register("subject", {
                required: "subject is missing please enter it",
                min: 5,
              })}
            />
            <textarea
              {...register("message", {
                required:
                  "message is missing pleaser enter a valid message (min:5 char)",
                min: 5,
              })}
            />
            <input className="cursor-pointer" type="submit" />
          </form>
        </div>
        <div className="col-start-1 col-end-3 col-span-full flex">
          Hello World
          {}
        </div>
      </div>
    </section>
  );
};

export default Contact;
