"use client";

import { Form } from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserValidation } from "../../lib/validations/user";
import { z } from "zod";
import { Button } from "../ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
interface props{ 
    userId:string 
} 
import { Textarea } from "@/components/ui/textarea";
import { usePathname, useRouter } from "next/navigation";
import { ThreadValidation } from "../../lib/validations/thread";
import { createThread } from "../../lib/actions/thread.actions";

function PostThread({userId}:props) {
  const router = useRouter()

  const path = usePathname()
  const form = useForm({
        resolver: zodResolver(ThreadValidation),
        defaultValues: {
            thread: "",
            accountId: userId,
        },
      });
      const onSubmit=async(values:z.infer<typeof ThreadValidation>)=>{
           await createThread({text:values.thread,author:userId,communityId:null,path:path})
           router.push("/")
      }
    return (
   
        <Form {...form}>
      <form className="flex flex-col justify-start gap-10" onSubmit={form.handleSubmit(onSubmit)}>
      <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel>Content</FormLabel>
              <Textarea rows={5} className="account-form_input no-focus" {...field} />
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="btn-md" type="submit">
          Post Thread
        </Button>
      </form>
    </Form>
   
     )
}

export default PostThread