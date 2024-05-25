"use client";

import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CommentValidation } from '../../lib/validations/thread';
import { FormField, FormControl, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Button } from '../ui/button';
import { Input } from '../ui/input'
import * as z from 'zod';
import Image from 'next/image';
import { addCommentToThread } from '../../lib/actions/thread.actions';
import { usePathname } from 'next/navigation';

interface Props { 
  threadId: string;
  currentUserImg: string ; 
  currentUserId: string; 
}

function Comment({ threadId, currentUserImg, currentUserId }:Props) { 
  const form = useForm({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      thread: "",
    },
  });
  const pathname=  usePathname()
  const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
    await addCommentToThread(threadId,values.thread,JSON.parse(currentUserId),pathname)
  
  form.reset()
};
  return (
    <div> 
      <h1 className="text-white">Comment Form</h1>
      <FormProvider {...form}>
        <form className="flex mt-4  justify-start gap-10" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="thread"
            render={({ field }) => (
              <FormItem className="flex w-full flex-row gap-3">
                <FormLabel>
                    <Image src={currentUserImg} className='rounded-full' alt="profile image" width={48} height={48} />
                </FormLabel>
                <FormControl className="border-none bg-transparent"> 
                <Input type="text" placeholder="comment" className="text-light-1  focus" {...field} />
                </FormControl>
               
              </FormItem>
            )}
          />
          <Button className="rounded-full  text-white"  type="submit">
           Reply 
          </Button>
        </form>
      </FormProvider>
    </div>
  ); 
};

export default Comment;
