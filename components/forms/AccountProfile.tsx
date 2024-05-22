"use client"

import { Form } from "../ui/form";
import { useForm } from "react-hook-form";
import {zodResolver} from '@hookform/resolvers/zod' 
import { UserValidation } from "../../lib/validations/user";

interface Props{ 
    user:{
        id:string ; 
        objectId:string ; 
        username:string ; 
        name:string ; 
        bio:string ; 
        image:string;

    }
    btnTitle:string ;
}
import { z } from "zod"
import { Button } from "../ui/button"
import {
  
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form"
import { Input } from "../ui/input"

const  AccountProfile= ({user,btnTitle}:Props)=> {
  const form = useForm({ 
    resolver: zodResolver(UserValidation),
    defaultValues:{
      profile_photo:"", 
      name:"",
      username:"",
      bio:""
    } 

  })
  // function onSubmit(values:z.infer<typeof UserValidation>{
  //   console.log(values) 
  // })  
  return (
    <Form {...form}>
    <form >
      <FormField
        control={form.control}
        name="username"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Username</FormLabel>
            <FormControl>
              <Input placeholder="username" {...field} />
            </FormControl>
            <FormDescription>
              This is your public display name.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button type="submit">Submit</Button>
    </form>
  </Form>
  )
}

export default AccountProfile
