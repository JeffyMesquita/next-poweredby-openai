"use client";
import axios from "axios";
import * as z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { BrainCircuit, UserSquare2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ChatCompletionRequestMessage } from "openai";

const formSchema = z.object({
  message: z
    .string()
    .min(10, "The minimum length is 10 characters for send a message"),
});

type FormSchema = z.infer<typeof formSchema>;

export default function Home() {
  const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  async function onSubmit(values: FormSchema) {
    setIsLoading(true);

    const message: ChatCompletionRequestMessage = {
      role: "user",
      content: values.message,
    };

    const messagesInContext = [...messages, message];

    try {
      const response = await axios.post("/api/ai/conversation", {
        messages: messagesInContext,
      });

      setMessages((current) => [...current, message, response.data]);
    } catch (error) {
      console.log("OPEN_AI_FRONTEND_ERROR", error);
    } finally {
      setIsLoading(false);
      form.reset();
    }
  }

  return (
    <div className="container mt-4 pt-4 h-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="message">Ask for Advice</FormLabel>
                <FormControl>
                  <Input
                    id="message"
                    disabled={isLoading}
                    placeholder="How to calculate the area of a triangle?"
                    type="text"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Inform the message you want to send to the AI
                </FormDescription>
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full md:w-52" disabled={isLoading}>
            Ask
          </Button>
        </form>
      </Form>

      <div className="flex flex-col mt-4 space-y-2">
        <div className="flex items-center justify-center">
          {isLoading && <BrainCircuit className="w-36 h-36 animate-pulse" />}
        </div>
        <div className="container flex flex-col-reverse space-y-4">
          {messages.map((message, index) => (
            <Card key={`${index}`}>
              <CardHeader>
                <CardTitle>
                  {message.role === "assistant" && (
                    <BrainCircuit className="w-8 h-8" />
                  )}
                  {message.role === "user" && (
                    <UserSquare2 className="w-8 h-8" />
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{message.content}</p>
              </CardContent>
              <CardFooter>
                <p>{message.role}</p>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
